"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Users, FileSearch2, TrendingUp, Quote, Star, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { marketingOrderReviewHref } from "@/components/marketing/marketing-site-data";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { SiteFooter } from "@/components/marketing/site-footer";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
};

const outcomeMetrics = [
  { value: "42%", label: "Faster first-pass review", detail: "Teams report significantly faster review cycles once coordinators work from one shared queue instead of scattered inboxes." },
  { value: "3x", label: "Fewer re-entry loops", detail: "Structured drafts eliminate most manual re-keying. Reviewers spend time on real exceptions, not data entry." },
  { value: "98%", label: "Orders routed with clear next action", detail: "Every order enters the review queue with mapped lines, flagged exceptions, and a visible next step for the reviewer." },
  { value: "31%", label: "Less internal handoff churn", detail: "Notes, approvals, and context stay attached to the order so teammates stop chasing each other for missing details." },
];

const roleOutcomes = [
  {
    icon: Users,
    title: "For coordinators",
    subtitle: "Less manual re-entry",
    text: "Structured drafts reduce re-keying and inbox chasing for routine orders. Coordinators work from one queue where every inbound PO already has a structured draft behind it.",
    bullets: ["One intake queue across shared mailboxes", "Prepared drafts with gaps already highlighted", "Fewer manual handoffs between teammates"],
  },
  {
    icon: FileSearch2,
    title: "For reviewers",
    subtitle: "Evidence in one place",
    text: "Exceptions carry source context forward so decisions feel confident. Reviewers see mapped lines, exceptions, and source evidence in one surface without reconstructing context from emails.",
    bullets: ["Source-aware field evidence", "Clear mismatch and exception routing", "Approval context before release"],
  },
  {
    icon: TrendingUp,
    title: "For leaders",
    subtitle: "Proof metrics",
    text: "Value shows up in real operating signals, not vanity usage charts. Leaders can see launch readiness, queue health, and value proof without asking for spreadsheets.",
    bullets: ["Launch-readiness signals in one view", "Operational proof before ERP rollout", "Visible adoption and review momentum"],
  },
];

const customerTestimonials = [
  {
    quote: "We went from three coordinators re-keying POs all morning to one shared queue where drafts are already structured. The time savings paid for the subscription in the first week.",
    name: "Sarah Mitchell",
    role: "VP Operations",
    company: "Apex Industrial Supply",
    metric: "4.2h saved daily per coordinator",
    stars: 5,
  },
  {
    quote: "The exception routing changed everything for our review team. Instead of hunting through emails for context, every flagged line comes with the source evidence attached. Approvals are faster and more defensible.",
    name: "David Chen",
    role: "Order Processing Manager",
    company: "Pacific Distribution Group",
    metric: "67% fewer review escalations",
    stars: 5,
  },
  {
    quote: "I can finally show the executive team real numbers on throughput improvement instead of anecdotes. The dashboard signals tell the story without me building a single spreadsheet.",
    name: "Rachel Torres",
    role: "Director of Supply Chain",
    company: "Continental Parts Co.",
    metric: "31% less internal handoff churn",
    stars: 5,
  },
  {
    quote: "We connected two shared mailboxes and had our first order processed through the full workflow within 24 hours. No consultant, no multi-month implementation. Just connected and started.",
    name: "James Whitfield",
    role: "IT Director",
    company: "Southeastern Hardware Dist.",
    metric: "Live in under 24 hours",
    stars: 5,
  },
  {
    quote: "The reason codes on every exception resolution give our compliance team exactly what they need. When auditors ask why a line was changed, we have the trail ready without scrambling.",
    name: "Priya Kapoor",
    role: "Compliance Lead",
    company: "Atlas Wholesale Solutions",
    metric: "100% audit trail coverage",
    stars: 5,
  },
  {
    quote: "Our NetSuite integration went live with zero custom development. The export adapter mapped our fields correctly on the first attempt. Failed exports surface immediately with context.",
    name: "Marcus Allen",
    role: "ERP Integration Lead",
    company: "Great Lakes Distribution",
    metric: "Zero custom integration code",
    stars: 5,
  },
];

const caseStudies = [
  {
    company: "Midwest Supply Partners",
    industry: "Industrial distribution",
    teamSize: "12 operators",
    challenge: "Processing 200+ daily orders from 40 customer accounts with different PO formats. Coordinators spent 60% of their time on manual re-keying.",
    outcome: "First-pass review time dropped 42%. Re-entry loops eliminated for 85% of standard orders. Full team adoption within 3 weeks.",
  },
  {
    company: "Coastal Automotive Parts",
    industry: "Automotive aftermarket",
    teamSize: "8 operators",
    challenge: "Complex multi-line POs with frequent SKU mismatches. Reviewers spent hours reconstructing context from email threads.",
    outcome: "Exception resolution time cut by 55%. SKU mapping accuracy reached 94%. ERP handoff errors reduced to near zero.",
  },
];

