/**
 * Error tracking and logging utilities.
 * Integrates with Sentry for production error monitoring.
 * 
 * To enable Sentry:
 * 1. Install: pnpm add @sentry/nextjs
 * 2. Run: npx @sentry/wizard@latest -i nextjs
 * 3. Set SENTRY_DSN in environment variables
 */

import { env } from "@/lib/env";

type ErrorContext = {
  userId?: string | null;
  organizationId?: string | null;
  route?: string;
  method?: string;
  [key: string]: unknown;
};

type ErrorSeverity = "fatal" | "error" | "warning" | "info" | "debug";

/**
 * Capture an error with context for monitoring.
 * In production, this would send to Sentry or similar service.
 */
export function captureError(
  error: Error | unknown,
  context?: ErrorContext,
  severity: ErrorSeverity = "error",
): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;

  // In development, log to console
  if (env.NODE_ENV === "development") {
    console.error(`[${severity.toUpperCase()}]`, errorMessage, {
      stack: errorStack,
      context,
    });
    return;
  }

  // In production, log structured error
  console.error(JSON.stringify({
    level: severity,
    message: errorMessage,
    stack: errorStack,
    context,
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  }));

  // TODO: Send to Sentry when configured
  // if (Sentry) {
  //   Sentry.captureException(error, {
  //     level: severity,
  //     contexts: { custom: context },
  //   });
  // }
}

/**
 * Capture a message for monitoring (non-error events).
 */
export function captureMessage(
  message: string,
  context?: ErrorContext,
  severity: ErrorSeverity = "info",
): void {
  if (env.NODE_ENV === "development") {
    console.log(`[${severity.toUpperCase()}]`, message, context);
    return;
  }

  console.log(JSON.stringify({
    level: severity,
    message,
    context,
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  }));

  // TODO: Send to Sentry when configured
  // if (Sentry) {
  //   Sentry.captureMessage(message, {
  //     level: severity,
  //     contexts: { custom: context },
  //   });
  // }
}

/**
 * Track a business metric or event.
 * Useful for monitoring key business operations.
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>,
): void {
  if (env.NODE_ENV === "development") {
    console.log(`[EVENT] ${eventName}`, properties);
    return;
  }

  console.log(JSON.stringify({
    event: eventName,
    properties,
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  }));

  // TODO: Send to analytics service (PostHog, Mixpanel, etc.)
}

/**
 * Wrap an async function with error tracking.
 * Automatically captures and logs errors while re-throwing them.
 */
export function withErrorTracking<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  context?: ErrorContext,
): T {
  return (async (...args: unknown[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      captureError(error, context);
      throw error;
    }
  }) as T;
}
