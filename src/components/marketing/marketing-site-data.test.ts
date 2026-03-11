import assert from "node:assert/strict";
import test from "node:test";
import {
  faqItems,
  footerLinkGroups,
  headerMenuGroups,
  marketingOrderReviewHref,
  marketingSignals,
  proofPills,
  testimonials,
  trustLogos,
  workflowSteps,
} from "./marketing-site-data.ts";

test("marketing site data covers navigation, proof, and trust sections", () => {
  assert.equal(proofPills.length, 3);
  assert.match(marketingOrderReviewHref, /^\/preview\//);
  assert.equal(marketingSignals.length, 3);
  assert.equal(workflowSteps.length, 4);
  assert.equal(headerMenuGroups.length, 4);
  assert.equal(headerMenuGroups[0]?.label, "Platform");
  assert.equal(testimonials.length, 5);
  assert.equal(testimonials[0]?.company, "Atlas Industrial Supply");
  assert.match(testimonials[0]?.detail ?? "", /Microsoft 365/);
  assert.equal(testimonials[0]?.proofPoints.length, 3);
  assert.equal(trustLogos[2]?.name, "NetSuite");
  assert.equal(trustLogos.length, 6);
  assert.equal(faqItems.length, 6);
  assert.equal(footerLinkGroups[1]?.links[1]?.label, "See order review");
  assert.equal(footerLinkGroups[1]?.links[1]?.href, marketingOrderReviewHref);
});