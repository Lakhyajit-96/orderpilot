import { NextResponse } from "next/server";
import { getWorkspaceRequestContext } from "@/lib/api-workspace";
import { getWorkspaceOrderByExternalRef, undoLastWorkspaceOrderAction } from "@/lib/orders";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  const { orderId } = await params;

  try {
    await undoLastWorkspaceOrderAction({
      organizationId: contextResult.context.workspace.id,
      externalRef: orderId,
      actor: {
        clerkUserId: contextResult.context.clerkUserId,
        name: contextResult.context.displayName,
        role: contextResult.context.workspace.role,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not undo the last order action.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const order = await getWorkspaceOrderByExternalRef(contextResult.context.workspace.id, orderId);
  return NextResponse.json({ order });
}