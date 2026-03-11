"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CustomerPortalButton({
  isReady,
  className,
}: {
  isReady: boolean;
  className?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleOpenPortal() {
    if (!isReady) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/billing/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const payload = (await response.json()) as { url?: string; error?: string };

      if (payload.url) {
        window.location.href = payload.url;
        return;
      }

      window.alert(payload.error ?? "Billing portal is not ready yet.");
    } catch {
      window.alert("Could not open the billing portal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={handleOpenPortal}
      disabled={!isReady || isLoading}
      variant="secondary"
      className={cn("w-full", className)}
    >
      {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
      {isReady ? "Manage subscription" : "Portal available after checkout"}
    </Button>
  );
}