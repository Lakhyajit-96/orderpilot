import test from "node:test";
import assert from "node:assert/strict";
import {
  buildBillingPortalReturnUrl,
  createBillingPortalSessionUrl,
} from "./billing-portal-core.ts";

test("buildBillingPortalReturnUrl targets settings page on same origin", () => {
  assert.equal(
    buildBillingPortalReturnUrl("https://app.example.com/api/billing/portal"),
    "https://app.example.com/settings?portal=return",
  );
});

test("createBillingPortalSessionUrl resolves customer from subscription when needed", async () => {
  const result = await createBillingPortalSessionUrl({
    persistedCustomerId: null,
    workspaceCustomerId: null,
    stripeSubscriptionId: "sub_123",
    requestUrl: "https://app.example.com/api/billing/portal",
    loadCustomerIdFromSubscription: async (subscriptionId) => {
      assert.equal(subscriptionId, "sub_123");
      return "cus_456";
    },
    createPortalSession: async ({ customer, returnUrl }) => {
      assert.equal(customer, "cus_456");
      assert.equal(returnUrl, "https://app.example.com/settings?portal=return");
      return "https://billing.stripe.com/session/test";
    },
  });

  assert.deepEqual(result, { ok: true, url: "https://billing.stripe.com/session/test" });
});

test("createBillingPortalSessionUrl returns conflict when no customer exists", async () => {
  const result = await createBillingPortalSessionUrl({
    persistedCustomerId: null,
    workspaceCustomerId: null,
    stripeSubscriptionId: null,
    requestUrl: "https://app.example.com/api/billing/portal",
    loadCustomerIdFromSubscription: async () => {
      throw new Error("should not be called");
    },
    createPortalSession: async () => {
      throw new Error("should not be called");
    },
  });

  assert.deepEqual(result, {
    ok: false,
    status: 409,
    error: "No Stripe customer is attached to this workspace yet. Start a subscription first.",
  });
});