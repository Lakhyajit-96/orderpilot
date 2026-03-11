type LaunchChecklistItemLike = {
  key: string;
  title: string;
  href: string;
  completed: boolean;
};

export type LaunchTelemetryRecord = {
  type: string;
  title: string;
  body: string;
  route: string | null;
  createdAt: string;
  recipientClerkUserId?: string | null;
};

export type LaunchRecoveryPrompt = {
  stepKey: string;
  title: string;
  body: string;
  route: string;
  createdAt: string;
};

export const LAUNCH_STEP_TYPE_PREFIX = "LAUNCH_STEP_COMPLETED_";
export const LAUNCH_CHECKLIST_COMPLETE_TYPE = "LAUNCH_CHECKLIST_COMPLETE";
export const LAUNCH_RECOVERY_PROMPT_TYPE_PREFIX = "LAUNCH_RECOVERY_PROMPT_";

export function buildLaunchStepType(key: string) {
  return `${LAUNCH_STEP_TYPE_PREFIX}${key.toUpperCase()}`;
}

export function buildLaunchRecoveryPromptType(key: string) {
  return `${LAUNCH_RECOVERY_PROMPT_TYPE_PREFIX}${key.toUpperCase()}`;
}

export function parseLaunchStepKey(type: string) {
  return type.startsWith(LAUNCH_STEP_TYPE_PREFIX)
    ? type.slice(LAUNCH_STEP_TYPE_PREFIX.length).toLowerCase()
    : null;
}

export function parseLaunchRecoveryPromptKey(type: string) {
  return type.startsWith(LAUNCH_RECOVERY_PROMPT_TYPE_PREFIX)
    ? type.slice(LAUNCH_RECOVERY_PROMPT_TYPE_PREFIX.length).toLowerCase()
    : null;
}

export function summarizeWorkspaceLaunchMilestones(records: LaunchTelemetryRecord[]) {
  const milestoneByKey = new Map<string, { key: string; title: string; route: string | null; createdAt: string }>();
  const trackedOperatorIds = new Set<string>();
  let checklistCompletedAt: string | null = null;

  for (const record of records) {
    if (record.recipientClerkUserId) {
      trackedOperatorIds.add(record.recipientClerkUserId);
    }

    if (record.type === LAUNCH_CHECKLIST_COMPLETE_TYPE) {
      if (!checklistCompletedAt || record.createdAt > checklistCompletedAt) {
        checklistCompletedAt = record.createdAt;
      }
      continue;
    }

    const key = parseLaunchStepKey(record.type);

    if (!key) {
      continue;
    }

    const existing = milestoneByKey.get(key);

    if (!existing || record.createdAt > existing.createdAt) {
      milestoneByKey.set(key, {
        key,
        title: record.title.replace(/^Milestone completed: /, ""),
        route: record.route ?? null,
        createdAt: record.createdAt,
      });
    }
  }

  const recentMilestones = [...milestoneByKey.values()].sort((left, right) => right.createdAt.localeCompare(left.createdAt));

  return {
    recordedMilestones: recentMilestones.length,
    firstMilestoneAt: recentMilestones.at(-1)?.createdAt ?? null,
    latestMilestone: recentMilestones[0] ?? null,
    recentMilestones: recentMilestones.slice(0, 5),
    checklistCompletedAt,
    trackedOperatorCount: trackedOperatorIds.size,
  };
}

export function buildLaunchRecoveryPrompt(input: {
  checklist: LaunchChecklistItemLike[];
  lastMilestoneAt: string | null;
  nowISOString: string;
  existingPrompts: LaunchTelemetryRecord[];
}) {
  const nextStep = input.checklist.find((item) => !item.completed) ?? null;

  if (!nextStep || !input.lastMilestoneAt) {
    return null;
  }

  const millisecondsSinceLastMilestone = Date.parse(input.nowISOString) - Date.parse(input.lastMilestoneAt);

  if (!Number.isFinite(millisecondsSinceLastMilestone) || millisecondsSinceLastMilestone < 48 * 60 * 60 * 1000) {
    return null;
  }

  const promptType = buildLaunchRecoveryPromptType(nextStep.key);
  const latestExistingPrompt = input.existingPrompts
    .filter((record) => record.type === promptType)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0] ?? null;

  if (latestExistingPrompt && latestExistingPrompt.createdAt >= input.lastMilestoneAt) {
    return null;
  }

  return {
    type: promptType,
    stepKey: nextStep.key,
    title: `Launch setup stalled: ${nextStep.title}`,
    body: `It has been more than two days since the last launch milestone. Pick back up with ${nextStep.title}.`,
    route: nextStep.href,
  };
}

export function getActiveLaunchRecoveryPrompt(input: {
  checklist: LaunchChecklistItemLike[];
  promptRecords: LaunchTelemetryRecord[];
}): LaunchRecoveryPrompt | null {
  const nextStep = input.checklist.find((item) => !item.completed) ?? null;

  if (!nextStep) {
    return null;
  }

  const latestPrompt = input.promptRecords
    .filter((record) => record.type === buildLaunchRecoveryPromptType(nextStep.key))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0] ?? null;

  if (!latestPrompt) {
    return null;
  }

  return {
    stepKey: nextStep.key,
    title: latestPrompt.title,
    body: latestPrompt.body,
    route: latestPrompt.route ?? nextStep.href,
    createdAt: latestPrompt.createdAt,
  };
}