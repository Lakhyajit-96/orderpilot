import type { MarketingDetailPageProps } from "@/components/marketing/marketing-detail-page";

export const marketingDetailSlugs = [
  "platform",
  "workflow",
  "controls",
  "pricing",
  "order-review",
  "customer-stories",
  "faq",
  "security",
  "contact",
] as const;

export type MarketingDetailSlug = (typeof marketingDetailSlugs)[number];

type PageTheme = {
  badge: string;
  title: string;
  description: string;
  buyer: string;
  promise: string;
  workflow: string;
  proof: string;
};

function buildPage(theme: PageTheme): MarketingDetailPageProps {
  return {
    badge: theme.badge,
    title: theme.title,
    description: theme.description,
    stats: [
      { label: "Buyer clarity", value: "8 sections", detail: `${theme.buyer} can review a complete story instead of a short landing-page summary.` },
      { label: "Visual proof", value: "3 product surfaces", detail: `High-resolution, screenshot-like visuals reinforce ${theme.promise.toLowerCase()}.` },
      { label: "Rollout framing", value: "Customer-ready", detail: `Each section explains ${theme.workflow.toLowerCase()} in language buyers can repeat internally.` },
    ],
    outcomes: [
      { title: "Why teams buy", text: `${theme.buyer} usually starts with a workflow problem. This page explains how OrderPilot solves it with a system buyers can picture clearly.` },
      { title: "What changes first", text: `${theme.promise} becomes visible in the first operating week because the team can see queue health, mapped drafts, and review decisions together.` },
      { title: "What decision-makers get", text: `${theme.proof} stays attached to the business case so operations, IT, and leadership can align before rollout.` },
    ],
    sections: [
      { eyebrow: "01 · Overview", title: `Explain ${theme.badge.toLowerCase()} in plain operational language`, text: `This section gives ${theme.buyer.toLowerCase()} a clear summary of ${theme.promise.toLowerCase()} without forcing them to decode generic SaaS copy.`, bullets: [
        `Frame the problem in terms customer teams already recognize`,
        `Show where OrderPilot fits inside the current operating model`,
        `Translate the product promise into buyer-safe language`,
      ] },
      { eyebrow: "02 · Operator experience", title: "Show what the desk experiences on day one", text: `Buyers want to know how the workflow feels for real coordinators and reviewers. This section centers the actual people doing the work.`, bullets: [
        `Shared intake replaces scattered mailbox triage`,
        `Structured drafts reduce repetitive re-keying`,
        `Reviewers see exceptions with context intact`,
      ] },
      { eyebrow: "03 · Customer impact", title: "Connect the workflow to customer response quality", text: `Customer-centric teams need more than efficiency claims. They need confidence that service quality, speed, and accuracy improve together.`, bullets: [
        `Faster response to inbound order demand`,
        `Fewer avoidable mistakes before ERP handoff`,
        `Clearer ownership when special handling is required`,
      ] },
      { eyebrow: "04 · Controls", title: "Make human approval boundaries obvious", text: `OrderPilot is strongest when buyers immediately understand that automation accelerates work without hiding decisions.`, bullets: [
        `Approvals remain in human hands`,
        `Exception paths are visible before release`,
        `Evidence stays attached to each reviewer decision`,
      ] },
      { eyebrow: "05 · Systems", title: "Position the workflow beside existing systems", text: `Buyers also need to understand how OrderPilot complements mailbox tools, ERP workflows, and team accountability instead of disrupting them.`, bullets: [
        `Mailbox capture supports staged rollout`,
        `ERP-ready drafts arrive with cleaner context`,
        `Operational ownership remains easy to explain internally`,
      ] },
      { eyebrow: "06 · Leadership", title: "Give leaders proof they can monitor", text: `Leadership adoption improves when queue visibility, throughput, and release readiness are easy to summarize.`, bullets: [
        `Operational proof can be reviewed in one system`,
        `Leaders can see where review slows down`,
        `Rollout readiness becomes measurable instead of anecdotal`,
      ] },
      { eyebrow: "07 · Rollout", title: "Describe implementation in a low-risk sequence", text: `Customer teams need rollout language that sounds practical. This section shows how the product is adopted step by step instead of all at once.`, bullets: [
        `Start with shared inbox visibility`,
        `Expand into reviewer workflow and approvals`,
        `Graduate into cleaner ERP handoff once trust is earned`,
      ] },
      { eyebrow: "08 · Business case", title: "Close with a customer-safe buying narrative", text: `The final section helps buyers repeat the case internally using language about throughput, control, service quality, and launch confidence.`, bullets: [
        `${theme.proof}`,
        `Reinforce ${theme.promise.toLowerCase()}`,
        `Give the buyer a clear next step toward evaluation`,
      ] },
    ],
    faqItems: [
      { question: `How does OrderPilot support ${theme.badge.toLowerCase()} without adding more complexity?`, answer: `OrderPilot is designed to simplify the operator experience first. The workflow becomes easier to adopt because the intake queue, review state, and readiness signals live in one coherent operating surface.` },
      { question: "Will our team still control approvals and exceptions?", answer: "Yes. Automation prepares and routes work, but the business rules, approvals, and final release decisions remain with your team." },
      { question: "Can we introduce this in stages?", answer: "Yes. Most teams begin with one mailbox or one order stream, prove the reviewer workflow, and then expand coverage once operators trust the system." },
      { question: "How does this help customer experience, not just internal efficiency?", answer: `The workflow helps teams respond faster, catch ambiguity earlier, and pass cleaner drafts downstream so customers receive more consistent service.` },
      { question: "What makes the evaluation credible for leadership?", answer: `Leadership can review visual workflow proof, rollout sequencing, and control boundaries in one place instead of interpreting abstract feature claims.` },
      { question: `Why does this page focus on ${theme.buyer.toLowerCase()}?`, answer: `Because buying decisions usually succeed when the people closest to the work can explain the value clearly to every stakeholder involved in rollout.` },
    ],
    primaryCta: { label: "Book an operations demo", href: "/contact" },
    secondaryCta: { label: "See pricing", href: "/pricing" },
    testimonialsTitle: `How customers talk about ${theme.badge.toLowerCase()} after rollout starts.`,
    testimonialsDescription: `These stories reinforce ${theme.promise.toLowerCase()} with language operations buyers actually use when describing value internally.`,
  };
}

