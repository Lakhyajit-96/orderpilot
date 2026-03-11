import { ExceptionState, OrderApprovalStatus, OrderStatus, UserRole } from "@/generated/prisma/enums";
import { getDb } from "@/lib/db";
import { flags } from "@/lib/env";
import {
  buildGeneratedOrderRef,
  getOrderStatusLabel,
  type WritableOrderStatus,
} from "@/lib/order-write-core";
import {
  createNotificationsForRole,
  getWorkspaceWorkflowSettings,
} from "@/lib/workflow";
import { canActForRole, type WorkflowRole } from "@/lib/workflow-core";
import { buildLaunchValueProofMetrics } from "@/lib/launch-value-proof-core";
import { buildWorkspaceMetricCards } from "@/lib/workspace-metrics-core";

type ActivityMetadata = Record<string, string | number | boolean | null>;

type ApprovalStageRecord = {
  id: string;
  sequence: number;
  role: UserRole;
  title: string;
  minOrderValueCents: number | null;
  requireReasonCode: boolean;
};

type OrderActivityWriter = {
  orderActivity: {
    create(args: {
      data: {
        orderId: string;
        label: string;
        actionType?: string;
        actorClerkUserId?: string;
        actorName?: string;
        timestampLabel?: string;
        targetExceptionId?: string;
        fromStatus?: (typeof OrderStatus)[keyof typeof OrderStatus];
        toStatus?: (typeof OrderStatus)[keyof typeof OrderStatus];
        undoable: boolean;
        metadata?: ActivityMetadata;
      };
    }): Promise<unknown>;
  };
};

type OrderNoteWriter = {
  orderNote: {
    create(args: {
      data: {
        orderId: string;
        body: string;
        authorClerkUserId?: string;
        authorName?: string;
      };
    }): Promise<unknown>;
  };
};

export type WorkspaceOrderListItem = {
  id: string;
  customer: string;
  source: string;
  receivedAt: string;
  lines: number;
  confidence: number;
  value: string;
  status: string;
  exceptions: string[];
};

export type WorkspaceOrderDetail = {
  id: string;
  customer: string;
  channel: string;
  receivedAt: string;
  lines: number;
  confidence: number;
  value: string;
  status: string;
  statusKey: WritableOrderStatus;
  summary: string;
  shippingAddress: string;
  notes: Array<{
    id: string;
    body: string;
    authorName: string | null;
    createdAt: string;
  }>;
  lineItems: Array<{
    sku: string;
    description: string;
    qty: number;
    mappedTo: string;
    match: number;
    state: string;
  }>;
  exceptions: Array<{
    id: string;
    message: string;
    state: string;
  }>;
  activity: Array<{
    id: string;
    label: string;
    time: string;
    actorName: string | null;
    actionType: string | null;
    undoable: boolean;
    isUndone: boolean;
  }>;
  exportRuns: Array<{
    id: string;
    status: string;
    connectionName: string | null;
    createdAt: string;
    message: string | null;
    externalRef: string | null;
  }>;
  approvals: Array<{
    id: string;
    sequence: number;
    title: string;
    requiredRole: string;
    status: string;
    reasonCode: string | null;
    approvedByName: string | null;
    approvedAt: string | null;
    comment: string | null;
  }>;
  nextApprovalRole: string | null;
};

export type OrderActor = {
  clerkUserId?: string | null;
  name?: string | null;
  role?: string | null;
};

export type CreateWorkspaceOrderInput = {
  externalRef?: string | null;
  customerName: string;
  customerEmail?: string | null;
  sourceEmail?: string | null;
  summary?: string | null;
  shippingAddress?: string | null;
  totalCents?: number | null;
  status?: WritableOrderStatus;
  notes?: string[];
  activity?: Array<{ label: string; time?: string | null }>;
  actor?: OrderActor;
  lineItems: Array<{
    sku: string;
    description: string;
    quantity: number;
    mappedTo?: string | null;
    match?: number | null;
    state?: string | null;
  }>;
  exceptions?: string[];
};

