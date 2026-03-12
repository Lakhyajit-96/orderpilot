import { AppShell } from "@/components/platform/app-shell";
import { AuthGate } from "@/components/platform/auth-gate";
import { getViewer } from "@/lib/auth";
import { getPlatformAccessState } from "@/lib/platform-shell-core";
import { clerkRuntime, env } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const viewer = await getViewer();
  const accessState = getPlatformAccessState(viewer);
  const stagingAuthActive =
    clerkRuntime.isHostedVercelProduction &&
    !clerkRuntime.usesLiveKeys &&
    Boolean(env.VERCEL_ENV === "preview" || env.CLERK_STAGING_ALLOW_TEST_AUTH);

  return (
    <AppShell viewer={viewer} stagingAuthActive={stagingAuthActive}>
      {accessState !== "READY" ? (
        <AuthGate viewer={viewer} />
      ) : (
        children
      )}
    </AppShell>
  );
}
