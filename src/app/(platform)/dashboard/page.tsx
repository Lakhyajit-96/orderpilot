import Link from "next/link";
import { ArrowRight, BrainCircuit, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getViewer } from "@/lib/auth";
import { activityFeed } from "@/lib/mock-data";
import { getWorkspaceMetrics, getWorkspaceOrders } from "@/lib/orders";

export default async function DashboardPage() {
  const viewer = await getViewer();
  const [workspaceMetrics, workspaceOrders] = await Promise.all([
    getWorkspaceMetrics(viewer.workspace?.id),
    getWorkspaceOrders(viewer.workspace?.id),
  ]);
  const reviewQueue = workspaceOrders.slice(0, 3);
  const latestOrderId = reviewQueue[0]?.id ?? "PO-10482";

  return (
    <div className="space-y-6">
      <section className="panel overflow-hidden rounded-[28px] p-6 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Badge>Order desk command center</Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white lg:text-5xl">
              Move from inbox chaos to ERP-ready order flow.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-white/66">
              OrderPilot extracts structured order data, flags exceptions with context, and gives reviewers a premium control plane to approve faster.
            </p>
          </div>
          <div className="flex gap-3">
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

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Live review queue</CardTitle>
              <CardDescription>Highest-value orders needing attention right now.</CardDescription>
            </div>
            <Badge variant="violet">{reviewQueue.length} active</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {reviewQueue.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`} className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4 transition hover:bg-white/[0.05] lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{order.id} · {order.customer}</p>
                  <p className="mt-1 text-sm text-white/52">{order.lines} lines · {order.value} · {order.source}</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/64">
                  <span>{order.status}</span>
                  <span className="rounded-full border border-white/10 px-3 py-1">{order.confidence}% confidence</span>
                </div>
              </Link>
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
              <div className="mb-3 flex items-center gap-2 text-violet-100"><BrainCircuit className="size-4" /> Next AI milestone</div>
              Add mailbox sync, parser workers, and ERP export adapters after the UI foundation is locked.
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