function formatCurrencyFromCents(value: number | null | undefined) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format((value ?? 0) / 100);
}

function toOrderStatus(status: WritableOrderStatus) {
  return status as (typeof OrderStatus)[keyof typeof OrderStatus];
}

function formatTimestamp(value: Date) {
  return value.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function getActorWorkflowRole(actor?: OrderActor) {
  return actor?.role ? (actor.role as WorkflowRole) : null;
}

async function getApplicableApprovalStageRecords(
  organizationId: string,
  totalCents: number | null | undefined,
): Promise<ApprovalStageRecord[]> {
  const db = getDb();

  if (!db) {
    return [];
  }

  await getWorkspaceWorkflowSettings(organizationId);
  const policy = await db.approvalPolicy.findUnique({
    where: { organizationId },
    include: { stages: { orderBy: { sequence: "asc" } } },
  });

  if (!policy?.isActive) {
    return [];
  }

  const orderValue = totalCents ?? 0;
  return policy.stages.filter(
    (stage) => !stage.minOrderValueCents || orderValue >= stage.minOrderValueCents,
  );
}

function formatReasonNote(reasonCode: string | null | undefined, comment: string | null | undefined) {
  const parts = [reasonCode ? `Reason code: ${reasonCode}` : null, comment?.trim() || null].filter(
    (value): value is string => Boolean(value),
  );

  return parts.join(" · ");
}

async function appendOrderActivity(
  tx: OrderActivityWriter,
  input: {
    orderId: string;
    label: string;
    actionType?: string;
    actor?: OrderActor;
    timestampLabel?: string | null;
    targetExceptionId?: string | null;
    fromStatus?: WritableOrderStatus | null;
    toStatus?: WritableOrderStatus | null;
    undoable?: boolean;
    metadata?: ActivityMetadata;
  },
) {
  return tx.orderActivity.create({
    data: {
      orderId: input.orderId,
      label: input.label,
      actionType: input.actionType ?? undefined,
      actorClerkUserId: input.actor?.clerkUserId ?? undefined,
      actorName: input.actor?.name ?? undefined,
      timestampLabel: input.timestampLabel ?? formatTimestamp(new Date()),
      targetExceptionId: input.targetExceptionId ?? undefined,
      fromStatus: input.fromStatus ? toOrderStatus(input.fromStatus) : undefined,
      toStatus: input.toStatus ? toOrderStatus(input.toStatus) : undefined,
      undoable: input.undoable ?? false,
      metadata: input.metadata,
    },
  });
}

async function appendOrderNote(
  tx: OrderNoteWriter,
  input: { orderId: string; body: string; actor?: OrderActor },
) {
  return tx.orderNote.create({
    data: {
      orderId: input.orderId,
      body: input.body,
      authorClerkUserId: input.actor?.clerkUserId ?? undefined,
      authorName: input.actor?.name ?? undefined,
    },
  });
}

async function getOrCreateCustomer(input: {
  organizationId: string;
  customerName: string;
  customerEmail?: string | null;
}) {
  const db = getDb();

  if (!db) {
    throw new Error("Database is unavailable.");
  }

  const existing = await db.customer.findFirst({
    where: {
      organizationId: input.organizationId,
      OR: [
        ...(input.customerEmail ? [{ email: input.customerEmail }] : []),
        { name: input.customerName },
      ],
    },
  });

  if (existing) {
    if (!existing.email && input.customerEmail) {
      return db.customer.update({
        where: { id: existing.id },
        data: { email: input.customerEmail },
      });
    }

    return existing;
  }

  return db.customer.create({
    data: {
      organizationId: input.organizationId,
      name: input.customerName,
      email: input.customerEmail ?? undefined,
    },
  });
}

export async function createWorkspaceOrder(
  organizationId: string,
  input: CreateWorkspaceOrderInput,
) {
  const db = getDb();

  if (!db) {
    throw new Error("Database is unavailable.");
  }

  const status = input.status ?? (input.exceptions?.length ? "REVIEW" : "INGESTED");
  const externalRef = input.externalRef?.trim() || buildGeneratedOrderRef(input.sourceEmail ? "MAIL" : "OP");
  const approvalStages = await getApplicableApprovalStageRecords(
    organizationId,
    input.totalCents ?? 0,
  );
  const customer = await getOrCreateCustomer({
    organizationId,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
  });

  return db.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        organizationId,
        customerId: customer.id,
        externalRef,
        sourceEmail: input.sourceEmail ?? undefined,
        status: toOrderStatus(status),
        statusLabel: getOrderStatusLabel(status),
        confidence: input.lineItems.length ? Math.max(70, 100 - (input.exceptions?.length ?? 0) * 8) : 82,
        totalCents: input.totalCents ?? 0,
        summary: input.summary ?? undefined,
        shippingAddress: input.shippingAddress ?? undefined,
      },
    });

    for (const line of input.lineItems) {
      const hasMappedSku = line.mappedTo && line.mappedTo !== "Unmapped";
      const catalogItem = hasMappedSku
        ? await tx.catalogItem.upsert({
            where: { organizationId_sku: { organizationId, sku: line.mappedTo! } },
            create: {
              organizationId,
              sku: line.mappedTo!,
              name: line.description,
              description: line.description,
            },
            update: {
              name: line.description,
              description: line.description,
            },
          })
        : null;

      await tx.orderLine.create({
        data: {
          orderId: order.id,
          requestedSku: line.sku,
          description: line.description,
          quantity: line.quantity,
          catalogItemId: catalogItem?.id,
          confidence: line.match ?? (hasMappedSku ? 96 : 78),
          mappingState: line.state ?? (hasMappedSku ? "Matched" : "Review"),
        },
      });
    }

    for (const [index, message] of (input.exceptions ?? []).entries()) {
      await tx.exception.create({
        data: {
          orderId: order.id,
          code: `EXC-${externalRef}-${index + 1}`,
          message,
          state: ExceptionState.OPEN,
        },
      });
    }

    if (approvalStages.length > 0) {
      await tx.orderApproval.createMany({
        data: approvalStages.map((stage) => ({
          orderId: order.id,
          approvalStageId: stage.id,
          status: OrderApprovalStatus.PENDING,
        })),
      });
    }

    for (const note of input.notes?.filter(Boolean) ?? []) {
      await appendOrderNote(tx, {
        orderId: order.id,
        body: note,
        actor: input.actor,
      });
    }

    await appendOrderActivity(tx, {
      orderId: order.id,
      label: input.sourceEmail ? `Inbound email captured from ${input.sourceEmail}` : "Order created manually",
      actionType: "ORDER_CREATED",
      actor: input.actor,
      toStatus: status,
      metadata: { sourceEmail: input.sourceEmail ?? null },
    });

    for (const item of input.activity ?? []) {
      await appendOrderActivity(tx, {
        orderId: order.id,
        label: item.label,
        actionType: "ORDER_ACTIVITY",
        actor: input.actor,
        timestampLabel: item.time ?? undefined,
      });
    }

    return order.externalRef;
  });
}

