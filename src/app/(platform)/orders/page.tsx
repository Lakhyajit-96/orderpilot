import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getViewer } from "@/lib/auth";
import { getWorkspaceOrders } from "@/lib/orders";

export default async function OrdersPage() {
  const viewer = await getViewer();
  const orders = await getWorkspaceOrders(viewer.workspace?.id);

  return (
    <div className="space-y-6">
      <div>
        <Badge>Orders workspace</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">Draft orders with structured extraction state</h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-white/64">
          This is the handoff layer between raw inbound documents and the ERP. Every order retains confidence, exception state, and reviewer history.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All draft orders</CardTitle>
          <CardDescription>Premium review lanes for operators, sales ops, and catalog teams backed by workspace persistence.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {orders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`} className="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-white/[0.035] p-5 transition hover:bg-white/[0.06] lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-white/38">
                  <span>{order.receivedAt}</span>
                  <span>·</span>
                  <span>{order.source}</span>
                </div>
                <h2 className="mt-3 text-xl font-semibold text-white">{order.id} · {order.customer}</h2>
                <p className="mt-2 text-sm text-white/58">
                  {order.exceptions[0] ?? "Persisted order ready for review and ERP handoff."}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                <Badge>{order.confidence}% confidence</Badge>
                <Badge variant="muted">{order.lines} lines</Badge>
                <Badge variant="violet">{order.status}</Badge>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/74">
                  Review order <ArrowRight className="size-4" />
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      <div className="rounded-[24px] border border-cyan-400/15 bg-cyan-400/6 p-5 text-sm leading-7 text-white/70">
        <div className="mb-2 flex items-center gap-2 text-cyan-100"><Sparkles className="size-4" /> Product direction</div>
        Next layers: team approvals, export adapters, audit history, and AI-generated reasoning per exception.
      </div>
    </div>
  );
}

