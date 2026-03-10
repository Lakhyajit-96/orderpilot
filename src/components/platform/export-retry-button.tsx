"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExportRetryButton({ exportRunId }: { exportRunId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleRetry() {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/exports/${exportRunId}/retry`, { method: "POST" });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        window.alert(payload.error ?? "Could not retry export.");
        return;
      }

      router.refresh();
    } catch {
      window.alert("Could not retry export. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button variant="secondary" size="sm" disabled={isLoading} onClick={handleRetry}>
      {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
      Retry export
    </Button>
  );
}