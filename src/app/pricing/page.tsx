import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { plans } from "@/lib/plans";

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