export async function updateWorkspaceOrderStatus(input: {
  organizationId: string;
  externalRef: string;
  status: WritableOrderStatus;
  note?: string | null;
  reasonCode?: string | null;
  comment?: string | null;
  actor?: OrderActor;
}) {
  const db = getDb();

  if (!db) {
    throw new Error("Database is unavailable.");
  }

  const order = await db.order.findUnique({
    where: { organizationId_externalRef: { organizationId: input.organizationId, externalRef: input.externalRef } },
    select: { id: true, status: true, totalCents: true },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  const workflowSettings = await getWorkspaceWorkflowSettings(input.organizationId);
  const applicableStages = await getApplicableApprovalStageRecords(
    input.organizationId,
    order.totalCents,
  );
  const actorRole = getActorWorkflowRole(input.actor);
  const reasonNote = formatReasonNote(input.reasonCode, input.comment ?? input.note);

  if (input.status === "EXPORTED" && !canActForRole(actorRole, "ADMIN")) {
    throw new Error("Only admins or owners can mark an order exported manually.");
  }

  if (input.status === "REVIEW" && !canActForRole(actorRole, "REVIEWER")) {
    throw new Error("Only reviewers, admins, or owners can return orders to review.");
  }

  if (
    workflowSettings.policy.requireReasonCodes &&
    ["APPROVED", "REVIEW", "EXPORTED"].includes(input.status) &&
    !input.reasonCode?.trim()
  ) {
    throw new Error("A reason code is required for this workflow action.");
  }

  if (input.status === "APPROVED" && applicableStages.length > 0) {
    const approvalResult = await db.$transaction(async (tx) => {
      const existingApprovals = await tx.orderApproval.findMany({
        where: { orderId: order.id },
        include: { approvalStage: true },
        orderBy: { approvalStage: { sequence: "asc" } },
      });
      const stageIds = new Set(applicableStages.map((stage) => stage.id));
      const missingStages = applicableStages.filter(
        (stage) => !existingApprovals.some((approval) => approval.approvalStageId === stage.id),
      );

      if (missingStages.length > 0) {
        await tx.orderApproval.createMany({
          data: missingStages.map((stage) => ({
            orderId: order.id,
            approvalStageId: stage.id,
            status: OrderApprovalStatus.PENDING,
          })),
        });
      }

      for (const approval of existingApprovals) {
        if (!stageIds.has(approval.approvalStageId) && approval.status === OrderApprovalStatus.PENDING) {
          await tx.orderApproval.update({
            where: { id: approval.id },
            data: { status: OrderApprovalStatus.SKIPPED },
          });
        }
      }

      const approvals = await tx.orderApproval.findMany({
        where: { orderId: order.id },
        include: { approvalStage: true },
        orderBy: { approvalStage: { sequence: "asc" } },
      });
      const nextApproval = approvals.find(
        (approval) =>
          stageIds.has(approval.approvalStageId) && approval.status === OrderApprovalStatus.PENDING,
      );

      if (!nextApproval) {
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: OrderStatus.APPROVED,
            statusLabel: getOrderStatusLabel("APPROVED"),
          },
        });
        return { final: true, nextRole: null as WorkflowRole | null };
      }

      if (!canActForRole(actorRole, nextApproval.approvalStage.role as WorkflowRole)) {
        throw new Error(`This approval step requires ${nextApproval.approvalStage.role} access.`);
      }

      if ((workflowSettings.policy.requireReasonCodes || nextApproval.approvalStage.requireReasonCode) && !input.reasonCode?.trim()) {
        throw new Error("A reason code is required before approving this step.");
      }

      await tx.orderApproval.update({
        where: { id: nextApproval.id },
        data: {
          status: OrderApprovalStatus.APPROVED,
          reasonCode: input.reasonCode?.trim() ?? undefined,
          comment: (input.comment ?? input.note)?.trim() || undefined,
          approvedByClerkUserId: input.actor?.clerkUserId ?? undefined,
          approvedByName: input.actor?.name ?? undefined,
          approvedAt: new Date(),
        },
      });

      const remainingApprovals = approvals.filter(
        (approval) =>
          approval.id !== nextApproval.id &&
          stageIds.has(approval.approvalStageId) &&
          approval.status === OrderApprovalStatus.PENDING,
      );
      const nextStage = remainingApprovals[0]?.approvalStage;

      if (nextStage) {
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: OrderStatus.REVIEW,
            statusLabel: `Awaiting ${nextStage.title}`,
          },
        });
        await appendOrderActivity(tx, {
          orderId: order.id,
          label: `Approval step completed: ${nextApproval.approvalStage.title}`,
          actionType: "APPROVAL_STEP_COMPLETED",
          actor: input.actor,
          undoable: true,
          metadata: {
            approvalId: nextApproval.id,
            reasonCode: input.reasonCode?.trim() ?? null,
          },
        });
        if (reasonNote) {
          await appendOrderNote(tx, { orderId: order.id, body: reasonNote, actor: input.actor });
        }

        return { final: false, nextRole: nextStage.role as WorkflowRole };
      }

      await tx.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.APPROVED,
          statusLabel: getOrderStatusLabel("APPROVED"),
        },
      });
      await appendOrderActivity(tx, {
        orderId: order.id,
        label: `Order moved to ${getOrderStatusLabel("APPROVED")}`,
        actionType: "APPROVED_FINAL",
        actor: input.actor,
        fromStatus: order.status as WritableOrderStatus,
        toStatus: "APPROVED",
        undoable: true,
        metadata: {
          approvalId: nextApproval.id,
          reasonCode: input.reasonCode?.trim() ?? null,
        },
      });

      if (reasonNote) {
        await appendOrderNote(tx, { orderId: order.id, body: reasonNote, actor: input.actor });
      }

      return { final: true, nextRole: null as WorkflowRole | null };
    });

    if (approvalResult.nextRole) {
      await createNotificationsForRole({
        organizationId: input.organizationId,
        requiredRole: approvalResult.nextRole,
        orderId: order.id,
        type: "ORDER_APPROVAL_REQUIRED",
        title: `Order ${input.externalRef} needs approval`,
        body: `The next approval step is assigned to ${approvalResult.nextRole}.`,
        route: `/orders/${input.externalRef}`,
      });
    } else if (approvalResult.final) {
      await createNotificationsForRole({
        organizationId: input.organizationId,
        requiredRole: "ADMIN",
        orderId: order.id,
        type: "ORDER_READY_FOR_EXPORT",
        title: `Order ${input.externalRef} is ready for export`,
        body: "All approval stages are complete and the order can be pushed to ERP.",
        route: `/orders/${input.externalRef}`,
      });
    }

    return;
  }

  await db.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: {
        status: toOrderStatus(input.status),
        statusLabel: getOrderStatusLabel(input.status),
      },
    });

    await appendOrderActivity(tx, {
      orderId: order.id,
      label:
        input.status === "REVIEW"
          ? "Order returned to review"
          : `Order moved to ${getOrderStatusLabel(input.status)}`,
      actionType: input.status === "REVIEW" ? "RETURN_TO_REVIEW" : "STATUS_CHANGED",
      actor: input.actor,
      fromStatus: order.status as WritableOrderStatus,
      toStatus: input.status,
      undoable: input.status !== "REVIEW",
      metadata: {
        reasonCode: input.reasonCode?.trim() ?? null,
      },
    });

    if (input.status === "REVIEW") {
      await tx.orderApproval.updateMany({
        where: { orderId: order.id, status: { in: [OrderApprovalStatus.APPROVED, OrderApprovalStatus.SKIPPED] } },
        data: {
          status: OrderApprovalStatus.PENDING,
          reasonCode: null,
          comment: null,
          approvedByClerkUserId: null,
          approvedByName: null,
          approvedAt: null,
        },
      });
    }

    if (reasonNote) {
      await appendOrderNote(tx, {
        orderId: order.id,
        body: reasonNote,
        actor: input.actor,
      });
    }
  });

  if (input.status === "REVIEW") {
    const firstStage = applicableStages[0];
    if (firstStage) {
      await createNotificationsForRole({
        organizationId: input.organizationId,
        requiredRole: firstStage.role as WorkflowRole,
        orderId: order.id,
        type: "ORDER_RETURNED_TO_REVIEW",
        title: `Order ${input.externalRef} returned to review`,
        body: reasonNote || "A reviewer returned this order to the review lane.",
        route: `/orders/${input.externalRef}`,
      });
    }
  }
}

