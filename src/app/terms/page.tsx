import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { marketingOrderReviewHref } from "@/components/marketing/marketing-site-data";

export default function TermsPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-glow opacity-60" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <section className="max-w-3xl space-y-5">
          <Badge>Terms and Conditions</Badge>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            The terms governing your use of OrderPilot.
          </h1>
          <p className="text-base leading-8 text-white/70">
            These Terms describe the service scope, acceptable use, payment and billing, data handling, and limitations of liability. They are written for real operations and procurement processes.
          </p>
        </section>

        <section className="mt-16">
          <div className="panel rounded-[32px] px-6 py-8 sm:px-8 sm:py-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <Badge>Next step</Badge>
                <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Open the workspace or inspect live order review.</h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-white/68">
                  Start with the dashboard to see workspace signals, or inspect the review surface to understand exceptions and approvals in action.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button asChild size="lg"><Link href="/dashboard">Open dashboard</Link></Button>
                <Button asChild size="lg" variant="secondary"><Link href={marketingOrderReviewHref}>Inspect order review</Link></Button>
              </div>
            </div>
          </div>
        </section>


        <section className="mt-14 space-y-6">

          <Card>
            <CardHeader>
              <CardTitle>Service scope</CardTitle>
              <CardDescription>Intake, review, approvals, and export readiness.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>OrderPilot provides a workspace-bound application for capturing inbound orders, reviewing exceptions, tracking approvals, and preparing ERP-ready drafts.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acceptable use</CardTitle>
              <CardDescription>No misuse, unauthorized access, or disallowed data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>Customers agree not to misuse the service, attempt unauthorized access, or upload prohibited content. Customers are responsible for the accuracy of operational data entered into the system.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment and billing</CardTitle>
              <CardDescription>Subscriptions, invoices, and tax responsibilities.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>Subscriptions are billed according to selected plans. Taxes and duties are the customer&#39;s responsibility. Failures to pay may result in suspension after reasonable notice.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data handling</CardTitle>
              <CardDescription>Security, retention, and export operations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>We maintain reasonable security controls and audit trails. Export adapters operate within configured destinations; customers are responsible for downstream accuracy.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
              <CardDescription>Reasonable efforts; maintenance windows and incidents.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>We use commercially reasonable efforts to provide availability. Maintenance and incidents are communicated through appropriate channels with recovery steps and diagnostics.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Liability</CardTitle>
              <CardDescription>Limitations, disclaimers, and indemnities.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>To the extent permitted by law, liability is limited. The service is provided &quot;as is&quot; for operational use, with no guarantees of specific business outcomes. Customers indemnify OrderPilot against misuse or unauthorized use.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Updates</CardTitle>
              <CardDescription>Changes to these terms.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>We may update these terms to reflect service changes. Material updates will be communicated through appropriate channels with effective dates.</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
