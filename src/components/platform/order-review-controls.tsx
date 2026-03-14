"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WritableOrderStatus } from "@/lib/order-write-core";

export function OrderReviewControls({
  orderId,
  status,
  openExceptionCount,
  isReady,
  reasonCodes,
  nextApprovalRole,
}: {
  orderId: string;
  status: WritableOrderStatus;
  openExceptionCount: number;
  isReady: boolean;
  reasonCodes: Array<{ code: string; label: string }>;
  nextApprovalRole: string | null;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<WritableOrderStatus | null>(null);
  const [reasonCode, setReasonCode] = useState(reasonCodes[0]?.code ?? "");
  const [comment, setComment] = useState("");

  async function updateStatus(nextStatus: WritableOrderStatus, note: string) {
    if (!isReady) {
      return;
    }

    setIsLoading(nextStatus);

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, note, reasonCode, comment }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        window.alert(payload.error ?? "Could not update order state.");
        return;
      }

      router.refresh();
    } catch {
      window.alert("Could not update order state. Please try again.");
    } finally {
      setIsLoading(null);
    }
  }

  return (
    <div className="space-y-3">
      {nextApprovalRole ? (
        <p className="text-xs uppercase tracking-[0.2em] text-white/42">
          Next approval role: {nextApprovalRole}
        </p>
      ) : null}
      <div className="grid gap-3 lg:grid-cols-[minmax(0,240px)_1fr]">
        <select
          className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/40"
          value={reasonCode}
          onChange={(event) => setReasonCode(event.target.value)}
        >
          {reasonCodes.length === 0 && (
            <option value="">No reason codes configured</option>
          )}
          {reasonCodes.map((item) => (
            <option key={item.code} value={item.code}>
              {item.code} · {item.label}
            </option>
          ))}
        </select>
        <input
          className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-cyan-300/40"
          placeholder="Optional reviewer comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button
          variant="secondary"
          className="w-full sm:w-auto"
          disabled={!isReady || isLoading !== null || openExceptionCount > 0 || status === "APPROVED"}
          onClick={() => updateStatus("APPROVED", "Reviewer approved order for export.")}
        >
          {isLoading === "APPROVED" ? <LoaderCircle className="size-4 animate-spin" /> : null}
          Approve for export
        </Button>
        <Button
          variant="secondary"
          className="w-full sm:w-auto"
          disabled={!isReady || isLoading !== null || status === "REVIEW"}
          onClick={() => updateStatus("REVIEW", "Reviewer returned order to the review lane.")}
        >
          {isLoading === "REVIEW" ? <LoaderCircle className="size-4 animate-spin" /> : null}
          Return to review
        </Button>
        <Button
          className="w-full sm:w-auto"
          disabled={!isReady || isLoading !== null || status !== "APPROVED"}
          onClick={() => updateStatus("EXPORTED", "Order marked exported after reviewer handoff.")}
        >
          {isLoading === "EXPORTED" ? <LoaderCircle className="size-4 animate-spin" /> : null}
          Mark exported
        </Button>
      </div>
    </div>
  );
}
