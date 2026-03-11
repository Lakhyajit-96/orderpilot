"use client";

import { useState } from "react";
import { LoaderCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BillingSyncButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSync() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/billing/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload.error ?? "Plan status could not be refreshed.");
        return;
      }

      window.location.href = "/settings?billing=refreshed#workspace-billing";
    } catch {
      setError("Plan status could not be refreshed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleSync} disabled={isLoading} variant="secondary" size="sm" className="w-auto">
        {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : <RefreshCcw className="size-4" />}
        Refresh plan status
      </Button>
      <p className="text-xs text-white/48">
        Use this if a purchase is complete but the plan status has not updated yet.
      </p>
      {error ? <p className="text-xs text-amber-200/80">{error}</p> : null}
    </div>
  );
}