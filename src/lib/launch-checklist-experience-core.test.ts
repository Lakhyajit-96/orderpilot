import test from "node:test";
import assert from "node:assert/strict";
import { buildDashboardLaunchChecklist } from "./dashboard-checklist-core.ts";
import {
  createEmptyLaunchChecklistClientState,
  deriveLaunchChecklistExperience,
  dismissLaunchChecklistCelebration,
} from "./launch-checklist-experience-core.ts";

test("deriveLaunchChecklistExperience records newly completed steps and next action", () => {
  const checklist = buildDashboardLaunchChecklist({
    viewerName: "Lakhya",
    isAuthenticated: true,
    workspaceName: "Flowpost Workspace",
    workspaceRole: "OWNER",
    inboxConnectionCount: 0,
    orderCount: 0,
    orderStatuses: [],
    erpConnectionCount: 0,
    subscriptionPlanKey: null,
    subscriptionStatus: null,
  });

  const snapshot = deriveLaunchChecklistExperience({
    checklist,
    previousState: createEmptyLaunchChecklistClientState(),
    nowISOString: "2026-03-11T08:00:00.000Z",
  });

  assert.deepEqual(snapshot.newlyCompletedKeys, ["workspace"]);
  assert.equal(snapshot.activeCelebrationId, "step:workspace");
  assert.equal(snapshot.state.lastRecommendedStepKey, "mailbox");
  assert.equal(snapshot.recordedMilestones, 1);
});

test("dismissLaunchChecklistCelebration suppresses repeat celebration display", () => {
  const checklist = buildDashboardLaunchChecklist({
    viewerName: "Lakhya",
    isAuthenticated: true,
    workspaceName: "Flowpost Workspace",
    workspaceRole: "OWNER",
    inboxConnectionCount: 0,
    orderCount: 0,
    orderStatuses: [],
    erpConnectionCount: 0,
    subscriptionPlanKey: null,
    subscriptionStatus: null,
  });

  const firstSnapshot = deriveLaunchChecklistExperience({
    checklist,
    previousState: createEmptyLaunchChecklistClientState(),
    nowISOString: "2026-03-11T08:00:00.000Z",
  });
  const dismissedState = dismissLaunchChecklistCelebration(firstSnapshot.state, "step:workspace");
  const secondSnapshot = deriveLaunchChecklistExperience({
    checklist,
    previousState: dismissedState,
    nowISOString: "2026-03-11T08:05:00.000Z",
  });

  assert.equal(secondSnapshot.activeCelebrationId, null);
  assert.equal(secondSnapshot.recordedMilestones, 1);
});

test("deriveLaunchChecklistExperience celebrates crossing the finish line", () => {
  const partialChecklist = buildDashboardLaunchChecklist({
    viewerName: "Lakhya",
    isAuthenticated: true,
    workspaceName: "Flowpost Workspace",
    workspaceRole: "OWNER",
    inboxConnectionCount: 2,
    orderCount: 12,
    orderStatuses: ["Ready to export"],
    erpConnectionCount: 0,
    subscriptionPlanKey: null,
    subscriptionStatus: null,
  });
  const partialSnapshot = deriveLaunchChecklistExperience({
    checklist: partialChecklist,
    previousState: createEmptyLaunchChecklistClientState(),
    nowISOString: "2026-03-11T08:00:00.000Z",
  });

  const completedChecklist = buildDashboardLaunchChecklist({
    viewerName: "Lakhya",
    isAuthenticated: true,
    workspaceName: "Flowpost Workspace",
    workspaceRole: "OWNER",
    inboxConnectionCount: 2,
    orderCount: 12,
    orderStatuses: ["Ready to export"],
    erpConnectionCount: 1,
    subscriptionPlanKey: "growth",
    subscriptionStatus: "ACTIVE",
  });
  const finalSnapshot = deriveLaunchChecklistExperience({
    checklist: completedChecklist,
    previousState: partialSnapshot.state,
    nowISOString: "2026-03-11T09:00:00.000Z",
  });

  assert.equal(finalSnapshot.activeCelebrationId, "launch-ready");
  assert.equal(finalSnapshot.recordedMilestones, 6);
  assert.equal(finalSnapshot.state.lastRecommendedStepKey, null);
});