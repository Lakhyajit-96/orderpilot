"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Eye, FileCheck, Layers, ShieldCheck, Lock, UserCheck, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { controlPillars, marketingOrderReviewHref } from "@/components/marketing/marketing-site-data";
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

const controlMatrix = [
  { control: "Order approval gates", description: "Every order passes through explicit approval before export. No order reaches your ERP without human sign-off from an authorized reviewer.", risk: "Prevents unapproved orders from entering downstream systems." },
  { control: "Reason code requirements", description: "Changes to extracted fields require a reason code. This creates an auditable decision trail that leaders can review and defend.", risk: "Eliminates unexplained edits and silent data changes." },
  { control: "Role-based permissions", description: "Operators, reviewers, and administrators have distinct access levels. Export and approval actions are restricted to authorized roles.", risk: "Prevents unauthorized actions on sensitive order data." },
  { control: "Export retry logging", description: "Failed exports are logged with full context including request payload, response, and error details. Retry logic handles transient failures.", risk: "Prevents silent downstream failures and data loss." },
];

const governanceFeatures = [
  { icon: ShieldCheck, title: "Approval chain enforcement", text: "Configure who must approve orders before export. Chains can be simple single-approver or multi-level based on order value or exception type." },
  { icon: Lock, title: "Workspace isolation", text: "Each workspace operates as an independent control boundary. Teams in one workspace cannot view or act on orders from another." },
  { icon: UserCheck, title: "Member role governance", text: "Workspace owners assign roles that determine what each team member can see and do. Role changes are logged and visible to administrators." },
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

        <section className="mt-4 grid gap-4 lg:grid-cols-3">
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

        <section className="mt-20">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="max-w-3xl">
            <Badge variant="success">Control matrix</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Specific controls that protect your order workflow end to end.
            </h2>
            <p className="mt-4 text-base leading-8 text-white/68">
              Each control addresses a specific operational risk. Together they create a defensible workflow that leaders can explain to auditors, compliance teams, and executive stakeholders.
            </p>
          </motion.div>
          <div className="mt-8 space-y-3">
            {controlMatrix.map((item, index) => (
              <motion.div key={item.control} {...fadeUp} transition={{ duration: 0.4, delay: index * 0.06 }}>
                <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-white">{item.control}</p>
                      <p className="mt-2 text-sm leading-7 text-white/68">{item.description}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-300/10 bg-emerald-300/5 px-3 py-2">
                    <CheckCircle2 className="size-3.5 shrink-0 text-emerald-300" />
                    <span className="text-xs text-emerald-200">{item.risk}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="max-w-3xl">
            <Badge>Governance features</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Built-in governance that scales with your team.
            </h2>
          </motion.div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {governanceFeatures.map((feature, index) => (
              <motion.div key={feature.title} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.08 }}>
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan-200"><feature.icon className="size-5" /></div>
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-7 text-white/72">
                    <p>{feature.text}</p>
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