export async function resolveWorkspaceOrderException(input: {
  organizationId: string;
  externalRef: string;
  exceptionId: string;
  note?: string | null;
  actor?: OrderActor;
}) {
  const db = getDb();

  if (!db) {
    throw new Error("Database is unavailable.");
  }

  const exception = await db.exception.findFirst({
    where: {
      id: input.exceptionId,
      order: {
        organizationId: input.organizationId,
        externalRef: input.externalRef,
      },
    },
    select: {
      id: true,
      message: true,
      orderId: true,
      state: true,
    },
  });

  if (!exception) {
    throw new Error("Exception not found.");
  }

  if (exception.state === ExceptionState.RESOLVED) {
    return;
  }

  await db.$transaction(async (tx) => {
    await tx.exception.update({
      where: { id: exception.id },
      data: {
        state: ExceptionState.RESOLVED,
        resolvedAt: new Date(),
        resolvedByClerkUserId: input.actor?.clerkUserId ?? undefined,
        resolvedByName: input.actor?.name ?? undefined,
      },
    });

    await appendOrderActivity(tx, {
      orderId: exception.orderId,
      label: `Resolved exception: ${exception.message}`,
      actionType: "EXCEPTION_RESOLVED",
      actor: input.actor,
      targetExceptionId: exception.id,
      undoable: true,
    });

    await appendOrderNote(tx, {
      orderId: exception.orderId,
      body: input.note?.trim() || `Resolved exception: ${exception.message}`,
      actor: input.actor,
    });
  });
}

