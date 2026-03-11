import assert from "node:assert/strict";
import test from "node:test";
import { resolveClerkRuntimeConfig } from "./env.ts";

test("resolveClerkRuntimeConfig keeps test keys enabled in local development", () => {
  const config = resolveClerkRuntimeConfig({
    nodeEnv: "development",
    publishableKey: "pk_test_example",
    secretKey: "sk_test_example",
  });

  assert.equal(config.isEnabled, true);
  assert.equal(config.publishableKey, "pk_test_example");
});

test("resolveClerkRuntimeConfig disables non-live keys for hosted Vercel production", () => {
  const config = resolveClerkRuntimeConfig({
    nodeEnv: "production",
    publishableKey: "pk_test_example",
    secretKey: "sk_test_example",
    vercel: "1",
    vercelEnv: "production",
    vercelUrl: "orderpilot-mu.vercel.app",
  });

  assert.equal(config.isHostedVercelProduction, true);
  assert.equal(config.isEnabled, false);
  assert.equal(config.publishableKey, undefined);
});

test("resolveClerkRuntimeConfig preserves live keys for hosted Vercel production", () => {
  const config = resolveClerkRuntimeConfig({
    nodeEnv: "production",
    publishableKey: "pk_live_example",
    secretKey: "sk_live_example",
    vercel: "1",
  });

  assert.equal(config.isEnabled, true);
  assert.equal(config.publishableKey, "pk_live_example");
});