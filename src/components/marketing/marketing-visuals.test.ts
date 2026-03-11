import assert from "node:assert/strict";
import test from "node:test";
import {
  dashboardPreview,
  featureVisualCards,
  heroVisualSnapshot,
  orderReviewPreview,
  settingsPreview,
  workflowStages,
} from "./marketing-visual-data.ts";

test("marketing visual data covers the hero, workflow, and feature surfaces", () => {
  assert.equal(heroVisualSnapshot.inboxMessages.length, 3);
  assert.equal(heroVisualSnapshot.extractionFields.length, 4);
  assert.equal(heroVisualSnapshot.launchChecklist.length, 3);
  assert.equal(heroVisualSnapshot.handoffSignals.length, 3);
  assert.equal(workflowStages.length, 4);
  assert.equal(featureVisualCards.length, 3);
  assert.equal(workflowStages[0]?.title, "Shared inbox capture");
  assert.equal(featureVisualCards[0]?.title, "Operations command center");
  assert.equal(featureVisualCards[2]?.title, "Launch control center");
  assert.equal(dashboardPreview.checklist.length, 3);
  assert.equal(orderReviewPreview.badges[0], "Needs review");
  assert.equal(orderReviewPreview.sourceMailbox, "Microsoft 365 · ops@atlasindustrial.com");
  assert.equal(orderReviewPreview.notes.length, 2);
  assert.equal(orderReviewPreview.activity.length, 3);
  assert.match(workflowStages[0]?.preview[0]?.secondary ?? "", /Secure sign-in complete/);
  assert.equal(settingsPreview.readiness[2], "Plan · Growth");
  assert.equal(settingsPreview.connections[0]?.detail, "ops@atlasindustrial.com");
  assert.equal(settingsPreview.connections[2]?.status, "Manage billing any time");
});