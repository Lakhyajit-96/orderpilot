import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { flags } from "@/lib/env";

declare global {
  var __orderpilot_prisma__: PrismaClient | undefined;
}

export function getDb() {
  if (!flags.hasDatabase) {
    return null;
  }

  if (!global.__orderpilot_prisma__) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });

    global.__orderpilot_prisma__ = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }

  return global.__orderpilot_prisma__;
}

