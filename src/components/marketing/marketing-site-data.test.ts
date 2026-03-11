import assert from "node:assert/strict";
import test from "node:test";
import {
  faqItems,
  footerLinkGroups,
  headerMenuGroups,
  marketingSignals,
  proofPills,
  testimonials,
  trustLogos,
  workflowSteps,
} from "./marketing-site-data.ts";

test("marketing site data covers navigation, proof, and trust sections", () => {
  assert.equal(proofPills.length, 3);
  assert.equal(marketingSignals.length, 3);
  assert.equal(workflowSteps.length, 4);
  assert.equal(headerMenuGroups.length, 4);
  assert.equal(headerMenuGroups[0]?.label, "Platform");
  assert.equal(headerMenuGroups[0]?.href, "/platform");
  assert.equal(testimonials[0]?.company, "Atlas Industrial Supply");
  assert.equal(testimonials.length, 8);
  assert.equal(trustLogos[2]?.name, "NetSuite");
  assert.equal(trustLogos[0]?.id, "microsoft-365");
  assert.equal(faqItems.length, 6);
  assert.equal(footerLinkGroups[1]?.links[0]?.href, "/order-review");
});