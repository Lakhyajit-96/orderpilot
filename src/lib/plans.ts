import { env } from "@/lib/env";

export const plans = [
  {
    key: "starter",
    name: "Starter",
    price: "$499",
    cadence: "/month",
    subtitle: "For lean order desks getting started with AI-assisted intake.",
    features: [
      "2 operator seats",
      "Up to 1,500 processed orders / month",
      "Manual upload + inbox review",
      "Confidence scoring + exception routing",
    ],
    stripePriceId: env.STRIPE_PRICE_STARTER,
  },
  {
    key: "growth",
    name: "Growth",
    price: "$1,499",
    cadence: "/month",
    subtitle: "For high-volume distributors that need approval flows and ERP handoff.",
    features: [
      "10 operator seats",
      "Mailbox ingestion + priority queueing",
      "Approval workflows",
      "ERP export adapters",
    ],
    stripePriceId: env.STRIPE_PRICE_GROWTH,
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: "Contact sales",
    cadence: "",
    subtitle: "For multi-branch operations needing custom mappings, SSO, and SLAs.",
    features: [
      "Unlimited reviewers",
      "Custom integrations",
      "Advanced audit controls",
      "Dedicated onboarding",
    ],
    stripePriceId: env.STRIPE_PRICE_ENTERPRISE,
  },
] as const;

export type PlanKey = (typeof plans)[number]["key"];

export function getPlan(planKey: string) {
  return plans.find((plan) => plan.key === planKey);
}

