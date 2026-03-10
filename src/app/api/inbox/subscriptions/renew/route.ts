import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { renewInboxConnectionSubscriptions } from "@/lib/inbox";

export const runtime = "nodejs";

const renewSchema = z.object({
  organizationId: z.string().trim().min(1).optional(),
  renewWithinMinutes: z.number().int().positive().max(10_080).optional(),
  force: z.boolean().optional(),
});

function isAuthorized(request: Request) {
  const secret = env.MAILBOX_MAINTENANCE_SECRET?.trim();

  if (!secret) {
    return false;
  }

  const bearer = request.headers.get("authorization");
  const header = request.headers.get("x-orderpilot-maintenance-secret");
  return bearer === `Bearer ${secret}` || header === secret;
}

export async function POST(request: Request) {
  if (!env.MAILBOX_MAINTENANCE_SECRET?.trim()) {
    return NextResponse.json({ error: "MAILBOX_MAINTENANCE_SECRET is not configured." }, { status: 503 });
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized mailbox maintenance request." }, { status: 401 });
  }

  let body: unknown = {};

  const contentLength = request.headers.get("content-length");

  if (contentLength && contentLength !== "0") {
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid mailbox maintenance request body." }, { status: 400 });
    }
  }

  const parsed = renewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const result = await renewInboxConnectionSubscriptions(parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Mailbox subscription renewal failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}