"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users, FileSearch2, TrendingUp, Inbox, GitBranch, Settings, Plug, Database, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrustLogoStrip } from "@/components/marketing/trust-logo-strip";
import { marketingOrderReviewHref } from "@/components/marketing/marketing-site-data";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { SiteFooter } from "@/components/marketing/site-footer";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
};

const personaCards = [
  { icon: Users, title: "For coordinators", subtitle: "Clear more inbound volume without re-keying or hunting for context.", texts: ["Coordinators work from one queue where every inbound PO and attachment already has a structured draft behind it.", "They can see which lines are confident, which need attention, and what needs to move before the order can be released."] },
  { icon: FileSearch2, title: "For reviewers", subtitle: "Only review lines that actually need judgment.", texts: ["Reviewers see mapped lines, exceptions, and source evidence in one surface. They do not have to reconstruct context from email threads.", "Reason codes and approval chains make it obvious what changed and why, so approvals stay explainable to the rest of the business."] },
  { icon: TrendingUp, title: "For leaders", subtitle: "Prove that the desk is improving throughput without losing control.", texts: ["Leaders can see launch readiness, queue health, and value proof without asking for spreadsheets or hallway updates.", "They can track adoption, review throughput, and ERP-ready handoffs as real operating signals instead of anecdotes."] },
];

const queueCards = [
  { title: "Queue health", subtitle: "See intake pace and review clearance in one view.", text: "Leaders evaluate stability by watching intake throughput, backlog, and ERP-ready release without asking for spreadsheets." },
  { title: "Launch readiness", subtitle: "Track signals that move rollout forward.", text: "Mailbox coverage, approvals policy, and export readiness stay visible so the first rollout feels controlled." },
  { title: "Proof metrics", subtitle: "Show value in operations terms, not vanity usage.", text: "We highlight faster first-pass review, fewer re-entry loops, and cleaner handoff downstream." },
];

const platformCapabilities = [
  { icon: Inbox, title: "Shared mailbox sync", text: "Connect one or more shared inboxes via OAuth. Inbound emails with order attachments are captured automatically and queued for structured extraction." },
  { icon: GitBranch, title: "Exception routing", text: "Low-confidence fields and unmapped SKUs are flagged and routed to the right reviewer. Routing rules are configurable per workspace." },
  { icon: Settings, title: "Approval workflows", text: "Define single or multi-step approval chains. Approvers see full context including source evidence, reviewer notes, and reason codes before signing off." },
  { icon: Plug, title: "ERP export adapters", text: "Pre-built adapters for NetSuite, SAP, and Dynamics 365. Generic webhook and CSV export options for custom integrations." },
  { icon: Database, title: "Structured data model", text: "Every order follows a consistent schema with line items, headers, addresses, and metadata. This structure makes downstream integration predictable and reliable." },
  { icon: BarChart3, title: "Operational analytics", text: "Track intake volume, review throughput, exception rates, and export success. Dashboard signals give leaders visibility without asking for manual reports." },
];

const architectureLayers = [
  { layer: "Ingestion", description: "OAuth-connected mailboxes capture inbound emails and queue attachments for processing. Deduplication logic prevents double-counting forwarded messages." },
  { layer: "Extraction", description: "PDF, spreadsheet, and HTML table parsers generate structured drafts with field-level confidence scores. Unmapped SKUs are flagged for manual resolution." },
  { layer: "Review", description: "Operators and reviewers work from a shared queue. Exception routing, reason codes, and approval chains ensure every decision is traceable and defensible." },
  { layer: "Export", description: "Approved orders map to configured adapters with retry logic, payload logging, and error diagnostics. Failed exports surface immediately for operator attention." },
];

export default function PlatformPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="starfield" />
      <div className="pointer-events-none absolute inset-0 grid-glow opacity-60" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <MarketingHeader />

        <section className="flex flex-col items-center py-12 text-center lg:py-16">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl">
            <Badge>Platform</Badge>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              One workspace for intake, review, and <span className="text-gradient">ERP-ready release.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-9 text-white/66">
              OrderPilot gives distributor operations teams one place to see inbound demand, resolve exceptions, and release ERP-ready orders without stitching together inboxes, spreadsheets, and ad hoc approvals.
            </p>
          </motion.div>
        </section>

        <div>
          <TrustLogoStrip />
        </div>

        <section className="mt-14 grid gap-6 lg:grid-cols-3">
          {personaCards.map((card, index) => (
            <motion.div key={card.title} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.08 }}>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan-200"><card.icon className="size-5" /></div>
                  <CardTitle className="mt-4">{card.title}</CardTitle>
                  <CardDescription className="text-sm leading-7 text-white/70">{card.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm leading-7 text-white/72">
                  {card.texts.map((t, i) => <p key={i}>{t}</p>)}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="mt-14 grid gap-4 lg:grid-cols-3">
          {queueCards.map((card, index) => (
            <motion.div key={card.title} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.08 }}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm leading-7 text-white/72">
                  <p>{card.text}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="mt-20">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="max-w-3xl">
            <Badge variant="violet">Platform capabilities</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Every layer of the order workflow, handled in one workspace.
            </h2>
            <p className="mt-4 text-base leading-8 text-white/68">
              From mailbox sync to ERP export, each capability is designed to eliminate manual work while preserving full operator control and auditability.
            </p>
          </motion.div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {platformCapabilities.map((cap, index) => (
              <motion.div key={cap.title} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.06 }}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan-200"><cap.icon className="size-5" /></div>
                    <CardTitle className="mt-4">{cap.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-7 text-white/72">
                    <p>{cap.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="max-w-3xl">
            <Badge variant="success">Architecture</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Four layers that turn inbound email into ERP-ready output.
            </h2>
          </motion.div>
          <div className="mt-8 grid gap-4 lg:grid-cols-4">
            {architectureLayers.map((item, index) => (
              <motion.div key={item.layer} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.08 }}>
                <div className="h-full rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Layer {index + 1}</p>
                  <p className="mt-3 text-base font-semibold text-white">{item.layer}</p>
                  <p className="mt-3 text-sm leading-7 text-white/72">{item.description}</p>
                </div>
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
