import { UserRole } from "@/generated/prisma/enums";
import { getDb } from "@/lib/db";
import { flags } from "@/lib/env";
import {
  getDefaultApprovalStageSeeds,
  getDefaultReasonCodeSeeds,
  getEscalationRoles,
  parseReasonCodeLines,
  selectApplicableApprovalStages,
  type ApprovalStageSeed,
  type WorkflowRole,
} from "@/lib/workflow-core";

export type WorkflowSettingsSnapshot = {
  policy: {
    isActive: boolean;
    requireReasonCodes: boolean;
    autoApproveConfidence: number | null;
    financeThresholdCents: number | null;
  };
  stages: ApprovalStageSeed[];
  reasonCodes: Array<{ actionType: string; code: string; label: string }>;
};

function toWorkflowRole(value: string) {
  return value as WorkflowRole;
}

export async function ensureDefaultWorkflowConfiguration(organizationId: string | null | undefined) {
  const db = getDb();

  if (!flags.hasDatabase || !db || !organizationId) {
    return;
  }

  const policy = await db.approvalPolicy.findUnique({
    where: { organizationId },
    include: { stages: { orderBy: { sequence: "asc" } } },
  });

  if (!policy) {
    const defaultStages = getDefaultApprovalStageSeeds();
    await db.approvalPolicy.create({
      data: {
        organizationId,
        isActive: true,
        requireReasonCodes: true,
        financeThresholdCents: 2_500_000,
        stages: {
          create: defaultStages.map((stage) => ({
            sequence: stage.sequence,
            role: stage.role,
            title: stage.title,
            minOrderValueCents: stage.minOrderValueCents ?? undefined,
            requireReasonCode: stage.requireReasonCode,
          })),
        },
      },
    });
  } else if (policy.stages.length === 0) {
    await db.approvalStage.createMany({
      data: getDefaultApprovalStageSeeds().map((stage) => ({
        approvalPolicyId: policy.id,
        sequence: stage.sequence,
        role: stage.role,
        title: stage.title,
        minOrderValueCents: stage.minOrderValueCents ?? undefined,
        requireReasonCode: stage.requireReasonCode,
      })),
    });
  }

  const existingReasonCodes = await db.reasonCode.findMany({ where: { organizationId } });
  const existingKeySet = new Set(existingReasonCodes.map((item) => `${item.actionType}:${item.code}`));
  const missingReasonCodes = getDefaultReasonCodeSeeds().filter(
    (item) => !existingKeySet.has(`${item.actionType}:${item.code}`),
  );

  if (missingReasonCodes.length > 0) {
    await db.reasonCode.createMany({
      data: missingReasonCodes.map((item) => ({
        organizationId,
        actionType: item.actionType,
        code: item.code,
        label: item.label,
      })),
    });
  }

  return;
}

export async function getWorkspaceWorkflowSettings(
  organizationId: string | null | undefined,
): Promise<WorkflowSettingsSnapshot> {
  const db = getDb();

  if (!flags.hasDatabase || !db || !organizationId) {
    return {
      policy: {
        isActive: true,
        requireReasonCodes: true,
        autoApproveConfidence: null,
        financeThresholdCents: 2_500_000,
      },
      stages: getDefaultApprovalStageSeeds(),
      reasonCodes: getDefaultReasonCodeSeeds(),
    };
  }

  await ensureDefaultWorkflowConfiguration(organizationId);

  const [policy, reasonCodes] = await Promise.all([
    db.approvalPolicy.findUnique({
      where: { organizationId },
      include: { stages: { orderBy: { sequence: "asc" } } },
    }),
    db.reasonCode.findMany({
      where: { organizationId, isActive: true },
      orderBy: [{ actionType: "asc" }, { code: "asc" }],
    }),
  ]);

  return {
    policy: {
      isActive: policy?.isActive ?? true,
      requireReasonCodes: policy?.requireReasonCodes ?? true,
      autoApproveConfidence: policy?.autoApproveConfidence ?? null,
      financeThresholdCents: policy?.financeThresholdCents ?? 2_500_000,
    },
    stages:
      policy?.stages.map((stage) => ({
        sequence: stage.sequence,
        role: toWorkflowRole(stage.role),
        title: stage.title,
        minOrderValueCents: stage.minOrderValueCents ?? null,
        requireReasonCode: stage.requireReasonCode,
      })) ?? getDefaultApprovalStageSeeds(),
    reasonCodes: reasonCodes.map((code) => ({
      actionType: code.actionType,
      code: code.code,
      label: code.label,
    })),
  };
}

