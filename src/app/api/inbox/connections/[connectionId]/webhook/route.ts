import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { ingestWebhookMessages, processInboxProviderNotification } from "@/lib/inbox";

const webhookSchema = z.object({
  secret: z.string().trim().min(6),
  messages: z.array(
    z.object({
      provider: z.enum(["GMAIL", "MICROSOFT365"]),
      externalMessageId: z.string().trim().min(1),
      fromEmail: z.string().email(),
      fromName: z.string().trim().min(1),
      subject: z.string().trim().min(1),
      bodyText: z.string().optional().default(""),
      receivedAt: z.string().optional(),
    }),
  ).min(1),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ connectionId: string }> },
) {
  const { connectionId } = await params;
  const validationToken = new URL(request.url).searchParams.get("validationToken");

  if (validationToken) {
    return new Response(validationToken, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.json({ ok: true, connectionId });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ connectionId: string }> },
) {
  const validationToken = new URL(request.url).searchParams.get("validationToken");

  if (validationToken) {
    return new Response(validationToken, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  const db = getDb();

  if (!db) {
    return NextResponse.json({ error: "Database is unavailable." }, { status: 503 });
  }

  const { connectionId } = await params;
  const connection = await db.inboxConnection.findUnique({ where: { id: connectionId } });

  if (!connection) {
    return NextResponse.json({ error: "Inbox connection not found." }, { status: 404 });
  }

  const payload = (await request.json()) as Record<string, unknown>;

  if (Array.isArray(payload.value)) {
    try {
      const result = await processInboxProviderNotification({ connectionId, payload });
      return NextResponse.json(result, { status: 202 });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Inbox provider notification failed.";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  const parsed = webhookSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const createdOrders = await ingestWebhookMessages({
      organizationId: connection.organizationId,
      connectionId,
      secret: parsed.data.secret,
      messages: parsed.data.messages,
    });

    return NextResponse.json({ createdOrders }, { status: 202 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Inbox webhook ingestion failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}