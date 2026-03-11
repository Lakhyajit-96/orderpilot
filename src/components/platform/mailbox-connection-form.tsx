"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const fieldClassName =
  "w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-cyan-300/40";

export function MailboxConnectionForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [form, setForm] = useState({
    provider: "GMAIL",
    address: "",
    syncMode: "POLLING",
    accessToken: "",
    refreshToken: "",
    webhookSecret: "",
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/inbox/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        window.alert(payload.error ?? "Could not save mailbox connection.");
        return;
      }

      router.refresh();
    } catch {
      window.alert("Could not save mailbox connection. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleOAuthConnect() {
    setIsConnecting(true);
    const params = new URLSearchParams({
      address: form.address,
      syncMode: form.syncMode,
    });
    window.location.href = `/api/inbox/oauth/${form.provider}/start?${params.toString()}`;
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <div className="grid gap-3 md:grid-cols-3">
        <select className={fieldClassName} value={form.provider} onChange={(event) => setForm((current) => ({ ...current, provider: event.target.value }))}>
          <option value="GMAIL">Gmail</option>
          <option value="MICROSOFT365">Microsoft 365</option>
        </select>
        <select className={fieldClassName} value={form.syncMode} onChange={(event) => setForm((current) => ({ ...current, syncMode: event.target.value }))}>
          <option value="POLLING">Scheduled refresh</option>
          <option value="WEBHOOK">Instant updates</option>
        </select>
        <input className={fieldClassName} type="email" placeholder="Mailbox address" value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} />
      </div>
      <input className={fieldClassName} placeholder="Mailbox access token" value={form.accessToken} onChange={(event) => setForm((current) => ({ ...current, accessToken: event.target.value }))} />
      <div className="grid gap-3 md:grid-cols-2">
        <input className={fieldClassName} placeholder="Mailbox renewal token (optional)" value={form.refreshToken} onChange={(event) => setForm((current) => ({ ...current, refreshToken: event.target.value }))} />
        <input className={fieldClassName} placeholder="Mailbox verification key (optional)" value={form.webhookSecret} onChange={(event) => setForm((current) => ({ ...current, webhookSecret: event.target.value }))} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-white/45">Use secure sign-in for guided Gmail or Microsoft 365 connection, or enter advanced access details manually.</p>
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="secondary" disabled={isConnecting || !form.address} onClick={handleOAuthConnect}>
            {isConnecting ? <LoaderCircle className="size-4 animate-spin" /> : null}
            Connect securely
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
            Save advanced connection
          </Button>
        </div>
      </div>
    </form>
  );
}