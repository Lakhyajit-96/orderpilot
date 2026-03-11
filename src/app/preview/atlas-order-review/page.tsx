import Link from "next/link";
import { ArrowRight, CheckCircle2, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { orderReviewPreview } from "@/components/marketing/marketing-visual-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AtlasOrderReviewPreviewPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-glow opacity-70" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <MarketingHeader />

        <section className="panel mt-10 rounded-[32px] p-6 lg:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <Badge variant="violet">Public order review preview</Badge>
              <h1 className="mt-4 break-words font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {orderReviewPreview.heading}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-white/68">{orderReviewPreview.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {orderReviewPreview.badges.map((badge, index) => (
                  <Badge key={badge} variant={index === 1 ? "violet" : index === 2 ? "success" : "default"}>
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="max-w-xl rounded-[28px] border border-cyan-300/16 bg-[linear-gradient(135deg,rgba(114,228,255,0.12),rgba(124,92,255,0.08))] p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-100/78">Why this route exists</p>
              <p className="mt-3 text-sm leading-7 text-white/72">
                This is a marketing-safe, shareable preview of the Atlas Industrial review experience. It mirrors the real mapped-line workflow while keeping live workspace data, approvals, and export actions behind sign-in.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/dashboard">
                    Dashboard
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/">Back to home</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle>Line-item mapping</CardTitle>
              <CardDescription>Representative mapped-line review with the exception surfaced before release.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {orderReviewPreview.lineItems.map((line) => (
                <div key={`${line.line}-${line.sku}`} className="overflow-hidden rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs uppercase tracking-[0.22em] text-white/40">Line {line.line}</p>
                      <p className="mt-2 break-words text-sm font-medium text-white">{line.description}</p>
                      <p className="mt-1 text-sm text-white/58">Requested SKU <span className="break-all text-white/76">{line.sku}</span> · Qty {line.qty}</p>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <Badge>{line.match} match</Badge>
                      <Badge variant={line.state === "Matched" ? "success" : "violet"}>{line.state}</Badge>
                    </div>
                  </div>
                  <div className="mt-4 rounded-2xl border border-white/8 bg-slate-950/60 px-4 py-3 text-sm text-white/70">
                    ERP mapping target: <span className="break-all font-medium text-white">{line.mappedTo}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Source and review context</CardTitle>
                <CardDescription>Mailbox intake proof, exception context, and shipping details preserved in one place.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/72">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 size-4 shrink-0 text-cyan-200" />
                    <div>
                      <p className="font-medium text-white">{orderReviewPreview.sourceMailbox}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/42">{orderReviewPreview.sourceDetail}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-violet-400/20 bg-violet-400/8 px-4 py-3 text-sm text-violet-50">
                  {orderReviewPreview.exception}
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
                  {orderReviewPreview.shippingAddress}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Approval chain</CardTitle>
                <CardDescription>The review path remains explicit even in the public preview.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {orderReviewPreview.approvals.map((approval) => (
                  <div key={approval.step} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-white">{approval.title}</p>
                      <ShieldCheck className="size-4 text-violet-200" />
                    </div>
                    <p className="mt-2 text-xs uppercase tracking-[0.22em] text-white/42">{approval.step}</p>
                    <p className="mt-2 text-sm text-white/62">{approval.meta}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Captured reviewer context</CardTitle>
                <CardDescription>Exactly the kind of supporting detail buyers expect to see during review.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {orderReviewPreview.notes.map((note) => (
                  <div key={note} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-white/70">
                    {note}
                  </div>
                ))}
                <div className="rounded-2xl border border-cyan-300/16 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-50">
                  <div className="flex items-center gap-3">
                    <Sparkles className="size-4 shrink-0" />
                    <span>Representative preview data only — live approvals and export actions remain secured inside the workspace.</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview timeline</CardTitle>
                <CardDescription>Shows the operational arc from intake to reviewer handoff.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {orderReviewPreview.activity.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}