"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Zap, Shield, Building2, Users, CreditCard, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { plans } from "@/lib/plans";
import { marketingOrderReviewHref } from "@/components/marketing/marketing-site-data";
import { ScreenshotFrame } from "@/components/marketing/visuals/screenshot-frame";
import { AnimatedConnectors } from "@/components/marketing/animated-connectors";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { SiteFooter } from "@/components/marketing/site-footer";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
};

const billingFeatures = [
  { icon: CreditCard, title: "Transparent billing", text: "No hidden fees, no usage surprises. Every plan includes clear seat-based pricing with predictable monthly or annual invoices." },
  { icon: Users, title: "Seat-based scaling", text: "Add operators and reviewers as your desk grows. Each seat gets full access to the intake, review, and approval workflow." },
  { icon: TrendingUp, title: "Upgrade when ready", text: "Move between plans as your order volume and control needs evolve. No penalties, no lock-in contracts." },
];

const comparisonRows = [
  { feature: "Shared mailbox intake", starter: true, growth: true, enterprise: true },
  { feature: "AI draft generation", starter: true, growth: true, enterprise: true },
  { feature: "Exception review surface", starter: true, growth: true, enterprise: true },
  { feature: "Approval workflows", starter: false, growth: true, enterprise: true },
  { feature: "ERP export adapters", starter: false, growth: true, enterprise: true },
  { feature: "Reason codes & audit trails", starter: false, growth: true, enterprise: true },
  { feature: "Multi-branch workspaces", starter: false, growth: false, enterprise: true },
  { feature: "Custom approval chains", starter: false, growth: false, enterprise: true },
  { feature: "Priority support & SLA", starter: false, growth: false, enterprise: true },
];

