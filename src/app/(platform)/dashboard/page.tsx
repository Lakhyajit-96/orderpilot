import Link from "next/link";
import { ArrowRight, ArrowUpRight, BrainCircuit, CheckCircle2, CircleDashed, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getViewer } from "@/lib/auth";
import {
  buildDashboardLaunchChecklist,
  getDashboardLaunchProgress,
  getNextDashboardLaunchStep,
} from "@/lib/dashboard-checklist-core";
import { getBillingDiagnosticsSnapshot } from "@/lib/billing-diagnostics";
import { getWorkspaceErpConnections } from "@/lib/erp";
import { getWorkspaceInboxConnections } from "@/lib/inbox";
import { activityFeed } from "@/lib/mock-data";
import { getWorkspaceMetrics, getWorkspaceOrders } from "@/lib/orders";

export default async function DashboardPage() {
  const viewer = await getViewer();
  const [workspaceMetrics, workspaceOrders, inboxConnections, erpConnections, billingDiagnostics] = await Promise.all([
    getWorkspaceMetrics(viewer.workspace?.id),
    getWorkspaceOrders(viewer.workspace?.id),
    getWorkspaceInboxConnections(viewer.workspace?.id),
    getWorkspaceErpConnections(viewer.workspace?.id),
    getBillingDiagnosticsSnapshot(viewer.workspace?.id),
  ]);
  const reviewQueue = workspaceOrders.slice(0, 3);
  const latestOrderId = reviewQueue[0]?.id ?? "PO-10482";
  const checklist = buildDashboardLaunchChecklist({
    viewerName: viewer.displayName,
    isAuthenticated: viewer.isAuthenticated,
    workspaceName: viewer.workspace?.name ?? null,
    workspaceRole: viewer.workspace?.role ?? null,
    inboxConnectionCount: inboxConnections.length,
    orderCount: workspaceOrders.length,
    orderStatuses: workspaceOrders.map((order) => order.status),
    erpConnectionCount: erpConnections.length,
    subscriptionPlanKey:
      billingDiagnostics.subscription?.planKey ?? viewer.workspace?.subscription?.planKey ?? null,
    subscriptionStatus:
      billingDiagnostics.subscription?.status ?? viewer.workspace?.subscription?.status ?? null,
  });
  const checklistProgress = getDashboardLaunchProgress(checklist);
  const nextLaunchStep = getNextDashboardLaunchStep(checklist);

  return (
    <div className="min-w-0 space-y-6">
      <section className="panel overflow-hidden rounded-[28px] p-6 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Badge>Order desk command center</Badge>
            <h1 className="mt-4 break-words text-3xl font-semibold tracking-tight text-white lg:text-5xl">
              Move from inbox chaos to ERP-ready order flow.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-white/66">
              OrderPilot extracts structured order data, flags exceptions with context, and gives reviewers a premium control plane to approve faster.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="secondary"><Link href="/inbox">Open inbox</Link></Button>
            <Button asChild><Link href={`/orders/${latestOrderId}`}>Review latest <ArrowRight className="size-4" /></Link></Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {workspaceMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader>
              <CardDescription>{metric.label}</CardDescription>
              <CardTitle className="text-3xl">{metric.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/55">{metric.delta}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <CardTitle>Launch checklist</CardTitle>
              <CardDescription>Use real workspace signals to move from setup to customer-ready go-live.</CardDescription>
            </div>
            <Badge variant={checklistProgress.completed === checklistProgress.total ? "success" : "violet"}>
              {checklistProgress.completed}/{checklistProgress.total} complete
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {checklist.map((item, index) => {
              const isNextStep = !item.completed && nextLaunchStep?.key === item.key;

              return (
                <div key={item.key} className="rounded-[24px] border border-white/10 bg-white/[0.035] p-4">
                  <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 gap-3">
                      <div className="mt-0.5 rounded-full border border-white/10 bg-white/[0.04] p-2 text-white/78">
                        {item.completed ? <CheckCircle2 className="size-4 text-emerald-300" /> : <CircleDashed className="size-4 text-violet-200" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium text-white">{index + 1}. {item.title}</p>
                          <Badge variant={item.completed ? "success" : isNextStep ? "violet" : "muted"}>
                            {item.completed ? "Done" : isNextStep ? "Next" : "Pending"}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm text-white/68">{item.description}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/38">{item.supportText}</p>
                      </div>
                    </div>
                    <Link
                      href={item.href}
                      className="inline-flex shrink-0 self-start items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/78 transition hover:bg-white/[0.06]"
                    >
                      {item.ctaLabel} <ArrowUpRight className="size-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Launch readiness</CardTitle>
            <CardDescription>The product now shows what still blocks a real customer rollout.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[24px] border border-violet-400/20 bg-violet-400/10 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-violet-100/72">Current score</p>
              <p className="mt-3 text-4xl font-semibold text-white">{checklistProgress.percent}%</p>
              <p className="mt-2 text-sm text-white/64">
                {checklistProgress.completed} of {checklistProgress.total} launch milestones are complete for {viewer.workspace?.name ?? "this workspace"}.
              </p>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-cyan-400/15 p-2 text-cyan-200"><BrainCircuit className="size-4" /></div>
                <div>
                  <p className="text-sm font-medium text-white">Next best action</p>
                  <p className="mt-1 text-sm text-white/62">
                    {nextLaunchStep
                      ? `${nextLaunchStep.title} is the clearest path to move this workspace toward a live customer rollout.`
                      : "The core go-live checklist is complete. The next step is proving daily usage and customer outcomes."}
                  </p>
                  {nextLaunchStep ? (
                    <Button asChild className="mt-4">
                      <Link href={nextLaunchStep.href}>{nextLaunchStep.ctaLabel}</Link>
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
                Mailboxes: {inboxConnections.length}
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
                Orders: {workspaceOrders.length}
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
                ERP targets: {erpConnections.length}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <CardTitle>Live review queue</CardTitle>
              <CardDescription>Highest-value orders needing attention right now.</CardDescription>
            </div>
            <Badge variant="violet">{reviewQueue.length} active</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviewQueue.map((order) => (
              <div key={order.id} className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.035] p-5">
                <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-white/74">
                      <span>{order.source}</span>
                      <span className="text-white/34">·</span>
                      <span>{order.receivedAt}</span>
                    </div>
                    <h2 className="mt-3 break-all text-xl font-semibold text-white">{order.id} · {order.customer}</h2>
                    <p className="mt-2 text-sm text-white/56">
                      {order.exceptions[0] ?? `${order.lines} lines · ${order.value} · ${order.status}`}
                    </p>
                  </div>
                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex shrink-0 self-start items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/78 transition hover:bg-white/[0.06]"
                  >
                    Open order <ArrowRight className="size-4" />
                  </Link>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Badge>{order.confidence}% confidence</Badge>
                  <Badge variant="muted">{order.lines} lines</Badge>
                  <Badge variant="violet">{order.status}</Badge>
                  {order.exceptions.slice(0, 2).map((exception) => (
                    <Badge key={exception} variant="violet">{exception}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Why teams keep this open all day</CardTitle>
            <CardDescription>Daily ops signals in one view.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activityFeed.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-cyan-400/15 p-2 text-cyan-200"><Sparkles className="size-4" /></div>
                  <div>
                    <p className="text-sm font-medium text-white/84">{item.label}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.24em] text-white/38">{item.time}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="rounded-2xl border border-violet-400/15 bg-violet-400/8 p-4 text-sm leading-7 text-white/70">
              <div className="mb-3 flex items-center gap-2 text-violet-100"><BrainCircuit className="size-4" /> Next growth milestone</div>
              Tighten onboarding, prove the first customer go-live path, and convert the workspace from a power-user console into a daily operating system.
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

