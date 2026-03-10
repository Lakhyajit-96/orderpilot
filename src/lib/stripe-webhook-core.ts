export type PersistedSubscriptionStatus = "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELED";

export function mapStripeSubscriptionStatus(status: string): PersistedSubscriptionStatus {
  switch (status) {
    case "active":
      return "ACTIVE";
    case "trialing":
      return "TRIALING";
    case "canceled":
      return "CANCELED";
    case "past_due":
    case "unpaid":
    case "incomplete":
    case "incomplete_expired":
    case "paused":
      return "PAST_DUE";
    default:
      return "TRIALING";
  }
}

export function resolvePlanKey(
  metadataPlanKey: string | null | undefined,
  fallbackPlanKey: string | null | undefined,
  pricePlanKey: string | null | undefined,
) {
  return metadataPlanKey ?? fallbackPlanKey ?? pricePlanKey ?? null;
}