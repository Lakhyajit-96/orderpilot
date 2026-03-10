import { auth, currentUser } from "@clerk/nextjs/server";
import { flags } from "@/lib/env";
import { ensureWorkspaceForUser, type WorkspaceSnapshot } from "@/lib/workspace";

export type WorkspaceRequestContext = {
  clerkUserId: string;
  displayName: string;
  email: string;
  workspace: WorkspaceSnapshot;
};

export async function getWorkspaceRequestContext(): Promise<
  | { ok: true; context: WorkspaceRequestContext }
  | { ok: false; status: number; error: string }
> {
  if (!flags.hasClerk || !flags.hasDatabase) {
    return {
      ok: false,
      status: 503,
      error: "This endpoint requires Clerk authentication and database persistence.",
    };
  }

  try {
    const authState = await auth();

    if (!authState.userId) {
      return { ok: false, status: 401, error: "Unauthorized" };
    }

    let user = null;

    try {
      user = await currentUser();
    } catch (error) {
      console.warn("Falling back to auth-only workspace context.", error);
    }

    const displayName =
      user?.fullName || user?.firstName || user?.username || user?.primaryEmailAddress?.emailAddress || "Operator";
    const email = user?.primaryEmailAddress?.emailAddress ?? `${authState.userId}@orderpilot.local`;
    const workspace = await ensureWorkspaceForUser({
      clerkUserId: authState.userId,
      clerkOrgId: authState.orgId,
      displayName,
      email,
    });

    if (!workspace) {
      return {
        ok: false,
        status: 503,
        error: "Workspace setup is incomplete. Please reload and try again.",
      };
    }

    return {
      ok: true,
      context: {
        clerkUserId: authState.userId,
        displayName,
        email,
        workspace,
      },
    };
  } catch (error) {
    console.error("Failed to build workspace request context.", error);
    return {
      ok: false,
      status: 503,
      error: "Workspace setup is incomplete. Please reload and try again.",
    };
  }
}