import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FeatureVisualGrid } from "@/components/marketing/feature-visual-grid";
import { TrustLogoStrip } from "@/components/marketing/trust-logo-strip";
import { WorkflowVisualStrip } from "@/components/marketing/workflow-visual-strip";

export default function PlatformPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-glow opacity-60" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <section className="max-w-3xl space-y-5">
          <Badge>Platform</Badge>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            One workspace for intake, review, and ERP-ready release.
          </h1>
          <p className="text-base leading-8 text-white/70">
            OrderPilot gives distributor operations teams one place to see inbound demand, resolve exceptions, and release ERP-ready orders without stitching together inboxes, spreadsheets, and ad hoc approvals.
          </p>
        </section>

        <div className="mt-10">
          <TrustLogoStrip />
        </div>

        <section className="mt-16 grid gap-6 lg:grid-cols-[0.68fr_1.32fr]">
          <Card className="h-full">
            <CardHeader>
              <Badge>Operations overview</Badge>
              <CardTitle className="mt-4 font-display text-3xl text-white">Operations command center</CardTitle>
              <CardDescription className="text-base leading-8 text-white/70">
                The dashboard surfaces queue health, launch readiness, and value proof in one place so operators and leaders can see whether the workflow is actually working.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>Every workspace opens to a single operations overview: inbox coverage, orders in review, ERP handoff readiness, and launch checklist progress.</p>
              <p>You can see whether the desk is keeping up with inbound demand, where exceptions are piling up, and which rollout steps still need attention.</p>
            </CardContent>
          </Card>
          <FeatureVisualGrid />
        </section>

        <section className="mt-20 space-y-8">
          <div className="max-w-3xl">
            <Badge variant="violet">Shared intake surface</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Replace scattered inbox triage with one shared queue.
            </h2>
            <p className="mt-4 text-base leading-8 text-white/70">
              Coordinators should not have to chase orders across personal inboxes and forwarded threads. OrderPilot captures customer POs and attachments into one shared queue built for operations, not marketing campaigns.
            </p>
          </div>
          <WorkflowVisualStrip />
        </section>

        <section className="mt-20 grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>For coordinators</CardTitle>
              <CardDescription className="text-sm leading-7 text-white/70">
                Clear more inbound volume without re-keying or hunting for context.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>Coordinators work from one queue where every inbound PO and attachment already has a structured draft behind it.</p>
              <p>They can see which lines are confident, which need attention, and what needs to move before the order can be released.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>For reviewers</CardTitle>
              <CardDescription className="text-sm leading-7 text-white/70">
                Only review lines that actually need judgment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>Reviewers see mapped lines, exceptions, and source evidence in one surface. They do not have to reconstruct context from email threads.</p>
              <p>Reason codes and approval chains make it obvious what changed and why, so approvals stay explainable to the rest of the business.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>For leaders</CardTitle>
              <CardDescription className="text-sm leading-7 text-white/70">
                Prove that the desk is improving throughput without losing control.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>Leaders can see launch readiness, queue health, and value proof without asking for spreadsheets or hallway updates.</p>
              <p>They can track adoption, review throughput, and ERP-ready handoffs as real operating signals instead of anecdotes.</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

