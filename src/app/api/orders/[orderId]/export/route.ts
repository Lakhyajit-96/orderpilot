import { NextResponse } from "next/server";
import { z } from "zod";
import { getWorkspaceRequestContext } from "@/lib/api-workspace";
import { exportWorkspaceOrder } from "@/lib/erp";
import { hasPlanFeature } from "@/lib/plan-features";

const exportSchema = z.object({
  connectionId: z.string().trim().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  const activePlan = contextResult.context.workspace.subscription?.planKey ?? null;

  if (!hasPlanFeature(activePlan, "erp_export_adapters")) {
    return NextResponse.json(
      { error: "ERP export requires the Growth plan or above. Upgrade your plan to use this feature." },
      { status: 403 },
    );
  }

  const parsed = exportSchema.safeParse(await request.json().catch(() => ({})));

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { orderId } = await params;

  try {
    const exportRunId = await exportWorkspaceOrder({
      organizationId: contextResult.context.workspace.id,
      externalRef: orderId,
      connectionId: parsed.data.connectionId,
      actor: {
        clerkUserId: contextResult.context.clerkUserId,
        name: contextResult.context.displayName,
        role: contextResult.context.workspace.role,
      },
    });

    return NextResponse.json({ exportRunId }, { status: 202 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not export order.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
