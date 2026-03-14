"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Rocket, ShieldCheck, HeadphonesIcon, Clock, Zap, Settings, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { marketingOrderReviewHref } from "@/components/marketing/marketing-site-data";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { SiteFooter } from "@/components/marketing/site-footer";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
};

const topicCards = [
  { icon: Rocket, label: "Deployment", title: "Mailbox to Review to Export", text: "Start small, prove value, expand coverage and controls once the desk is ready. Each phase delivers standalone value so teams never risk a big-bang rollout." },
  { icon: ShieldCheck, label: "Approvals", title: "Explicit and explainable", text: "Reason codes and audit trails ensure changes are clear and defensible. Every approval decision is attributed, timestamped, and carries context forward to export." },
  { icon: HeadphonesIcon, label: "Support", title: "Operations first", text: "We focus on real operating outcomes, not demo metrics. Support is built around helping teams get through rollout milestones and resolve real-world workflow questions." },
];

const additionalFaqs = [
  { q: "How long does initial setup take?", a: "Most teams connect their first shared mailbox within 15 minutes. The full intake-to-review workflow is typically running within a day, with ERP export configured in the first week." },
  { q: "Do I need IT involvement to connect mailboxes?", a: "Workspace administrators can connect Microsoft 365 and Gmail mailboxes through OAuth consent flows. IT may need to approve the OAuth application in your tenant, but no server-side changes are required." },
  { q: "Can I start without connecting an ERP system?", a: "Yes. Many teams start with inbox visibility and review workflow before configuring export adapters. The staged rollout model means you get value from day one without needing full integration." },
  { q: "How are exceptions handled when the AI is uncertain?", a: "Low-confidence extractions are flagged as exceptions and routed to the appropriate reviewer with source evidence attached. Reviewers resolve exceptions with reason codes that carry forward to export." },
  { q: "What happens if an export fails?", a: "Export attempts are logged with request and response bodies. Failed exports surface immediately with actionable diagnostics. Retry logic handles transient failures automatically." },
  { q: "Is there a limit on the number of orders?", a: "Plans are seat-based, not volume-based. Your team can process as many orders as needed within your plan. Higher-tier plans unlock deeper controls and integrations, not higher volume caps." },
];

const quickAnswers = [
  { icon: Clock, question: "How fast can we start?", answer: "Connect a mailbox in 15 minutes, process your first order within the hour, and have your full review workflow running within a day." },
  { icon: Zap, question: "What if our team is small?", answer: "OrderPilot works for lean desks with 2-3 operators just as well as for large multi-branch teams. The Starter plan is designed for smaller operations." },
  { icon: Settings, question: "Do we need to change our ERP?", answer: "No. Export adapters map approved drafts to your existing ERP format. OrderPilot sits upstream of your ERP, not inside it." },
  { icon: HelpCircle, question: "Is training required?", answer: "The workflow mirrors how operators already think about orders. Most teams are productive within the first session without formal training." },
];

const rolloutMilestones = [
  { milestone: "Day 1", title: "Mailbox connected", description: "OAuth consent flow completes. Inbound orders begin arriving in the shared queue as structured drafts with source evidence attached." },
  { milestone: "Week 1", title: "Review workflow active", description: "Coordinators and reviewers are working from one queue. Exceptions surface with evidence. The desk starts seeing time savings on routine orders." },
  { milestone: "Week 2", title: "Approval chains configured", description: "Reason codes and approval workflows are live. Every change is explainable. Leaders can see review throughput and queue health signals." },
  { milestone: "Month 1", title: "ERP export running", description: "Export adapters are configured and tested. Approved orders flow downstream with context, notes, and audit trails intact. Full operational value realized." },
];

export default function FaqPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="starfield" />
      <div className="pointer-events-none absolute inset-0 grid-glow opacity-60" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <MarketingHeader />

        <section className="flex flex-col items-center py-12 text-center lg:py-16">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl">
            <Badge variant="violet">FAQ</Badge>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Answers for operations, IT, and <span className="text-gradient">order desk leaders.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-9 text-white/66">
              The questions teams ask once they understand the workflow: how fast value shows up, how approvals remain protected, and how rollout happens without chaos.
            </p>
          </motion.div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickAnswers.map((item, index) => (
            <motion.div key={item.question} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.08 }}>
              <div className="h-full rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(114,228,255,0.06),rgba(124,92,255,0.04))] p-5">
                <div className="flex size-10 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200"><item.icon className="size-4" /></div>
                <p className="mt-4 text-base font-semibold text-white">{item.question}</p>
                <p className="mt-2 text-sm leading-7 text-white/68">{item.answer}</p>
              </div>
            </motion.div>
          ))}
        </section>

        <section className="mt-14">
          <FaqAccordion />
        </section>

        <section className="mt-14">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="max-w-3xl">
            <Badge variant="success">Typical rollout timeline</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              From first connection to full operational value in under a month.
            </h2>
            <p className="mt-4 text-base leading-8 text-white/68">
              Most teams follow a natural adoption curve that builds confidence at each stage. Here is what the typical rollout looks like for a mid-size distributor desk.
            </p>
          </motion.div>
          <div className="mt-8 grid gap-4 lg:grid-cols-4">
            {rolloutMilestones.map((item, index) => (
              <motion.div key={item.milestone} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.08 }}>
                <div className="h-full rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">{item.milestone}</p>
                  <p className="mt-3 text-base font-semibold text-white">{item.title}</p>
                  <p className="mt-3 text-sm leading-7 text-white/72">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="max-w-3xl">
            <Badge>Additional questions</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Common questions from teams evaluating OrderPilot.
            </h2>
          </motion.div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {additionalFaqs.map((faq, index) => (
              <motion.div key={faq.q} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.06 }}>
                <div className="h-full rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-base font-semibold text-white">{faq.q}</p>
                  <p className="mt-3 text-sm leading-7 text-white/72">{faq.a}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-4 lg:grid-cols-3">
          {topicCards.map((card, index) => (
            <motion.div key={card.label} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.08 }}>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan-200"><card.icon className="size-5" /></div>
                  <p className="mt-2 text-xs uppercase tracking-[0.24em] text-white/42">{card.label}</p>
                  <CardTitle className="mt-2">{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-7 text-white/72">
                  <p>{card.text}</p>
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
                  <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Open the workspace or inspect live order review.</h2>
                  <p className="mt-4 max-w-3xl text-base leading-8 text-white/68">
                    Start with the dashboard to see workspace signals, or inspect the review surface to understand exceptions and approvals in action.
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
