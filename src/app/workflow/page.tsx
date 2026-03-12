import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkflowVisualStrip } from "@/components/marketing/workflow-visual-strip";
import { AnimatedConnectors } from "@/components/marketing/animated-connectors";
import { marketingOrderReviewHref } from "@/components/marketing/marketing-site-data";
import { MailboxOAuthFlow } from "@/components/marketing/visuals/mailbox-oauth-flow";
import Image from "next/image";

export default function WorkflowPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-glow opacity-60" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <section className="max-w-3xl space-y-5">
          <Badge variant="violet">Workflow</Badge>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            From shared mailbox capture to ERP-ready release.
          </h1>
          <p className="text-base leading-8 text-white/70">
            The workflow is simple: capture and structure inbound orders, surface exceptions with evidence, keep approvals explicit, and release cleaner drafts downstream. It is designed to be explainable to operators and leaders.
          </p>
        </section>

        <section className="mt-10">
          <MailboxOAuthFlow />
        </section>

        <section className="mt-10">
          <Image
            src="/assets/marketing/workflow-oauth.svg"
            alt="Mailbox OAuth flow screenshot"
            width={1200}
            height={480}
            className="rounded-[26px] border border-white/10"
          />
        </section>

        <AnimatedConnectors className="mt-10" />

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

        <section className="mt-20 grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Evidence stays attached</CardTitle>
              <CardDescription>Reviewers never lose the original context.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-white/72">
              <p>Source files and mapping evidence remain next to the line so reviewers do not chase details across inboxes.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Reason codes</CardTitle>
              <CardDescription>Make changes explainable to the business.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-white/72">
              <p>Every exception resolved carries a reason and approval trail forward so downstream teams trust the order.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Approvals chain</CardTitle>
              <CardDescription>Human-controlled before export.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-white/72">
              <p>The workflow clarifies who signs off and when, without turning approvals into bureaucracy.</p>
            </CardContent>
          </Card>
        </section>

        <section className="mt-12">
          <WorkflowVisualStrip />
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Intake</CardTitle>
              <CardDescription>Shared mailbox capture and uploads land in one queue.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>Microsoft 365 shared inboxes and Gmail routing aliases connect securely. Every inbound PO and file becomes a structured draft with source evidence attached.</p>
              <p>Manual uploads are supported for edge cases, onboarding, and legacy flows.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Extract</CardTitle>
              <CardDescription>Line-level mapping with clear confidence scoring.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>Requested SKUs, quantities, references, and shipping details are parsed into a draft order. Confidence gaps are flagged in context to prevent downstream rework.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review</CardTitle>
              <CardDescription>Exceptions surface to the right reviewer with evidence.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>Reason codes define what changed and why. Approval chains make responsibility explicit and keep audit trails intact without introducing bureaucracy.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Approve</CardTitle>
              <CardDescription>Human approvals stay in control before ERP release.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>Once exceptions are resolved and approvals satisfied, the order carries notes and context forward so downstream teams can trust it.</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
