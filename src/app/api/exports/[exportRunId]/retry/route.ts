import { NextResponse } from "next/server";
import { getWorkspaceRequestContext } from "@/lib/api-workspace";
import { retryExportRun } from "@/lib/erp";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ exportRunId: string }> },
) {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  const { exportRunId } = await params;

  try {
    const newRunId = await retryExportRun({
      organizationId: contextResult.context.workspace.id,
      exportRunId,
      actor: {
        clerkUserId: contextResult.context.clerkUserId,
        name: contextResult.context.displayName,
        role: contextResult.context.workspace.role,
      },
    });

    return NextResponse.json({ exportRunId: newRunId }, { status: 202 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not retry export run.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}