export default function CustomersPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="starfield" />
      <div className="pointer-events-none absolute inset-0 grid-glow opacity-60" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <MarketingHeader />

        <section className="flex flex-col items-center py-12 text-center lg:py-16">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl">
            <Badge>Customer stories</Badge>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Outcome-focused proof from <span className="text-gradient">operations leaders.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-9 text-white/66">
              Teams cite faster first-pass review, fewer re-entry loops, and clearer approvals. The workflow is valued because operators can trust it, not because the visuals look good.
            </p>
          </motion.div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {outcomeMetrics.map((metric, index) => (
            <motion.div key={metric.label} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.08 }}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <p className="font-display text-4xl font-semibold text-cyan-200">{metric.value}</p>
                  <p className="mt-3 text-base font-semibold text-white">{metric.label}</p>
                  <p className="mt-3 text-sm leading-7 text-white/66">{metric.detail}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="mt-14">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-8 max-w-3xl">
            <Badge variant="violet">What customers say</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Hear directly from operations teams using OrderPilot daily.
            </h2>
          </motion.div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {customerTestimonials.map((t, index) => (
              <motion.div key={t.name} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.06 }}>
                <div className="flex h-full flex-col rounded-[24px] border border-white/10 bg-[linear-gradient(145deg,rgba(124,92,255,0.06),rgba(114,228,255,0.03))] p-6">
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-amber-300 text-amber-300" />
                    ))}
                  </div>
                  <Quote className="mb-2 size-5 text-white/20" />
                  <p className="flex-1 text-sm leading-7 text-white/72">{t.quote}</p>
                  <div className="mt-4 border-t border-white/8 pt-4">
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/55">{t.role} at {t.company}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-cyan-200/15 bg-cyan-200/8 px-2.5 py-1">
                      <TrendingUp className="size-3 text-cyan-200" />
                      <span className="text-[11px] font-medium text-cyan-200">{t.metric}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-8 max-w-3xl">
            <Badge variant="success">Case studies</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Real implementation stories from distribution teams.
            </h2>
          </motion.div>
          <div className="grid gap-6 lg:grid-cols-2">
            {caseStudies.map((cs, index) => (
              <motion.div key={cs.company} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.1 }}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan-200">
                        <Building2 className="size-5" />
                      </div>
                      <div>
                        <CardTitle>{cs.company}</CardTitle>
                        <CardDescription>{cs.industry} &middot; {cs.teamSize}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/40">Challenge</p>
                      <p className="mt-1 text-sm leading-7 text-white/68">{cs.challenge}</p>
                    </div>
                    <div className="rounded-xl border border-emerald-300/10 bg-emerald-300/5 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Outcome</p>
                      <p className="mt-1 text-sm leading-7 text-emerald-100/80">{cs.outcome}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="max-w-3xl">
            <Badge variant="violet">Role-specific outcomes</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Every role on the desk feels the impact differently.
            </h2>
            <p className="mt-4 text-base leading-8 text-white/68">
              Strong rollout stories are role-specific. Coordinators want less re-entry, reviewers want better evidence, and leaders want proof the workflow is actually improving throughput and control.
            </p>
          </motion.div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {roleOutcomes.map((item, index) => (
              <motion.div key={item.title} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.08 }}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan-200">
                      <item.icon className="size-5" />
                    </div>
                    <CardTitle className="mt-4">{item.title}</CardTitle>
                    <CardDescription className="text-base font-semibold text-white/80">{item.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-7 text-white/72">{item.text}</p>
                    <ul className="space-y-3 text-sm leading-7 text-white/72">
                      {item.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <CheckCircle2 className="mt-1 size-4 shrink-0 text-cyan-200" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
            <div className="panel shimmer-border rounded-[32px] px-6 py-8 sm:px-8 sm:py-10">
              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <Badge variant="success">See it in action</Badge>
                  <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    Join the teams already clearing more orders with less rework.
                  </h2>
                  <p className="mt-4 max-w-3xl text-base leading-8 text-white/68">
                    Open the dashboard to see workspace signals, or inspect a live order review to understand how exceptions and approvals work in practice.
                  </p>
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
