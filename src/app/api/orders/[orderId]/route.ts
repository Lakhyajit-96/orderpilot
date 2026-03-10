import { NextResponse } from "next/server";
import { z } from "zod";
import { getWorkspaceRequestContext } from "@/lib/api-workspace";
import {
  getWorkspaceOrderByExternalRef,
  updateWorkspaceOrderStatus,
} from "@/lib/orders";

const patchOrderSchema = z.object({
  status: z.enum(["INGESTED", "REVIEW", "APPROVED", "EXPORTED"]),
  note: z.string().trim().min(1).optional(),
  reasonCode: z.string().trim().min(1).optional(),
  comment: z.string().trim().min(1).optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  const { orderId } = await params;
  const order = await getWorkspaceOrderByExternalRef(
    contextResult.context.workspace.id,
    orderId,
  );

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ order });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  const parsed = patchOrderSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { orderId } = await params;

  try {
    await updateWorkspaceOrderStatus({
      organizationId: contextResult.context.workspace.id,
      externalRef: orderId,
      status: parsed.data.status,
      note: parsed.data.note,
      reasonCode: parsed.data.reasonCode,
      comment: parsed.data.comment,
      actor: {
        clerkUserId: contextResult.context.clerkUserId,
        name: contextResult.context.displayName,
        role: contextResult.context.workspace.role,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update order status.";
    return NextResponse.json({ error: message }, { status: 404 });
  }

  const order = await getWorkspaceOrderByExternalRef(contextResult.context.workspace.id, orderId);
  return NextResponse.json({ order });
}