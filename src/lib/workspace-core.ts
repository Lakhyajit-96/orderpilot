export type WorkspaceDraftInput = {
  clerkUserId: string;
  displayName: string;
  email: string;
};

export function slugifyWorkspaceName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 36);
}

export function buildWorkspaceName(displayName: string, email: string) {
  const seed = displayName.trim() || email.split("@")[0] || "OrderPilot";
  return `${seed} Workspace`;
}

export function buildWorkspaceDraft(input: WorkspaceDraftInput) {
  const name = buildWorkspaceName(input.displayName, input.email);
  const slugBase = slugifyWorkspaceName(name) || "workspace";

  return {
    name,
    slug: `${slugBase}-${input.clerkUserId.slice(-6).toLowerCase()}`,
    role: "OWNER" as const,
  };
}