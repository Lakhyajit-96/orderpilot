import { NextResponse } from "next/server";
import { flags } from "@/lib/env";
import { getDb } from "@/lib/db";

/**
 * Health check endpoint for monitoring and uptime checks.
 * Returns system status and configuration flags.
 */
export async function GET() {
  const checks = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    features: {
      auth: flags.hasClerk,
      database: flags.hasDatabase,
      billing: flags.hasStripe,
      gmailOAuth: flags.hasGmailOAuth,
      microsoftOAuth: flags.hasMicrosoftOAuth,
      tokenEncryption: flags.hasTokenEncryption,
    },
    services: {
      database: "unknown",
    },
  };

  // Check database connectivity
  if (flags.hasDatabase) {
    try {
      const db = getDb();
      if (db) {
        await db.$queryRaw`SELECT 1`;
        checks.services.database = "healthy";
      } else {
        checks.services.database = "unavailable";
        checks.status = "degraded";
      }
    } catch (error) {
      checks.services.database = "unhealthy";
      checks.status = "degraded";
    }
  }

  const statusCode = checks.status === "healthy" ? 200 : 503;

  return NextResponse.json(checks, { status: statusCode });
}
