import { env } from "@/lib/env";

export const plans = [
  {
    key: "starter",
    name: "Starter",
    price: "$499",
    cadence: "/month",
    subtitle: "For smaller distributor teams replacing inbox triage with structured draft review.",
    features: [
      "2 coordinator or reviewer seats",
      "Up to 1,500 processed orders per month",
      "Shared inbox capture plus manual uploads",
      "Confidence scoring with exception routing",
    ],
    stripePriceId: env.STRIPE_PRICE_STARTER,
  },
  {
    key: "growth",
    name: "Growth",
    price: "$1,499",
    cadence: "/month",
    subtitle: "For growing order desks that need approvals, clearer review ownership, and ERP-ready handoff.",
    features: [
      "10 operations seats",
      "Mailbox ingestion with priority queueing",
      "Approval workflows and reason codes",
      "ERP export adapters",
    ],
    stripePriceId: env.STRIPE_PRICE_GROWTH,
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: "Contact sales",
    cadence: "",
    subtitle: "For multi-branch operations needing custom mappings, access controls, and rollout support.",
    features: [
      "Unlimited coordinator and reviewer seats",
      "Custom integrations",
      "Advanced audit controls",
      "Dedicated onboarding and launch support",
    ],
    stripePriceId: env.STRIPE_PRICE_ENTERPRISE,
  },
] as const;

export type PlanKey = (typeof plans)[number]["key"];

export function getPlan(planKey: string) {
  return plans.find((plan) => plan.key === planKey);
}

