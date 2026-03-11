import type { DashboardLaunchChecklistItem } from "@/lib/dashboard-checklist-core";
import { getDb } from "@/lib/db";
import { flags } from "@/lib/env";

const LAUNCH_STEP_TYPE_PREFIX = "LAUNCH_STEP_COMPLETED_";
const LAUNCH_CHECKLIST_COMPLETE_TYPE = "LAUNCH_CHECKLIST_COMPLETE";

export type LaunchChecklistMilestone = {
  key: string;
  title: string;
  route: string | null;
  createdAt: string;
};

export type LaunchChecklistTelemetrySnapshot = {
  recordedMilestones: number;
  firstMilestoneAt: string | null;
  latestMilestone: LaunchChecklistMilestone | null;
  recentMilestones: LaunchChecklistMilestone[];
  checklistCompletedAt: string | null;
};

function emptyLaunchTelemetrySnapshot(): LaunchChecklistTelemetrySnapshot {
  return {
    recordedMilestones: 0,
    firstMilestoneAt: null,
    latestMilestone: null,
    recentMilestones: [],
    checklistCompletedAt: null,
  };
}

function buildLaunchStepType(key: string) {
  return `${LAUNCH_STEP_TYPE_PREFIX}${key.toUpperCase()}`;
}

function parseLaunchStepKey(type: string) {
  return type.startsWith(LAUNCH_STEP_TYPE_PREFIX)
    ? type.slice(LAUNCH_STEP_TYPE_PREFIX.length).toLowerCase()
    : null;
}

export async function getLaunchChecklistTelemetry(input: {
  organizationId: string | null | undefined;
  clerkUserId: string | null | undefined;
}): Promise<LaunchChecklistTelemetrySnapshot> {
  const db = getDb();

  if (!flags.hasDatabase || !db || !input.organizationId || !input.clerkUserId) {
    return emptyLaunchTelemetrySnapshot();
  }

  const notifications = await db.notification.findMany({
    where: {
      organizationId: input.organizationId,
      recipientClerkUserId: input.clerkUserId,
      OR: [
        { type: { startsWith: LAUNCH_STEP_TYPE_PREFIX } },
        { type: LAUNCH_CHECKLIST_COMPLETE_TYPE },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const milestoneNotifications = notifications
    .map((notification) => {
      const key = parseLaunchStepKey(notification.type);

      if (!key) {
        return null;
      }

      return {
        key,
        title: notification.title.replace(/^Milestone completed: /, ""),
        route: notification.route ?? null,
        createdAt: notification.createdAt.toISOString(),
      } satisfies LaunchChecklistMilestone;
    })
    .filter((item): item is LaunchChecklistMilestone => Boolean(item));

  return {
    recordedMilestones: milestoneNotifications.length,
    firstMilestoneAt: milestoneNotifications.at(-1)?.createdAt ?? null,
    latestMilestone: milestoneNotifications[0] ?? null,
    recentMilestones: milestoneNotifications.slice(0, 5),
    checklistCompletedAt:
      notifications.find((notification) => notification.type === LAUNCH_CHECKLIST_COMPLETE_TYPE)?.createdAt.toISOString() ?? null,
  };
}

export async function recordLaunchChecklistTelemetry(input: {
  organizationId: string;
  clerkUserId: string;
  checklist: DashboardLaunchChecklistItem[];
}) {
  const db = getDb();

  if (!flags.hasDatabase || !db) {
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

  return getLaunchChecklistTelemetry(input);
}