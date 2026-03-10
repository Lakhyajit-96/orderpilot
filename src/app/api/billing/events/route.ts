import { NextResponse } from "next/server";
import { BillingEventStatus } from "@/generated/prisma/enums";
import { getWorkspaceRequestContext } from "@/lib/api-workspace";
import { getBillingDiagnosticsSnapshot, getBillingEvents } from "@/lib/billing-diagnostics";

export async function GET(request: Request) {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const normalizedStatus =
    status && status in BillingEventStatus
      ? (status as keyof typeof BillingEventStatus)
      : undefined;

  if (status && !normalizedStatus) {
    return NextResponse.json({ error: "Invalid billing event status filter." }, { status: 400 });
  }

  const organizationId = contextResult.context.workspace.id;
  const events = normalizedStatus
    ? await getBillingEvents({ organizationId, status: normalizedStatus, take: 20 })
    : (await getBillingDiagnosticsSnapshot(organizationId)).recentEvents;

  return NextResponse.json({ events });
}