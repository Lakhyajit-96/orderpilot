import assert from "node:assert/strict";
import test from "node:test";
import { legacyMarketingOrderReviewHref, marketingOrderReviewHref } from "./marketing-routes.ts";
import { isPublicAppRoute, shouldRedirectLegacyMarketingOrderReview } from "./public-route-core.ts";

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