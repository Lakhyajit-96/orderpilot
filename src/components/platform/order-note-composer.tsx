"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OrderNoteComposer({ orderId, disabled }: { orderId: string; disabled: boolean }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!body.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/orders/${orderId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        window.alert(payload.error ?? "Could not add note.");
        return;
      }

      setBody("");
      router.refresh();
    } catch {
      window.alert("Could not add note. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <textarea
        className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-cyan-300/40"
        rows={3}
        placeholder="Add reviewer note"
        value={body}
        disabled={disabled || isLoading}
        onChange={(event) => setBody(event.target.value)}
      />
      <div className="flex justify-end">
        <Button type="submit" variant="secondary" className="w-full sm:w-auto" disabled={disabled || isLoading || !body.trim()}>
          {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
          Save note
        </Button>
      </div>
    </form>
  );
}