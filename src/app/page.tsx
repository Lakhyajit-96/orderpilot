import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  FileSearch2,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { FeatureVisualGrid } from "@/components/marketing/feature-visual-grid";
import { HeroVisual } from "@/components/marketing/hero-visual";
import { WorkflowVisualStrip } from "@/components/marketing/workflow-visual-strip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const proof = [
  "Shared inbox intake for distributor teams",
  "Reviewer-controlled exception handling",
  "ERP-ready handoff before export",
];

const signals = [
  {
    label: "Intake surface",
    title: "Email, PDF, and attachment orders in one queue",
    text: "Give the order desk one operating surface for inbox intake, uploads, and exception follow-up instead of scattered forwarding chains.",
  },
  {
    label: "Reviewer flow",
    title: "Confidence-led review before anyone exports",
    text: "Route low-confidence fields, mapping gaps, and ship-date questions into a workflow your team can close quickly.",
  },
  {
    label: "ERP handoff",
    title: "Structured drafts your downstream system can trust",
    text: "Approved orders leave the review queue with mappings, notes, and approval history intact for the final handoff.",
  },
];

const steps = [
  {
    title: "Capture every incoming order request",
    text: "Customer emails, PDFs, and forwarded quote requests land in a shared intake surface instead of personal inboxes.",
    detail: "Shared inbox + uploads",
  },
  {
    title: "Extract fields and line items into a draft",
    text: "OrderPilot maps customer references, quantities, ship dates, and notes into a structured order your team can inspect immediately.",
    detail: "Structured draft generation",
  },
  {
    title: "Route mismatches to the right reviewer",
    text: "Confidence gaps, unmapped SKUs, and special terms are surfaced with evidence so reviewers can resolve them without hunting through emails.",
    detail: "Evidence-backed exception queue",
  },
  {
    title: "Approve and hand off with context preserved",
    text: "The final draft keeps reviewer decisions, notes, and status changes visible before the ERP export or order desk handoff.",
    detail: "Audit-ready ERP prep",
  },
];

const teamViews = [
  {
    icon: Users,
    title: "For order desk teams",
    text: "Start from a prepared draft instead of manually re-entering every emailed line item.",
    bullets: [
      "Centralized intake across shared inboxes",
      "Prepared draft orders with highlighted gaps",
      "Cleaner handoff between coordinators and reviewers",
    ],
  },
  {
    icon: FileSearch2,
    title: "For reviewers and approvers",
    text: "See why a field was extracted, where confidence drops, and what still needs human judgment.",
    bullets: [
      "Source-aware extraction evidence",
      "Clear mismatch and exception routing",
      "Approval history before export",
    ],
  },
  {
    icon: TrendingUp,
    title: "For ops leaders",
    text: "Measure launch readiness around intake coverage, review throughput, and ERP handoff confidence.",
    bullets: [
      "One place to monitor order flow",
      "Operational checkpoints before downstream export",
      "Visible adoption path for the full team",
    ],
  },
];

const controls = [
  {
    icon: MessagesSquare,
    title: "Exception context stays attached",
    text: "Teams do not lose the original customer signal—reviewers can work from captured notes, source documents, and mapped fields together.",
  },
  {
    icon: ShieldCheck,
    title: "Human approval remains the release gate",
    text: "OrderPilot accelerates intake and review, but final control still sits with the people responsible for the order outcome.",
  },
  {
    icon: Sparkles,
    title: "Designed for phased rollout",
    text: "Start with inbox capture and review visibility, then expand into ERP-ready export when the team is comfortable with the workflow.",
  },
];

