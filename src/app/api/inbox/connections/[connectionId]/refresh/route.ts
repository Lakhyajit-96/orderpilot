import { NextResponse } from "next/server";
import { getWorkspaceRequestContext } from "@/lib/api-workspace";
import { refreshInboxConnectionToken } from "@/lib/inbox";

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
    const connection = await refreshInboxConnectionToken({
      organizationId: contextResult.context.workspace.id,
      connectionId,
    });

    return NextResponse.json({ connection });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not refresh mailbox token.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}