"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Users, FileSearch2, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { marketingOrderReviewHref } from "@/components/marketing/marketing-site-data";
import { CustomersHeroVisual } from "@/components/marketing/visuals/customers-hero-visual";
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

        <section className="mt-12">
          <CustomersHeroVisual />
        </section>

        <section className="mt-14">
          <TestimonialsSection />
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
