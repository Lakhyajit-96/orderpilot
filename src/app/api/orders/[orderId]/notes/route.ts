import { NextResponse } from "next/server";
import { z } from "zod";
import { getWorkspaceRequestContext } from "@/lib/api-workspace";
import { addWorkspaceOrderNote, getWorkspaceOrderByExternalRef } from "@/lib/orders";

const noteSchema = z.object({
  body: z.string().trim().min(2),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  const parsed = noteSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { orderId } = await params;

  try {
    await addWorkspaceOrderNote({
      organizationId: contextResult.context.workspace.id,
      externalRef: orderId,
      body: parsed.data.body,
      actor: {
        clerkUserId: contextResult.context.clerkUserId,
        name: contextResult.context.displayName,
        role: contextResult.context.workspace.role,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not add order note.";
    return NextResponse.json({ error: message }, { status: 404 });
  }

  const order = await getWorkspaceOrderByExternalRef(contextResult.context.workspace.id, orderId);
  return NextResponse.json({ order }, { status: 201 });
}