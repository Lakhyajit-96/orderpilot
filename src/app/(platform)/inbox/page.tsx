import Link from "next/link";
import { ArrowUpRight, Mail, Paperclip } from "lucide-react";
import { InboxIngestForm } from "@/components/platform/inbox-ingest-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getViewer } from "@/lib/auth";
import { getWorkspaceOrders } from "@/lib/orders";

export default async function InboxPage() {
  const viewer = await getViewer();
  const reviewQueue = await getWorkspaceOrders(viewer.workspace?.id);

  return (
    <div className="space-y-6">
      <div>
        <Badge variant="violet">Inbox view</Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">Shared order intake inbox</h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-white/64">
          Every inbound email, PO attachment, and parser status lands here first. Reviewers can jump straight into the highest-leverage exceptions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mailbox ingestion</CardTitle>
          <CardDescription>Turn a raw inbound email into a persisted workspace order record, or use mailbox provider sync from Settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <InboxIngestForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s inbound queue</CardTitle>
          <CardDescription>Ordered by value, exception count, and confidence risk.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {reviewQueue.map((item) => (
            <div key={item.id} className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex items-center gap-3 text-sm text-white/74">
                    <Mail className="size-4 text-cyan-200" />
                    <span>{item.source}</span>
                    <span className="text-white/34">·</span>
                    <span>{item.receivedAt}</span>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-white">{item.id} · {item.customer}</h2>
                  <p className="mt-2 text-sm text-white/56">{item.lines} lines · {item.value} · {item.status}</p>
                </div>
                <Link href={`/orders/${item.id}`} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/78 transition hover:bg-white/[0.06]">
                  Open order <ArrowUpRight className="size-4" />
                </Link>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Badge>{item.confidence}% confidence</Badge>
                <Badge variant="muted"><Paperclip className="size-3" /> PDF parsed</Badge>
                {item.exceptions.map((exception) => (
                  <Badge key={exception} variant="violet">{exception}</Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

