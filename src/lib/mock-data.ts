export type QueueOrder = {
  id: string;
  customer: string;
  channel: string;
  receivedAt: string;
  lines: number;
  confidence: number;
  value: string;
  status: string;
  exceptions: string[];
};

export type PlatformOrder = QueueOrder & {
  summary: string;
  shippingAddress: string;
  notes: string[];
  lineItems: {
    sku: string;
    description: string;
    qty: number;
    mappedTo: string;
    match: number;
    state: string;
  }[];
  activity: { label: string; time: string }[];
};

export const metrics = [
  { label: "Orders processed", value: "2,184", delta: "+18% this month" },
  { label: "Straight-through rate", value: "74%", delta: "12pt above baseline" },
  { label: "Avg. review time", value: "2m 16s", delta: "Down from 8m 40s" },
  { label: "Revenue routed", value: "$3.8M", delta: "Across 14 active accounts" },
];

export const activityFeed = [
  { label: "Atlas order approved and queued for export", time: "2 min ago" },
  { label: "BrightForge line 4 flagged for unit mismatch", time: "7 min ago" },
  { label: "Northline customer matched via shipping alias", time: "13 min ago" },
  { label: "Applied catalog enrichment for fastener family", time: "26 min ago" },
];

export const platformOrders: PlatformOrder[] = [
  {
    id: "PO-10482",
    customer: "Atlas Industrial Supply",
    channel: "ap@atlasindustrial.com",
    receivedAt: "08:42 AM",
    lines: 6,
    confidence: 96,
    value: "$18,420",
    status: "Ready to export",
    exceptions: ["1 ship date confirmation"],
    summary: "Routine replenishment order with one requested ship-date clarification.",
    shippingAddress: "490 Harbor Ridge Rd, Cleveland, OH",
    notes: ["Customer account matched automatically.", "Terms inherited from Atlas master profile."],
    lineItems: [
      { sku: "BRG-4402", description: "Sealed bearing assembly", qty: 12, mappedTo: "BRG-4402", match: 99, state: "Matched" },
      { sku: "FTG-8820", description: "Compression fitting kit", qty: 40, mappedTo: "FTG-8820", match: 97, state: "Matched" },
      { sku: "LUB-14", description: "Synthetic lubricant", qty: 24, mappedTo: "LUB-14", match: 95, state: "Matched" },
    ],
    activity: [
      { label: "PDF attachment parsed", time: "08:42 AM" },
      { label: "Customer + terms matched", time: "08:43 AM" },
      { label: "Awaiting reviewer approval", time: "08:44 AM" },
    ],
  },
  {
    id: "PO-10479",
    customer: "Northline Maintenance Group",
    channel: "orders@northline-mro.com",
    receivedAt: "08:11 AM",
    lines: 11,
    confidence: 88,
    value: "$42,980",
    status: "Needs review",
    exceptions: ["2 SKU aliases", "1 quantity mismatch"],
    summary: "Large MRO replenishment batch with legacy customer item aliases.",
    shippingAddress: "18 Foundry Loop, Grand Rapids, MI",
    notes: ["Customer uses legacy PDF template.", "One line references outdated internal part code."],
    lineItems: [
      { sku: "VAL-220", description: "Pressure relief valve", qty: 18, mappedTo: "VAL-220A", match: 84, state: "Alias review" },
      { sku: "PMP-78", description: "Inline transfer pump", qty: 3, mappedTo: "PMP-78", match: 98, state: "Matched" },
      { sku: "KIT-402", description: "Seal rebuild kit", qty: 9, mappedTo: "KIT-402", match: 91, state: "Quantity check" },
    ],
    activity: [
      { label: "Email body converted into order notes", time: "08:11 AM" },
      { label: "Catalog alias conflict detected", time: "08:12 AM" },
      { label: "Moved to review queue", time: "08:13 AM" },
    ],
  },
  {
    id: "PO-10471",
    customer: "BrightForge Controls",
    channel: "procurement@brightforge.io",
    receivedAt: "07:29 AM",
    lines: 4,
    confidence: 79,
    value: "$9,870",
    status: "Catalog mapping",
    exceptions: ["1 new SKU request", "1 unit-of-measure mismatch"],
    summary: "Control systems order with a newly requested accessory not yet in the master catalog.",
    shippingAddress: "240 Meridian Park, Austin, TX",
    notes: ["New line item may require purchasing review.", "Requested expedited delivery in email body."],
    lineItems: [
      { sku: "SNS-44", description: "Temperature sensor", qty: 20, mappedTo: "SNS-44", match: 96, state: "Matched" },
      { sku: "CAB-9X", description: "Shielded cable assembly", qty: 100, mappedTo: "CAB-9X", match: 94, state: "Matched" },
      { sku: "ACC-NEW", description: "Panel mounting accessory", qty: 20, mappedTo: "Unmapped", match: 42, state: "Create SKU" },
    ],
    activity: [
      { label: "OCR completed for scanned attachment", time: "07:29 AM" },
      { label: "Unit mismatch flagged", time: "07:31 AM" },
      { label: "Catalog team requested", time: "07:33 AM" },
    ],
  },
];

export const reviewQueue = platformOrders;

export function getOrderById(orderId: string) {
  return platformOrders.find((order) => order.id === orderId);
}

