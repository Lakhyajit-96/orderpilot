"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OrderExportButton({ orderId, disabled }: { orderId: string; disabled: boolean }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleExport() {
    if (disabled) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/orders/${orderId}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        window.alert(payload.error ?? "Could not export order.");
        return;
      }

      router.refresh();
    } catch {
      window.alert("Could not export order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button disabled={disabled || isLoading} onClick={handleExport}>
      {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
      Push to ERP
    </Button>
  );
}