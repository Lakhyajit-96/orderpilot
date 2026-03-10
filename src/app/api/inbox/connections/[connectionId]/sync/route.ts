import { NextResponse } from "next/server";
import { getWorkspaceRequestContext } from "@/lib/api-workspace";
import { syncInboxConnection } from "@/lib/inbox";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ connectionId: string }> },
) {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  const { connectionId } = await params;

  try {
    const result = await syncInboxConnection({
      organizationId: contextResult.context.workspace.id,
      connectionId,
      actor: {
        clerkUserId: contextResult.context.clerkUserId,
        name: contextResult.context.displayName,
        role: contextResult.context.workspace.role,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Inbox sync failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}