import type { DashboardLaunchChecklistItem } from "@/lib/dashboard-checklist-core";
import { getDb } from "@/lib/db";
import { flags } from "@/lib/env";
import {
  buildLaunchRecoveryPrompt,
  buildLaunchStepType,
  getActiveLaunchRecoveryPrompt,
  LAUNCH_CHECKLIST_COMPLETE_TYPE,
  LAUNCH_RECOVERY_PROMPT_TYPE_PREFIX,
  LAUNCH_STEP_TYPE_PREFIX,
  summarizeWorkspaceLaunchMilestones,
} from "@/lib/launch-telemetry-core";

export type LaunchChecklistMilestone = {
  key: string;
  title: string;
  route: string | null;
  createdAt: string;
};

export type LaunchChecklistRecoveryNudge = {
  stepKey: string;
  title: string;
  body: string;
  route: string;
  createdAt: string;
};

export type LaunchChecklistTelemetrySnapshot = {
  recordedMilestones: number;
  firstMilestoneAt: string | null;
  latestMilestone: LaunchChecklistMilestone | null;
  recentMilestones: LaunchChecklistMilestone[];
  checklistCompletedAt: string | null;
  workspaceMemberCount: number;
  trackedOperatorCount: number;
  activeNudge: LaunchChecklistRecoveryNudge | null;
};

function emptyLaunchTelemetrySnapshot(): LaunchChecklistTelemetrySnapshot {
  return {
    recordedMilestones: 0,
    firstMilestoneAt: null,
    latestMilestone: null,
    recentMilestones: [],
    checklistCompletedAt: null,
    workspaceMemberCount: 0,
    trackedOperatorCount: 0,
    activeNudge: null,
  };
}

export async function getLaunchChecklistTelemetry(input: {
  organizationId: string | null | undefined;
  clerkUserId: string | null | undefined;
  checklist?: DashboardLaunchChecklistItem[];
}): Promise<LaunchChecklistTelemetrySnapshot> {
  const db = getDb();

  if (!flags.hasDatabase || !db || !input.organizationId) {
    return emptyLaunchTelemetrySnapshot();
  }

  const [notifications, promptNotifications, workspaceMemberCount] = await Promise.all([
    db.notification.findMany({
      where: {
        organizationId: input.organizationId,
        OR: [
          { type: { startsWith: LAUNCH_STEP_TYPE_PREFIX } },
          { type: LAUNCH_CHECKLIST_COMPLETE_TYPE },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    input.clerkUserId
      ? db.notification.findMany({
          where: {
            organizationId: input.organizationId,
            recipientClerkUserId: input.clerkUserId,
            type: { startsWith: LAUNCH_RECOVERY_PROMPT_TYPE_PREFIX },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        })
      : Promise.resolve([]),
    db.membership.count({ where: { organizationId: input.organizationId } }),
  ]);

  const summary = summarizeWorkspaceLaunchMilestones(
    notifications.map((notification) => ({
      type: notification.type,
      title: notification.title,
      body: notification.body,
      route: notification.route ?? null,
      createdAt: notification.createdAt.toISOString(),
      recipientClerkUserId: notification.recipientClerkUserId,
    })),
  );
  const activeNudge = input.checklist
    ? getActiveLaunchRecoveryPrompt({
        checklist: input.checklist,
        promptRecords: promptNotifications.map((notification) => ({
          type: notification.type,
          title: notification.title,
          body: notification.body,
          route: notification.route ?? null,
          createdAt: notification.createdAt.toISOString(),
          recipientClerkUserId: notification.recipientClerkUserId,
        })),
      })
    : null;

  return {
    recordedMilestones: summary.recordedMilestones,
    firstMilestoneAt: summary.firstMilestoneAt,
    latestMilestone: summary.latestMilestone,
    recentMilestones: summary.recentMilestones,
    checklistCompletedAt: summary.checklistCompletedAt,
    workspaceMemberCount,
    trackedOperatorCount: summary.trackedOperatorCount,
    activeNudge,
  };
}

export async function recordLaunchChecklistTelemetry(input: {
  organizationId: string;
  clerkUserId: string;
  checklist: DashboardLaunchChecklistItem[];
}) {
  const db = getDb();

  if (!flags.hasDatabase || !db || !input.organizationId || !input.clerkUserId) {
    return emptyLaunchTelemetrySnapshot();
  }

  const completedItems = input.checklist.filter((item) => item.completed);

  if (completedItems.length === 0) {
    return getLaunchChecklistTelemetry(input);
  }

  const desiredTypes = completedItems.map((item) => buildLaunchStepType(item.key));
  const existingNotifications = await db.notification.findMany({
    where: {
      organizationId: input.organizationId,
      recipientClerkUserId: input.clerkUserId,
      OR: [
        { type: { in: desiredTypes } },
        { type: LAUNCH_CHECKLIST_COMPLETE_TYPE },
      ],
    },
    select: { type: true },
  });

  const existingTypes = new Set(existingNotifications.map((notification) => notification.type));
  const nextStep = input.checklist.find((item) => !item.completed) ?? null;
  const notificationsToCreate = completedItems
    .filter((item) => !existingTypes.has(buildLaunchStepType(item.key)))
    .map((item) => ({
      organizationId: input.organizationId,
      recipientClerkUserId: input.clerkUserId,
      type: buildLaunchStepType(item.key),
      title: `Milestone completed: ${item.title}`,
      body: nextStep
        ? `Launch milestone recorded. Recommended next action: ${nextStep.title}.`
        : "Launch milestone recorded. This workspace is now ready for a live rollout.",
      route: item.href,
    }));

  if (input.checklist.every((item) => item.completed) && !existingTypes.has(LAUNCH_CHECKLIST_COMPLETE_TYPE)) {
    notificationsToCreate.push({
      organizationId: input.organizationId,
      recipientClerkUserId: input.clerkUserId,
      type: LAUNCH_CHECKLIST_COMPLETE_TYPE,
      title: "Launch checklist complete",
      body: "Every guided setup milestone is complete. The workspace is ready to prove real customer daily usage.",
      route: "/dashboard",
    });
  }

  if (notificationsToCreate.length > 0) {
    await db.notification.createMany({ data: notificationsToCreate });
  }

  const [promptNotifications, telemetryBeforePrompt] = await Promise.all([
    db.notification.findMany({
      where: {
        organizationId: input.organizationId,
        recipientClerkUserId: input.clerkUserId,
        type: { startsWith: LAUNCH_RECOVERY_PROMPT_TYPE_PREFIX },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    getLaunchChecklistTelemetry(input),
  ]);
  const recoveryPrompt = buildLaunchRecoveryPrompt({
    checklist: input.checklist,
    lastMilestoneAt: telemetryBeforePrompt.latestMilestone?.createdAt ?? null,
    nowISOString: new Date().toISOString(),
    existingPrompts: promptNotifications.map((notification) => ({
      type: notification.type,
      title: notification.title,
      body: notification.body,
      route: notification.route ?? null,
      createdAt: notification.createdAt.toISOString(),
      recipientClerkUserId: notification.recipientClerkUserId,
    })),
  });

  if (recoveryPrompt) {
    await db.notification.create({
      data: {
        organizationId: input.organizationId,
        recipientClerkUserId: input.clerkUserId,
        type: recoveryPrompt.type,
        title: recoveryPrompt.title,
        body: recoveryPrompt.body,
        route: recoveryPrompt.route,
      },
    });
  }

  return getLaunchChecklistTelemetry(input);
}