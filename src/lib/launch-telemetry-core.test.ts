import test from "node:test";
import assert from "node:assert/strict";
import { buildDashboardLaunchChecklist } from "./dashboard-checklist-core.ts";
import {
  buildLaunchRecoveryPrompt,
  buildLaunchRecoveryPromptType,
  buildLaunchStepType,
  getActiveLaunchRecoveryPrompt,
  summarizeWorkspaceLaunchMilestones,
} from "./launch-telemetry-core.ts";

test("summarizeWorkspaceLaunchMilestones deduplicates workspace milestones across teammates", () => {
  const summary = summarizeWorkspaceLaunchMilestones([
    {
      type: buildLaunchStepType("workspace"),
      title: "Milestone completed: Sign in and activate your workspace",
      body: "done",
      route: "/settings#guided-setup",
      createdAt: "2026-03-11T08:00:00.000Z",
      recipientClerkUserId: "user-1",
    },
    {
      type: buildLaunchStepType("workspace"),
      title: "Milestone completed: Sign in and activate your workspace",
      body: "done",
      route: "/settings#guided-setup",
      createdAt: "2026-03-11T08:05:00.000Z",
      recipientClerkUserId: "user-2",
    },
    {
      type: buildLaunchStepType("mailbox"),
      title: "Milestone completed: Connect a shared mailbox",
      body: "done",
      route: "/settings#mailbox-provider-integration",
      createdAt: "2026-03-11T09:00:00.000Z",
      recipientClerkUserId: "user-1",
    },
  ]);

  assert.equal(summary.recordedMilestones, 2);
  assert.equal(summary.trackedOperatorCount, 2);
  assert.equal(summary.latestMilestone?.key, "mailbox");
});

test("buildLaunchRecoveryPrompt creates a nudge after onboarding stalls", () => {
  const checklist = buildDashboardLaunchChecklist({
    viewerName: "Lakhya",
    isAuthenticated: true,
    workspaceName: "Flowpost Workspace",
    workspaceRole: "OWNER",
    inboxConnectionCount: 2,
    orderCount: 0,
    orderStatuses: [],
    erpConnectionCount: 0,
    subscriptionPlanKey: null,
    subscriptionStatus: null,
  });

  const prompt = buildLaunchRecoveryPrompt({
    checklist,
    lastMilestoneAt: "2026-03-09T08:00:00.000Z",
    nowISOString: "2026-03-11T12:30:00.000Z",
    existingPrompts: [],
  });

  assert.equal(prompt?.stepKey, "orders");
  assert.equal(prompt?.type, buildLaunchRecoveryPromptType("orders"));
});

test("getActiveLaunchRecoveryPrompt returns the latest nudge for the current next step", () => {
  const checklist = buildDashboardLaunchChecklist({
    viewerName: "Lakhya",
    isAuthenticated: true,
    workspaceName: "Flowpost Workspace",
    workspaceRole: "OWNER",
    inboxConnectionCount: 2,
    orderCount: 0,
    orderStatuses: [],
    erpConnectionCount: 0,
    subscriptionPlanKey: null,
    subscriptionStatus: null,
  });

  const prompt = getActiveLaunchRecoveryPrompt({
    checklist,
    promptRecords: [
      {
        type: buildLaunchRecoveryPromptType("orders"),
        title: "Launch setup stalled: Pull in the first live order",
        body: "Pick back up with the first live order.",
        route: "/inbox",
        createdAt: "2026-03-11T12:00:00.000Z",
      },
    ],
  });

  assert.equal(prompt?.stepKey, "orders");
  assert.equal(prompt?.route, "/inbox");
});