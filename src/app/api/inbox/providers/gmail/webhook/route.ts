import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { decodeGmailPushNotification } from "@/lib/inbox-core";
import { processGmailPushNotification } from "@/lib/inbox";

export const runtime = "nodejs";

const gmailPubsubSchema = z.object({
  message: z.object({
    data: z.string().trim().min(1),
    messageId: z.string().trim().optional(),
    publishTime: z.string().trim().optional(),
  }),
  subscription: z.string().trim().optional(),
});

function isAuthorized(request: Request) {
  const expectedToken = env.GMAIL_PUBSUB_VERIFICATION_TOKEN?.trim();

  if (!expectedToken) {
    return true;
  }

  return new URL(request.url).searchParams.get("token") === expectedToken;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Invalid Gmail Pub/Sub verification token." }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid Gmail Pub/Sub request body." }, { status: 400 });
  }

  const parsed = gmailPubsubSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const notification = decodeGmailPushNotification(parsed.data.message.data);
    const result = await processGmailPushNotification({
      ...notification,
      pubsubMessageId: parsed.data.message.messageId ?? null,
    });

    return NextResponse.json({ acknowledged: true, result }, { status: 202 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gmail Pub/Sub processing failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}