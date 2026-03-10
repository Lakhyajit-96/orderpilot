import { Prisma } from "@/generated/prisma/client";
import { ExportRunStatus, OrderStatus } from "@/generated/prisma/enums";
import { getDb } from "@/lib/db";
import {
  buildErpAdapterPayload,
  buildErpExportPayload,
  maskAuthHeader,
  type ErpAdapterSettings,
  type ErpFieldMappings,
  type ErpProviderKey,
} from "@/lib/erp-core";
import { getOrderStatusLabel } from "@/lib/order-write-core";
import { canActForRole } from "@/lib/workflow-core";

function parseResponseBody(responseText: string) {
  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return { raw: responseText };
  }
}

type ExportActor = {
  clerkUserId?: string | null;
  name?: string | null;
  role?: string | null;
};

type ActivityMetadata = Record<string, string | number | boolean | null>;

export async function upsertErpConnection(input: {
  organizationId: string;
  name: string;
  endpointUrl: string;
  authHeader?: string | null;
  provider?: ErpProviderKey;
  fieldMappings?: ErpFieldMappings | null;
  adapterSettings?: ErpAdapterSettings | null;
  isActive?: boolean;
}) {
  const db = getDb();

  if (!db) {
    throw new Error("Database is unavailable.");
  }

  return db.erpConnection.upsert({
    where: {
      organizationId_name: {
        organizationId: input.organizationId,
        name: input.name,
      },
    },
    create: {
      organizationId: input.organizationId,
      name: input.name,
      endpointUrl: input.endpointUrl,
      authHeader: input.authHeader ?? undefined,
      provider: input.provider ?? "WEBHOOK",
      fieldMappings: input.fieldMappings ?? undefined,
      adapterSettings: input.adapterSettings ?? undefined,
      isActive: input.isActive ?? true,
    },
    update: {
      endpointUrl: input.endpointUrl,
      authHeader: input.authHeader ?? undefined,
      provider: input.provider ?? "WEBHOOK",
      fieldMappings: input.fieldMappings ?? undefined,
      adapterSettings: input.adapterSettings ?? undefined,
      isActive: input.isActive ?? true,
      lastError: null,
    },
  });
}

export async function getWorkspaceErpConnections(organizationId: string | null | undefined) {
  const db = getDb();

  if (!db || !organizationId) {
    return [];
  }

  const connections = await db.erpConnection.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
  });

  return connections.map((connection) => ({
    ...connection,
    authHeader: maskAuthHeader(connection.authHeader),
  }));
}

export async function getWorkspaceExportRuns(organizationId: string | null | undefined) {
  const db = getDb();

  if (!db || !organizationId) {
    return [];
  }

  return db.exportRun.findMany({
    where: { organizationId },
    include: { erpConnection: true, order: true },
    orderBy: { createdAt: "desc" },
    take: 12,
  });
}

async function recordOrderActivity(input: {
  orderId: string;
  label: string;
  actionType: string;
  actor?: ExportActor;
  fromStatus?: OrderStatus | null;
  toStatus?: OrderStatus | null;
  metadata?: ActivityMetadata;
}) {
  const db = getDb();

  if (!db) {
    return;
  }

  await db.orderActivity.create({
    data: {
      orderId: input.orderId,
      label: input.label,
      actionType: input.actionType,
      actorClerkUserId: input.actor?.clerkUserId ?? undefined,
      actorName: input.actor?.name ?? undefined,
      fromStatus: input.fromStatus ?? undefined,
      toStatus: input.toStatus ?? undefined,
      timestampLabel: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      metadata: input.metadata,
      undoable: false,
    },
  });
}

