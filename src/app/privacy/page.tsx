import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { marketingOrderReviewHref } from "@/components/marketing/marketing-site-data";

export default function PrivacyPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-glow opacity-60" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <section className="max-w-3xl space-y-5">
          <Badge>Privacy Policy</Badge>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            How OrderPilot handles customer and operator data.
          </h1>
          <p className="text-base leading-8 text-white/70">
            This Privacy Policy explains what data we collect, how we use and protect it, and the rights users have regarding their information. It reflects the operational nature of OrderPilot and the systems distributors already run.
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
              <CardTitle>Scope</CardTitle>
              <CardDescription>Workspace, member, mailbox, and order data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>OrderPilot processes data associated with your workspace, team members, and connected mailboxes. This includes inbound order emails and attachments, structured order drafts, approval history, notes, and export diagnostics.</p>
              <p>We do not sell personal data. Access is restricted based on workspace roles and configured integrations.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Collection</CardTitle>
              <CardDescription>Sources: shared inboxes, uploads, and operator input.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>Data originates from mailbox providers (Microsoft 365, Gmail), manual uploads, and operator actions such as notes, approvals, and workflow settings.</p>
              <p>We store structured representations of orders and related events in a workspace-bound database for operational continuity and auditability.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Use</CardTitle>
              <CardDescription>Operating the intake, review, and release workflow.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>Data is used to surface inbox coverage, queue health, exception review, approvals, and ERP-ready release. It enables operators to work faster without losing control or context.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sharing</CardTitle>
              <CardDescription>Authorized downstream systems and providers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>Approved orders may be sent to configured ERP systems or webhook destinations. Mailbox providers and billing platforms receive the minimum data necessary to operate their integrations.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Access controls, encryption, and audit trails.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>OrderPilot uses role-based access, transport encryption, and stored audits of approvals and changes to maintain accountability and reduce risk.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Retention</CardTitle>
              <CardDescription>Workspace-bound retention supporting auditability.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>Operational records are retained to support audit and continuity. Customers can request removal of specific personal data subject to regulatory requirements and operational constraints.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rights</CardTitle>
              <CardDescription>Access, correction, deletion, and portability.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/72">
              <p>Users may request access to their data, corrections, and deletion where applicable. We provide reasonable portability of operational records upon authorized requests.</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
