import { z } from "zod";

export type ClerkRuntimeConfigInput = {
  nodeEnv: "development" | "test" | "production";
  publishableKey?: string;
  secretKey?: string;
  vercel?: string;
  vercelEnv?: string;
  vercelUrl?: string;
  stagingAllowTestAuth?: boolean;
};

function isLiveClerkKey(value?: string) {
  return Boolean(value?.startsWith("pk_live_") || value?.startsWith("sk_live_"));
}

export function resolveClerkRuntimeConfig(input: ClerkRuntimeConfigInput) {
  const publishableKey = input.publishableKey?.trim() || undefined;
  const secretKey = input.secretKey?.trim() || undefined;
  const hasKeys = Boolean(publishableKey) && Boolean(secretKey);
  const isHostedVercelProduction =
    input.nodeEnv === "production" && Boolean(input.vercel || input.vercelEnv || input.vercelUrl);
  const usesLiveKeys = isLiveClerkKey(publishableKey) && isLiveClerkKey(secretKey);
  const allowTestAuth =
    Boolean(input.stagingAllowTestAuth) ||
    (input.nodeEnv === "production" && input.vercelEnv === "preview");
  const disableForHostedProduction = hasKeys && isHostedVercelProduction && !usesLiveKeys && !allowTestAuth;

  return {
    isHostedVercelProduction,
    usesLiveKeys,
    isEnabled: hasKeys && !disableForHostedProduction,
    publishableKey: disableForHostedProduction ? undefined : publishableKey,
  };
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
  CLERK_SECRET_KEY: z.string().optional(),
  VERCEL: z.string().optional(),
  VERCEL_ENV: z.string().optional(),
  VERCEL_URL: z.string().optional(),
  CLERK_STAGING_ALLOW_TEST_AUTH: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  MAILBOX_OAUTH_STATE_SECRET: z.string().optional(),
  CRON_SECRET: z.string().optional(),
  GMAIL_OAUTH_CLIENT_ID: z.string().optional(),
  GMAIL_OAUTH_CLIENT_SECRET: z.string().optional(),
  GMAIL_OAUTH_SCOPES: z.string().optional(),
  GMAIL_PUBSUB_TOPIC: z.string().optional(),
  GMAIL_PUBSUB_VERIFICATION_TOKEN: z.string().optional(),
  MICROSOFT_ENTRA_CLIENT_ID: z.string().optional(),
  MICROSOFT_ENTRA_CLIENT_SECRET: z.string().optional(),
  MICROSOFT_ENTRA_TENANT_ID: z.string().optional(),
  MICROSOFT_GRAPH_SCOPES: z.string().optional(),
  MAILBOX_MAINTENANCE_SECRET: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_STARTER: z.string().optional(),
  STRIPE_PRICE_GROWTH: z.string().optional(),
  STRIPE_PRICE_ENTERPRISE: z.string().optional(),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  VERCEL: process.env.VERCEL,
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
  CLERK_STAGING_ALLOW_TEST_AUTH: process.env.CLERK_STAGING_ALLOW_TEST_AUTH,
  DATABASE_URL: process.env.DATABASE_URL,
  MAILBOX_OAUTH_STATE_SECRET: process.env.MAILBOX_OAUTH_STATE_SECRET,
  CRON_SECRET: process.env.CRON_SECRET,
  GMAIL_OAUTH_CLIENT_ID: process.env.GMAIL_OAUTH_CLIENT_ID,
  GMAIL_OAUTH_CLIENT_SECRET: process.env.GMAIL_OAUTH_CLIENT_SECRET,
  GMAIL_OAUTH_SCOPES: process.env.GMAIL_OAUTH_SCOPES,
  GMAIL_PUBSUB_TOPIC: process.env.GMAIL_PUBSUB_TOPIC,
  GMAIL_PUBSUB_VERIFICATION_TOKEN: process.env.GMAIL_PUBSUB_VERIFICATION_TOKEN,
  MICROSOFT_ENTRA_CLIENT_ID: process.env.MICROSOFT_ENTRA_CLIENT_ID,
  MICROSOFT_ENTRA_CLIENT_SECRET: process.env.MICROSOFT_ENTRA_CLIENT_SECRET,
  MICROSOFT_ENTRA_TENANT_ID: process.env.MICROSOFT_ENTRA_TENANT_ID,
  MICROSOFT_GRAPH_SCOPES: process.env.MICROSOFT_GRAPH_SCOPES,
  MAILBOX_MAINTENANCE_SECRET: process.env.MAILBOX_MAINTENANCE_SECRET,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_PRICE_STARTER: process.env.STRIPE_PRICE_STARTER,
  STRIPE_PRICE_GROWTH: process.env.STRIPE_PRICE_GROWTH,
  STRIPE_PRICE_ENTERPRISE: process.env.STRIPE_PRICE_ENTERPRISE,
});

export const clerkRuntime = resolveClerkRuntimeConfig({
  nodeEnv: env.NODE_ENV,
  publishableKey: env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  secretKey: env.CLERK_SECRET_KEY,
  vercel: env.VERCEL,
  vercelEnv: env.VERCEL_ENV,
  vercelUrl: env.VERCEL_URL,
  stagingAllowTestAuth: Boolean(env.CLERK_STAGING_ALLOW_TEST_AUTH),
});

export const flags = {
  hasClerk: clerkRuntime.isEnabled,
  hasDatabase: Boolean(env.DATABASE_URL),
  hasGmailOAuth:
    Boolean(env.GMAIL_OAUTH_CLIENT_ID) && Boolean(env.GMAIL_OAUTH_CLIENT_SECRET),
  hasMicrosoftOAuth:
    Boolean(env.MICROSOFT_ENTRA_CLIENT_ID) && Boolean(env.MICROSOFT_ENTRA_CLIENT_SECRET),
  hasMailboxOAuthStateSecret: Boolean(env.MAILBOX_OAUTH_STATE_SECRET || env.CLERK_SECRET_KEY),
  hasStripe:
    Boolean(env.STRIPE_SECRET_KEY) && Boolean(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
} as const;
