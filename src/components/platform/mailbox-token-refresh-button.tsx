"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MailboxTokenRefreshButton({ connectionId }: { connectionId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleRefresh() {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/inbox/connections/${connectionId}/refresh`, { method: "POST" });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        window.alert(payload.error ?? "Could not refresh mailbox token.");
        return;
      }

      router.refresh();
    } catch {
      window.alert("Could not refresh mailbox token. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button variant="secondary" size="sm" disabled={isLoading} onClick={handleRefresh}>
      {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
      Refresh token
    </Button>
  );
}