import type { DashboardLaunchChecklistItem } from "@/lib/dashboard-checklist-core";

export type LaunchChecklistClientState = {
  trackedAt: string | null;
  completedAtByKey: Record<string, string>;
  dismissedCelebrationIds: string[];
  lastRecommendedStepKey: string | null;
  lastRecommendedStepAt: string | null;
};

export type LaunchChecklistExperienceSnapshot = {
  state: LaunchChecklistClientState;
  activeCelebrationId: string | null;
  newlyCompletedKeys: string[];
  latestCompletedKey: string | null;
  recordedMilestones: number;
};

export function createEmptyLaunchChecklistClientState(): LaunchChecklistClientState {
  return {
    trackedAt: null,
    completedAtByKey: {},
    dismissedCelebrationIds: [],
    lastRecommendedStepKey: null,
    lastRecommendedStepAt: null,
  };
}

function normalizeLaunchChecklistClientState(
  value?: Partial<LaunchChecklistClientState> | null,
): LaunchChecklistClientState {
  return {
    trackedAt: value?.trackedAt ?? null,
    completedAtByKey: value?.completedAtByKey ?? {},
    dismissedCelebrationIds: value?.dismissedCelebrationIds ?? [],
    lastRecommendedStepKey: value?.lastRecommendedStepKey ?? null,
    lastRecommendedStepAt: value?.lastRecommendedStepAt ?? null,
  };
}

export function deriveLaunchChecklistExperience(input: {
  checklist: DashboardLaunchChecklistItem[];
  previousState?: Partial<LaunchChecklistClientState> | null;
  nowISOString: string;
}): LaunchChecklistExperienceSnapshot {
  const previous = normalizeLaunchChecklistClientState(input.previousState);
  const completedAtByKey = { ...previous.completedAtByKey };
  const newlyCompletedKeys: string[] = [];

  for (const item of input.checklist) {
    if (item.completed && !completedAtByKey[item.key]) {
      completedAtByKey[item.key] = input.nowISOString;
      newlyCompletedKeys.push(item.key);
    }
  }

  const recommendedStep = input.checklist.find((item) => !item.completed) ?? null;
  const previousRecordedMilestones = Object.keys(previous.completedAtByKey).length;
  const recordedMilestones = Object.keys(completedAtByKey).length;
  const isChecklistComplete = input.checklist.length > 0 && input.checklist.every((item) => item.completed);
  const crossedFinishLine = isChecklistComplete && previousRecordedMilestones < input.checklist.length;
  const celebrationId = crossedFinishLine
    ? "launch-ready"
    : newlyCompletedKeys[0]
      ? `step:${newlyCompletedKeys[0]}`
      : null;
  const dismissedCelebrations = new Set(previous.dismissedCelebrationIds);

  const latestCompletedKey = Object.entries(completedAtByKey)
    .sort((left, right) => right[1].localeCompare(left[1]))[0]?.[0] ?? null;

  return {
    state: {
      trackedAt: previous.trackedAt ?? input.nowISOString,
      completedAtByKey,
      dismissedCelebrationIds: previous.dismissedCelebrationIds,
      lastRecommendedStepKey: recommendedStep?.key ?? null,
      lastRecommendedStepAt:
        previous.lastRecommendedStepKey !== (recommendedStep?.key ?? null)
          ? input.nowISOString
          : previous.lastRecommendedStepAt,
    },
    activeCelebrationId:
      celebrationId && !dismissedCelebrations.has(celebrationId)
        ? celebrationId
        : null,
    newlyCompletedKeys,
    latestCompletedKey,
    recordedMilestones,
  };
}

export function dismissLaunchChecklistCelebration(
  state: LaunchChecklistClientState,
  celebrationId: string,
): LaunchChecklistClientState {
  if (state.dismissedCelebrationIds.includes(celebrationId)) {
    return state;
  }

  return {
    ...state,
    dismissedCelebrationIds: [...state.dismissedCelebrationIds, celebrationId],
  };
}