export async function addWorkspaceOrderNote(input: {
  organizationId: string;
  externalRef: string;
  body: string;
  actor?: OrderActor;
}) {
  const db = getDb();

  if (!db) {
    throw new Error("Database is unavailable.");
  }

  const order = await db.order.findUnique({
    where: { organizationId_externalRef: { organizationId: input.organizationId, externalRef: input.externalRef } },
    select: { id: true },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  await db.$transaction(async (tx) => {
    await appendOrderNote(tx, {
      orderId: order.id,
      body: input.body.trim(),
      actor: input.actor,
    });
    await appendOrderActivity(tx, {
      orderId: order.id,
      label: "Reviewer note added",
      actionType: "NOTE_ADDED",
      actor: input.actor,
      undoable: false,
    });
  });
}

export async function undoLastWorkspaceOrderAction(input: {
  organizationId: string;
  externalRef: string;
  actor?: OrderActor;
}) {
  const db = getDb();

  if (!db) {
    throw new Error("Database is unavailable.");
  }

  const order = await db.order.findUnique({
    where: { organizationId_externalRef: { organizationId: input.organizationId, externalRef: input.externalRef } },
    select: { id: true },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  const activity = await db.orderActivity.findFirst({
    where: { orderId: order.id, undoable: true, undoneAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!activity) {
    throw new Error("No undoable order action is available.");
  }

  await db.$transaction(async (tx) => {
    if (activity.actionType === "STATUS_CHANGED" && activity.fromStatus) {
      const previousStatus = activity.fromStatus as WritableOrderStatus;
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: activity.fromStatus,
          statusLabel: getOrderStatusLabel(previousStatus),
        },
      });
      await appendOrderActivity(tx, {
        orderId: order.id,
        label: `Undid status change to ${getOrderStatusLabel(previousStatus)}`,
        actionType: "UNDO",
        actor: input.actor,
      });
    }

    if (activity.actionType === "EXCEPTION_RESOLVED" && activity.targetExceptionId) {
      await tx.exception.update({
        where: { id: activity.targetExceptionId },
        data: {
          state: ExceptionState.OPEN,
          resolvedAt: null,
          resolvedByClerkUserId: null,
          resolvedByName: null,
        },
      });
      await appendOrderActivity(tx, {
        orderId: order.id,
        label: "Undid exception resolution",
        actionType: "UNDO",
        actor: input.actor,
        targetExceptionId: activity.targetExceptionId,
      });
    }

    if (
      (activity.actionType === "APPROVAL_STEP_COMPLETED" || activity.actionType === "APPROVED_FINAL") &&
      activity.metadata &&
      typeof activity.metadata === "object" &&
      "approvalId" in activity.metadata &&
      typeof activity.metadata.approvalId === "string"
    ) {
      const approval = await tx.orderApproval.findUnique({
        where: { id: activity.metadata.approvalId },
        include: { approvalStage: true },
      });

      if (approval) {
        await tx.orderApproval.update({
          where: { id: approval.id },
          data: {
            status: OrderApprovalStatus.PENDING,
            reasonCode: null,
            comment: null,
            approvedByClerkUserId: null,
            approvedByName: null,
            approvedAt: null,
          },
        });
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: OrderStatus.REVIEW,
            statusLabel: `Awaiting ${approval.approvalStage.title}`,
          },
        });
        await appendOrderActivity(tx, {
          orderId: order.id,
          label: `Undid approval step ${approval.approvalStage.title}`,
          actionType: "UNDO",
          actor: input.actor,
        });
      }
    }

    await tx.orderActivity.update({
      where: { id: activity.id },
      data: { undoneAt: new Date() },
    });
  });
}

