"use client";

import Link from "next/link";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PlanKey } from "@/lib/plans";

export function SubscriptionButton({
  planKey,
  isCheckoutReady,
}: {
  planKey: PlanKey;
  isCheckoutReady: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const isEnterprise = planKey === "enterprise";

  async function handleCheckout() {
    if (!isCheckoutReady || isEnterprise) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planKey }),
      });

      const payload = (await response.json()) as { url?: string; error?: string };

      if (payload.url) {
        window.location.href = payload.url;
        return;
      }

      window.alert(payload.error ?? "Plan checkout isn’t available yet.");
    } catch {
      window.alert("We couldn’t start checkout. Please confirm workspace access and billing availability, then try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isEnterprise) {
    return (
      <Button asChild variant="secondary" className="w-full">
        <Link href="mailto:sales@orderpilot.ai?subject=OrderPilot%20Enterprise%20Inquiry">
          Contact sales
        </Link>
      </Button>
    );
  }

  return (
    <Button onClick={handleCheckout} disabled={!isCheckoutReady || isLoading} className="w-full">
      {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
      {isCheckoutReady ? "Choose plan" : "Plans unavailable right now"}
    </Button>
  );
}

