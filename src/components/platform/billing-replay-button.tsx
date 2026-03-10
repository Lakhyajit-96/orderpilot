"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BillingReplayButton({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleReplay() {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/billing/events/${eventId}/replay`, {
        method: "POST",
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        window.alert(payload.error ?? "Could not replay billing event.");
        return;
      }

      router.refresh();
    } catch {
      window.alert("Could not replay billing event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button variant="secondary" size="sm" disabled={isLoading} onClick={handleReplay}>
      {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
      Replay event
    </Button>
  );
}