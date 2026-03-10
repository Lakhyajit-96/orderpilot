"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MailboxSyncButton({ connectionId }: { connectionId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSync() {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/inbox/connections/${connectionId}/sync`, { method: "POST" });
      const payload = (await response.json()) as { error?: string; createdOrders?: string[]; syncedMessages?: number };

      if (!response.ok) {
        window.alert(payload.error ?? "Could not sync mailbox.");
        return;
      }

      window.alert(`Synced ${payload.syncedMessages ?? 0} messages and created ${payload.createdOrders?.length ?? 0} order(s).`);
      router.refresh();
    } catch {
      window.alert("Could not sync mailbox. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button variant="secondary" size="sm" disabled={isLoading} onClick={handleSync}>
      {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
      Sync now
    </Button>
  );
}