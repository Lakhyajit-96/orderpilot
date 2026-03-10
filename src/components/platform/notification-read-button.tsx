"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationReadButton({ notificationId, disabled }: { notificationId: string; disabled: boolean }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleRead() {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, { method: "POST" });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        window.alert(payload.error ?? "Could not mark notification read.");
        return;
      }

      router.refresh();
    } catch {
      window.alert("Could not mark notification read. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button variant="secondary" size="sm" disabled={disabled || isLoading} onClick={handleRead}>
      {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
      Mark read
    </Button>
  );
}