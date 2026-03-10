import Stripe from "stripe";
import { env, flags } from "@/lib/env";
import { getPlan, type PlanKey } from "@/lib/plans";

let stripeInstance: Stripe | null = null;

export function getStripeServer() {
  if (!flags.hasStripe || !env.STRIPE_SECRET_KEY) {
    return null;
  }

  stripeInstance ??= new Stripe(env.STRIPE_SECRET_KEY);
  return stripeInstance;
}

export function getPriceIdForPlan(planKey: PlanKey) {
  return getPlan(planKey)?.stripePriceId ?? null;
}

export function getPlanKeyForPriceId(priceId: string | null | undefined): PlanKey | null {
  if (!priceId) {
    return null;
  }

  const match = ["starter", "growth", "enterprise"] as const;

  for (const planKey of match) {
    if (getPriceIdForPlan(planKey) === priceId) {
      return planKey;
    }
  }

  return null;
}

