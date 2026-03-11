const INTAKE_CAPTURED_LABEL = "Intake captured";
const NEEDS_REVIEW_LABEL = "Needs review";

export type DashboardLaunchChecklistInput = {
  viewerName: string;
  isAuthenticated: boolean;
  workspaceName: string | null;
  workspaceRole: string | null;
  inboxConnectionCount: number;
  orderCount: number;
  orderStatuses: string[];
  erpConnectionCount: number;
  subscriptionPlanKey: string | null;
  subscriptionStatus: string | null;
};

export type DashboardLaunchChecklistItem = {
  key: string;
  title: string;
  description: string;
  supportText: string;
  href: string;
  ctaLabel: string;
  completed: boolean;
};

function formatLabel(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function hasReviewedOrders(orderStatuses: string[]) {
  return orderStatuses.some((status) => {
    const normalized = status.trim().toLowerCase();
    return normalized.length > 0
      && normalized !== INTAKE_CAPTURED_LABEL.toLowerCase()
      && normalized !== NEEDS_REVIEW_LABEL.toLowerCase();
  });
}

export function buildDashboardLaunchChecklist(
  input: DashboardLaunchChecklistInput,
): DashboardLaunchChecklistItem[] {
  const workspaceReady = input.isAuthenticated && Boolean(input.workspaceName);
  const hasMailbox = input.inboxConnectionCount > 0;
  const hasOrders = input.orderCount > 0;
  const reviewedOrders = hasReviewedOrders(input.orderStatuses);
  const hasErpConnection = input.erpConnectionCount > 0;
  const hasBilling = Boolean(input.subscriptionPlanKey || input.subscriptionStatus);
  const roleLabel = formatLabel(input.workspaceRole) ?? "Workspace";
  const billingLabel = [formatLabel(input.subscriptionPlanKey), formatLabel(input.subscriptionStatus)]
    .filter(Boolean)
    .join(" · ");

  return [
    {
      key: "workspace",
      title: "Sign in and activate your workspace",
      description: workspaceReady
        ? `${input.workspaceName} is live and ${input.viewerName} has ${roleLabel} access.`
        : "Secure the workspace before connecting mailboxes, reviewers, and exports.",
      supportText: workspaceReady
        ? "You can now configure mailbox sync, approvals, and billing from authenticated screens."
        : "Start by confirming authenticated access and workspace creation.",
      href: "/settings",
      ctaLabel: workspaceReady ? "Review settings" : "Verify access",
      completed: workspaceReady,
    },
    {
      key: "mailbox",
      title: "Connect a shared mailbox",
      description: hasMailbox
        ? `${input.inboxConnectionCount} mailbox connection${input.inboxConnectionCount === 1 ? "" : "s"} ready for sync.`
        : "Connect Gmail or Microsoft 365 so inbound customer orders land automatically.",
      supportText: hasMailbox
        ? "You can trigger syncs, refresh tokens, and bootstrap webhook subscriptions from Settings."
        : "Mailbox onboarding is the fastest way to prove OrderPilot against live inbound traffic.",
      href: "/settings",
      ctaLabel: hasMailbox ? "Manage mailbox" : "Connect mailbox",
      completed: hasMailbox,
    },
    {
      key: "orders",
      title: "Pull in the first live order",
      description: hasOrders
        ? `${input.orderCount} order${input.orderCount === 1 ? "" : "s"} already captured in the workspace.`
        : "Sync a mailbox or ingest one order manually to start the review loop.",
      supportText: hasOrders
        ? "The inbox and order workspaces now have real data to validate parsing and routing."
        : "Use the inbox form or mailbox sync controls to ingest the first order.",
      href: "/inbox",
      ctaLabel: hasOrders ? "Open inbox" : "Ingest first order",
      completed: hasOrders,
    },
    {
      key: "review",
      title: "Move one order through review",
      description: reviewedOrders
        ? "At least one order has moved beyond intake into approval or export-ready workflow."
        : "Advance one order past intake so the team can validate the real review path.",
      supportText: reviewedOrders
        ? "This is the key proof that operators can act on exceptions and push work forward."
        : "Approve or route an order so the workflow becomes more than passive ingestion.",
      href: "/orders",
      ctaLabel: reviewedOrders ? "Open orders" : "Review first order",
      completed: reviewedOrders,
    },
    {
      key: "erp",
      title: "Add an ERP / export destination",
      description: hasErpConnection
        ? `${input.erpConnectionCount} export destination${input.erpConnectionCount === 1 ? "" : "s"} configured.`
        : "Configure a downstream ERP or webhook destination for approved orders.",
      supportText: hasErpConnection
        ? "Approved orders can now be handed off into the customer’s downstream system."
        : "ERP connectivity is what turns approval into an operational outcome.",
      href: "/settings",
      ctaLabel: hasErpConnection ? "Manage exports" : "Add ERP connection",
      completed: hasErpConnection,
    },
    {
      key: "billing",
      title: "Verify billing before go-live",
      description: hasBilling
        ? `Billing is tracked${billingLabel ? ` on ${billingLabel}` : " for this workspace"}.`
        : "Confirm the subscription state so the account is ready for a real rollout.",
      supportText: hasBilling
        ? "The workspace has a persisted plan context for customer rollout and support."
        : "A verified plan is the final commercial checkpoint before launch.",
      href: "/settings",
      ctaLabel: hasBilling ? "Open billing" : "Verify billing",
      completed: hasBilling,
    },
  ];
}

export function getDashboardLaunchProgress(items: DashboardLaunchChecklistItem[]) {
  const completed = items.filter((item) => item.completed).length;
  const total = items.length;

  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function getNextDashboardLaunchStep(items: DashboardLaunchChecklistItem[]) {
  return items.find((item) => !item.completed) ?? null;
}