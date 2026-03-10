import { NextResponse } from "next/server";
import { z } from "zod";
import { getWorkspaceRequestContext } from "@/lib/api-workspace";
import { createWorkspaceOrder, getWorkspaceOrders } from "@/lib/orders";

const createOrderSchema = z.object({
  externalRef: z.string().trim().min(3).optional(),
  customerName: z.string().trim().min(2),
  customerEmail: z.string().email().optional(),
  sourceEmail: z.string().trim().min(3).optional(),
  summary: z.string().trim().min(2).optional(),
  shippingAddress: z.string().trim().min(2).optional(),
  totalCents: z.number().int().nonnegative().optional(),
  status: z.enum(["INGESTED", "REVIEW", "APPROVED", "EXPORTED"]).optional(),
  notes: z.array(z.string().trim().min(1)).optional(),
  activity: z
    .array(
      z.object({
        label: z.string().trim().min(2),
        time: z.string().trim().min(1).optional(),
      }),
    )
    .optional(),
  exceptions: z.array(z.string().trim().min(1)).optional(),
  lineItems: z.array(
    z.object({
      sku: z.string().trim().min(1),
      description: z.string().trim().min(2),
      quantity: z.number().int().positive(),
      mappedTo: z.string().trim().min(1).optional(),
      match: z.number().int().min(0).max(100).optional(),
      state: z.string().trim().min(1).optional(),
    }),
  ).min(1),
});

export async function GET() {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  const orders = await getWorkspaceOrders(contextResult.context.workspace.id);
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  const parsed = createOrderSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const orderId = await createWorkspaceOrder(contextResult.context.workspace.id, {
    ...parsed.data,
    actor: {
      clerkUserId: contextResult.context.clerkUserId,
      name: contextResult.context.displayName,
      role: contextResult.context.workspace.role,
    },
  });
  return NextResponse.json({ orderId }, { status: 201 });
}