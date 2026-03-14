"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Bot, FileSearch, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { marketingOrderReviewHref } from "@/components/marketing/marketing-site-data";
import { WorkflowHeroVisual } from "@/components/marketing/visuals/workflow-hero-visual";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { SiteFooter } from "@/components/marketing/site-footer";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
};

const workflowStages = [
  { icon: Mail, title: "Intake", subtitle: "Shared mailbox capture and uploads land in one queue.", texts: ["Microsoft 365 shared inboxes and Gmail routing aliases connect securely. Every inbound PO and file becomes a structured draft with source evidence attached.", "Manual uploads are supported for edge cases, onboarding, and legacy flows. Nothing gets lost between personal inboxes."] },
  { icon: Bot, title: "Extract", subtitle: "Line-level mapping with clear confidence scoring.", texts: ["Requested SKUs, quantities, references, and shipping details are parsed into a draft order. Confidence gaps are flagged in context to prevent downstream rework.", "Each extracted field carries source evidence so reviewers can trace any value back to the original document."] },
  { icon: FileSearch, title: "Review", subtitle: "Exceptions surface to the right reviewer with evidence.", texts: ["Reason codes define what changed and why. Approval chains make responsibility explicit and keep audit trails intact without introducing bureaucracy.", "Reviewers see mapped lines, exceptions, and source evidence in one surface without reconstructing context from email threads."] },
  { icon: CheckCircle, title: "Approve", subtitle: "Human approvals stay in control before ERP release.", texts: ["Once exceptions are resolved and approvals satisfied, the order carries notes and context forward so downstream teams can trust it.", "Export adapters map approved drafts to your ERP format. Retry logic and diagnostics prevent silent failures."] },
];

const evidenceCards = [
  { label: "Evidence stays attached", title: "Reviewers never lose the original context", text: "Source files and mapping evidence remain next to the line so reviewers do not chase details across inboxes. Every field links back to its source." },
  { label: "Reason codes", title: "Make changes explainable to the business", text: "Every exception resolved carries a reason and approval trail forward so downstream teams trust the order. No more unexplained edits." },
  { label: "Approval chains", title: "Human-controlled before export", text: "The workflow clarifies who signs off and when, without turning approvals into bureaucracy. Chains are configurable per workspace." },
];

export default function WorkflowPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="starfield" />
      <div className="pointer-events-none absolute inset-0 grid-glow opacity-60" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <MarketingHeader />

        <section className="flex flex-col items-center py-12 text-center lg:py-16">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl">
            <Badge variant="violet">Workflow</Badge>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              From shared mailbox capture to <span className="text-gradient">ERP-ready release.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-9 text-white/66">
              The workflow is simple: capture and structure inbound orders, surface exceptions with evidence, keep approvals explicit, and release cleaner drafts downstream. It is designed to be explainable to operators and leaders.
            </p>
          </motion.div>
        </section>

        <section>
          <WorkflowHeroVisual />
        </section>

        <section className="mt-20 grid gap-6 lg:grid-cols-3">
          {evidenceCards.map((card, index) => (
            <motion.div key={card.label} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.08 }}>
              <div className="h-full rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-white/42">{card.label}</p>
                <p className="mt-3 text-base font-semibold text-white">{card.title}</p>
                <p className="mt-3 text-sm leading-7 text-white/72">{card.text}</p>
              </div>
            </motion.div>
          ))}
        </section>

        <section className="mt-20">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="max-w-3xl">
            <Badge>Four stages</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Each stage adds structure without adding complexity.
            </h2>
            <p className="mt-4 text-base leading-8 text-white/68">
              The workflow moves orders through four clear stages. Each stage adds confidence and evidence so the next team in the chain can trust the output.
            </p>
          </motion.div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {workflowStages.map((stage, index) => (
              <motion.div key={stage.title} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.08 }}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan-200"><stage.icon className="size-5" /></div>
                    <CardTitle className="mt-4">{stage.title}</CardTitle>
                    <CardDescription>{stage.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm leading-7 text-white/72">
                    {stage.texts.map((t, i) => <p key={i}>{t}</p>)}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
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
