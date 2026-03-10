"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OrderUndoButton({ orderId, disabled }: { orderId: string; disabled: boolean }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleUndo() {
    if (disabled) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/orders/${orderId}/undo`, { method: "POST" });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        window.alert(payload.error ?? "Could not undo last action.");
        return;
      }

      router.refresh();
    } catch {
      window.alert("Could not undo last action. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button variant="secondary" disabled={disabled || isLoading} onClick={handleUndo}>
      {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
      Undo last action
    </Button>
  );
}