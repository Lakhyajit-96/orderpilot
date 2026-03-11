import { auth, currentUser } from "@clerk/nextjs/server";
import { flags } from "@/lib/env";
import { ensureWorkspaceForUser, type WorkspaceSnapshot } from "@/lib/workspace";

export type Viewer = {
  isConfigured: boolean;
  isAuthenticated: boolean;
  displayName: string;
  email: string | null;
  modeLabel: string;
  clerkUserId: string | null;
  workspace: WorkspaceSnapshot | null;
};

export async function getViewer(): Promise<Viewer> {
  if (!flags.hasClerk) {
    return {
      isConfigured: false,
      isAuthenticated: false,
      displayName: "Workspace access",
      email: null,
      modeLabel: "Sign-in unavailable",
      clerkUserId: null,
      workspace: null,
    };
  }

  try {
    const authState = await auth();

    if (!authState.userId) {
      return {
        isConfigured: true,
        isAuthenticated: false,
        displayName: "Guest",
        email: null,
        modeLabel: "Sign in required",
        clerkUserId: null,
        workspace: null,
      };
    }

    let user = null;

    try {
      user = await currentUser();
    } catch (error) {
      console.warn("Falling back to auth-only viewer context.", error);
    }

    const displayName =
      user?.fullName || user?.firstName || user?.username || user?.primaryEmailAddress?.emailAddress || "Operator";
    const email = user?.primaryEmailAddress?.emailAddress ?? null;
    const workspace = await ensureWorkspaceForUser({
      clerkUserId: authState.userId,
      clerkOrgId: authState.orgId,
      displayName,
      email: email ?? `${authState.userId}@orderpilot.local`,
    });

    return {
      isConfigured: true,
      isAuthenticated: true,
      displayName,
      email,
      modeLabel: "Signed in",
      clerkUserId: authState.userId,
      workspace,
    };
  } catch (error) {
    console.error("getViewer failed to resolve Clerk session.", error);
    return {
      isConfigured: true,
      isAuthenticated: false,
      displayName: "Guest",
      email: null,
      modeLabel: "Sign-in issue",
      clerkUserId: null,
      workspace: null,
    };
  }
}

