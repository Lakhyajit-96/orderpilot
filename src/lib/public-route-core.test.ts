import assert from "node:assert/strict";
import test from "node:test";
import { legacyMarketingOrderReviewHref, marketingOrderReviewHref } from "./marketing-routes.ts";
import {
  isProxyProtectedRoute,
  isPublicAppRoute,
  shouldRedirectLegacyMarketingOrderReview,
} from "./public-route-core.ts";

test("public route core allows the marketing-safe order preview", () => {
  assert.equal(isPublicAppRoute("/"), true);
  assert.equal(isPublicAppRoute(marketingOrderReviewHref), true);
  assert.equal(isPublicAppRoute(legacyMarketingOrderReviewHref), false);
});

test("public route core redirects the legacy order-review link only for anonymous visitors", () => {
  assert.equal(shouldRedirectLegacyMarketingOrderReview(legacyMarketingOrderReviewHref, false), true);
  assert.equal(shouldRedirectLegacyMarketingOrderReview(legacyMarketingOrderReviewHref, true), false);
  assert.equal(shouldRedirectLegacyMarketingOrderReview("/orders/PO-99999", false), false);
});

test("public route core only proxy-protects non-public api routes", () => {
  assert.equal(isProxyProtectedRoute("/dashboard"), false);
  assert.equal(isProxyProtectedRoute("/orders"), false);
  assert.equal(isProxyProtectedRoute("/settings"), false);
  assert.equal(isProxyProtectedRoute(marketingOrderReviewHref), false);
  assert.equal(isProxyProtectedRoute("/api/orders"), true);
  assert.equal(isProxyProtectedRoute("/api/billing/portal"), true);
  assert.equal(isProxyProtectedRoute("/api/stripe/webhook"), false);
  assert.equal(isProxyProtectedRoute("/api/inbox/providers/gmail/webhook"), false);
});