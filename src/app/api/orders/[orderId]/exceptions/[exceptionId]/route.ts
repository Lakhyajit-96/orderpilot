import { NextResponse } from "next/server";
import { z } from "zod";
import { getWorkspaceRequestContext } from "@/lib/api-workspace";
import {
  getWorkspaceOrderByExternalRef,
  resolveWorkspaceOrderException,
} from "@/lib/orders";

const patchExceptionSchema = z.object({
  note: z.string().trim().min(1).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderId: string; exceptionId: string }> },
) {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  const parsed = patchExceptionSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { orderId, exceptionId } = await params;

  try {
    await resolveWorkspaceOrderException({
      organizationId: contextResult.context.workspace.id,
      externalRef: orderId,
      exceptionId,
      note: parsed.data.note,
      actor: {
        clerkUserId: contextResult.context.clerkUserId,
        name: contextResult.context.displayName,
        role: contextResult.context.workspace.role,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not resolve exception.";
    return NextResponse.json({ error: message }, { status: 404 });
  }

  const order = await getWorkspaceOrderByExternalRef(contextResult.context.workspace.id, orderId);
  return NextResponse.json({ order });
}