/**
 * Simple in-memory rate limiter for API routes.
 * For production scale, replace with Redis-based rate limiting (Upstash, Vercel KV, etc.)
 */

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export type RateLimitConfig = {
  /**
   * Maximum number of requests allowed in the window
   */
  limit: number;
  /**
   * Time window in seconds
   */
  windowSeconds: number;
};

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

/**
 * Check if a request should be rate limited.
 * 
 * @param identifier - Unique identifier for the rate limit (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns Rate limit result with success status and metadata
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig,
): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const key = `${identifier}:${config.limit}:${config.windowSeconds}`;

  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // First request or window expired
    store.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });

    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      reset: now + windowMs,
    };
  }

  if (entry.count >= config.limit) {
    // Rate limit exceeded
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      reset: entry.resetAt,
    };
  }

  // Increment count
  entry.count += 1;
  store.set(key, entry);

  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - entry.count,
    reset: entry.resetAt,
  };
}

/**
 * Get rate limit identifier from request.
 * Uses Clerk user ID if authenticated, otherwise falls back to IP address.
 */
export function getRateLimitIdentifier(request: Request, userId?: string | null): string {
  if (userId) {
    return `user:${userId}`;
  }

  // Try to get IP from various headers (Vercel, Cloudflare, etc.)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim() || realIp || "unknown";

  return `ip:${ip}`;
}

/**
 * Rate limit presets for common use cases
 */
export const RATE_LIMITS = {
  // Strict limits for expensive operations
  CHECKOUT: { limit: 5, windowSeconds: 60 }, // 5 checkouts per minute
  EXPORT: { limit: 10, windowSeconds: 60 }, // 10 exports per minute
  OAUTH_START: { limit: 10, windowSeconds: 60 }, // 10 OAuth flows per minute
  
  // Moderate limits for normal operations
  API_WRITE: { limit: 30, windowSeconds: 60 }, // 30 writes per minute
  SYNC: { limit: 20, windowSeconds: 60 }, // 20 syncs per minute
  
  // Generous limits for read operations
  API_READ: { limit: 100, windowSeconds: 60 }, // 100 reads per minute
  
  // Very strict for webhooks (should be from trusted sources)
  WEBHOOK: { limit: 100, windowSeconds: 60 }, // 100 webhooks per minute per source
} as const;
