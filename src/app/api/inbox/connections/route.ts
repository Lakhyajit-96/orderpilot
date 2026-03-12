import { NextResponse } from "next/server";
import { z } from "zod";
import { getWorkspaceRequestContext } from "@/lib/api-workspace";
import { captureError, trackEvent } from "@/lib/error-tracking";
import { getWorkspaceInboxConnections, upsertInboxConnection } from "@/lib/inbox";
import { checkRateLimit, getRateLimitIdentifier, RATE_LIMITS } from "@/lib/rate-limit";

const inboxConnectionSchema = z.object({
  provider: z.enum(["GMAIL", "MICROSOFT365"]),
  address: z.string().trim().email(),
  syncMode: z.enum(["POLLING", "WEBHOOK"]),
  accessToken: z.string().trim().min(8).optional(),
  refreshToken: z.string().trim().min(8).optional(),
  webhookSecret: z.string().trim().min(6).optional(),
  isActive: z.boolean().optional(),
});

export async function GET(request: Request) {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  // Rate limiting
  const rateLimitId = getRateLimitIdentifier(request, contextResult.context.clerkUserId);
  const rateLimit = checkRateLimit(rateLimitId, RATE_LIMITS.API_READ);

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { 
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
          "X-RateLimit-Reset": String(rateLimit.reset),
        },
      },
    );
  }

  try {
    const connections = await getWorkspaceInboxConnections(contextResult.context.workspace.id);
    return NextResponse.json({ connections });
  } catch (error) {
    captureError(error, {
      userId: contextResult.context.clerkUserId,
      organizationId: contextResult.context.workspace.id,
      route: "/api/inbox/connections",
      method: "GET",
    });
    return NextResponse.json({ error: "Failed to fetch inbox connections." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  // Rate limiting
  const rateLimitId = getRateLimitIdentifier(request, contextResult.context.clerkUserId);
  const rateLimit = checkRateLimit(rateLimitId, RATE_LIMITS.API_WRITE);

  if (!rateLimit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { 
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
          "X-RateLimit-Reset": String(rateLimit.reset),
        },
      },
    );
  }

  const parsed = inboxConnectionSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const connection = await upsertInboxConnection(contextResult.context.workspace.id, parsed.data);

    trackEvent("inbox_connection_created", {
      userId: contextResult.context.clerkUserId,
      organizationId: contextResult.context.workspace.id,
      provider: parsed.data.provider,
      syncMode: parsed.data.syncMode,
    });

    return NextResponse.json({ connection }, { status: 201 });
  } catch (error) {
    captureError(error, {
      userId: contextResult.context.clerkUserId,
      organizationId: contextResult.context.workspace.id,
      route: "/api/inbox/connections",
      method: "POST",
    });

    const message = error instanceof Error ? error.message : "Could not save inbox connection.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}