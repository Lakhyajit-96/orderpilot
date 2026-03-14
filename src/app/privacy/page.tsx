"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Eye, Database, Share2, Lock, Clock, UserCheck, Mail, CheckCircle2 } from "lucide-react";
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

const privacySections = [
  { icon: Eye, title: "Scope", subtitle: "Workspace, member, mailbox, and order data.", texts: ["OrderPilot processes data associated with your workspace, team members, and connected mailboxes. This includes inbound order emails and attachments, structured order drafts, approval history, notes, and export diagnostics.", "We do not sell personal data. Access is restricted based on workspace roles and configured integrations."] },
  { icon: Database, title: "Collection", subtitle: "Sources: shared inboxes, uploads, and operator input.", texts: ["Data originates from mailbox providers (Microsoft 365, Gmail), manual uploads, and operator actions such as notes, approvals, and workflow settings.", "We store structured representations of orders and related events in a workspace-bound database for operational continuity and auditability."] },
  { icon: Shield, title: "Use", subtitle: "Operating the intake, review, and release workflow.", texts: ["Data is used to surface inbox coverage, queue health, exception review, approvals, and ERP-ready release. It enables operators to work faster without losing control or context.", "We use aggregated, anonymized data to improve service quality. Individual order data is never shared outside of configured integrations."] },
  { icon: Share2, title: "Sharing", subtitle: "Authorized downstream systems and providers.", texts: ["Approved orders may be sent to configured ERP systems or webhook destinations. Mailbox providers and billing platforms receive the minimum data necessary to operate their integrations.", "We do not share operational data with third parties for advertising or marketing purposes."] },
  { icon: Lock, title: "Security", subtitle: "Access controls, encryption, and audit trails.", texts: ["OrderPilot uses role-based access, transport encryption, and stored audits of approvals and changes to maintain accountability and reduce risk.", "Integration credentials are encrypted at rest. Token rotation events are logged and visible to administrators."] },
  { icon: Clock, title: "Retention", subtitle: "Workspace-bound retention supporting auditability.", texts: ["Operational records are retained to support audit and continuity. Customers can request removal of specific personal data subject to regulatory requirements and operational constraints.", "Retention periods are designed to balance operational needs with privacy expectations."] },
  { icon: UserCheck, title: "Rights", subtitle: "Access, correction, deletion, and portability.", texts: ["Users may request access to their data, corrections, and deletion where applicable. We provide reasonable portability of operational records upon authorized requests.", "Rights requests are processed within 30 days and tracked for compliance purposes."] },
  { icon: Mail, title: "Requests", subtitle: "How to contact us about privacy.", texts: ["For privacy requests, contact privacy@orderpilot.ai. We respond within a reasonable timeframe and provide status updates on applicable requests.", "All privacy requests are logged and tracked to ensure timely resolution and regulatory compliance."] },
];

const dataLifecycle = [
  { phase: "Ingest", description: "Order emails and attachments are received from connected mailboxes. Only message metadata and attachment content relevant to order processing are retained.", commitments: ["No email body content stored beyond order extraction", "Attachments processed in memory where possible", "Source files retained only for reviewer evidence"] },
  { phase: "Process", description: "Structured extraction creates order drafts with field-level confidence. Processing happens within your workspace boundary and is never shared across workspaces.", commitments: ["Workspace-isolated processing pipeline", "No cross-tenant data mixing", "Extraction models do not train on customer data"] },
  { phase: "Store", description: "Order drafts, approval history, notes, and export diagnostics are stored in workspace-scoped databases with encryption at rest.", commitments: ["AES-256 encryption at rest", "Role-based access enforcement", "Audit trail for all data access events"] },
  { phase: "Export", description: "Approved orders are sent to configured ERP endpoints. Export payloads contain only the mapped fields and context necessary for downstream processing.", commitments: ["Minimum necessary data in export payloads", "Request and response logging for diagnostics", "No credential exposure in export logs"] },
];

const privacyPrinciples = [
  { title: "Data minimization", detail: "We collect and retain only the data necessary to operate the intake, review, and export workflow. We do not harvest data for advertising or unrelated purposes." },
  { title: "Workspace isolation", detail: "Every workspace is a separate data boundary. Team members in one workspace cannot access orders, connections, or history from another workspace." },
  { title: "Transparent processing", detail: "Operators can see exactly what data was extracted, what confidence scores were assigned, and what evidence supports each field in the order draft." },
];

export default function PrivacyPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="starfield" />
      <div className="pointer-events-none absolute inset-0 grid-glow opacity-60" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <MarketingHeader />

        <section className="flex flex-col items-center py-12 text-center lg:py-16">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl">
            <Badge>Privacy Policy</Badge>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              How OrderPilot handles <span className="text-gradient">customer and operator data.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-9 text-white/66">
              This Privacy Policy explains what data we collect, how we use and protect it, and the rights users have regarding their information. It reflects the operational nature of OrderPilot and the systems distributors already run.
            </p>
          </motion.div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {privacyPrinciples.map((principle, index) => (
            <motion.div key={principle.title} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.08 }}>
              <div className="h-full rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(114,228,255,0.06),rgba(94,234,212,0.04))] p-5">
                <p className="font-display text-lg font-semibold text-white">{principle.title}</p>
                <p className="mt-3 text-sm leading-7 text-white/68">{principle.detail}</p>
              </div>
            </motion.div>
          ))}
        </section>

        <section className="mt-14 space-y-6">
          {privacySections.map((section, index) => (
            <motion.div key={section.title} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.05 }}>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan-200"><section.icon className="size-5" /></div>
                    <div>
                      <CardTitle>{section.title}</CardTitle>
                      <CardDescription>{section.subtitle}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm leading-7 text-white/72">
                  {section.texts.map((t, i) => <p key={i}>{t}</p>)}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="mt-20">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="max-w-3xl">
            <Badge variant="violet">Data lifecycle</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              How your data moves through each stage of the workflow.
            </h2>
            <p className="mt-4 text-base leading-8 text-white/68">
              From initial email ingestion through structured processing and secure export, each phase has defined data handling practices and privacy commitments.
            </p>
          </motion.div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {dataLifecycle.map((phase, index) => (
              <motion.div key={phase.phase} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.08 }}>
                <div className="h-full rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">{phase.phase}</p>
                  <p className="mt-3 text-sm leading-7 text-white/72">{phase.description}</p>
                  <ul className="mt-4 space-y-2">
                    {phase.commitments.map((c) => (
                      <li key={c} className="flex items-center gap-3 text-sm text-white/66">
                        <CheckCircle2 className="size-3.5 shrink-0 text-emerald-300" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
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
