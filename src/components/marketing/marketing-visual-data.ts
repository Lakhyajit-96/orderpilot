export const heroVisualSnapshot = {
  navigation: [
    { label: "Dashboard", meta: "5/6 complete", active: false },
    { label: "Inbox", meta: "3 intake sources", active: false },
    { label: "Review queue", meta: "3 active", active: true },
    { label: "Settings", meta: "Growth plan", active: false },
  ],
  heroMetrics: [
    { label: "Orders in review", value: "3", detail: "currently surfaced" },
    { label: "Inbox coverage", value: "2", detail: "shared mailbox connections" },
    { label: "ERP readiness", value: "1", detail: "NetSuite handoff ready" },
  ],
  inboxMessages: [
    { subject: "PO-10482 · Atlas Industrial Supply", meta: "Microsoft 365 · 09:18 AM", status: "Needs review", tone: "text-cyan-200" },
    { subject: "PO-10479 · North Coast Electric", meta: "Gmail alias · 09:11 AM", status: "Ready to approve", tone: "text-white/76" },
    { subject: "Rush reorder · Bayline Components", meta: "Manual upload · 08:56 AM", status: "Pending mapping", tone: "text-white/76" },
  ],
  lineItems: [
    { line: "01", description: "Hydraulic fitting · 3/4in brass", sku: "ATL-4438", qty: "24", mappedTo: "ERP-4438", match: "98%", state: "Matched" },
    { line: "02", description: "Seal kit · assembly B", sku: "ATL-9921", qty: "12", mappedTo: "ERP-9921", match: "94%", state: "Matched" },
    { line: "03", description: "Alternate pack size", sku: "ATL-2204", qty: "6", mappedTo: "Needs review", match: "81%", state: "Review" },
  ],
  extractionFields: [
    { label: "Customer matched", value: "Atlas Industrial Supply", tone: "text-emerald-300" },
    { label: "Requested ship date", value: "Jun 18 · dock C3", tone: "text-cyan-200" },
    { label: "Line-item confidence", value: "96% across 6 lines", tone: "text-white" },
    { label: "Open exception", value: "Confirm alternate pack size", tone: "text-violet-200" },
  ],
  approvalChain: [
    { step: "Step 1", title: "Ops manager approval", meta: "Pending · reason APPROVAL" },
    { step: "Step 2", title: "Finance review", meta: "Not required below $25k" },
  ],
  launchChecklist: [
    "Shared mailbox live",
    "Reason codes loaded",
    "Review policy active",
  ],
  handoffSignals: [
    "NetSuite handoff ready",
    "Approved orders queued",
    "Desk handoff visible",
  ],
  reviewQueue: [
    { id: "PO-10482", status: "Needs review", detail: "Pack size mismatch · 1 blocker", meta: "shared inbox · 09:18 AM" },
    { id: "PO-10479", status: "Ready to approve", detail: "Mapped 8/8 lines", meta: "gmail alias · 09:11 AM" },
    { id: "PO-10464", status: "Exported", detail: "NetSuite handoff complete", meta: "export queue · 08:42 AM" },
  ],
  exportSummary: {
    title: "NetSuite handoff ready",
    detail: "Order package prepared · customer fields matched",
    timeline: ["Review complete", "Approval chain satisfied", "ERP queue staged"],
  },
} as const;

export const workflowStages = [
  {
    label: "Intake",
    title: "Shared inbox capture",
    text: "Messages, attachments, and uploads enter one operating queue instead of personal inboxes.",
    metric: "3 live channels",
    variant: "default" as const,
    iconName: "mail",
    preview: [
      { primary: "Microsoft 365 · ops@atlasindustrial.com", secondary: "Secure sign-in complete · instant updates on", badge: "Connected" },
      { primary: "PO-10482 · Atlas Industrial", secondary: "09:18 AM · attachment + body parsed", badge: "New" },
      { primary: "PO-10479 · North Coast", secondary: "09:11 AM · 8 lines detected", badge: "Queued" },
    ],
  },
  {
    label: "Extract",
    title: "AI draft generation",
    text: "Customer references, quantities, and line mappings are structured into an evidence-backed draft order.",
    metric: "96% line confidence",
    variant: "violet" as const,
    iconName: "bot",
    preview: [
      { primary: "Customer matched", secondary: "Atlas Industrial Supply", badge: "98%" },
      { primary: "6 mapped lines", secondary: "Order system matches resolved for 5 lines", badge: "Live" },
      { primary: "Pack size flagged", secondary: "Needs reviewer confirmation", badge: "Issue" },
    ],
  },
  {
    label: "Review",
    title: "Reviewer exception handling",
    text: "Confidence gaps and special terms are routed to the right approver with context intact.",
    metric: "1 blocker left",
    variant: "muted" as const,
    iconName: "file-search",
    preview: [
      { primary: "Pack size mismatch", secondary: "Reason code APPROVAL", badge: "Open" },
      { primary: "Ship date confirmed", secondary: "Dock C3 · Jun 18", badge: "Closed" },
      { primary: "Finance review not needed", secondary: "Below approval threshold", badge: "Bypassed" },
    ],
  },
  {
    label: "Approve",
    title: "ERP-ready release",
    text: "Approved orders retain notes, approval history, and export readiness before handoff downstream.",
    metric: "NetSuite queue ready",
    variant: "success" as const,
    iconName: "check-circle",
    preview: [
      { primary: "Approval chain complete", secondary: "Ops manager signed off", badge: "Done" },
      { primary: "Order package prepared", secondary: "Customer fields confirmed", badge: "Ready" },
      { primary: "Desk handoff confirmed", secondary: "Queue visible to coordinators", badge: "Live" },
    ],
  },
] as const;

