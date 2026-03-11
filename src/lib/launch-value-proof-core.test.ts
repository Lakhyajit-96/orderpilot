import test from "node:test";
import assert from "node:assert/strict";
import { buildLaunchValueProofMetrics, formatLaunchValueDuration } from "./launch-value-proof-core.ts";

test("formatLaunchValueDuration renders human-readable elapsed time", () => {
  assert.equal(
    formatLaunchValueDuration("2026-03-11T08:00:00.000Z", "2026-03-11T10:15:00.000Z"),
    "2h 15m",
  );
});

test("buildLaunchValueProofMetrics reports missing ERP-ready state clearly", () => {
  const metrics = buildLaunchValueProofMetrics({
    ordersIngested: 3,
    ordersReviewed: 2,
    firstOrderAt: "2026-03-11T08:00:00.000Z",
    firstErpReadyAt: null,
  });

  assert.equal(metrics[1]?.detail, "67% of ingested orders have entered review or approval.");
  assert.equal(metrics[2]?.value, "Not reached yet");
});