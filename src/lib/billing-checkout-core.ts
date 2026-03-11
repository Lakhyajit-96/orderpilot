const BILLING_SECTION_HASH = "#workspace-billing";

export function buildCheckoutSuccessUrl(requestUrl: string) {
  const url = new URL(requestUrl);
  return `${url.origin}/settings?checkout=success&session_id={CHECKOUT_SESSION_ID}${BILLING_SECTION_HASH}`;
}

export function buildCheckoutCancelUrl(requestUrl: string) {
  const url = new URL(requestUrl);
  return `${url.origin}/settings?checkout=canceled${BILLING_SECTION_HASH}`;
}