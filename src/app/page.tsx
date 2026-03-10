import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, Layers3, ShieldCheck } from "lucide-react";
import { HeroVisual } from "@/components/marketing/hero-visual";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const proof = ["74% straight-through rate", "2m 16s average review", "$3.8M routed this month"];
const features = [
  {
    icon: Bot,
    title: "AI extraction that understands order context",
    text: "Parse email bodies, attachments, SKU aliases, quantities, ship dates, and notes into a clean structured draft order.",
  },
  {
    icon: Layers3,
    title: "Exception routing without enterprise ugliness",
    text: "Every mismatch is surfaced with confidence, mapping evidence, and a reviewer lane that feels modern instead of clunky.",
  },
  {
    icon: ShieldCheck,
    title: "ERP-ready control layer",
    text: "Keep auditability, approval history, and export confidence before anything reaches the downstream system.",
  },
];
const steps = [
  "Orders land in a shared inbox or upload queue.",
  "OrderPilot extracts structured fields and maps each line item.",
  "Exceptions get triaged into a premium reviewer workflow.",
  "Approved orders become ERP-ready drafts.",
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
            <Link href="/dashboard" className="text-sm text-white/62 transition hover:text-white">Product</Link>
            <Link href="/orders" className="text-sm text-white/62 transition hover:text-white">Workspace</Link>
            <Button asChild variant="secondary" size="sm"><Link href="/dashboard">Open app</Link></Button>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <Badge>Build-first B2B infrastructure</Badge>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Turn emailed purchase orders into <span className="text-gradient">ERP-ready draft orders.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-white/66 sm:text-xl">
              OrderPilot ingests email threads and PDF attachments, extracts structured order data, resolves SKU ambiguity, and routes exceptions into a premium review workflow.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg"><Link href="/dashboard">Enter workspace <ArrowRight className="size-4" /></Link></Button>
              <Button asChild size="lg" variant="secondary"><Link href="/orders/PO-10482">See live order review</Link></Button>
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

        <section className="grid gap-4 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <Card key={title}>
              <CardHeader>
                <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-cyan-200"><Icon className="size-5" /></div>
                <CardTitle className="mt-4">{title}</CardTitle>
                <CardDescription className="leading-7">{text}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Card>
            <CardHeader>
              <CardTitle>Why this product is inevitable</CardTitle>
              <CardDescription>Industrial distributors already live in email-driven order intake. The workflow is real, expensive, and daily.</CardDescription>
            </CardHeader>
          </Card>
          <div className="grid gap-3 sm:grid-cols-2">
            {steps.map((step, index) => (
              <Card key={step}>
                <CardContent className="pt-6">
                  <p className="text-xs uppercase tracking-[0.26em] text-white/38">Step {index + 1}</p>
                  <p className="mt-3 text-base leading-8 text-white/78">{step}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
