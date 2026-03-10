export type WorkflowRole = "OWNER" | "ADMIN" | "REVIEWER" | "OPERATOR";

export type ApprovalStageSeed = {
  sequence: number;
  role: WorkflowRole;
  title: string;
  minOrderValueCents?: number | null;
  requireReasonCode: boolean;
};

export type ReasonCodeSeed = {
  actionType: string;
  code: string;
  label: string;
};

const roleRank: Record<WorkflowRole, number> = {
  OPERATOR: 1,
  REVIEWER: 2,
  ADMIN: 3,
  OWNER: 4,
};

export function canActForRole(actorRole: string | null | undefined, requiredRole: WorkflowRole) {
  if (!actorRole) {
    return false;
  }

  const normalized = actorRole as WorkflowRole;
  return (roleRank[normalized] ?? 0) >= roleRank[requiredRole];
}

export function getEscalationRoles(requiredRole: WorkflowRole) {
  return (Object.keys(roleRank) as WorkflowRole[]).filter(
    (role) => roleRank[role] >= roleRank[requiredRole],
  );
}

export function selectApplicableApprovalStages(
  stages: ApprovalStageSeed[],
  totalCents: number | null | undefined,
) {
  const orderValue = totalCents ?? 0;
  return stages.filter((stage) => !stage.minOrderValueCents || orderValue >= stage.minOrderValueCents);
}

export function getDefaultApprovalStageSeeds() {
  return [
    {
      sequence: 1,
      role: "REVIEWER",
      title: "Operations review",
      minOrderValueCents: 0,
      requireReasonCode: true,
    },
    {
      sequence: 2,
      role: "ADMIN",
      title: "Finance approval",
      minOrderValueCents: 2_500_000,
      requireReasonCode: true,
    },
  ] satisfies ApprovalStageSeed[];
}

export function getDefaultReasonCodeSeeds() {
  return [
    { actionType: "APPROVAL", code: "MATCH_VERIFIED", label: "Mappings and pricing verified" },
    { actionType: "APPROVAL", code: "CUSTOMER_CONFIRMED", label: "Customer request confirmed" },
    { actionType: "RETURN_TO_REVIEW", code: "DATA_GAP", label: "Data gap requires more review" },
    { actionType: "RETURN_TO_REVIEW", code: "MAPPING_RISK", label: "Mapping risk found" },
    { actionType: "EXPORT", code: "ERP_HANDOFF", label: "ERP handoff authorized" },
    { actionType: "EXCEPTION", code: "EXCEPTION_RESOLVED", label: "Exception resolved by reviewer" },
  ] satisfies ReasonCodeSeed[];
}

export function parseReasonCodeLines(input: string) {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [actionType, code, label] = line.split("|").map((part) => part.trim());

      if (!actionType || !code || !label) {
        throw new Error("Reason codes must use the format ACTION_TYPE | CODE | Label.");
      }

      return { actionType, code, label };
    });
}