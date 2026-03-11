import type { LucideIcon } from "lucide-react";
import { Bot, FileSearch2, MessagesSquare, ShieldCheck, TrendingUp, Users } from "lucide-react";

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
    metric: "42% faster first-pass review",
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
    metric: "3 shared inboxes unified in week one",
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
    metric: "98% of orders routed with clear next action",
    rating: 5,
    tone: "from-emerald-300/18 via-slate-950/0 to-cyan-300/10",
    hairColor: "#3a241d",
    accentColor: "#5EEAD4",
  },
  {
    name: "Dana Whitlock",
    role: "Customer Service Manager",
    company: "NorthRiver Industrial",
    quote:
      "Before OrderPilot, every rush order started with inbox archaeology. Now the queue already tells my team what was extracted, what is missing, and who should own the next decision.",
    metric: "31% fewer manual touchpoints per order",
    rating: 5,
    tone: "from-cyan-300/16 via-slate-950/0 to-emerald-300/16",
    hairColor: "#2c243f",
    accentColor: "#60A5FA",
  },
  {
    name: "Victor Salas",
    role: "VP of Supply Chain Systems",
    company: "Harborline Process Equipment",
    quote:
      "The rollout worked because leadership could see controls, reviewers could see evidence, and coordinators could finally stop re-keying the same customer demand into multiple systems.",
    metric: "First ERP-ready draft delivered in 9 days",
    rating: 5,
    tone: "from-violet-300/18 via-slate-950/0 to-emerald-300/12",
    hairColor: "#1b1d2f",
    accentColor: "#A78BFA",
  },
  {
    name: "Shannon Brooks",
    role: "Director of Order Operations",
    company: "Evercrest Motion",
    quote:
      "We bought it for extraction, but the real value was visibility. The team could see queue health, review blockers, and release readiness without asking three different people for status.",
    metric: "2.4 hours saved per coordinator each day",
    rating: 5,
    tone: "from-emerald-300/16 via-slate-950/0 to-cyan-300/12",
    hairColor: "#3f2c28",
    accentColor: "#34D399",
  },
  {
    name: "Leah Morgan",
    role: "Senior Manager, Customer Fulfillment",
    company: "Trident Flow Systems",
    quote:
      "The reason our service team trusted OrderPilot was simple: the draft, the exception, and the original customer evidence were all visible in one place. Nobody had to reconstruct the story from email threads.",
    metric: "37% faster response on same-day priority orders",
    rating: 5,
    tone: "from-cyan-300/14 via-slate-950/0 to-violet-300/12",
    hairColor: "#2d2337",
    accentColor: "#67E8F9",
  },
  {
    name: "Omar Bennett",
    role: "Head of Distribution Operations",
    company: "Keystone Parts Group",
    quote:
      "What sold the team internally was that OrderPilot looked like an operating system, not a black box. Supervisors could see rollout readiness, reviewers could see blockers, and coordinators could move faster with confidence.",
    metric: "4.1 fewer status-check messages per order cycle",
    rating: 5,
    tone: "from-emerald-300/16 via-slate-950/0 to-cyan-300/12",
    hairColor: "#30251f",
    accentColor: "#5EEAD4",
  },
] as const;

export const trustLogos = [
  { id: "microsoft-365", name: "Microsoft 365", label: "Shared mailbox sync" },
  { id: "gmail", name: "Gmail", label: "Routing alias intake" },
  { id: "netsuite", name: "NetSuite", label: "ERP handoff" },
  { id: "sap", name: "SAP", label: "Enterprise export" },
  { id: "dynamics-365", name: "Dynamics 365", label: "Ops system alignment" },
  { id: "stripe", name: "Stripe", label: "Billing and rollout" },
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
        title: "Pricing and rollout",
        description: "Compare rollout paths and see what each stage unlocks for the operation.",
        href: "/pricing",
      },
      {
        title: "Security and controls",
        description: "Understand how approvals, auditability, and mailbox access stay protected.",
        href: "/security",
      },
      {
        title: "Customer proof",
        description: "Read how operations teams use the workflow in practice.",
        href: "/customer-stories",
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
        href: "/order-review",
      },
      {
        title: "Measure impact",
        description: "See how coordinators, reviewers, and leaders each benefit from the workflow.",
        href: "/customer-stories",
      },
      {
        title: "Implementation FAQ",
        description: "Review how rollout usually begins, how approvals work, and what buyers ask first.",
        href: "/faq",
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
        title: "Security and compliance",
        description: "Review how OrderPilot handles order data, mailbox connections, approvals, and audit expectations.",
        href: "/security",
      },
      {
        title: "Talk through rollout",
        description: "See how implementation, mailbox onboarding, and training are typically sequenced.",
        href: "/contact",
      },
    ],
  },
  {
    label: "See order review",
    href: "/order-review",
    tone: "amber",
    summary: "Open the representative order-review experience to inspect mapped lines, exceptions, and approval context in action.",
    items: [
      {
        title: "Order detail surface",
        description: "Inspect the actual mapped-line review screen used in the product visual system.",
        href: "/order-review",
      },
      {
        title: "Why reviewers trust it",
        description: "See how evidence, notes, and approvals stay tied to the order.",
        href: "/controls",
      },
      {
        title: "Testimonials",
        description: "Read how review teams describe their first rollout wins.",
        href: "/customer-stories",
      },
      {
        title: "Pricing and rollout",
        description: "Match the product surface with the rollout path your team needs.",
        href: "/pricing",
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
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Order review", href: "/order-review" },
      { label: "Customer stories", href: "/customer-stories" },
      { label: "FAQ", href: "/faq" },
      { label: "Security", href: "/security" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Privacy policy", href: "/privacy-policy" },
      { label: "Terms & conditions", href: "/terms-and-conditions" },
    ],
  },
] as const;