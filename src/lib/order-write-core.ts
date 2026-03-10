import { randomUUID } from "node:crypto";

export type WritableOrderStatus = "INGESTED" | "REVIEW" | "APPROVED" | "EXPORTED";

export type ParsedMailboxLine = {
  sku: string;
  description: string;
  quantity: number;
};

export function getOrderStatusLabel(status: WritableOrderStatus) {
  switch (status) {
    case "INGESTED":
      return "Intake captured";
    case "REVIEW":
      return "Needs review";
    case "APPROVED":
      return "Ready to export";
    case "EXPORTED":
      return "Exported";
  }
}

export function buildGeneratedOrderRef(prefix = "OP") {
  return `${prefix}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

export function isDuplicateExternalRefConstraintError(error: unknown) {
  if (!error || typeof error !== "object" || !("code" in error) || error.code !== "P2002") {
    return false;
  }

  const meta = "meta" in error ? error.meta : undefined;

  if (!meta || typeof meta !== "object" || !("target" in meta) || !Array.isArray(meta.target)) {
    return false;
  }

  return meta.target.some((item) => String(item).includes("externalRef"));
}

export function parseMailboxLineItems(input: string): ParsedMailboxLine[] {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [sku, description, quantityText] = line.split("|").map((part) => part.trim());
      const quantity = Number.parseInt(quantityText ?? "", 10);

      if (!sku || !description || !quantityText || Number.isNaN(quantity) || quantity <= 0) {
        throw new Error(
          "Each line item must use the format SKU | Description | Quantity with a positive quantity.",
        );
      }

      return { sku, description, quantity };
    });
}

export function parseMailboxExceptions(input: string) {
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function buildMailboxSummary(subject: string, summary: string | null | undefined) {
  if (summary && summary.trim()) {
    return summary.trim();
  }

  if (subject.trim()) {
    return `Inbound email received: ${subject.trim()}`;
  }

  return "Inbound order email awaiting reviewer confirmation.";
}