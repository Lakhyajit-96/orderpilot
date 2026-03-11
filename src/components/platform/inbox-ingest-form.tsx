"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const fieldClassName =
  "w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-cyan-300/40";

export function InboxIngestForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    sourceEmail: "",
    subject: "",
    summary: "",
    shippingAddress: "",
    body: "",
    lineItemsText: "",
    exceptionsText: "",
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/inbox/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = (await response.json()) as { orderId?: string; error?: string };

      if (!response.ok || !payload.orderId) {
        window.alert(payload.error ?? "Could not ingest mailbox payload.");
        return;
      }

      router.push(`/orders/${payload.orderId}`);
      router.refresh();
    } catch {
      window.alert("Could not ingest mailbox payload. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <div className="grid gap-3 md:grid-cols-2">
        <input className={fieldClassName} placeholder="Customer name" value={form.customerName} onChange={(event) => setForm((current) => ({ ...current, customerName: event.target.value }))} />
        <input className={fieldClassName} placeholder="Mailbox sender email" type="email" value={form.sourceEmail} onChange={(event) => setForm((current) => ({ ...current, sourceEmail: event.target.value }))} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <input className={fieldClassName} placeholder="Customer contact email (optional)" type="email" value={form.customerEmail} onChange={(event) => setForm((current) => ({ ...current, customerEmail: event.target.value }))} />
        <input className={fieldClassName} placeholder="Email subject" value={form.subject} onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))} />
      </div>
      <input className={fieldClassName} placeholder="Ship-to address" value={form.shippingAddress} onChange={(event) => setForm((current) => ({ ...current, shippingAddress: event.target.value }))} />
      <textarea className={fieldClassName} rows={3} placeholder="Order summary (optional)" value={form.summary} onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))} />
      <textarea className={fieldClassName} rows={4} placeholder="Email body / parser notes (optional)" value={form.body} onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))} />
      <textarea className={fieldClassName} rows={4} placeholder="Line items: SKU | Description | Quantity" value={form.lineItemsText} onChange={(event) => setForm((current) => ({ ...current, lineItemsText: event.target.value }))} />
      <textarea className={fieldClassName} rows={3} placeholder="Exceptions, one per line (optional)" value={form.exceptionsText} onChange={(event) => setForm((current) => ({ ...current, exceptionsText: event.target.value }))} />
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-xs text-white/45">
          Example line format: <span className="font-medium text-white/75">SKU-100 | Stainless elbow fitting | 24</span>
        </p>
        <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
          {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
          Create order from mailbox
        </Button>
      </div>
    </form>
  );
}