"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MailboxBootstrapButton({ connectionId }: { connectionId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleBootstrap() {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/inbox/connections/${connectionId}/bootstrap`, { method: "POST" });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        window.alert(payload.error ?? "Could not bootstrap mailbox subscription.");
        return;
      }

      router.refresh();
    } catch {
      window.alert("Could not bootstrap mailbox subscription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button variant="secondary" size="sm" disabled={isLoading} onClick={handleBootstrap}>
      {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
      Bootstrap webhook
    </Button>
  );
}