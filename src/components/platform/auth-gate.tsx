import Link from "next/link";
import { LockKeyhole, Sparkles } from "lucide-react";
import type { Viewer } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthGate({ viewer }: { viewer: Viewer }) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="max-w-2xl">
        <CardHeader>
          <Badge variant="violet">Protected workspace</Badge>
          <CardTitle className="mt-4 text-3xl">Sign in to access the live OrderPilot tenant</CardTitle>
          <CardDescription className="max-w-xl text-base leading-8">
            Clerk is configured for this environment, so the platform routes are now auth-gated. Once signed in, this workspace will become the real operational cockpit.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 text-sm leading-7 text-white/70">
            <div className="mb-3 flex items-center gap-2 text-white"><LockKeyhole className="size-4 text-cyan-200" /> {viewer.modeLabel}</div>
            Current session: <span className="font-medium text-white">{viewer.displayName}</span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild><Link href="/sign-in"><Sparkles className="size-4" /> Sign in</Link></Button>
            <Button asChild variant="secondary"><Link href="/sign-up">Create account</Link></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

