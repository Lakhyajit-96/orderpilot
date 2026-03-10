import test from "node:test";
import assert from "node:assert/strict";
import {
  canActForRole,
  getDefaultApprovalStageSeeds,
  getDefaultReasonCodeSeeds,
  getEscalationRoles,
  parseReasonCodeLines,
  selectApplicableApprovalStages,
} from "./workflow-core.ts";

test("canActForRole supports hierarchical review permissions", () => {
  assert.equal(canActForRole("ADMIN", "REVIEWER"), true);
  assert.equal(canActForRole("OPERATOR", "ADMIN"), false);
});

test("selectApplicableApprovalStages filters by order value", () => {
  const stages = getDefaultApprovalStageSeeds();

  assert.equal(selectApplicableApprovalStages(stages, 500_000).length, 1);
  assert.equal(selectApplicableApprovalStages(stages, 3_000_000).length, 2);
});

test("getEscalationRoles includes higher privilege roles", () => {
  assert.deepEqual(getEscalationRoles("ADMIN"), ["ADMIN", "OWNER"]);
});

test("parseReasonCodeLines validates pipe-delimited reason codes", () => {
  assert.deepEqual(parseReasonCodeLines("APPROVAL | MATCH_VERIFIED | Verified"), [
    { actionType: "APPROVAL", code: "MATCH_VERIFIED", label: "Verified" },
  ]);
});

test("default reason code seeds are available", () => {
  assert.ok(getDefaultReasonCodeSeeds().some((code) => code.actionType === "APPROVAL"));
});