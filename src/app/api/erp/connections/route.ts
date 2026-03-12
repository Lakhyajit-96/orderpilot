import { NextResponse } from "next/server";
import { z } from "zod";
import { getWorkspaceRequestContext } from "@/lib/api-workspace";
import { captureError, trackEvent } from "@/lib/error-tracking";
import { parseJsonRecord } from "@/lib/erp-core";
import { getWorkspaceErpConnections, upsertErpConnection } from "@/lib/erp";
import { checkRateLimit, getRateLimitIdentifier, RATE_LIMITS } from "@/lib/rate-limit";

const erpConnectionSchema = z.object({
  name: z.string().trim().min(2),
  endpointUrl: z.string().url(),
  authHeader: z.string().trim().min(6).optional(),
  provider: z.enum(["WEBHOOK", "NETSUITE", "SAP", "DYNAMICS"]).optional(),
  fieldMappingsText: z.string().optional(),
  adapterSettingsText: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(request: Request) {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  // Rate limiting for reads
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
    const connections = await getWorkspaceErpConnections(contextResult.context.workspace.id);
    return NextResponse.json({ connections });
  } catch (error) {
    captureError(error, {
      userId: contextResult.context.clerkUserId,
      organizationId: contextResult.context.workspace.id,
      route: "/api/erp/connections",
      method: "GET",
    });
    return NextResponse.json({ error: "Failed to fetch ERP connections." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const contextResult = await getWorkspaceRequestContext();

  if (!contextResult.ok) {
    return NextResponse.json({ error: contextResult.error }, { status: contextResult.status });
  }

  // Rate limiting for writes
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

  const parsed = erpConnectionSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const connection = await upsertErpConnection({
      organizationId: contextResult.context.workspace.id,
      name: parsed.data.name,
      endpointUrl: parsed.data.endpointUrl,
      authHeader: parsed.data.authHeader,
      provider: parsed.data.provider,
      fieldMappings: parseJsonRecord(parsed.data.fieldMappingsText ?? "", {}),
      adapterSettings: parseJsonRecord(parsed.data.adapterSettingsText ?? "", {}),
      isActive: parsed.data.isActive,
    });

    trackEvent("erp_connection_created", {
      userId: contextResult.context.clerkUserId,
      organizationId: contextResult.context.workspace.id,
      provider: parsed.data.provider,
    });

    return NextResponse.json({ connection }, { status: 201 });
  } catch (error) {
    captureError(error, {
      userId: contextResult.context.clerkUserId,
      organizationId: contextResult.context.workspace.id,
      route: "/api/erp/connections",
      method: "POST",
    });

    const message = error instanceof Error ? error.message : "Could not save ERP connection.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}