import { AppShell } from "@/components/platform/app-shell";
import { AuthGate } from "@/components/platform/auth-gate";
import { getViewer } from "@/lib/auth";

export default async function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const viewer = await getViewer();

  return (
    <AppShell viewer={viewer}>
      {viewer.isConfigured && !viewer.isAuthenticated ? (
        <AuthGate viewer={viewer} />
      ) : (
        children
      )}
    </AppShell>
  );
}

