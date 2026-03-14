"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Lock, KeyRound, Eye, FileWarning, RefreshCw, Server, Globe, Fingerprint, CheckCircle2 } from "lucide-react";
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

const securityPillars = [
  { icon: Lock, title: "OAuth and token rotation", subtitle: "Provider OAuth, token refresh, and revocation visibility.", texts: ["Mailbox credentials use provider OAuth flows. Rotation and refresh events are visible to administrators, with revocation controls in Settings.", "Tokens are never stored in plaintext. Each refresh cycle is logged so your team can audit access patterns and revoke connections instantly."] },
  { icon: ShieldCheck, title: "Webhook verification", subtitle: "Signature checks, secrets, and logged deliveries.", texts: ["Inbound provider notifications and mail events are authenticated. Deliveries are captured with minimal metadata to support diagnostics without exposing sensitive payloads.", "Every webhook delivery is signature-verified against a rotating secret. Failed verifications are logged and surfaced to workspace administrators."] },
  { icon: Eye, title: "Data retention and boundaries", subtitle: "Workspace-bound retention with audit trails.", texts: ["Operational records remain scoped to the workspace. Approval decisions, notes, and export diagnostics maintain accountability while respecting retention policies.", "Cross-workspace data isolation ensures that each team only sees their own orders, connections, and operational history."] },
  { icon: FileWarning, title: "Incident response and auditability", subtitle: "Posture focused on measurable recovery and transparency.", texts: ["We prioritize fast, transparent response for incidents. Audit trails and export diagnostics reduce risk of silent failures and support clean recovery.", "Every approval, status change, and export attempt is logged with timestamps and actor identity for full traceability."] },
];

const securityFeatures = [
  { icon: Fingerprint, title: "Role-based access", text: "Workspace roles (Owner, Admin, Operator, Reviewer) govern who can view, edit, approve, and export orders. Permissions are enforced at the API layer." },
  { icon: RefreshCw, title: "Token lifecycle management", text: "Administrators can confirm rotation events and revoke access in Settings. Token health is monitored and surfaced on the dashboard." },
  { icon: Server, title: "Transport encryption", text: "All data in transit uses TLS 1.2+. Mailbox sync, webhook deliveries, and ERP exports are encrypted end-to-end." },
  { icon: Globe, title: "API security", text: "Rate limiting, request signing, and session validation protect all API endpoints. Suspicious activity triggers automatic lockout." },
  { icon: KeyRound, title: "Secret management", text: "Integration credentials are encrypted at rest using AES-256. Secrets are never logged, displayed, or included in export payloads." },
  { icon: Lock, title: "Compliance readiness", text: "Audit trails, retention boundaries, and export diagnostics support SOC 2, GDPR, and industry-specific compliance requirements." },
];

const complianceChecklist = [
  { standard: "SOC 2 Type II", status: "Aligned", areas: ["Access controls", "Change management", "Monitoring and logging", "Incident response procedures"] },
  { standard: "GDPR", status: "Compliant", areas: ["Data minimization", "Right to erasure", "Data portability", "Processing records"] },
  { standard: "ISO 27001", status: "Framework aligned", areas: ["Information security policy", "Asset management", "Cryptographic controls", "Supplier relationships"] },
];

const securityTimeline = [
  { event: "Connection established", detail: "OAuth consent flow completes. Provider tokens are encrypted and stored. Initial sync begins within seconds." },
  { event: "Ongoing token rotation", detail: "Refresh tokens are rotated automatically on provider-defined schedules. Each rotation is logged with timestamp and outcome." },
  { event: "Webhook delivery verified", detail: "Inbound notifications are signature-checked against the workspace secret. Failed verifications trigger alerts to administrators." },
  { event: "Data processing scoped", detail: "Order data stays within workspace boundaries. Cross-workspace access is architecturally prevented at the database layer." },
  { event: "Export with audit trail", detail: "Every export attempt logs the request body, response, timestamp, and operator identity. Failed exports surface immediately." },
];

export default function SecurityPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="starfield" />
      <div className="pointer-events-none absolute inset-0 grid-glow opacity-60" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <MarketingHeader />

        <section className="flex flex-col items-center py-12 text-center lg:py-16">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl">
            <Badge>Security and Data Handling</Badge>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Practical security for <span className="text-gradient">mailbox OAuth, retention, and auditability.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-9 text-white/66">
              OrderPilot focuses on the controls operations leaders care about: secure OAuth and token rotation, webhook verification, clear data retention across workspace boundaries, and incident response practices that preserve trust.
            </p>
          </motion.div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          {securityPillars.map((pillar, index) => (
            <motion.div key={pillar.title} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.08 }}>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan-200"><pillar.icon className="size-5" /></div>
                  <CardTitle className="mt-4">{pillar.title}</CardTitle>
                  <CardDescription>{pillar.subtitle}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm leading-7 text-white/72">
                  {pillar.texts.map((t, i) => <p key={i}>{t}</p>)}
                  <div className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/42">{pillar.title}</p>
                    <p className="mt-3 text-sm text-white/72">{pillar.subtitle}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="mt-20">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="max-w-3xl">
            <Badge variant="success">Security lifecycle</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              How data flows through the security boundary from connection to export.
            </h2>
            <p className="mt-4 text-base leading-8 text-white/68">
              Every stage of the data lifecycle has explicit security controls. From the initial OAuth handshake through to the final ERP export, each step is logged, scoped, and auditable.
            </p>
          </motion.div>
          <div className="mt-8 space-y-3">
            {securityTimeline.map((item, index) => (
              <motion.div key={item.event} {...fadeUp} transition={{ duration: 0.4, delay: index * 0.06 }}>
                <div className="flex gap-5 rounded-[20px] border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-emerald-300/20 bg-emerald-300/10 text-emerald-300">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">{item.event}</p>
                    <p className="mt-1 text-sm leading-7 text-white/66">{item.detail}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="max-w-3xl">
            <Badge variant="violet">Compliance posture</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Framework alignment for teams with regulatory obligations.
            </h2>
            <p className="mt-4 text-base leading-8 text-white/68">
              OrderPilot maintains alignment with industry security frameworks. Each standard maps to specific controls built into the platform architecture.
            </p>
          </motion.div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {complianceChecklist.map((item, index) => (
              <motion.div key={item.standard} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.08 }}>
                <div className="h-full rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(114,228,255,0.05),rgba(94,234,212,0.04))] p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-lg font-semibold text-white">{item.standard}</p>
                    <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">{item.status}</span>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {item.areas.map((area) => (
                      <li key={area} className="flex items-center gap-3 text-sm text-white/72">
                        <CheckCircle2 className="size-3.5 shrink-0 text-emerald-300" />
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="max-w-3xl">
            <Badge variant="violet">Security features</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Defense in depth across every layer of the workflow.
            </h2>
            <p className="mt-4 text-base leading-8 text-white/68">
              From role-based access at the workspace level to encrypted secrets at rest, every layer is designed to protect your operational data without slowing down the team.
            </p>
          </motion.div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {securityFeatures.map((item, index) => (
              <motion.div key={item.title} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.06 }}>
                <div className="h-full rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-cyan-200"><item.icon className="size-4" /></div>
                  <p className="mt-4 text-base font-semibold text-white">{item.title}</p>
                  <p className="mt-3 text-sm leading-7 text-white/68">{item.text}</p>
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