export const marketingDetailContent: Record<MarketingDetailSlug, MarketingDetailPageProps> = {
  platform: buildPage({ badge: "Platform", title: "A complete order-intake platform for distributor operations teams.", description: "Show buyers how OrderPilot brings inbox capture, review workflow, and ERP-ready handoff into one premium operating system.", buyer: "operations leaders", promise: "a single platform for intake, review, and release", workflow: "the platform surface", proof: "The buyer sees a credible, end-to-end operating model instead of isolated features." }),
  workflow: buildPage({ badge: "Workflow", title: "Make the order journey easy to follow from inbox arrival to ERP-ready release.", description: "This page explains the real sequence buyers care about most: capture, draft creation, review, approval, and downstream handoff.", buyer: "order desk teams", promise: "a workflow that reduces manual back-and-forth", workflow: "the workflow arc", proof: "The buying team can explain the process step by step without guessing how the product really works." }),
  controls: buildPage({ badge: "Controls", title: "Keep control, auditability, and release discipline visible at every step.", description: "Buyers need confidence that speed does not come at the expense of approval quality. This page makes the control model explicit.", buyer: "operations and compliance stakeholders", promise: "faster intake with clear human oversight", workflow: "the control model", proof: "Risk, approvals, and accountability remain easy to explain to leadership and reviewers alike." }),
  pricing: buildPage({ badge: "Pricing", title: "Choose a rollout path that matches your current volume, team shape, and control needs.", description: "Pricing should sound like a rollout plan, not a checkout widget. This page explains how teams usually expand from first mailbox coverage to broader operational adoption.", buyer: "buyers comparing rollout options", promise: "a practical path from first value to broader deployment", workflow: "the rollout path", proof: "Stakeholders can see what each stage unlocks and why adoption can happen gradually." }),
  "order-review": buildPage({ badge: "Order review", title: "Show reviewers the exact evidence they need before approving an order draft.", description: "This page focuses on the mapped-line review experience, the place where buyer trust is often won or lost during evaluation.", buyer: "reviewers and approvers", promise: "a reviewer surface teams can trust", workflow: "the order-review surface", proof: "Reviewers can see why the workflow feels safer and faster than working from email threads and spreadsheets." }),
  "customer-stories": buildPage({ badge: "Customer stories", title: "Read the business outcomes teams talk about once OrderPilot is live.", description: "These customer-centric stories focus on operational wins buyers care about most: clarity, throughput, control, and service quality.", buyer: "prospective customers", promise: "customer proof that sounds practical and believable", workflow: "customer outcomes", proof: "The value story is grounded in workflow reality instead of abstract claims." }),
  faq: buildPage({ badge: "FAQ", title: "Answer the rollout, approval, and adoption questions buyers ask before they commit.", description: "This detailed FAQ page gives customer teams realistic answers they can share internally with operations, IT, and leadership stakeholders.", buyer: "cross-functional buying teams", promise: "clear answers to evaluation-stage questions", workflow: "the evaluation process", proof: "Common objections can be resolved with direct, operationally credible answers." }),
  security: buildPage({ badge: "Security", title: "Explain how OrderPilot protects data, approvals, and operational accountability.", description: "Security conversations matter early. This page frames mailbox access, review controls, and customer data handling in a way buyers can understand quickly.", buyer: "security, IT, and operations leaders", promise: "trustworthy data handling with visible control boundaries", workflow: "security and access expectations", proof: "Buyers can align technical review with operational adoption instead of treating them as separate conversations." }),
  contact: buildPage({ badge: "Contact", title: "Start a rollout conversation grounded in your team’s real operating constraints.", description: "The contact experience should feel like a business conversation, not a generic lead form. This page speaks directly to buyer planning, rollout timing, and evaluation scope.", buyer: "evaluation teams", promise: "a thoughtful next step toward rollout planning", workflow: "the contact and discovery process", proof: "The buyer leaves with a clearer understanding of what an OrderPilot rollout would look like for their team." }),
};