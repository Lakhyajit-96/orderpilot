export type WorkspaceMetricCard = {
  label: string;
  value: string;
  delta: string;
};

function formatCurrencyFromCents(value: number | null | undefined) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format((value ?? 0) / 100);
}

export function buildWorkspaceMetricCards(input: {
  ordersProcessed: number;
  reviewCount: number;
  totalRevenueCents: number | null | undefined;
}): WorkspaceMetricCard[] {
  const straightThroughRate = input.ordersProcessed === 0
    ? 0
    : Math.round(((input.ordersProcessed - input.reviewCount) / input.ordersProcessed) * 100);

  return [
    {
      label: "Orders processed",
      value: String(input.ordersProcessed),
      delta: input.ordersProcessed === 0 ? "No workspace orders have been captured yet" : "Orders captured in this workspace",
    },
    {
      label: "Straight-through rate",
      value: `${straightThroughRate}%`,
      delta: input.ordersProcessed === 0
        ? "This rate appears after the first order arrives"
        : `${input.reviewCount} order(s) still need review`,
    },
    {
      label: "Open review queue",
      value: String(input.reviewCount),
      delta: input.reviewCount === 0
        ? input.ordersProcessed === 0
          ? "Nothing is waiting for review yet"
          : "No orders are waiting right now"
        : "Based on current order statuses",
    },
    {
      label: "Revenue routed",
      value: formatCurrencyFromCents(input.totalRevenueCents),
      delta: input.ordersProcessed === 0 ? "Revenue appears after the first captured order" : "Based on captured workspace orders",
    },
  ];
}