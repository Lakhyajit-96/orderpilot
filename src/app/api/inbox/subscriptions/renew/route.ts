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

function getAuthorizedSecrets() {
  return [env.MAILBOX_MAINTENANCE_SECRET?.trim(), env.CRON_SECRET?.trim()].filter(
    (value): value is string => Boolean(value),
  );
}

function isAuthorized(request: Request) {
  const secrets = getAuthorizedSecrets();

  if (!secrets.length) {
    return false;
  }

  const bearer = request.headers.get("authorization");
  const header = request.headers.get("x-orderpilot-maintenance-secret");
  return secrets.some((secret) => bearer === `Bearer ${secret}` || header === secret);
}

async function runRenewal(payload: unknown) {
  const parsed = renewSchema.safeParse(payload);

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

export async function GET(request: Request) {
  if (!getAuthorizedSecrets().length) {
    return NextResponse.json(
      { error: "MAILBOX_MAINTENANCE_SECRET or CRON_SECRET is not configured." },
      { status: 503 },
    );
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized mailbox maintenance request." }, { status: 401 });
  }

  const url = new URL(request.url);
  const renewWithinMinutesParam = url.searchParams.get("renewWithinMinutes");
  const forceParam = url.searchParams.get("force");

  return runRenewal({
    renewWithinMinutes: renewWithinMinutesParam ? Number(renewWithinMinutesParam) : 36 * 60,
    force: forceParam === "true",
  });
}

export async function POST(request: Request) {
  if (!getAuthorizedSecrets().length) {
    return NextResponse.json(
      { error: "MAILBOX_MAINTENANCE_SECRET or CRON_SECRET is not configured." },
      { status: 503 },
    );
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

  return runRenewal(body);
}