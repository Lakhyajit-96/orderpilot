import { NextResponse } from "next/server";
import { z } from "zod";
import { getWorkspaceRequestContext } from "@/lib/api-workspace";
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