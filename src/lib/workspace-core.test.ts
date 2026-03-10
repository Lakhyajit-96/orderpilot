import test from "node:test";
import assert from "node:assert/strict";
import { buildWorkspaceDraft } from "./workspace-core.ts";

test("buildWorkspaceDraft creates stable owner workspace metadata", () => {
  const draft = buildWorkspaceDraft({
    clerkUserId: "user_1234567890",
    displayName: "Atlas Supply",
    email: "ops@atlas.example",
  });

  assert.equal(draft.name, "Atlas Supply Workspace");
  assert.equal(draft.role, "OWNER");
  assert.equal(draft.slug, "atlas-supply-workspace-567890");
});

test("buildWorkspaceDraft falls back to email seed when display name is empty", () => {
  const draft = buildWorkspaceDraft({
    clerkUserId: "user_abcdef123456",
    displayName: "   ",
    email: "review.team@example.com",
  });

  assert.equal(draft.name, "review.team Workspace");
  assert.equal(draft.slug, "review-team-workspace-123456");
});