const faqs = [
  {
    question: "What changes first when a distributor launches OrderPilot?",
    answer:
      "The biggest day-one change is operational visibility: the shared inbox becomes a structured work queue, and every new order arrives with extraction context instead of manual re-entry work.",
  },
  {
    question: "Does the team still decide what gets approved?",
    answer:
      "Yes. The platform is designed to accelerate intake and highlight risk, not bypass review. Exceptions, approvals, and ERP handoff remain controlled by your team.",
  },
  {
    question: "Can OrderPilot support a staged rollout?",
    answer:
      "Yes. Teams can begin with shared inbox intake and reviewer workflow, then expand into billing, launch readiness, and export integration as operating confidence grows.",
  },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-glow opacity-70" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <header className="panel flex items-center justify-between rounded-full px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#72e4ff,#7c5cff)] text-slate-950 shadow-[0_14px_40px_rgba(80,160,255,0.35)]">
              <Bot className="size-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-white/40">OrderPilot</p>
              <p className="text-sm text-white/72">AI order intake for distributors</p>
            </div>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Link href="#platform-capabilities" className="text-sm text-white/62 transition hover:text-white">Platform</Link>
            <Link href="#workflow" className="text-sm text-white/62 transition hover:text-white">Workflow</Link>
            <Link href="#controls" className="text-sm text-white/62 transition hover:text-white">Controls</Link>
            <Link href="/orders/PO-10482" className="text-sm text-white/62 transition hover:text-white">See order review</Link>
            <Button asChild variant="secondary" size="sm"><Link href="/dashboard">Open app</Link></Button>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[0.96fr_1.04fr] lg:py-20 xl:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Badge>Built for distributor operations</Badge>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Turn emailed purchase orders into <span className="text-gradient">ERP-ready draft orders.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-white/66 sm:text-xl">
              OrderPilot turns emailed POs and attachments into structured order drafts, highlights exceptions, and routes review before the ERP handoff.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg"><Link href="/dashboard">Enter workspace <ArrowRight className="size-4" /></Link></Button>
              <Button asChild size="lg" variant="secondary"><Link href="/orders/PO-10482">See order review</Link></Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-3 text-sm text-white/54">
              {proof.map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                  <CheckCircle2 className="size-4 text-cyan-200" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <HeroVisual />
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {signals.map(({ label, title, text }) => (
            <Card key={title} className="border-white/12 bg-white/[0.05]">
              <CardContent className="pt-6">
                <p className="text-xs uppercase tracking-[0.28em] text-white/38">{label}</p>
                <p className="mt-3 text-lg font-semibold text-white">{title}</p>
                <p className="mt-3 text-sm leading-7 text-white/66">{text}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section id="platform-capabilities" className="mt-18 grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <Card className="h-full">
            <CardHeader>
              <Badge>Platform capabilities</Badge>
              <CardTitle className="mt-4 text-3xl sm:text-4xl">Built for the realities of distributor order intake.</CardTitle>
              <CardDescription className="text-base leading-8 text-white/68">
                OrderPilot is not just extraction. It combines intake capture, reviewer workflow, and downstream readiness so teams can improve operations without giving up control.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-[22px] border border-white/10 bg-slate-950/60 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-white/40">What operations teams get</p>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-white/72">
                  <li>• A live dashboard surface for launch readiness, queue health, and next action</li>
                  <li>• A reviewer workstation with mapped lines, approval context, and exceptions in one place</li>
                  <li>• Rollout controls for mailbox connections, billing state, and ERP handoff readiness</li>
                </ul>
              </div>
              <div className="mt-4 rounded-[22px] border border-cyan-300/12 bg-[linear-gradient(135deg,rgba(114,228,255,0.08),rgba(124,92,255,0.06))] p-5 text-sm leading-7 text-white/72">
                The visuals below are derived from the actual dashboard, review, and settings surfaces so buyers immediately understand what the live product feels like.
              </div>
            </CardContent>
          </Card>
          <FeatureVisualGrid />
        </section>

        <section id="workflow" className="mt-16 space-y-6">
          <div className="max-w-3xl">
            <Badge variant="violet">Operational workflow</Badge>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">A cinematic view of intake → review → approval.</h2>
            <p className="mt-4 text-base leading-8 text-white/68">
              The landing page now shows the actual operating arc: shared inbox capture, AI draft generation, reviewer exception handling, and the final ERP-ready handoff.
            </p>
          </div>

          <WorkflowVisualStrip />

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <Card key={step.title}>
                <CardContent className="pt-6">
                  <p className="text-xs uppercase tracking-[0.26em] text-white/38">Step {index + 1}</p>
                  <p className="mt-3 text-lg font-semibold text-white">{step.title}</p>
                  <p className="mt-3 text-sm leading-7 text-white/72">{step.text}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.24em] text-cyan-200">{step.detail}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="max-w-3xl">
            <Badge>Where teams feel the impact</Badge>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Designed for the people who have to make the order flow work every day.</h2>
            <p className="mt-4 text-base leading-8 text-white/68">
              Different roles care about different outcomes. The homepage now makes that explicit: faster draft creation for coordinators, better evidence for reviewers, and clearer launch metrics for ops leaders.
            </p>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {teamViews.map(({ icon: Icon, title, text, bullets }) => (
              <Card key={title}>
                <CardHeader>
                  <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan-200"><Icon className="size-5" /></div>
                  <CardTitle className="mt-4">{title}</CardTitle>
                  <CardDescription className="leading-7">{text}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm leading-7 text-white/72">
                    {bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <CheckCircle2 className="mt-1 size-4 shrink-0 text-cyan-200" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="controls" className="mt-16 grid gap-6 lg:grid-cols-[1.04fr_0.96fr]">
          <Card>
            <CardHeader>
              <Badge variant="success">Controls and rollout</Badge>
              <CardTitle className="mt-4">Adoption gets easier when the control model is obvious.</CardTitle>
              <CardDescription className="text-base leading-8 text-white/68">
                The marketing story should reassure operations leaders that OrderPilot improves speed without turning approvals into a black box.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              {controls.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-[22px] border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-cyan-200">
                    <Icon className="size-4" />
                  </div>
                  <p className="mt-4 text-base font-semibold text-white">{title}</p>
                  <p className="mt-3 text-sm leading-7 text-white/68">{text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="grid gap-4">
            {faqs.map(({ question, answer }) => (
              <Card key={question}>
                <CardContent className="pt-6">
                  <p className="text-base font-semibold text-white">{question}</p>
                  <p className="mt-3 text-sm leading-7 text-white/68">{answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-16 pb-6">
          <div className="panel rounded-[32px] px-6 py-8 sm:px-8 sm:py-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <Badge>Next step</Badge>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">See the workspace, then inspect how an order gets reviewed.</h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-white/68">
                  The homepage now tells a fuller operations story. From here, buyers can jump straight into the app shell or a representative order-review screen to understand the product in context.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button asChild size="lg"><Link href="/dashboard">Open workspace <ArrowRight className="size-4" /></Link></Button>
                <Button asChild size="lg" variant="secondary"><Link href="/orders/PO-10482">Inspect order review</Link></Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
