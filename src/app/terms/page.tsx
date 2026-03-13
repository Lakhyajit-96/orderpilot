"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileText, ShieldCheck, CreditCard, Database, Server, AlertTriangle, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { marketingOrderReviewHref } from "@/components/marketing/marketing-site-data";
import { AnimatedConnectors } from "@/components/marketing/animated-connectors";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { SiteFooter } from "@/components/marketing/site-footer";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
};

const termsSections = [
  { icon: FileText, title: "Service scope", subtitle: "Intake, review, approvals, and export readiness.", texts: ["OrderPilot provides a workspace-bound application for capturing inbound orders, reviewing exceptions, tracking approvals, and preparing ERP-ready drafts.", "The service includes shared mailbox integration, structured draft generation, exception routing, approval workflows, and export adapters for downstream systems.", "Features and capabilities may vary by plan. Refer to the pricing page for current plan details and feature availability."] },
  { icon: ShieldCheck, title: "Acceptable use", subtitle: "No misuse, unauthorized access, or disallowed data.", texts: ["Customers agree not to misuse the service, attempt unauthorized access, or upload prohibited content. Customers are responsible for the accuracy of operational data entered into the system.", "Automated scraping, reverse engineering, and unauthorized API access are prohibited. Workspace administrators are responsible for managing member access and permissions.", "We reserve the right to suspend accounts that violate these terms after reasonable notice and opportunity to cure."] },
  { icon: CreditCard, title: "Payment and billing", subtitle: "Subscriptions, invoices, and tax responsibilities.", texts: ["Subscriptions are billed according to selected plans. Taxes and duties are the customer's responsibility. Failures to pay may result in suspension after reasonable notice.", "Plan changes take effect at the start of the next billing cycle. Downgrades may result in reduced feature access. No refunds are provided for partial billing periods.", "Enterprise customers may negotiate custom billing terms. Contact sales for details on annual contracts and volume pricing."] },
  { icon: Database, title: "Data handling", subtitle: "Security, retention, and export operations.", texts: ["We maintain reasonable security controls and audit trails. Export adapters operate within configured destinations; customers are responsible for downstream accuracy.", "Data is retained according to workspace-level policies. Customers can request data export or deletion subject to regulatory requirements and operational constraints.", "Our data handling practices are described in detail in our Privacy Policy, which forms part of these terms."] },
  { icon: Server, title: "Availability", subtitle: "Reasonable efforts; maintenance windows and incidents.", texts: ["We use commercially reasonable efforts to provide availability. Maintenance and incidents are communicated through appropriate channels with recovery steps and diagnostics.", "Scheduled maintenance windows are communicated in advance. Emergency maintenance may occur without advance notice when required to protect service integrity.", "Enterprise customers may have access to SLA guarantees with defined uptime commitments and remedies."] },
  { icon: AlertTriangle, title: "Liability", subtitle: "Limitations, disclaimers, and indemnities.", texts: ["To the extent permitted by law, liability is limited. The service is provided as-is for operational use, with no guarantees of specific business outcomes.", "Customers indemnify OrderPilot against claims arising from misuse, unauthorized access, or violation of these terms.", "Neither party is liable for indirect, incidental, or consequential damages arising from use of the service."] },
  { icon: RefreshCw, title: "Updates", subtitle: "Changes to these terms.", texts: ["We may update these terms to reflect service changes. Material updates will be communicated through appropriate channels with effective dates.", "Continued use of the service after updates take effect constitutes acceptance of the revised terms.", "We maintain a changelog of material updates for transparency and reference."] },
];

export default function TermsPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="starfield" />
      <div className="pointer-events-none absolute inset-0 grid-glow opacity-60" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <MarketingHeader />

        <section className="flex flex-col items-center py-12 text-center lg:py-16">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mx-auto max-w-3xl">
            <Badge>Terms and Conditions</Badge>
            <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              The terms governing your use of <span className="text-gradient">OrderPilot.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-9 text-white/66">
              These Terms describe the service scope, acceptable use, payment and billing, data handling, and limitations of liability. They are written for real operations and procurement processes.
            </p>
          </motion.div>
        </section>

        <section className="space-y-6">
          {termsSections.map((section, index) => (
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

        <AnimatedConnectors className="mt-12" />

        <section className="mt-14 pb-6">
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