export async function getWorkspaceOrders(
  organizationId: string | null | undefined,
): Promise<WorkspaceOrderListItem[]> {
  const db = getDb();

  if (!flags.hasDatabase || !db || !organizationId) {
    return [];
  }

  const orders = await db.order.findMany({
    where: { organizationId },
    include: { customer: true, lineItems: true, exceptions: true },
    orderBy: { createdAt: "desc" },
  });

  return orders.map((order) => ({
    id: order.externalRef,
    customer: order.customer?.name ?? "Unknown customer",
    source: order.sourceEmail ?? "No source",
    receivedAt: order.createdAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    lines: order.lineItems.length,
    confidence: order.confidence,
    value: formatCurrencyFromCents(order.totalCents),
    status: order.statusLabel ?? getOrderStatusLabel(order.status as WritableOrderStatus),
    exceptions: order.exceptions.map((item) => item.message),
  }));
}

export async function getWorkspaceOrderByExternalRef(
  organizationId: string | null | undefined,
  externalRef: string,
): Promise<WorkspaceOrderDetail | null> {
  const db = getDb();

  if (!flags.hasDatabase || !db || !organizationId) {
    return null;
  }

  const order = await db.order.findUnique({
    where: { organizationId_externalRef: { organizationId, externalRef } },
    include: {
      customer: true,
      lineItems: { include: { catalogItem: true } },
      exceptions: { orderBy: { createdAt: "asc" } },
      notes: { orderBy: { createdAt: "asc" } },
      activity: { orderBy: { createdAt: "asc" } },
      exportRuns: { include: { erpConnection: true }, orderBy: { createdAt: "desc" } },
      approvals: { include: { approvalStage: true }, orderBy: { approvalStage: { sequence: "asc" } } },
    },
  });

  if (!order) {
    return null;
  }

  const nextApproval = order.approvals.find((item) => item.status === OrderApprovalStatus.PENDING) ?? null;

  return {
    id: order.externalRef,
    customer: order.customer?.name ?? "Unknown customer",
    channel: order.sourceEmail ?? "No source",
    receivedAt: order.createdAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    lines: order.lineItems.length,
    confidence: order.confidence,
    value: formatCurrencyFromCents(order.totalCents),
    status: order.statusLabel ?? getOrderStatusLabel(order.status as WritableOrderStatus),
    statusKey: order.status as WritableOrderStatus,
    summary: order.summary ?? "No summary available.",
    shippingAddress: order.shippingAddress ?? "Address pending",
    notes: order.notes.map((note) => ({
      id: note.id,
      body: note.body,
      authorName: note.authorName ?? null,
      createdAt: note.createdAt.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
    })),
    lineItems: order.lineItems.map((line) => ({
      sku: line.requestedSku,
      description: line.description,
      qty: line.quantity,
      mappedTo: line.catalogItem?.sku ?? "Unmapped",
      match: line.confidence,
      state: line.mappingState ?? (line.catalogItemId ? "Matched" : "Review"),
    })),
    exceptions: order.exceptions.map((item) => ({
      id: item.id,
      message: item.message,
      state: item.state,
    })),
    activity: order.activity.map((item) => ({
      id: item.id,
      label: item.label,
      time: item.timestampLabel ?? item.createdAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      actorName: item.actorName ?? null,
      actionType: item.actionType ?? null,
      undoable: item.undoable,
      isUndone: Boolean(item.undoneAt),
    })),
    exportRuns: order.exportRuns.map((run) => ({
      id: run.id,
      status: run.status,
      connectionName: run.erpConnection?.name ?? null,
      createdAt: run.createdAt.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
      message: run.message ?? null,
      externalRef: run.externalRef ?? null,
    })),
    approvals: order.approvals.map((approval) => ({
      id: approval.id,
      sequence: approval.approvalStage.sequence,
      title: approval.approvalStage.title,
      requiredRole: approval.approvalStage.role,
      status: approval.status,
      reasonCode: approval.reasonCode ?? null,
      approvedByName: approval.approvedByName ?? null,
      approvedAt: approval.approvedAt
        ? approval.approvedAt.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
        : null,
      comment: approval.comment ?? null,
    })),
    nextApprovalRole: nextApproval?.approvalStage.role ?? null,
  };
}

