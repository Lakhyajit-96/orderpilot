import { NextResponse } from "next/server";
import { z } from "zod";
import { getWorkspaceRequestContext } from "@/lib/api-workspace";
import { exportWorkspaceOrder } from "@/lib/erp";

const exportSchema = z.object({
  connectionId: z.string().trim().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  const parsed = exportSchema.safeParse(await request.json().catch(() => ({})));

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { orderId } = await params;

  try {
    const exportRunId = await exportWorkspaceOrder({
      organizationId: contextResult.context.workspace.id,
      externalRef: orderId,
      connectionId: parsed.data.connectionId,
      actor: {
        clerkUserId: contextResult.context.clerkUserId,
        name: contextResult.context.displayName,
        role: contextResult.context.workspace.role,
      },
    });

    return NextResponse.json({ exportRunId }, { status: 202 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not export order.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}