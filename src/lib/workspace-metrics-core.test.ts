import test from "node:test";
import assert from "node:assert/strict";
import { buildWorkspaceMetricCards } from "./workspace-metrics-core.ts";

test("buildWorkspaceMetricCards returns customer-safe zero-order messaging", () => {
  const metrics = buildWorkspaceMetricCards({
    ordersProcessed: 0,
    reviewCount: 0,
    totalRevenueCents: 0,
  });

  assert.equal(metrics[0]?.delta, "No workspace orders have been captured yet");
  assert.equal(metrics[1]?.value, "0%");
  assert.equal(metrics[2]?.delta, "Nothing is waiting for review yet");
  assert.equal(metrics[3]?.value, "$0");
});

test("buildWorkspaceMetricCards reports active review load once orders exist", () => {
  const metrics = buildWorkspaceMetricCards({
    ordersProcessed: 5,
    reviewCount: 2,
    totalRevenueCents: 125000,
  });

  assert.equal(metrics[0]?.value, "5");
  assert.equal(metrics[1]?.value, "60%");
  assert.equal(metrics[1]?.delta, "2 order(s) still need review");
  assert.equal(metrics[3]?.value, "$1,250");
});