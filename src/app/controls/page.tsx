"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Eye, FileCheck, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { controlPillars, marketingOrderReviewHref } from "@/components/marketing/marketing-site-data";
import { ErpMappingDiagram } from "@/components/marketing/visuals/erp-mapping-diagram";
import { AnimatedConnectors } from "@/components/marketing/animated-connectors";
import { ScreenshotFrame } from "@/components/marketing/visuals/screenshot-frame";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { SiteFooter } from "@/components/marketing/site-footer";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
};

const controlCards = [
  { icon: Eye, title: "Audit trails", subtitle: "Changes and approvals remain visible.", text: "We preserve who changed what and why so leaders can defend the workflow decisions. Every action is timestamped and attributed to a specific team member." },
  { icon: Layers, title: "Staged controls", subtitle: "Adopt depth without risking operations.", text: "Teams step into deeper approvals or ERP release when they are ready, not before. Start with inbox visibility and graduate to full export control at your own pace." },
  { icon: FileCheck, title: "Export diagnostics", subtitle: "Prevent silent failures downstream.", text: "We log export attempts and outcomes to catch issues early and reduce rework. Failed exports surface immediately with actionable context for the operator." },
];

const rolloutPhases = [
  { phase: "Phase 1", title: "Mailbox visibility", text: "Connect shared inboxes and see inbound demand in one queue. No ERP changes, no approval complexity. Just visibility into what is arriving and how it looks as a structured draft." },
  { phase: "Phase 2", title: "Reviewer workflow", text: "Enable exception routing and approval chains. Reviewers work from one surface with evidence attached. Reason codes make every change explainable to the business." },
  { phase: "Phase 3", title: "ERP handoff", text: "Configure export adapters for NetSuite, SAP, or webhook destinations. Approved orders carry context forward and map cleanly to downstream systems with retry logic and diagnostics." },
];

export default function ControlsPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="starfield" />
      <div className="pointer-events-none absolute inset-0 grid-glow opacity-60" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <MarketingHeader />

        <section className="flex flex-col items-center py-12 text-center lg:py-16">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl">
            <Badge variant="success">Controls</Badge>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Keep approvals visible and rollout <span className="text-gradient">staged without losing control.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-9 text-white/66">
              OrderPilot is built for operations, not demos. Approvals are explicit, changes are evidence-backed, and rollout is staged so leaders can say yes without betting the desk on a big-bang change.
            </p>
          </motion.div>
        </section>

        <section>
          <ErpMappingDiagram />
        </section>

        <AnimatedConnectors className="mt-10" />

        <section className="mt-14 grid gap-4 lg:grid-cols-3">
          {controlCards.map((card, index) => (
            <motion.div key={card.title} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.08 }}>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan-200"><card.icon className="size-5" /></div>
                  <CardTitle className="mt-4">{card.title}</CardTitle>
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
            <Badge variant="violet">Control pillars</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Approvals remain human-controlled with reason codes and required roles.
            </h2>
            <p className="mt-4 text-base leading-8 text-white/68">
              Audit trails carry decisions, notes, and approvals forward to release. Every control pillar is designed to make the workflow defensible without making it slow.
            </p>
          </motion.div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {controlPillars.map((pillar, index) => (
              <motion.div key={pillar.title} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.08 }}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>{pillar.title}</CardTitle>
                    <CardDescription className="text-sm leading-7 text-white/70">{pillar.text}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm leading-7 text-white/72">
                    <p>Approvals remain human-controlled with reason codes and required roles.</p>
                    <p>Audit trails carry decisions, notes, and approvals forward to release.</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="max-w-3xl">
            <Badge>Staged rollout</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Start with visibility. Graduate into deeper control.
            </h2>
            <p className="mt-4 text-base leading-8 text-white/68">
              Teams adopt the workflow in phases that match their comfort and volume. It is not a risky overnight process change. Each phase delivers standalone value.
            </p>
          </motion.div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {rolloutPhases.map((phase, index) => (
              <motion.div key={phase.phase} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.08 }}>
                <div className="h-full rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">{phase.phase}</p>
                  <p className="mt-3 text-base font-semibold text-white">{phase.title}</p>
                  <p className="mt-3 text-sm leading-7 text-white/72">{phase.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <ScreenshotFrame title="Export readiness overview" lines={["Adapter - NetSuite REST", "Last export - Jun 12, 14:22", "Status - Healthy", "Retries - 0 pending", "Diagnostics - All clear"]} accent="emerald" />
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
