import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { FeatureVisualGrid } from "@/components/marketing/feature-visual-grid";
import { HeroVisual } from "@/components/marketing/hero-visual";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import {
  controlPillars,
  marketingSignals,
  marketingOrderReviewHref,
  proofPills,
  teamViews,
  workflowSteps,
} from "@/components/marketing/marketing-site-data";
import { SiteFooter } from "@/components/marketing/site-footer";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { TrustLogoStrip } from "@/components/marketing/trust-logo-strip";
import { WorkflowVisualStrip } from "@/components/marketing/workflow-visual-strip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { plans } from "@/lib/plans";

const pricingHighlights = [
  "Start with shared inbox capture and a review flow buyers can understand immediately",
  "Expand into approvals and ERP-ready handoff only when the team is ready for it",
  "Keep rollout, billing, and launch readiness visible in one operational workspace",
];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div className="starfield" />
      <div className="pointer-events-none absolute inset-0 grid-glow opacity-60" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <MarketingHeader />

        <section className="flex flex-1 flex-col items-center py-12 lg:py-20">
          <div className="mx-auto max-w-[58rem] text-center">
            <Badge>Built for distributor operations</Badge>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-[4.5rem]">
              Turn emailed purchase orders into <span className="text-gradient">ERP-ready draft orders.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-white/66 sm:text-xl">
              OrderPilot turns emailed POs and attachments into structured order drafts, highlights exceptions, and routes review before the ERP handoff.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg"><Link href="/dashboard">Dashboard <ArrowRight className="size-4" /></Link></Button>
              <Button asChild size="lg" variant="secondary"><Link href={marketingOrderReviewHref}>See live order review</Link></Button>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-3 text-sm text-white/54">
              {proofPills.map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                  <CheckCircle2 className="size-4 text-cyan-200" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 w-full xl:mt-12">
            <HeroVisual />
          </div>
        </section>

        <TrustLogoStrip />

        <section className="mt-20 grid gap-4 md:grid-cols-3">
          {marketingSignals.map(({ label, title, text }) => (
            <Card key={title} className="border-white/12 bg-white/[0.05]">
              <CardContent className="pt-6">
                <p className="text-xs uppercase tracking-[0.28em] text-white/38">{label}</p>
                <p className="mt-3 text-lg font-semibold text-white">{title}</p>
                <p className="mt-3 text-sm leading-7 text-white/66">{text}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section id="platform-capabilities" className="mt-24 grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <Card className="h-full">
            <CardHeader>
              <Badge>Platform capabilities</Badge>
              <CardTitle className="mt-4 font-display text-3xl sm:text-4xl">Give your order desk one reliable system for intake, review, and release.</CardTitle>
              <CardDescription className="text-base leading-8 text-white/68">
                OrderPilot helps distributor teams clear inbound demand faster without forcing operators to trust a black box, chase scattered inboxes, or hand off incomplete drafts downstream.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-[22px] border border-white/10 bg-slate-950/60 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-white/40">What buyers immediately understand</p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-white/72">
                  <li>• A shared operational queue instead of personal inbox triage</li>
                  <li>• A reviewer surface that keeps mapped lines, notes, and exceptions together</li>
                  <li>• Clear rollout controls for mailbox coverage, billing, and ERP handoff readiness</li>
                </ul>
              </div>
              <div className="mt-4 rounded-[22px] border border-cyan-300/12 bg-[linear-gradient(135deg,rgba(114,228,255,0.08),rgba(124,92,255,0.06))] p-5 text-sm leading-7 text-white/72">
                Buyers do not have to imagine the product from abstract marketing copy — the visuals on this page mirror the real dashboard, review, and rollout surfaces your team would actually use.
              </div>
            </CardContent>
          </Card>
          <FeatureVisualGrid />
        </section>

        <section id="workflow" className="mt-24 space-y-8">
          <div className="max-w-3xl">
            <Badge variant="violet">Operational workflow</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">A clear path from shared mailbox capture to ERP-ready release.</h2>
            <p className="mt-4 text-base leading-8 text-white/68">
              The workflow below shows the real operating arc teams care about most: capture demand, create a draft, resolve exceptions, and release a cleaner order downstream.
            </p>
          </div>

          <WorkflowVisualStrip />

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {workflowSteps.map((step, index) => (
              <Card key={step.title}>
                <CardContent className="pt-6">
                  <p className="text-xs uppercase tracking-[0.26em] text-white/38">Step {index + 1}</p>
                  <p className="mt-3 text-lg font-semibold text-white">{step.title}</p>
                  <p className="mt-3 text-sm leading-7 text-white/72">{step.text}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.24em] text-cyan-200">{step.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="team-impact" className="mt-24">
          <div className="max-w-3xl">
            <Badge>Where teams feel the impact</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Designed for the people who have to make order flow work every single day.</h2>
            <p className="mt-4 text-base leading-8 text-white/68">
              Strong rollout stories are role-specific. Coordinators want less re-entry, reviewers want better evidence, and leaders want proof the workflow is actually improving throughput and control.
            </p>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {teamViews.map(({ icon: Icon, title, text, bullets }) => (
              <Card key={title}>
                <CardHeader>
                  <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan-200"><Icon className="size-5" /></div>
                  <CardTitle className="mt-4">{title}</CardTitle>
                  <CardDescription className="leading-7">{text}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm leading-7 text-white/72">
                    {bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <CheckCircle2 className="mt-1 size-4 shrink-0 text-cyan-200" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <TestimonialsSection />

        <section id="pricing" className="mt-24 space-y-8">
          <div className="max-w-3xl">
            <Badge variant="success">Pricing and rollout</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Choose the rollout path that matches your current order volume and control model.
            </h2>
            <p className="mt-4 text-base leading-8 text-white/68">
              Start with the operational basics your team needs first, expand into approval depth and cleaner ERP release as volume grows, and add enterprise controls only when they become part of the real rollout plan.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {pricingHighlights.map((item) => (
              <div key={item} className="rounded-[24px] border border-white/10 bg-white/[0.045] px-5 py-4 text-sm leading-7 text-white/68">
                {item}
              </div>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
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
                      <Button asChild variant="secondary" className="w-full"><Link href="mailto:hello@orderpilot.ai?subject=OrderPilot%20enterprise%20rollout">Talk through rollout</Link></Button>
                    ) : (
                      <Button asChild className="w-full"><Link href="/pricing">View pricing</Link></Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="controls" className="mt-24 grid gap-6 lg:grid-cols-[1.04fr_0.96fr]">
          <Card>
            <CardHeader>
              <Badge variant="success">Controls and rollout</Badge>
              <CardTitle className="mt-4 font-display">Adoption gets easier when buyers can see exactly where control stays in place.</CardTitle>
              <CardDescription className="text-base leading-8 text-white/68">
                Operations leaders need confidence that automation improves speed without weakening approvals, auditability, or downstream release discipline. The control model should feel obvious at a glance.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              {controlPillars.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-[22px] border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-cyan-200">
                    <Icon className="size-4" />
                  </div>
                  <p className="mt-4 text-base font-semibold text-white">{title}</p>
                  <p className="mt-3 text-sm leading-7 text-white/68">{text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="grid gap-4">
            <Card className="overflow-hidden border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))]">
              <CardContent className="pt-6">
                <p className="text-xs uppercase tracking-[0.24em] text-white/40">Rollout promise</p>
                <p className="mt-3 font-display text-2xl font-semibold text-white">Make the first launch feel controlled, measurable, and easy to explain internally.</p>
                <p className="mt-4 text-sm leading-7 text-white/66">
                  OrderPilot is designed so leadership can say yes without betting the team on a dramatic process change. Start with visibility, prove reviewer confidence, and expand from there.
                </p>
                <div className="mt-5 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-white/44">
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">Mailbox coverage</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">Approval context</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">ERP release readiness</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs uppercase tracking-[0.24em] text-white/40">What customers ask before rollout</p>
                <p className="mt-3 text-base leading-7 text-white/66">
                  Buyers usually want to know how quickly their team sees value, where approvals remain human-controlled, and how to introduce the workflow without disrupting the desk.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="faq" className="mt-24 grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="max-w-2xl">
            <Badge variant="violet">FAQ</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Answers for teams comparing intake automation against the way they operate today.
            </h2>
            <p className="mt-4 text-base leading-8 text-white/64">
              These are the questions operations, IT, and order desk leaders tend to ask once they understand the workflow: how fast value shows up, how approvals stay protected, and how rollout can happen without chaos.
            </p>
          </div>
          <FaqAccordion />
        </section>

        <section className="mt-24 pb-6">
          <div className="panel rounded-[32px] px-6 py-8 sm:px-8 sm:py-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <Badge>Next step</Badge>
                <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">See the workspace, then inspect how an order gets reviewed in context.</h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-white/68">
                  The clearest next move is to open the actual dashboard and then inspect a representative order review surface. That gives buyers both the high-level operations picture and the detailed line-level proof.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button asChild size="lg"><Link href="/dashboard">Dashboard <ArrowRight className="size-4" /></Link></Button>
                <Button asChild size="lg" variant="secondary"><Link href={marketingOrderReviewHref}>Inspect live order</Link></Button>
              </div>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
