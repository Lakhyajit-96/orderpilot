import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { controlPillars } from "@/components/marketing/marketing-site-data";

export default function ControlsPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-glow opacity-60" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <section className="max-w-3xl space-y-5">
          <Badge variant="success">Controls</Badge>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Keep approvals visible and rollout staged without losing control.
          </h1>
          <p className="text-base leading-8 text-white/70">
            OrderPilot is built for operations, not demos. Approvals are explicit, changes are evidence-backed, and rollout is staged so leaders can say yes without betting the desk on a big-bang change.
          </p>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-3">
          {controlPillars.map((pillar) => (
            <Card key={pillar.title}>
              <CardHeader>
                <CardTitle>{pillar.title}</CardTitle>
                <CardDescription className="text-sm leading-7 text-white/70">{pillar.text}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-7 text-white/72">
                <p>Approvals remain human-controlled with reason codes and required roles.</p>
                <p>Audit trails carry decisions, notes, and approvals forward to release.</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Staged rollout</CardTitle>
              <CardDescription>Start with mailbox visibility, graduate into reviewer workflow, and then ERP handoff.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>Teams adopt the workflow in phases that match their comfort and volume. It is not a risky overnight process change.</p>
              <p>Billing and workspace readiness stay visible so operations leaders can track adoption and value.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Export readiness</CardTitle>
              <CardDescription>NetSuite, SAP, and webhook adapters keep downstream release clean.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>Approved orders carry context forward and map cleanly to downstream systems. Export retries and diagnostics prevent silent failures.</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}

