import { NextResponse } from "next/server";
import { z } from "zod";
import { getWorkspaceRequestContext } from "@/lib/api-workspace";
import { hasPlanFeature } from "@/lib/plan-features";
import { getWorkspaceWorkflowSettings, updateWorkspaceWorkflowSettings } from "@/lib/workflow";

const workflowSchema = z.object({
  requireReasonCodes: z.boolean(),
  autoApproveConfidence: z.number().int().min(0).max(100).nullable().optional(),
  financeThresholdCents: z.number().int().min(0).nullable().optional(),
  stages: z.array(
    z.object({
      sequence: z.number().int().min(1),
      role: z.enum(["OWNER", "ADMIN", "REVIEWER", "OPERATOR"]),
      title: z.string().trim().min(2),
      minOrderValueCents: z.number().int().min(0).nullable().optional(),
      requireReasonCode: z.boolean(),
    }),
  ).min(1),
  reasonCodesText: z.string(),
});

export async function GET() {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  const settings = await getWorkspaceWorkflowSettings(contextResult.context.workspace.id);
  return NextResponse.json({ settings });
}

export async function POST(request: Request) {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  const activePlan = contextResult.context.workspace.subscription?.planKey ?? null;

  if (!hasPlanFeature(activePlan, "approval_workflows")) {
    return NextResponse.json(
      { error: "Approval workflows and reason codes require the Growth plan or above. Upgrade your plan to use this feature." },
      { status: 403 },
    );
  }

  const parsed = workflowSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const settings = await updateWorkspaceWorkflowSettings({
      organizationId: contextResult.context.workspace.id,
      ...parsed.data,
    });

    return NextResponse.json({ settings });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update workflow policy.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
