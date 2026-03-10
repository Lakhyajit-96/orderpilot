import test from "node:test";
import assert from "node:assert/strict";
import {
  mapStripeSubscriptionStatus,
  resolvePlanKey,
} from "./stripe-webhook-core.ts";

test("mapStripeSubscriptionStatus normalizes Stripe states into persisted states", () => {
  assert.equal(mapStripeSubscriptionStatus("active"), "ACTIVE");
  assert.equal(mapStripeSubscriptionStatus("trialing"), "TRIALING");
  assert.equal(mapStripeSubscriptionStatus("past_due"), "PAST_DUE");
  assert.equal(mapStripeSubscriptionStatus("canceled"), "CANCELED");
  assert.equal(mapStripeSubscriptionStatus("paused"), "PAST_DUE");
});

test("resolvePlanKey prefers explicit metadata before fallback sources", () => {
  assert.equal(resolvePlanKey("growth", "starter", "starter"), "growth");
  assert.equal(resolvePlanKey(null, "starter", "growth"), "starter");
  assert.equal(resolvePlanKey(null, null, "growth"), "growth");
  assert.equal(resolvePlanKey(null, null, null), null);
});