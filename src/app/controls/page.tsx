import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { controlPillars } from "@/components/marketing/marketing-site-data";
import { marketingOrderReviewHref } from "@/components/marketing/marketing-site-data";
import { ErpMappingDiagram } from "@/components/marketing/visuals/erp-mapping-diagram";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { SiteFooter } from "@/components/marketing/site-footer";

export default function ControlsPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-glow opacity-60" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <MarketingHeader />
        <section className="max-w-3xl space-y-5">
          <Badge variant="success">Controls</Badge>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Keep approvals visible and rollout staged without losing control.
          </h1>
          <p className="text-base leading-8 text-white/70">
            OrderPilot is built for operations, not demos. Approvals are explicit, changes are evidence-backed, and rollout is staged so leaders can say yes without betting the desk on a big-bang change.
          </p>
        </section>

        <section className="mt-10">
          <ErpMappingDiagram />
        </section>



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
              <CardTitle>Audit trails</CardTitle>
              <CardDescription>Changes and approvals remain visible.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-white/72">
              <p>We preserve who changed what and why so leaders can defend the workflow decisions.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Staged controls</CardTitle>
              <CardDescription>Adopt depth without risking operations.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-white/72">
              <p>Teams step into deeper approvals or ERP release when they are ready, not before.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Export diagnostics</CardTitle>
              <CardDescription>Prevent silent failures downstream.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-white/72">
              <p>We log export attempts and outcomes to catch issues early and reduce rework.</p>
            </CardContent>
          </Card>
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

        <SiteFooter />
      </div>
    </main>
  );
}