export async function updateWorkspaceWorkflowSettings(input: {
  organizationId: string;
  requireReasonCodes: boolean;
  autoApproveConfidence?: number | null;
  financeThresholdCents?: number | null;
  stages: ApprovalStageSeed[];
  reasonCodesText: string;
}) {
  const db = getDb();

  if (!db) {
    throw new Error("Database is unavailable.");
  }

  const reasonCodes = parseReasonCodeLines(input.reasonCodesText);

  await db.$transaction(async (tx) => {
    const policy = await tx.approvalPolicy.upsert({
      where: { organizationId: input.organizationId },
      create: {
        organizationId: input.organizationId,
        requireReasonCodes: input.requireReasonCodes,
        autoApproveConfidence: input.autoApproveConfidence ?? undefined,
        financeThresholdCents: input.financeThresholdCents ?? undefined,
      },
      update: {
        requireReasonCodes: input.requireReasonCodes,
        autoApproveConfidence: input.autoApproveConfidence ?? undefined,
        financeThresholdCents: input.financeThresholdCents ?? undefined,
      },
    });

    await tx.approvalStage.deleteMany({ where: { approvalPolicyId: policy.id } });
    await tx.approvalStage.createMany({
      data: input.stages
        .slice()
        .sort((left, right) => left.sequence - right.sequence)
        .map((stage) => ({
          approvalPolicyId: policy.id,
          sequence: stage.sequence,
          role: stage.role,
          title: stage.title,
          minOrderValueCents: stage.minOrderValueCents ?? undefined,
          requireReasonCode: stage.requireReasonCode,
        })),
    });

    await tx.reasonCode.deleteMany({ where: { organizationId: input.organizationId } });
    if (reasonCodes.length > 0) {
      await tx.reasonCode.createMany({
        data: reasonCodes.map((code) => ({
          organizationId: input.organizationId,
          actionType: code.actionType,
          code: code.code,
          label: code.label,
        })),
      });
    }
  });

  return getWorkspaceWorkflowSettings(input.organizationId);
}

export async function getApplicableApprovalStagesForOrder(input: {
  organizationId: string;
  totalCents?: number | null;
}) {
  const settings = await getWorkspaceWorkflowSettings(input.organizationId);

  if (!settings.policy.isActive) {
    return [];
  }

  return selectApplicableApprovalStages(settings.stages, input.totalCents);
}

export function getReasonCodesForAction(
  reasonCodes: Array<{ actionType: string; code: string; label: string }>,
  actionType: string,
) {
  return reasonCodes.filter((code) => code.actionType === actionType);
}

export async function createNotificationsForRole(input: {
  organizationId: string;
  requiredRole: WorkflowRole;
  orderId?: string | null;
  type: string;
  title: string;
  body: string;
  route?: string | null;
}) {
  const db = getDb();

  if (!db) {
    return;
  }

  const roles = getEscalationRoles(input.requiredRole) as Array<(typeof UserRole)[keyof typeof UserRole]>;
  const memberships = await db.membership.findMany({
    where: {
      organizationId: input.organizationId,
      role: { in: roles },
    },
    select: { clerkUserId: true },
  });

  if (memberships.length === 0) {
    return;
  }

  await db.notification.createMany({
    data: memberships.map((membership) => ({
      organizationId: input.organizationId,
      orderId: input.orderId ?? undefined,
      recipientClerkUserId: membership.clerkUserId,
      type: input.type,
      title: input.title,
      body: input.body,
      route: input.route ?? undefined,
    })),
  });
}

export async function getWorkspaceNotifications(input: {
  organizationId: string | null | undefined;
  clerkUserId: string | null | undefined;
}) {
  const db = getDb();

  if (!flags.hasDatabase || !db || !input.organizationId || !input.clerkUserId) {
    return [];
  }

  return db.notification.findMany({
    where: {
      organizationId: input.organizationId,
      recipientClerkUserId: input.clerkUserId,
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function markNotificationRead(input: {
  organizationId: string;
  clerkUserId: string;
  notificationId: string;
}) {
  const db = getDb();

  if (!db) {
    throw new Error("Database is unavailable.");
  }

  return db.notification.updateMany({
    where: {
      id: input.notificationId,
      organizationId: input.organizationId,
      recipientClerkUserId: input.clerkUserId,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
}