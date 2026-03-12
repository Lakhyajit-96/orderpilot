import test from "node:test";
import assert from "node:assert/strict";
import { checkRateLimit, RATE_LIMITS } from "./rate-limit.ts";

test("checkRateLimit allows requests within limit", () => {
  const identifier = "test-user-1";
  const config = { limit: 5, windowSeconds: 60 };

  for (let i = 0; i < 5; i++) {
    const result = checkRateLimit(identifier, config);
    assert.equal(result.success, true);
    assert.equal(result.remaining, 4 - i);
  }
});

test("checkRateLimit blocks requests exceeding limit", () => {
  const identifier = "test-user-2";
  const config = { limit: 3, windowSeconds: 60 };

  // Use up the limit
  for (let i = 0; i < 3; i++) {
    checkRateLimit(identifier, config);
  }

  // Next request should be blocked
  const result = checkRateLimit(identifier, config);
  assert.equal(result.success, false);
  assert.equal(result.remaining, 0);
});

test("checkRateLimit resets after window expires", async () => {
  const identifier = "test-user-3";
  const config = { limit: 2, windowSeconds: 1 }; // 1 second window

  // Use up the limit
  checkRateLimit(identifier, config);
  checkRateLimit(identifier, config);

  // Should be blocked
  let result = checkRateLimit(identifier, config);
  assert.equal(result.success, false);

  // Wait for window to expire
  await new Promise((resolve) => setTimeout(resolve, 1100));

  // Should be allowed again
  result = checkRateLimit(identifier, config);
  assert.equal(result.success, true);
  assert.equal(result.remaining, 1);
});

test("checkRateLimit isolates different identifiers", () => {
  const config = { limit: 2, windowSeconds: 60 };

  // User 1 uses their limit
  checkRateLimit("user-1", config);
  checkRateLimit("user-1", config);

  // User 1 should be blocked
  let result = checkRateLimit("user-1", config);
  assert.equal(result.success, false);

  // User 2 should still be allowed
  result = checkRateLimit("user-2", config);
  assert.equal(result.success, true);
});

test("RATE_LIMITS presets are properly configured", () => {
  assert.ok(RATE_LIMITS.CHECKOUT.limit > 0);
  assert.ok(RATE_LIMITS.CHECKOUT.windowSeconds > 0);
  assert.ok(RATE_LIMITS.API_READ.limit > RATE_LIMITS.API_WRITE.limit);
  assert.ok(RATE_LIMITS.CHECKOUT.limit < RATE_LIMITS.API_WRITE.limit);
});
