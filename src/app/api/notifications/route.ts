import { NextResponse } from "next/server";
import { getWorkspaceRequestContext } from "@/lib/api-workspace";
import { getWorkspaceNotifications } from "@/lib/workflow";

export async function GET() {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  const notifications = await getWorkspaceNotifications({
    organizationId: contextResult.context.workspace.id,
    clerkUserId: contextResult.context.clerkUserId,
  });

  return NextResponse.json({ notifications });
}