async function exportOrderViaConnection(input: {
  organizationId: string;
  externalRef: string;
  connectionId?: string | null;
  actor?: ExportActor;
  retryRunId?: string;
}) {
  const db = getDb();

  if (!db) {
    throw new Error("Database is unavailable.");
  }

  const order = await db.order.findUnique({
    where: { organizationId_externalRef: { organizationId: input.organizationId, externalRef: input.externalRef } },
    include: {
      organization: true,
      customer: true,
      lineItems: { include: { catalogItem: true } },
      notes: true,
    },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  if (!canActForRole(input.actor?.role, "ADMIN")) {
    throw new Error("Only admins or owners can export orders to ERP.");
  }

  if (order.status !== OrderStatus.APPROVED && order.status !== OrderStatus.EXPORTED) {
    throw new Error("Only approved or exported orders can be pushed downstream.");
  }

  const connection = input.connectionId
    ? await db.erpConnection.findFirst({ where: { id: input.connectionId, organizationId: input.organizationId, isActive: true } })
    : await db.erpConnection.findFirst({ where: { organizationId: input.organizationId, isActive: true }, orderBy: { createdAt: "asc" } });

  if (!connection) {
    throw new Error("No active ERP connection is configured for this workspace.");
  }

  const payload = buildErpExportPayload({
    workspaceName: order.organization.name,
    orderId: order.externalRef,
    status: order.statusLabel ?? getOrderStatusLabel(order.status),
    customerName: order.customer?.name ?? "Unknown customer",
    customerEmail: order.customer?.email,
    sourceEmail: order.sourceEmail,
    shippingAddress: order.shippingAddress,
    summary: order.summary,
    totalCents: order.totalCents,
    notes: order.notes.map((note) => ({ body: note.body, authorName: note.authorName })),
    lineItems: order.lineItems.map((line) => ({
      sku: line.requestedSku,
      description: line.description,
      quantity: line.quantity,
      mappedTo: line.catalogItem?.sku,
      confidence: line.confidence,
    })),
  });
  const adapterPayload = buildErpAdapterPayload({
    provider: (connection.provider as ErpProviderKey) ?? "WEBHOOK",
    fieldMappings: (connection.fieldMappings as ErpFieldMappings | null) ?? null,
    adapterSettings: (connection.adapterSettings as ErpAdapterSettings | null) ?? null,
    payload,
  });
  const requestBody = JSON.parse(JSON.stringify(adapterPayload)) as Prisma.InputJsonValue;

  const exportRun = await db.exportRun.create({
    data: {
      organizationId: input.organizationId,
      orderId: order.id,
      erpConnectionId: connection.id,
      status: ExportRunStatus.PENDING,
      attemptCount: input.retryRunId ? 2 : 1,
      requestBody,
      message: input.retryRunId ? `Retry from export run ${input.retryRunId}` : "ERP export queued.",
    },
  });

  try {
    const response = await fetch(connection.endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(connection.authHeader ? { Authorization: connection.authHeader } : {}),
        "x-orderpilot-organization-id": input.organizationId,
        "x-orderpilot-order-id": order.externalRef,
        "x-orderpilot-erp-adapter": connection.provider,
      },
      body: JSON.stringify(adapterPayload),
    });
    const responseText = await response.text();
    const responseBody = parseResponseBody(responseText);

    if (!response.ok) {
      throw new Error(`ERP export failed with ${response.status}.`);
    }

    await db.$transaction(async (tx) => {
      await tx.exportRun.update({
        where: { id: exportRun.id },
        data: {
          status: ExportRunStatus.SUCCESS,
          responseBody,
          externalRef:
            typeof responseBody?.externalRef === "string"
              ? responseBody.externalRef
              : typeof responseBody?.id === "string"
                ? responseBody.id
                : null,
          message: "Order exported successfully.",
        },
      });
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.EXPORTED,
          statusLabel: getOrderStatusLabel(OrderStatus.EXPORTED),
        },
      });
      await tx.erpConnection.update({
        where: { id: connection.id },
        data: { lastExportedAt: new Date(), lastError: null },
      });
    });

    await recordOrderActivity({
      orderId: order.id,
      label: `Order exported to ${connection.name}`,
      actionType: "ERP_EXPORT_SUCCEEDED",
      actor: input.actor,
      fromStatus: order.status,
      toStatus: OrderStatus.EXPORTED,
      metadata: { exportRunId: exportRun.id, connectionId: connection.id },
    });

    return exportRun.id;
  } catch (error) {
    const message = error instanceof Error ? error.message : "ERP export failed.";
    await db.$transaction(async (tx) => {
      await tx.exportRun.update({
        where: { id: exportRun.id },
        data: {
          status: ExportRunStatus.FAILED,
          message,
          responseBody: { error: message },
        },
      });
      await tx.erpConnection.update({
        where: { id: connection.id },
        data: { lastError: message },
      });
    });

    await recordOrderActivity({
      orderId: order.id,
      label: `ERP export failed for ${connection.name}`,
      actionType: "ERP_EXPORT_FAILED",
      actor: input.actor,
      fromStatus: order.status,
      toStatus: order.status,
      metadata: { exportRunId: exportRun.id, connectionId: connection.id, error: message },
    });

    throw error;
  }
}

export async function exportWorkspaceOrder(input: {
  organizationId: string;
  externalRef: string;
  connectionId?: string | null;
  actor?: ExportActor;
}) {
  return exportOrderViaConnection(input);
}

export async function retryExportRun(input: {
  organizationId: string;
  exportRunId: string;
  actor?: ExportActor;
}) {
  const db = getDb();

  if (!db) {
    throw new Error("Database is unavailable.");
  }

  const exportRun = await db.exportRun.findFirst({
    where: { id: input.exportRunId, organizationId: input.organizationId },
    include: { order: true },
  });

  if (!exportRun) {
    throw new Error("Export run not found.");
  }

  if (exportRun.status !== ExportRunStatus.FAILED) {
    throw new Error("Only failed export runs can be retried.");
  }

  return exportOrderViaConnection({
    organizationId: input.organizationId,
    externalRef: exportRun.order.externalRef,
    connectionId: exportRun.erpConnectionId,
    retryRunId: exportRun.id,
    actor: input.actor,
  });
}