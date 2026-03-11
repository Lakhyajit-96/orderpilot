import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getViewer } from "@/lib/auth";
import { getWorkspaceInboxConnections } from "@/lib/inbox";
import { getWorkspaceOrders } from "@/lib/orders";

export default async function OrdersPage() {
  const viewer = await getViewer();
  const [orders, inboxConnections] = await Promise.all([
    getWorkspaceOrders(viewer.workspace?.id),
    getWorkspaceInboxConnections(viewer.workspace?.id),
  ]);

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <Badge>Order review</Badge>
        <h1 className="mt-4 break-words text-3xl font-semibold tracking-tight text-white">Orders ready for review and ERP handoff</h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-white/64">
          Review structured purchase orders, resolve exceptions, and move approved drafts toward export.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workspace orders</CardTitle>
          <CardDescription>Every structured order, its current status, and the next action.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {orders.length ? (
            orders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`} className="flex min-w-0 flex-col gap-4 rounded-[24px] border border-white/10 bg-white/[0.035] p-5 transition hover:bg-white/[0.06] lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-white/38">
                    <span>{order.receivedAt}</span>
                    <span>·</span>
                    <span>{order.source}</span>
                  </div>
                  <h2 className="mt-3 break-words text-xl font-semibold text-white">{order.id} · {order.customer}</h2>
                  <p className="mt-2 text-sm text-white/58">
                    {order.exceptions[0] ?? "Structured order ready for review and downstream handoff."}
                  </p>
                </div>
                <div className="flex w-full flex-wrap items-center gap-2 lg:w-auto lg:justify-end">
                  <Badge>{order.confidence}% confidence</Badge>
                  <Badge variant="muted">{order.lines} lines</Badge>
                  <Badge variant="violet">{order.status}</Badge>
                  <div className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/74 sm:w-auto">
                    Review order <ArrowRight className="size-4" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] p-5 text-sm text-white/64">
              <p className="text-base font-medium text-white">No workspace orders yet.</p>
              <p className="mt-2 max-w-2xl leading-7 text-white/58">
                {inboxConnections.length
                  ? "Your intake setup is ready. Create the first order from the inbox or wait for the next sync to bring work into review."
                  : "Connect a shared mailbox in Settings or create the first order manually from the inbox to start this workspace."}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button asChild size="sm"><Link href="/inbox">Open inbox</Link></Button>
                {!inboxConnections.length ? <Button asChild size="sm" variant="secondary"><Link href="/settings#mailbox-provider-integration">Connect mailbox</Link></Button> : null}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

