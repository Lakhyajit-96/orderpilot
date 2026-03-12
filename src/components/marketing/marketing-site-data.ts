import type { LucideIcon } from "lucide-react";
import { Bot, FileSearch2, MessagesSquare, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { marketingOrderReviewHref } from "../../lib/marketing-routes.ts";

export { marketingOrderReviewHref } from "../../lib/marketing-routes.ts";

export const proofPills = [
  "Shared mailbox capture for distributor teams",
  "Exception-first review with human approval",
  "ERP-ready drafts before downstream handoff",
] as const;

export const marketingSignals = [
  {
    label: "Inbox capture",
    title: "Every customer PO lands in one operating queue",
    text: "Replace personal inbox forwarding and spreadsheet triage with one shared intake surface for emails, PDFs, and attachments.",
  },
  {
    label: "Review clarity",
    title: "Low-confidence fields get surfaced before they become downstream errors",
    text: "Reviewers see exactly where extraction needs a decision so the team can fix exceptions early instead of discovering them inside the ERP.",
  },
  {
    label: "Release confidence",
    title: "Approved drafts leave review with context attached",
    text: "Mappings, notes, approvals, and shipment details stay visible all the way to the final handoff so teams can move faster without losing control.",
  },
] as const;

export const workflowSteps = [
  {
    title: "Collect distributor order demand in one place",
    text: "Customer emails, attachments, forwarded quote requests, and shared mailboxes become one clean intake stream for the order desk.",
    detail: "Shared inbox + uploads",
  },
  {
    title: "Generate a usable draft before a coordinator touches the order",
    text: "OrderPilot extracts customer references, requested SKUs, quantities, ship dates, and notes into a structured draft built for fast review.",
    detail: "Structured AI draft",
  },
  {
    title: "Route risk to the right human reviewer",
    text: "Unmapped SKUs, special terms, and confidence gaps are elevated with evidence so reviewers can make the call without digging through emails.",
    detail: "Evidence-backed review",
  },
  {
    title: "Approve with accountability and hand off cleanly",
    text: "The final order carries decisions, notes, and approval state forward so downstream teams receive a draft they can trust.",
    detail: "Audit-ready ERP handoff",
  },
] as const;

export const teamViews: Array<{
  icon: LucideIcon;
  title: string;
  text: string;
  bullets: string[];
}> = [
  {
    icon: Users,
    title: "For order desk coordinators",
    text: "Clear more inbound volume without re-keying every emailed line item or chasing scattered customer context.",
    bullets: [
      "One intake queue across shared mailboxes",
      "Prepared drafts with the gaps already highlighted",
      "Fewer manual handoffs between teammates",
    ],
  },
  {
    icon: FileSearch2,
    title: "For reviewers and approvers",
    text: "Review only the lines that need judgment and keep extraction evidence close to the decision.",
    bullets: [
      "Source-aware field evidence",
      "Clear mismatch and exception routing",
      "Approval context before release",
    ],
  },
  {
    icon: TrendingUp,
    title: "For operations leaders",
    text: "See whether inbox coverage, review throughput, and rollout readiness are improving across the workspace.",
    bullets: [
      "Launch-readiness signals in one view",
      "Operational proof before ERP rollout",
      "Visible adoption and review momentum",
    ],
  },
];

export const controlPillars: Array<{
  icon: LucideIcon;
  title: string;
  text: string;
}> = [
  {
    icon: MessagesSquare,
    title: "Customer context stays connected to the order",
    text: "Notes, source files, and extracted details stay attached so reviewers do not lose the original customer signal as the order moves forward.",
  },
  {
    icon: ShieldCheck,
    title: "Approvals stay in human hands",
    text: "Automation accelerates intake and review, but your team still controls what gets approved, escalated, and exported.",
  },
  {
    icon: Bot,
    title: "Roll out in phases without changing your operating model overnight",
    text: "Start with shared inbox visibility, expand into reviewer workflow, and then graduate into ERP handoff when the team is ready.",
  },
] as const;

export const faqItems = [
  {
    question: "How quickly can a distributor team start seeing value?",
    answer:
      "Most teams feel the first benefit immediately: inbound orders stop living in scattered inboxes and start arriving in one structured queue with draft data attached.",
  },
  {
    question: "Do reviewers still decide what gets approved?",
    answer:
      "Yes. OrderPilot is built to speed up intake and highlight exceptions, not bypass human judgment. Approval and release decisions remain with your team.",
  },
  {
    question: "What happens when a SKU or ship date is unclear?",
    answer:
      "The order is routed into review with evidence and mapping context so the right person can resolve the issue before the draft reaches the ERP.",
  },
  {
    question: "Can we start with one mailbox before expanding the rollout?",
    answer:
      "Absolutely. Many teams begin with one shared intake source, prove the workflow with a small reviewer group, and then expand into broader mailbox and ERP coverage.",
  },
  {
    question: "Does the product support approval and audit requirements?",
    answer:
      "Yes. Reviewer decisions, status changes, and handoff context stay visible so operations leaders can understand what changed and why before export.",
  },
  {
    question: "Is OrderPilot designed only for large enterprise teams?",
    answer:
      "No. Lean order desks use it to reduce manual re-entry, while larger teams use it to standardize review, approvals, and ERP handoff across multiple operators.",
  },
] as const;

export const testimonials = [
  {
    name: "Priya Nair",
    role: "Director of Customer Operations",
    company: "Atlas Industrial Supply",
    quote:
      "The biggest win was not just extraction accuracy — it was finally giving our coordinators and reviewers one shared place to work every inbound PO without losing context.",
    detail:
      "Within the first rollout, Atlas connected its Microsoft 365 order inbox, standardized reviewer notes, and made pack-size or ship-date questions visible before a draft ever reached downstream teams.",
    metric: "42% faster first-pass review",
    proofPoints: [
      "Shared Microsoft 365 intake replaced inbox forwarding between coordinators.",
      "Reviewers stopped reopening original emails just to confirm notes or dock instructions.",
      "Approved drafts reached downstream teams with context, approvals, and shipment details intact.",
    ],
    rating: 5,
    tone: "from-cyan-300/24 via-slate-950/0 to-violet-400/18",
    hairColor: "#10213d",
    accentColor: "#72E4FF",
  },
  {
    name: "Marcus Delaney",
    role: "VP, Distribution Systems",
    company: "Westport Components",
    quote:
      "Our team stopped re-keying routine orders and spent their time only where confidence dropped. That changed throughput almost immediately.",
    detail: "Westport’s reviewers now spend their time on true exceptions instead of reconstructing the same context from inboxes and attachments.",
    metric: "3 shared inboxes unified in week one",
    proofPoints: [
      "Unified intake coverage across three shared inboxes.",
      "Routine orders stayed out of manual re-entry loops.",
      "Low-confidence lines reached the right reviewer faster.",
    ],
    rating: 5,
    tone: "from-violet-300/18 via-slate-950/0 to-cyan-300/12",
    hairColor: "#20152c",
    accentColor: "#B19DFF",
  },
  {
    name: "Elena Kovac",
    role: "Order Management Lead",
    company: "Summit Fluid Power",
    quote:
      "Reviewers now see the exception, the source evidence, and the draft line in one workflow. That removed a lot of back-and-forth from our desk.",
    detail: "Summit’s desk reduced internal context-chasing because the workflow kept evidence, mapped lines, and next action together on the order.",
    metric: "98% of orders routed with clear next action",
    proofPoints: [
      "Evidence stayed attached to each exception.",
      "Reviewers could act without leaving the order surface.",
      "Desk handoffs became clearer and faster.",
    ],
    rating: 5,
    tone: "from-emerald-300/18 via-slate-950/0 to-cyan-300/10",
    hairColor: "#3a241d",
    accentColor: "#5EEAD4",
  },
  {
    name: "Leah Morgan",
    role: "Senior Order Desk Manager",
    company: "Trident Flow Systems",
    quote:
      "We finally gave the whole desk one queue and one review habit. New coordinators ramp faster because the evidence, notes, and next action are already in the order.",
    detail: "Trident used the shared review habit to reduce training drag and make new coordinators productive faster during rollout.",
    metric: "31% less internal order handoff churn",
    proofPoints: [
      "One shared queue replaced ad hoc teammate handoffs.",
      "New operators learned the workflow faster.",
      "Notes and next action stayed attached to the order.",
    ],
    rating: 5,
    tone: "from-amber-300/16 via-slate-950/0 to-cyan-300/10",
    hairColor: "#2a1e19",
    accentColor: "#FBBF24",
  },
  {
    name: "Omar Bennett",
    role: "Director of Branch Operations",
    company: "Keystone Parts Group",
    quote:
      "The rollout story landed because branch leads could see where approvals stayed human-controlled while the intake work got lighter almost right away.",
    detail: "Keystone’s branch leaders bought in faster once the control model was visible and the value showed up in day-one intake work.",
    metric: "2 branches launched from the same operating model",
    proofPoints: [
      "Human approvals remained visible to branch leads.",
      "Day-one intake work got lighter without risky automation leaps.",
      "Two branches launched from the same operating model.",
    ],
    rating: 5,
    tone: "from-cyan-300/14 via-slate-950/0 to-emerald-300/16",
    hairColor: "#171f33",
    accentColor: "#7DD3FC",
  },
] as const;

export const trustLogos = [
  { name: "Microsoft 365", label: "Shared mailbox sync" },
  { name: "Gmail", label: "Routing alias intake" },
  { name: "NetSuite", label: "ERP handoff" },
  { name: "SAP", label: "Enterprise export" },
  { name: "Dynamics 365", label: "Ops system alignment" },
  { name: "Stripe", label: "Billing and rollout" },
] as const;

export const headerMenuGroups = [
  {
    label: "Platform",
    href: "/platform",
    tone: "cyan",
    summary: "See how OrderPilot turns shared inbox demand into a reviewable order workflow built for distributor operations.",
    items: [
      {
        title: "Unified intake surface",
        description: "Shared mailboxes, uploads, and attachments land in one clean queue.",
        href: "/platform",
      },
      {
        title: "Launch-ready dashboard",
        description: "Track queue health, review flow, and rollout readiness in one workspace.",
        href: "/dashboard",
      },
      {
        title: "Live settings controls",
        description: "Confirm rollout, billing, and ERP readiness without leaving the product.",
        href: "/settings",
      },
      {
        title: "Customer proof",
        description: "Read how operations teams use the workflow in practice.",
        href: "/customers",
      },
    ],
  },
  {
    label: "Workflow",
    href: "/workflow",
    tone: "violet",
    summary: "Understand the order arc from inbound mailbox capture through exception review and final ERP-ready release.",
    items: [
      {
        title: "Capture and classify",
        description: "Turn every inbound request into structured intake instead of manual triage.",
        href: "/workflow",
      },
      {
        title: "Review exceptions",
        description: "Route low-confidence fields to the right human with evidence attached.",
        href: marketingOrderReviewHref,
      },
      {
        title: "Measure impact",
        description: "See how coordinators, reviewers, and leaders each benefit from the workflow.",
        href: "/workflow",
      },
      {
        title: "Customer stories",
        description: "Explore the practical wins teams cite after rollout.",
        href: "/customers",
      },
    ],
  },
  {
    label: "Controls",
    href: "/controls",
    tone: "emerald",
    summary: "Keep approvals, rollout sequencing, and downstream handoff visible so automation never becomes a black box.",
    items: [
      {
        title: "Human approval gates",
        description: "Keep release decisions under team control even as intake speeds up.",
        href: "/controls",
      },
      {
        title: "Phased rollout plan",
        description: "Adopt mailbox capture, reviewer workflow, and export readiness step by step.",
        href: "/pricing",
      },
      {
        title: "FAQ and launch fit",
        description: "Get answers on rollout scope, approvals, and operational readiness.",
        href: "/faq",
      },
      {
        title: "Open workspace",
        description: "Jump into the live application shell and inspect the operational surface.",
        href: "/dashboard",
      },
    ],
  },
  {
    label: "Security",
    href: "/security",
    tone: "amber",
    summary: "Security & data handling: OAuth, token rotation, webhook verification, retention, and incident response.",
    items: [
      {
        title: "Mailbox OAuth",
        description: "Provider OAuth flows with rotation and revocation visibility.",
        href: "/security",
      },
      {
        title: "Webhook verification",
        description: "Signature checks, secrets, and logged deliveries.",
        href: "/security",
      },
      {
        title: "Retention boundaries",
        description: "Workspace-bound records with audit trails.",
        href: "/security",
      },
      {
        title: "Incident response",
        description: "Measurable recovery and transparency practices.",
        href: "/security",
      },
    ],
  },
] as const;

export const footerLinkGroups = [
  {
    title: "Product",
    links: [
      { label: "Platform", href: "/platform" },
      { label: "Workflow", href: "/workflow" },
      { label: "Controls", href: "/controls" },
      { label: "Pricing", href: "/pricing" },
      { label: "Security & Data Handling", href: "/security" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Open workspace", href: "/dashboard" },
      { label: "See order review", href: marketingOrderReviewHref },
      { label: "Customer stories", href: "/customers" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "hello@orderpilot.ai", href: "mailto:hello@orderpilot.ai" },
      { label: "Request a rollout review", href: "mailto:hello@orderpilot.ai?subject=OrderPilot%20rollout%20review" },
      { label: "Book an operations demo", href: "mailto:hello@orderpilot.ai?subject=OrderPilot%20demo" },
    ],
  },
] as const;
