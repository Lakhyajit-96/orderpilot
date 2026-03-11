import Link from "next/link";
import { AlertCircle, LockKeyhole, Sparkles } from "lucide-react";
import type { Viewer } from "@/lib/auth";
import { getPlatformAccessState } from "@/lib/platform-shell-core";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthGate({ viewer }: { viewer: Viewer }) {
  const accessState = getPlatformAccessState(viewer);
  const isSignInRequired = accessState === "SIGN_IN_REQUIRED";
  const isSetupRequired = accessState === "SIGN_IN_SETUP_REQUIRED";
  const title = isSetupRequired
    ? "Secure workspace access is temporarily unavailable"
    : isSignInRequired
      ? "Sign in to access your workspace"
      : "We couldn’t open your workspace";
  const description = isSetupRequired
    ? "Secure workspace access is still being finalized for this site. Until then, workspace pages will stay unavailable."
    : isSignInRequired
      ? "Sign in to open the dashboard, inbox, orders, and settings for your workspace."
      : "Your session is active, but we couldn’t load saved orders and workspace settings right now. Restore workspace access and reload the page.";
  const badgeLabel = isSignInRequired ? "Workspace access" : "Needs attention";

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="max-w-2xl">
        <CardHeader>
          <Badge variant="violet">{badgeLabel}</Badge>
          <CardTitle className="mt-4 text-3xl">{title}</CardTitle>
          <CardDescription className="max-w-xl text-base leading-8">{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-white/70">
            <div className="mb-3 flex items-center gap-2 text-white">
              {isSignInRequired ? <LockKeyhole className="size-4 text-cyan-200" /> : <AlertCircle className="size-4 text-cyan-200" />}
              {viewer.modeLabel}
            </div>
            Current session: <span className="font-medium text-white">{viewer.displayName}</span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {isSignInRequired ? (
              <>
                <Button asChild><Link href="/sign-in"><Sparkles className="size-4" /> Sign in</Link></Button>
                <Button asChild variant="secondary"><Link href="/sign-up">Create account</Link></Button>
              </>
            ) : (
              <Button asChild variant="secondary"><Link href="/">Return home</Link></Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

