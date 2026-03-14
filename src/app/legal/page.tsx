"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Scale, KeyRound, Truck, Shield, FileText, BookOpen, AlertCircle } from "lucide-react";
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

const legalSections = [
  { icon: Scale, title: "Compliance", subtitle: "Regulatory awareness and audit support.", texts: ["OrderPilot supports audit trails for approvals, changes, and export actions. Customers remain responsible for compliance obligations specific to their jurisdiction and sector.", "We maintain records of operational decisions, approval chains, and export diagnostics to support internal and external audit requirements.", "Our platform is designed to align with SOC 2, GDPR, and industry-specific compliance frameworks where applicable."] },
  { icon: KeyRound, title: "Mailbox integrations", subtitle: "OAuth, tokens, and webhook deliveries.", texts: ["Mailbox access uses provider OAuth flows and tokens. Workspace administrators control which inboxes are connected and can revoke tokens. Webhook deliveries are authenticated and logged.", "Token rotation events are visible to administrators. Integration credentials are encrypted at rest and never exposed in logs or API responses.", "We support Microsoft 365 and Gmail OAuth flows with consent-based authorization that respects your tenant policies."] },
  { icon: Truck, title: "ERP handoff", subtitle: "Adapters, credentials, and data mapping accuracy.", texts: ["Export adapters send approved order payloads to configured destinations. Customers manage endpoint credentials and mappings; OrderPilot logs request and response bodies for operational diagnostics.", "Supported adapters include NetSuite REST, SAP, and generic webhook destinations. Retry logic handles transient failures automatically.", "Customers are responsible for verifying that export mappings produce accurate data in their downstream systems."] },
  { icon: Shield, title: "Security", subtitle: "Access controls, encryption, and incident response.", texts: ["Role-based access governs who can view and act on orders. Transport encryption protects data in motion. We follow reasonable incident response practices to triage and communicate issues.", "Workspace isolation ensures that each team only sees their own operational data. Cross-workspace data access is not possible.", "We maintain incident response procedures with clear escalation paths and communication timelines."] },
  { icon: FileText, title: "Export logs", subtitle: "Operational diagnostics for downstream handoff.", texts: ["We maintain export attempt logs and outcomes for troubleshooting and accountability. Logs are workspace-bound and accessible to authorized operators.", "Export diagnostics include request payloads, response codes, timestamps, and retry history to support fast resolution of integration issues.", "Log retention follows workspace-level policies and supports audit requirements."] },
];

const documentIndex = [
  { icon: BookOpen, title: "Terms of Service", href: "/terms", description: "Service scope, acceptable use, payment, liability, and update policies governing your use of OrderPilot." },
  { icon: Shield, title: "Privacy Policy", href: "/privacy", description: "How we collect, use, store, and protect customer and operator data across workspace boundaries." },
  { icon: Scale, title: "Security Overview", href: "/security", description: "OAuth practices, token rotation, webhook verification, data retention, and incident response posture." },
];

const customerObligations = [
  { title: "Data accuracy", detail: "Customers are responsible for the accuracy of operational data entered into the system, including SKU mappings, customer references, and shipping details." },
  { title: "Access management", detail: "Workspace administrators manage member access, role assignments, and mailbox connections. Timely removal of departed team members is the customer's responsibility." },
  { title: "Export verification", detail: "Customers should verify that export adapter mappings produce accurate data in downstream ERP systems before relying on automated handoff at scale." },
  { title: "Compliance obligations", detail: "Industry-specific and jurisdiction-specific compliance obligations remain the customer's responsibility. OrderPilot provides audit trails and controls to support these requirements." },
];

export default function LegalPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="starfield" />
      <div className="pointer-events-none absolute inset-0 grid-glow opacity-60" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <MarketingHeader />

        <section className="flex flex-col items-center py-12 text-center lg:py-16">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl">
            <Badge>Legal</Badge>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Compliance, security, and <span className="text-gradient">integration responsibilities.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-9 text-white/66">
              This page summarizes legal posture and obligations around mailbox integrations, ERP handoffs, billing, and data security applicable to OrderPilot customers.
            </p>
          </motion.div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {documentIndex.map((doc, index) => (
            <motion.div key={doc.title} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.08 }}>
              <Link href={doc.href} className="group block h-full">
                <div className="h-full rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(114,228,255,0.06),rgba(124,92,255,0.04))] p-5 transition-colors group-hover:border-cyan-300/20">
                  <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan-200"><doc.icon className="size-5" /></div>
                  <p className="mt-4 text-lg font-semibold text-white group-hover:text-cyan-200 transition-colors">{doc.title}</p>
                  <p className="mt-2 text-sm leading-7 text-white/68">{doc.description}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-cyan-200">
                    Read document <ArrowRight className="size-3.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </section>

        <section className="mt-14 space-y-6">
          {legalSections.map((section, index) => (
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
            <Badge variant="violet">Customer responsibilities</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              What customers own in the shared responsibility model.
            </h2>
            <p className="mt-4 text-base leading-8 text-white/68">
              OrderPilot provides the platform, controls, and audit infrastructure. Customers retain responsibility for data accuracy, access management, and compliance obligations specific to their operations.
            </p>
          </motion.div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {customerObligations.map((item, index) => (
              <motion.div key={item.title} {...fadeUp} transition={{ duration: 0.45, delay: index * 0.06 }}>
                <div className="flex h-full gap-4 rounded-[20px] border border-white/10 bg-white/[0.04] p-5">
                  <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-200" />
                  <div>
                    <p className="text-base font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-white/68">{item.detail}</p>
                  </div>
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
