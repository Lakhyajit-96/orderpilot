type LaunchValueProofInput = {
  ordersIngested: number;
  ordersReviewed: number;
  firstOrderAt: string | null;
  firstErpReadyAt: string | null;
};

export function formatLaunchValueDuration(firstOrderAt: string | null, firstErpReadyAt: string | null) {
  if (!firstOrderAt || !firstErpReadyAt) {
    return "Not reached yet";
  }

  const durationMs = Date.parse(firstErpReadyAt) - Date.parse(firstOrderAt);

  if (!Number.isFinite(durationMs) || durationMs < 0) {
    return "Not reached yet";
  }

  const totalMinutes = Math.max(0, Math.round(durationMs / 60_000));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  const parts = [
    days > 0 ? `${days}d` : null,
    hours > 0 ? `${hours}h` : null,
    minutes > 0 || (days === 0 && hours === 0) ? `${minutes}m` : null,
  ].filter((value): value is string => Boolean(value));

  return parts.join(" ");
}

export function buildLaunchValueProofMetrics(input: LaunchValueProofInput) {
  const reviewRate = input.ordersIngested === 0
    ? 0
    : Math.round((input.ordersReviewed / input.ordersIngested) * 100);
  const timeToFirstErpReady = formatLaunchValueDuration(input.firstOrderAt, input.firstErpReadyAt);

  return [
    {
      label: "Orders ingested",
      value: String(input.ordersIngested),
      detail: input.ordersIngested === 0 ? "No live orders have landed yet." : "Live customer traffic captured in this workspace.",
    },
    {
      label: "Orders reviewed",
      value: String(input.ordersReviewed),
      detail: input.ordersIngested === 0 ? "Review rate unlocks after the first ingestion." : `${reviewRate}% of ingested orders have entered review or approval.`,
    },
    {
      label: "Time to first ERP-ready order",
      value: timeToFirstErpReady,
      detail: timeToFirstErpReady === "Not reached yet"
        ? "Approve one order to unlock the first go-live proof point."
        : "Elapsed from the first ingested order to the first approved/export-ready order.",
    },
  ];
}