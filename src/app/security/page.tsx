import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedConnectors } from "@/components/marketing/animated-connectors";
import { marketingOrderReviewHref } from "@/components/marketing/marketing-site-data";

export default function SecurityPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-glow opacity-60" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <section className="max-w-3xl space-y-5">
          <Badge>Security & Data Handling</Badge>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Practical security for mailbox OAuth, retention, and auditability.
          </h1>
          <p className="text-base leading-8 text-white/70">
            OrderPilot focuses on the controls operations leaders care about: secure OAuth and token rotation, webhook verification, clear data retention across workspace boundaries, and incident response practices that preserve trust.
          </p>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>OAuth and token rotation</CardTitle>
              <CardDescription>Provider OAuth, token refresh, and revocation visibility.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>Mailbox credentials use provider OAuth flows. Rotation and refresh events are visible to administrators, with revocation controls in Settings.</p>
              <div className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/42">Mailbox OAuth flow</p>
                <p className="mt-3 text-sm text-white/72">Admin starts authorization → Provider consent → Token issued → Rotation tracked → Optional revoke.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Webhook verification</CardTitle>
              <CardDescription>Signature checks, secrets, and logged deliveries.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>Inbound provider notifications and mail events are authenticated. Deliveries are captured with minimal metadata to support diagnostics without exposing sensitive payloads.</p>
              <div className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/42">Webhook verification</p>
                <p className="mt-3 text-sm text-white/72">Provider → Signature/secret validation → Delivery logged → Ingestion safe-guarded.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data retention and boundaries</CardTitle>
              <CardDescription>Workspace-bound retention with audit trails.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>Operational records remain scoped to the workspace. Approval decisions, notes, and export diagnostics maintain accountability while respecting retention policies.</p>
              <div className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/42">Retention boundaries</p>
                <p className="mt-3 text-sm text-white/72">Drafts, approvals, and exports remain workspace-bound. Requests can remove personal data subject to requirements.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Incident response & auditability</CardTitle>
              <CardDescription>Posture focused on measurable recovery and transparency.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>We prioritize fast, transparent response for incidents. Audit trails and export diagnostics reduce risk of silent failures and support clean recovery.</p>
              <div className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-white/42">Auditability</p>
                <p className="mt-3 text-sm text-white/72">Approvals, changes, and export attempts remain visible with clear context and timestamps.</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <AnimatedConnectors className="mt-12" />

        <section className="mt-16">
          <div className="panel rounded-[32px] px-6 py-8 sm:px-8 sm:py-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <Badge>Next step</Badge>
                <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Open the workspace or inspect live order review.</h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-white/68">
                  Start with the dashboard to see workspace signals, or inspect the review surface to understand exceptions and approvals in action.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button asChild size="lg"><Link href="/dashboard">Open dashboard</Link></Button>
                <Button asChild size="lg" variant="secondary"><Link href={marketingOrderReviewHref}>Inspect order review</Link></Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

