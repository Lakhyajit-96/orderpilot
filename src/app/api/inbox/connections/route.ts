import { NextResponse } from "next/server";
import { z } from "zod";
import { getWorkspaceRequestContext } from "@/lib/api-workspace";
import { getWorkspaceInboxConnections, upsertInboxConnection } from "@/lib/inbox";

const inboxConnectionSchema = z.object({
  provider: z.enum(["GMAIL", "MICROSOFT365"]),
  address: z.string().trim().email(),
  syncMode: z.enum(["POLLING", "WEBHOOK"]),
  accessToken: z.string().trim().min(8).optional(),
  refreshToken: z.string().trim().min(8).optional(),
  webhookSecret: z.string().trim().min(6).optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  const connections = await getWorkspaceInboxConnections(contextResult.context.workspace.id);
  return NextResponse.json({ connections });
}

export async function POST(request: Request) {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  const parsed = inboxConnectionSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const connection = await upsertInboxConnection(contextResult.context.workspace.id, parsed.data);
  return NextResponse.json({ connection }, { status: 201 });
}