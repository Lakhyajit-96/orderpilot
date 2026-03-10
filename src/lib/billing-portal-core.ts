export type PortalSessionResult =
  | { ok: true; url: string }
  | { ok: false; status: number; error: string };

type CreatePortalSessionInput = {
  persistedCustomerId: string | null;
  workspaceCustomerId: string | null;
  stripeSubscriptionId: string | null;
  requestUrl: string;
  loadCustomerIdFromSubscription: (subscriptionId: string) => Promise<string | null>;
  createPortalSession: (input: { customer: string; returnUrl: string }) => Promise<string>;
};

export function buildBillingPortalReturnUrl(requestUrl: string) {
  const url = new URL(requestUrl);
  return `${url.origin}/settings?portal=return`;
}

export async function createBillingPortalSessionUrl(
  input: CreatePortalSessionInput,
): Promise<PortalSessionResult> {
  let customerId = input.persistedCustomerId ?? input.workspaceCustomerId;

  if (!customerId && input.stripeSubscriptionId) {
    customerId = await input.loadCustomerIdFromSubscription(input.stripeSubscriptionId);
  }

  if (!customerId) {
    return {
      ok: false,
      status: 409,
      error: "No Stripe customer is attached to this workspace yet. Start a subscription first.",
    };
  }

  try {
    const url = await input.createPortalSession({
      customer: customerId,
      returnUrl: buildBillingPortalReturnUrl(input.requestUrl),
    });

    return { ok: true, url };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not open the billing portal.";
    return { ok: false, status: 502, error: message };
  }
}