export default function PricingPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="starfield" />
      <div className="pointer-events-none absolute inset-0 grid-glow opacity-60" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <MarketingHeader />

        <section className="flex flex-col items-center py-12 text-center lg:py-16">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl">
            <Badge variant="success">Pricing</Badge>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Choose the rollout path that matches your <span className="text-gradient">order volume.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-9 text-white/66">
              Start with shared inbox visibility, expand into reviewer workflow, and graduate into ERP-ready release when the team is ready. Billing is designed for real operations, not vanity usage.
            </p>
          </motion.div>
        </section>

        <section className="grid gap-4 xl:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div key={plan.key} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.1 }}>
              <Card className={`h-full ${plan.key === "growth" ? "border-cyan-400/20 bg-[linear-gradient(180deg,rgba(114,228,255,0.08),rgba(255,255,255,0.04))]" : ""}`}>
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
                    <div key={feature} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-cyan-200" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  <div className="pt-2">
                    {plan.key === "enterprise" ? (
                      <Button asChild variant="secondary" className="w-full">
                        <Link href="mailto:hello@orderpilot.ai?subject=OrderPilot%20enterprise%20rollout">Talk through rollout</Link>
                      </Button>
                    ) : (
                      <Button asChild className="w-full">
                        <Link href="/dashboard">Start now <ArrowRight className="size-4" /></Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="mt-16">
          <ScreenshotFrame title="Workspace billing overview" lines={["Current plan - Growth", "Billing status - Active", "Seats - 6 operators", "Next invoice - Jul 28", "Payment method - Visa ending 4242"]} accent="emerald" />
        </section>

        <AnimatedConnectors className="mt-12" />

        <section className="mt-16">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="max-w-3xl">
            <Badge variant="violet">Billing features</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Billing built for operations teams, not developer experiments.</h2>
            <p className="mt-4 text-base leading-8 text-white/68">Every plan includes the core workflow your team needs. Upgrade only when you need deeper approvals, ERP integration, or enterprise controls.</p>
          </motion.div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {billingFeatures.map((item, index) => (
              <motion.div key={item.title} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.08 }}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan-200"><item.icon className="size-5" /></div>
                    <CardTitle className="mt-4">{item.title}</CardTitle>
                    <CardDescription className="leading-7">{item.text}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="max-w-3xl">
            <Badge>Feature comparison</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Every plan includes the essentials. Deeper controls unlock as you grow.</h2>
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
            <div className="grid grid-cols-4 gap-0 border-b border-white/10 px-5 py-4 text-xs uppercase tracking-[0.22em] text-white/42">
              <span>Feature</span><span className="text-center">Starter</span><span className="text-center">Growth</span><span className="text-center">Enterprise</span>
            </div>
            {comparisonRows.map((row, index) => (
              <div key={row.feature} className={`grid grid-cols-4 gap-0 px-5 py-4 text-sm text-white/70 ${index < comparisonRows.length - 1 ? "border-b border-white/6" : ""}`}>
                <span>{row.feature}</span>
                <span className="text-center">{row.starter ? <CheckCircle2 className="mx-auto size-4 text-emerald-300" /> : <span className="text-white/20">-</span>}</span>
                <span className="text-center">{row.growth ? <CheckCircle2 className="mx-auto size-4 text-emerald-300" /> : <span className="text-white/20">-</span>}</span>
                <span className="text-center">{row.enterprise ? <CheckCircle2 className="mx-auto size-4 text-emerald-300" /> : <span className="text-white/20">-</span>}</span>
              </div>
            ))}
          </motion.div>
        </section>

        <section className="mt-20 grid gap-6 lg:grid-cols-3">
          {[
            { icon: Zap, title: "Starter fit", desc: "Begin with intake visibility.", texts: ["For small desks that need shared inbox capture and basic review without ERP handoff yet. Start seeing value from day one with structured drafts and exception highlighting.", "Perfect for teams processing fewer than 100 orders per month who want to eliminate inbox chaos first."], highlight: false },
            { icon: Shield, title: "Growth fit", desc: "Reviewer workflow plus export readiness.", texts: ["For teams moving more volume and ready to approve ERP-ready drafts with confidence. Includes approval workflows, reason codes, and export adapters.", "Most teams start here once they have proven the intake workflow with a small reviewer group."], highlight: true },
            { icon: Building2, title: "Enterprise fit", desc: "Advanced controls and integrations.", texts: ["For multi-branch operations needing deeper approvals, integrations, and stronger rollout guarantees. Includes custom approval chains, priority support, and SLA guarantees.", "Designed for organizations processing thousands of orders across multiple locations."], highlight: false },
          ].map((item, index) => (
            <motion.div key={item.title} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.08 }}>
              <Card className={`h-full ${item.highlight ? "border-cyan-400/20 bg-[linear-gradient(180deg,rgba(114,228,255,0.06),rgba(255,255,255,0.03))]" : ""}`}>
                <CardHeader>
                  <div className={`flex size-11 items-center justify-center rounded-2xl border ${item.highlight ? "border-cyan-300/20 bg-cyan-300/10" : "border-white/10 bg-white/[0.05]"} text-cyan-200`}><item.icon className="size-5" /></div>
                  <CardTitle className="mt-4">{item.title}</CardTitle>
                  <CardDescription>{item.desc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm leading-7 text-white/72">
                  {item.texts.map((t) => <p key={t.slice(0, 30)}>{t}</p>)}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="mt-20 pb-6">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
            <div className="panel shimmer-border rounded-[32px] px-6 py-8 sm:px-8 sm:py-10">
              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <Badge>Next step</Badge>
                  <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Start with the dashboard, then inspect live order review.</h2>
                  <p className="mt-4 max-w-3xl text-base leading-8 text-white/68">The clearest way to evaluate pricing is to see the workflow in action. Open the dashboard to explore workspace signals, or inspect a live order review to understand the value before committing.</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Button asChild size="lg"><Link href="/dashboard">Open dashboard <ArrowRight className="size-4" /></Link></Button>
                  <Button asChild size="lg" variant="secondary"><Link href={marketingOrderReviewHref}>Inspect order review</Link></Button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
