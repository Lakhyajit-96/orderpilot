import type { PlanKey } from "@/lib/plans";

/**
 * Feature keys that correspond to the pricing page comparison table.
 * Each feature maps to a specific capability that may be gated by plan.
 */
export type PlanFeature =
  | "shared_mailbox_intake"
  | "ai_draft_generation"
  | "exception_review_surface"
  | "approval_workflows"
  | "erp_export_adapters"
  | "reason_codes_audit_trails"
  | "multi_branch_workspaces"
  | "custom_approval_chains"
  | "priority_support_sla";

/**
 * Feature availability per plan, matching the pricing page comparison table.
 * A `null` planKey means no active subscription (free tier).
 */
const planFeatureMatrix: Record<PlanFeature, Record<"starter" | "growth" | "enterprise", boolean>> = {
  shared_mailbox_intake:      { starter: true,  growth: true,  enterprise: true },
  ai_draft_generation:        { starter: true,  growth: true,  enterprise: true },
  exception_review_surface:   { starter: true,  growth: true,  enterprise: true },
  approval_workflows:         { starter: false, growth: true,  enterprise: true },
  erp_export_adapters:        { starter: false, growth: true,  enterprise: true },
  reason_codes_audit_trails:  { starter: false, growth: true,  enterprise: true },
  multi_branch_workspaces:    { starter: false, growth: false, enterprise: true },
  custom_approval_chains:     { starter: false, growth: false, enterprise: true },
  priority_support_sla:       { starter: false, growth: false, enterprise: true },
};

/**
 * Check whether a given plan has access to a specific feature.
 * Users with no active subscription (null planKey) get the same
 * access as the Starter tier.
 */
export function hasPlanFeature(
  planKey: string | null | undefined,
  feature: PlanFeature,
): boolean {
  const row = planFeatureMatrix[feature];
  const effectivePlan = (planKey ?? "starter") as "starter" | "growth" | "enterprise";

  if (effectivePlan in row) {
    return row[effectivePlan];
  }

  return row.starter;
}

/**
 * Return the minimum plan required for a given feature, for upgrade prompts.
 */
export function minimumPlanForFeature(feature: PlanFeature): PlanKey {
  const row = planFeatureMatrix[feature];

  if (row.starter) {
    return "starter";
  }

  if (row.growth) {
    return "growth";
  }

  return "enterprise";
}

/**
 * Human-readable label for a plan key.
 */
export function getPlanLabel(planKey: PlanKey): string {
  if (planKey === "starter") return "Starter";
  if (planKey === "growth") return "Growth";
  return "Enterprise";
}

/**
 * Build an upgrade prompt message for a gated feature.
 */
export function buildUpgradePrompt(feature: PlanFeature): string {
  const minPlan = minimumPlanForFeature(feature);
  const label = getPlanLabel(minPlan);
  return `This feature requires the ${label} plan or above.`;
}

/**
 * Convenience: get the full set of feature flags for a given plan.
 */
export function getPlanFeatureFlags(planKey: string | null | undefined): Record<PlanFeature, boolean> {
  const features = Object.keys(planFeatureMatrix) as PlanFeature[];
  const result = {} as Record<PlanFeature, boolean>;

  for (const feature of features) {
    result[feature] = hasPlanFeature(planKey, feature);
  }

  return result;
}
