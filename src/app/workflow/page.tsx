import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkflowVisualStrip } from "@/components/marketing/workflow-visual-strip";

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

