import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { plans } from "@/lib/plans";
import { marketingOrderReviewHref } from "@/components/marketing/marketing-site-data";
import { ScreenshotFrame } from "@/components/marketing/visuals/screenshot-frame";

export default function PricingPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-glow opacity-60" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <section className="max-w-3xl space-y-5">
          <Badge variant="success">Pricing</Badge>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Choose the rollout path that matches your order volume and control model.
          </h1>
          <p className="text-base leading-8 text-white/70">
            Start with shared inbox visibility, expand into reviewer workflow, and graduate into ERP-ready release when the team is ready. Billing is designed for real operations, not vanity usage.
          </p>
        </section>

        <section className="mt-12">
          <ScreenshotFrame
            title="Workspace billing overview"
            lines={["Current plan · Growth", "Billing status · Active", "Seats · 6", "Next invoice · Jul 28"]}
            accent="emerald"
          />
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
              <CardTitle>Starter fit</CardTitle>
              <CardDescription>Begin with intake visibility.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-white/72">
              <p>For small desks that need shared inbox capture and basic review without ERP handoff yet.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Growth fit</CardTitle>
              <CardDescription>Reviewer workflow plus export readiness.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-white/72">
              <p>For teams moving more volume and ready to approve ERP-ready drafts with confidence.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Enterprise fit</CardTitle>
              <CardDescription>Advanced controls and integrations.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-white/72">
              <p>For multi-branch operations needing deeper approvals, integrations, and stronger rollout guarantees.</p>
            </CardContent>
          </Card>
        </section>

        <section className="mt-12 grid gap-4 xl:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.key} className={plan.key === "growth" ? "border-cyan-400/20 bg-[linear-gradient(180deg,rgba(114,228,255,0.08),rgba(255,255,255,0.04))]" : undefined}>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="font-display">{plan.name}</CardTitle>
                  {plan.key === "growth" ? <Badge>Recommended</Badge> : null}
                </div>
                <CardDescription>{plan.subtitle}</CardDescription>
                <div className="pt-3 text-3xl font-semibold text-white">
                  {plan.price} <span className="text-sm font-normal text-white/45">{plan.cadence}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
                    {feature}
                  </div>
                ))}
                <div className="pt-2">
                  {plan.key === "enterprise" ? (
                    <Button asChild variant="secondary" className="w-full">
                      <Link href="mailto:hello@orderpilot.ai?subject=OrderPilot%20enterprise%20rollout">Talk through rollout</Link>
                    </Button>
                  ) : (
                    <Button asChild className="w-full">
                      <Link href="/dashboard">Explore dashboard</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