export const featureVisualCards = [
  {
    eyebrow: "Dashboard",
    title: "Operations command center",
    text: "Mirror the real dashboard: launch checklist progress, queue health, proof metrics, and next action in a single surface.",
    iconName: "layout-dashboard",
    variant: "default" as const,
    metrics: ["Orders today · 27", "Inbox coverage · 3", "ERP ready · 2 exports"],
    rows: ["Launch checklist · 5/6 complete", "Review queue · 3 active", "Value proof · 18m saved today"],
  },
  {
    eyebrow: "Order review",
    title: "Reviewer workstation",
    text: "Reflect the live order detail experience: mapped line items, approval chain context, exceptions, and release readiness.",
    iconName: "package-search",
    variant: "violet" as const,
    metrics: ["PO-10482 · 96% confidence", "6 active lines", "1 open blocker"],
    rows: ["Line 1 · SKU matched to ERP-4438", "Approval chain · Ops manager pending", "Exception · Confirm alternate pack size"],
  },
  {
    eyebrow: "Settings and rollout",
    title: "Launch control center",
    text: "Show the actual readiness model: mailbox connections, ERP handoff, billing state, and rollout controls in one place.",
    iconName: "settings",
    variant: "success" as const,
    metrics: ["Mailbox sync · Microsoft 365 live", "Billing · Growth plan active", "ERP handoff · NetSuite ready"],
    rows: ["Secure sign-in complete · shared inbox ready", "Retry queue · 0 delayed handoffs", "Billing management · available"],
  },
] as const;

export const dashboardPreview = {
  heading: "Operations overview",
  subheading: "Move from inbox chaos to ERP-ready order flow.",
  metrics: ["Orders in review · 3", "Inbox coverage · 2", "ERP handoff readiness · 1"],
  checklist: [
    { title: "Launch checklist", detail: "5/6 complete", status: "Continue with ERP handoff" },
    { title: "Review queue", detail: "3 active", status: "Latest order ready to inspect" },
    { title: "Operational proof", detail: "18m saved today", status: "Workflow trend improving" },
  ],
} as const;

export const orderReviewPreview = {
  heading: "PO-10482 · Atlas Industrial Supply",
  badges: ["Needs review", "$18,420", "96% confidence"],
  summary:
    "Atlas Industrial’s order arrives from a shared Microsoft 365 mailbox, keeps the extracted line mapping visible, and elevates the one remaining pack-size question before ERP release.",
  sourceMailbox: "Microsoft 365 · ops@atlasindustrial.com",
  sourceDetail: "Secure sign-in complete · instant updates on · attachment + body parsed at 09:18 AM",
  lineItems: heroVisualSnapshot.lineItems,
  approvals: heroVisualSnapshot.approvalChain,
  exception: "Confirm alternate pack size before export",
  notes: [
    "Mailbox body captured the Dock C3 delivery instruction and the customer’s alternate pack-size note directly in review context.",
    "Reviewer confirmation is only needed for ATL-2204 before the order can move from review into ERP handoff readiness.",
  ],
  activity: [
    "Mailbox ingest completed at 09:18 AM from the Atlas shared inbox.",
    "Draft order created with mapped lines and one flagged exception.",
    "Ops manager review lane opened with approval context attached.",
  ],
  shippingAddress: "Ship-to: Dock C3 · 18 Westport Ave · Cleveland, OH",
} as const;

export const settingsPreview = {
  heading: "Manage rollout, connections, and team workflow",
  readiness: ["Mailbox connections · 2", "ERP connections · 1", "Plan · Growth"],
  connections: [
    { title: "Microsoft 365", detail: "ops@atlasindustrial.com", status: "Connected" },
    { title: "NetSuite handoff", detail: "Secure access saved", status: "Ready for approved orders" },
    { title: "Billing status", detail: "Active on Growth", status: "Manage billing any time" },
  ],
} as const;