import test from "node:test";
import assert from "node:assert/strict";
import {
  buildCheckoutCancelUrl,
  buildCheckoutSuccessUrl,
} from "./billing-checkout-core.ts";

test("buildCheckoutSuccessUrl returns a billing-focused settings redirect with session id", () => {
  assert.equal(
    buildCheckoutSuccessUrl("https://app.example.com/api/billing/checkout"),
    "https://app.example.com/settings?checkout=success&session_id={CHECKOUT_SESSION_ID}#workspace-billing",
  );
});

test("buildCheckoutCancelUrl returns a billing-focused settings redirect", () => {
  assert.equal(
    buildCheckoutCancelUrl("https://app.example.com/api/billing/checkout"),
    "https://app.example.com/settings?checkout=canceled#workspace-billing",
  );
});