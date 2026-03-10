"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExceptionResolveButton({
  orderId,
  exceptionId,
  disabled,
}: {
  orderId: string;
  exceptionId: string;
  disabled: boolean;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleResolve() {
    if (disabled) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/orders/${orderId}/exceptions/${exceptionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: "Reviewer resolved this exception." }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        window.alert(payload.error ?? "Could not resolve exception.");
        return;
      }

      router.refresh();
    } catch {
      window.alert("Could not resolve exception. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button variant="secondary" size="sm" disabled={disabled || isLoading} onClick={handleResolve}>
      {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
      Resolve
    </Button>
  );
}