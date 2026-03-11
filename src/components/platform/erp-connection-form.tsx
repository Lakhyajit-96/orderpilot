"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const fieldClassName =
  "w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-cyan-300/40";

export function ErpConnectionForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "Primary ERP",
    endpointUrl: "",
    authHeader: "",
    provider: "WEBHOOK",
    fieldMappingsText: '{\n  "order": { "shippingAddress": "ShipTo" },\n  "lineItem": { "mappedSku": "ItemNumber" }\n}',
    adapterSettingsText: "{}",
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/erp/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          endpointUrl: form.endpointUrl,
          authHeader: form.authHeader,
          provider: form.provider,
          fieldMappingsText: form.fieldMappingsText,
          adapterSettingsText: form.adapterSettingsText,
        }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        window.alert(payload.error ?? "Could not save ERP connection.");
        return;
      }

      router.refresh();
    } catch {
      window.alert("Could not save ERP connection. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit}>
      <div className="grid gap-3 lg:grid-cols-2">
        <input className={fieldClassName} placeholder="Destination name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
        <input className={fieldClassName} placeholder="ERP endpoint URL" value={form.endpointUrl} onChange={(event) => setForm((current) => ({ ...current, endpointUrl: event.target.value }))} />
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <input className={fieldClassName} placeholder="Secure access header (optional)" value={form.authHeader} onChange={(event) => setForm((current) => ({ ...current, authHeader: event.target.value }))} />
        <select className={fieldClassName} value={form.provider} onChange={(event) => setForm((current) => ({ ...current, provider: event.target.value }))}>
          <option value="WEBHOOK">Custom destination</option>
          <option value="NETSUITE">NetSuite</option>
          <option value="SAP">SAP</option>
          <option value="DYNAMICS">Dynamics</option>
        </select>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <textarea className={fieldClassName} rows={5} placeholder="Field matching (JSON)" value={form.fieldMappingsText} onChange={(event) => setForm((current) => ({ ...current, fieldMappingsText: event.target.value }))} />
        <textarea className={fieldClassName} rows={5} placeholder="Advanced options (JSON)" value={form.adapterSettingsText} onChange={(event) => setForm((current) => ({ ...current, adapterSettingsText: event.target.value }))} />
      </div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-xs text-white/45">Choose your destination and, if needed, match your team’s field names to the outgoing order format.</p>
        <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
          {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
          Save handoff destination
        </Button>
      </div>
    </form>
  );
}