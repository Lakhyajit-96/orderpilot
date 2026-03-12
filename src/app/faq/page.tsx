import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { marketingOrderReviewHref } from "@/components/marketing/marketing-site-data";

export default function FaqPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-glow opacity-60" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <section className="max-w-3xl space-y-5">
          <Badge variant="violet">FAQ</Badge>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Answers for operations, IT, and order desk leaders.
          </h1>
          <p className="text-base leading-8 text-white/70">
            The questions teams ask once they understand the workflow: how fast value shows up, how approvals remain protected, and how rollout happens without chaos.
          </p>
        </section>

        <section className="mt-14">
          <FaqAccordion />
        </section>

        <section className="mt-16">
          <div className="panel rounded-[32px] px-6 py-8 sm:px-8 sm:py-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <Badge>Next step</Badge>
                <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">Open the workspace or inspect live order review.</h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-white/68">
                  Start with the dashboard to see workspace signals, or inspect the review surface to understand exceptions and approvals in action.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button asChild size="lg"><Link href="/dashboard">Open dashboard</Link></Button>
                <Button asChild size="lg" variant="secondary"><Link href={marketingOrderReviewHref}>Inspect order review</Link></Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
