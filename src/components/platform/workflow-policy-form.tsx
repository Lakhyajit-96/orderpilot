"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const fieldClassName =
  "w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-cyan-300/40";

type StageConfig = {
  sequence: number;
  role: "OWNER" | "ADMIN" | "REVIEWER" | "OPERATOR";
  title: string;
  minOrderValueCents: number | null;
  requireReasonCode: boolean;
};

export function WorkflowPolicyForm({
  initialRequireReasonCodes,
  initialAutoApproveConfidence,
  initialFinanceThresholdCents,
  initialStages,
  initialReasonCodesText,
}: {
  initialRequireReasonCodes: boolean;
  initialAutoApproveConfidence: number | null;
  initialFinanceThresholdCents: number | null;
  initialStages: StageConfig[];
  initialReasonCodesText: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [requireReasonCodes, setRequireReasonCodes] = useState(initialRequireReasonCodes);
  const [autoApproveConfidence, setAutoApproveConfidence] = useState(
    initialAutoApproveConfidence?.toString() ?? "",
  );
  const [financeThresholdCents, setFinanceThresholdCents] = useState(
    initialFinanceThresholdCents?.toString() ?? "",
  );
  const [reasonCodesText, setReasonCodesText] = useState(initialReasonCodesText);
  const [stages, setStages] = useState(initialStages);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/workflow/policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requireReasonCodes,
          autoApproveConfidence: autoApproveConfidence ? Number(autoApproveConfidence) : null,
          financeThresholdCents: financeThresholdCents ? Number(financeThresholdCents) : null,
          stages,
          reasonCodesText,
        }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        window.alert(payload.error ?? "Could not update the review policy.");
        return;
      }

      router.refresh();
    } catch {
      window.alert("Could not update the review policy. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white">
          <input type="checkbox" checked={requireReasonCodes} onChange={(event) => setRequireReasonCodes(event.target.checked)} />
          Require reasons for status changes
        </label>
        <input className={fieldClassName} placeholder="Auto-approve confidence score" value={autoApproveConfidence} onChange={(event) => setAutoApproveConfidence(event.target.value)} />
        <input className={fieldClassName} placeholder="Finance review threshold (enter cents)" value={financeThresholdCents} onChange={(event) => setFinanceThresholdCents(event.target.value)} />
      </div>
      {stages.map((stage, index) => (
        <div key={stage.sequence} className="grid gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4 md:grid-cols-4">
          <input className={fieldClassName} value={stage.title} onChange={(event) => setStages((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item))} />
          <select className={fieldClassName} value={stage.role} onChange={(event) => setStages((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, role: event.target.value as StageConfig["role"] } : item))}>
            <option value="OPERATOR">Operator</option>
            <option value="REVIEWER">Reviewer</option>
            <option value="ADMIN">Admin</option>
            <option value="OWNER">Owner</option>
          </select>
          <input className={fieldClassName} placeholder="Minimum order amount (enter cents)" value={stage.minOrderValueCents?.toString() ?? ""} onChange={(event) => setStages((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, minOrderValueCents: event.target.value ? Number(event.target.value) : null } : item))} />
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white">
            <input type="checkbox" checked={stage.requireReasonCode} onChange={(event) => setStages((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, requireReasonCode: event.target.checked } : item))} />
            Reason required at this stage
          </label>
        </div>
      ))}
      <textarea className={fieldClassName} rows={6} value={reasonCodesText} onChange={(event) => setReasonCodesText(event.target.value)} placeholder="One per line: action | code | label" />
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
          Save review policy
        </Button>
      </div>
    </form>
  );
}