export async function getWorkspaceReviewQueue(organizationId: string | null | undefined) {
  const orders = await getWorkspaceOrders(organizationId);

  return orders.slice(0, 3).map((order) => ({
    orderId: order.id,
    customer: order.customer,
    issue: order.exceptions[0] ?? "Awaiting approval",
    eta: order.status === "Ready to export" ? "Ready now" : "Needs review",
  }));
}

export async function getWorkspaceMetrics(organizationId: string | null | undefined) {
  const db = getDb();

  if (!flags.hasDatabase || !db || !organizationId) {
    return buildWorkspaceMetricCards({
      ordersProcessed: 0,
      reviewCount: 0,
      totalRevenueCents: 0,
    });
  }

  const [ordersProcessed, reviewCount, totalRevenue] = await Promise.all([
    db.order.count({ where: { organizationId } }),
    db.order.count({ where: { organizationId, status: OrderStatus.REVIEW } }),
    db.order.aggregate({ where: { organizationId }, _sum: { totalCents: true } }),
  ]);

  return buildWorkspaceMetricCards({
    ordersProcessed,
    reviewCount,
    totalRevenueCents: totalRevenue._sum.totalCents,
  });
}

export async function getWorkspaceValueProofMetrics(organizationId: string | null | undefined) {
  const db = getDb();

  if (!flags.hasDatabase || !db || !organizationId) {
    return buildLaunchValueProofMetrics({
      ordersIngested: 0,
      ordersReviewed: 0,
      firstOrderAt: null,
      firstErpReadyAt: null,
    });
  }

  const [ordersIngested, ordersReviewed, firstOrder, firstErpReadyActivity, firstReadyOrder] = await Promise.all([
    db.order.count({ where: { organizationId } }),
    db.order.count({ where: { organizationId, status: { in: [OrderStatus.REVIEW, OrderStatus.APPROVED, OrderStatus.EXPORTED] } } }),
    db.order.findFirst({ where: { organizationId }, orderBy: { createdAt: "asc" }, select: { createdAt: true } }),
    db.orderActivity.findFirst({
      where: {
        order: { organizationId },
        OR: [
          { actionType: "APPROVED_FINAL" },
          { actionType: "ERP_EXPORT_SUCCEEDED" },
          { actionType: "STATUS_CHANGED", toStatus: { in: [OrderStatus.APPROVED, OrderStatus.EXPORTED] } },
        ],
      },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    }),
    db.order.findFirst({
      where: { organizationId, status: { in: [OrderStatus.APPROVED, OrderStatus.EXPORTED] } },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    }),
  ]);

  return buildLaunchValueProofMetrics({
    ordersIngested,
    ordersReviewed,
    firstOrderAt: firstOrder?.createdAt.toISOString() ?? null,
    firstErpReadyAt: firstErpReadyActivity?.createdAt.toISOString() ?? firstReadyOrder?.createdAt.toISOString() ?? null,
  });
}