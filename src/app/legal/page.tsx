import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function LegalPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-glow opacity-60" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <section className="max-w-3xl space-y-5">
          <Badge>Legal</Badge>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Compliance, security, and integration responsibilities.
          </h1>
          <p className="text-base leading-8 text-white/70">
            This page summarizes legal posture and obligations around mailbox integrations, ERP handoffs, billing, and data security applicable to OrderPilot customers.
          </p>
        </section>

        <section className="mt-10">
          <Image
            src="/assets/marketing/legal-compliance.svg"
            alt="Legal and compliance screenshot"
            width={1200}
            height={480}
            className="rounded-[26px] border border-white/10"
          />
        </section>

        <section className="mt-14 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance</CardTitle>
              <CardDescription>Regulatory awareness and audit support.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>OrderPilot supports audit trails for approvals, changes, and export actions. Customers remain responsible for compliance obligations specific to their jurisdiction and sector.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mailbox integrations</CardTitle>
              <CardDescription>OAuth, tokens, and webhook deliveries.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>Mailbox access uses provider OAuth flows and tokens. Workspace administrators control which inboxes are connected and can revoke tokens. Webhook deliveries are authenticated and logged.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ERP handoff</CardTitle>
              <CardDescription>Adapters, credentials, and data mapping accuracy.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>Export adapters send approved order payloads to configured destinations. Customers manage endpoint credentials and mappings; OrderPilot logs request and response bodies for operational diagnostics.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Access controls, encryption, and incident response.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>Role-based access governs who can view and act on orders. Transport encryption protects data in motion. We follow reasonable incident response practices to triage and communicate issues.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Export logs</CardTitle>
              <CardDescription>Operational diagnostics for downstream handoff.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>We maintain export attempt logs and outcomes for troubleshooting and accountability. Logs are workspace-bound and accessible to authorized operators.</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
