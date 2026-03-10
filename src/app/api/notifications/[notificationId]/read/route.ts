import { NextResponse } from "next/server";
import { getWorkspaceRequestContext } from "@/lib/api-workspace";
import { markNotificationRead } from "@/lib/workflow";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ notificationId: string }> },
) {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  const { notificationId } = await params;

  try {
    await markNotificationRead({
      organizationId: contextResult.context.workspace.id,
      clerkUserId: contextResult.context.clerkUserId,
      notificationId,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not mark notification read.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}