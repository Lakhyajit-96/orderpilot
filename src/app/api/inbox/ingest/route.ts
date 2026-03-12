import { NextResponse } from "next/server";
import { z } from "zod";
import { getWorkspaceRequestContext } from "@/lib/api-workspace";
import {
  buildMailboxSummary,
  parseMailboxExceptions,
  parseMailboxLineItems,
} from "@/lib/order-write-core";
import { createWorkspaceOrder } from "@/lib/orders";
import { buildDashboardLaunchChecklist } from "@/lib/dashboard-checklist-core";
import { recordLaunchChecklistTelemetry } from "@/lib/launch-telemetry";

const mailboxIngestSchema = z.object({
  customerName: z.string().trim().min(2),
  customerEmail: z.string().email().optional(),
  sourceEmail: z.string().email(),
  subject: z.string().trim().min(2),
  summary: z.string().trim().optional(),
  shippingAddress: z.string().trim().optional(),
  body: z.string().trim().optional(),
  lineItemsText: z.string().trim().min(3),
  exceptionsText: z.string().trim().optional(),
});

export async function POST(request: Request) {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  const parsed = mailboxIngestSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const lineItems = parseMailboxLineItems(parsed.data.lineItemsText);
    const exceptions = parseMailboxExceptions(parsed.data.exceptionsText ?? "");
    const notes = [
      `Subject: ${parsed.data.subject}`,
      parsed.data.body?.trim() ? `Mailbox body: ${parsed.data.body.trim()}` : null,
    ].filter((value): value is string => Boolean(value));

    const orderId = await createWorkspaceOrder(contextResult.context.workspace.id, {
      customerName: parsed.data.customerName,
      customerEmail: parsed.data.customerEmail,
      sourceEmail: parsed.data.sourceEmail,
      summary: buildMailboxSummary(parsed.data.subject, parsed.data.summary),
      shippingAddress: parsed.data.shippingAddress,
      lineItems,
      exceptions,
      notes,
      activity: [
        { label: `Mailbox subject captured: ${parsed.data.subject}` },
        { label: `Mailbox ingestion completed for ${parsed.data.sourceEmail}` },
      ],
      actor: {
        clerkUserId: contextResult.context.clerkUserId,
        name: contextResult.context.displayName,
        role: contextResult.context.workspace.role,
      },
    });

    const checklist = buildDashboardLaunchChecklist({
      viewerName: contextResult.context.displayName,
      isAuthenticated: true,
      workspaceName: contextResult.context.workspace.name,
      workspaceRole: contextResult.context.workspace.role,
      inboxConnectionCount: 0,
      orderCount: 1,
      orderStatuses: ["Intake captured"],
      erpConnectionCount: 0,
      subscriptionPlanKey: null,
      subscriptionStatus: null,
    });

    await recordLaunchChecklistTelemetry({
      organizationId: contextResult.context.workspace.id,
      clerkUserId: contextResult.context.clerkUserId,
      checklist,
    });

    return NextResponse.json({ orderId }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not ingest mailbox payload.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
