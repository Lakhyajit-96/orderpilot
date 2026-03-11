import test from "node:test";
import assert from "node:assert/strict";
import {
  buildDashboardLaunchChecklist,
  getDashboardLaunchProgress,
  getNextDashboardLaunchStep,
  hasReviewedOrders,
} from "./dashboard-checklist-core.ts";

test("hasReviewedOrders only treats post-review statuses as complete review progress", () => {
  assert.equal(hasReviewedOrders(["Intake captured", "Needs review"]), false);
  assert.equal(hasReviewedOrders(["Awaiting Finance Review", "Ready to export"]), true);
});

test("buildDashboardLaunchChecklist reflects completed onboarding milestones", () => {
  const checklist = buildDashboardLaunchChecklist({
    viewerName: "Lakhya",
    isAuthenticated: true,
    workspaceName: "Flowpost Workspace",
    workspaceRole: "OWNER",
    inboxConnectionCount: 2,
    orderCount: 12,
    orderStatuses: ["Needs review", "Ready to export"],
    erpConnectionCount: 1,
    subscriptionPlanKey: "growth",
    subscriptionStatus: "ACTIVE",
  });

  assert.equal(checklist.every((item) => item.completed), true);

  const progress = getDashboardLaunchProgress(checklist);
  assert.deepEqual(progress, { completed: 6, total: 6, percent: 100 });
  assert.equal(getNextDashboardLaunchStep(checklist), null);
});

test("buildDashboardLaunchChecklist points to the next missing go-live action", () => {
  const checklist = buildDashboardLaunchChecklist({
    viewerName: "Guest",
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

  assert.equal(checklist[0]?.completed, true);
  assert.equal(getNextDashboardLaunchStep(checklist)?.key, "mailbox");
  assert.deepEqual(getDashboardLaunchProgress(checklist), { completed: 1, total: 6, percent: 17 });
});