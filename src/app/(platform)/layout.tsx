import { AppShell } from "@/components/platform/app-shell";
import { AuthGate } from "@/components/platform/auth-gate";
import { getViewer } from "@/lib/auth";
import { getPlatformAccessState } from "@/lib/platform-shell-core";

export const dynamic = "force-dynamic";

export default async function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const viewer = await getViewer();
  const accessState = getPlatformAccessState(viewer);

  return (
    <AppShell viewer={viewer}>
      {accessState !== "READY" ? (
        <AuthGate viewer={viewer} />
      ) : (
        children
      )}
    </AppShell>
  );
}
