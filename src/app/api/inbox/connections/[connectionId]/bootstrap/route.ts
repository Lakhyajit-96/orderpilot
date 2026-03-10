import { NextResponse } from "next/server";
import { getWorkspaceRequestContext } from "@/lib/api-workspace";
import { bootstrapInboxConnectionSubscription } from "@/lib/inbox";

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
    const connection = await bootstrapInboxConnectionSubscription({
      organizationId: contextResult.context.workspace.id,
      connectionId,
    });

    return NextResponse.json({ connection });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not bootstrap mailbox subscription.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}