import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { FeatureVisualGrid } from "@/components/marketing/feature-visual-grid";
import { HeroVisual } from "@/components/marketing/hero-visual";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { TestimonialsSection } from "@/components/marketing/testimonials-section";
import { TrustLogoStrip } from "@/components/marketing/trust-logo-strip";
import { WorkflowVisualStrip } from "@/components/marketing/workflow-visual-strip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type DetailStat = {
  label: string;
  value: string;
  detail: string;
};

type DetailOutcome = {
  title: string;
  text: string;
};

type DetailSection = {
  eyebrow: string;
  title: string;
  text: string;
  bullets: readonly string[];
};

type DetailFaqItem = {
  question: string;
  answer: string;
};

type DetailCta = {
  label: string;
  href: string;
};

export type MarketingDetailPageProps = {
  badge: string;
  title: string;
  description: string;
  stats: readonly DetailStat[];
  outcomes: readonly DetailOutcome[];
  sections: readonly DetailSection[];
  faqItems: readonly DetailFaqItem[];
  primaryCta?: DetailCta;
  secondaryCta?: DetailCta;
  testimonialsTitle: string;
  testimonialsDescription: string;
};

export function MarketingDetailPage({
  badge,
  title,
  description,
  stats,
  outcomes,
  sections,
  faqItems,
  primaryCta = { label: "Book an operations demo", href: "/contact" },
  secondaryCta = { label: "See pricing", href: "/pricing" },
  testimonialsTitle,
  testimonialsDescription,
}: MarketingDetailPageProps) {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-glow opacity-70" />
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <MarketingHeader primaryCta={{ label: "Book demo", href: "/contact" }} />

        <section className="flex flex-col py-16 lg:py-20">
          <div className="mx-auto max-w-5xl text-center">
            <Badge>{badge}</Badge>
            <h1 className="mt-6 font-display text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-white/66 sm:text-xl">
              {description}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg"><Link href={primaryCta.href}>{primaryCta.label} <ArrowRight className="size-4" /></Link></Button>
              <Button asChild size="lg" variant="secondary"><Link href={secondaryCta.href}>{secondaryCta.label}</Link></Button>
            </div>
          </div>

          <div className="mt-12 w-full xl:mt-14">
            <HeroVisual />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {stats.map((item) => (
            <Card key={item.label} className="border-white/12 bg-white/[0.05]">
              <CardContent className="pt-6">
                <p className="text-xs uppercase tracking-[0.24em] text-white/38">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
                <p className="mt-3 text-sm leading-7 text-white/66">{item.detail}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <TrustLogoStrip />

        <section className="mt-24 grid gap-4 md:grid-cols-3">
          {outcomes.map((item) => (
            <Card key={item.title} className="border-white/12 bg-white/[0.05]">
              <CardContent className="pt-6">
                <p className="text-lg font-semibold text-white">{item.title}</p>
                <p className="mt-3 text-sm leading-7 text-white/66">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-24 space-y-8">
          <div className="max-w-3xl">
            <Badge variant="violet">Product surfaces</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              See the operating system buyers are actually evaluating.
            </h2>
            <p className="mt-4 text-base leading-8 text-white/68">
              Every page uses the same OrderPilot design system and the same screenshot-like product surfaces so teams can connect the promise to the real workflow.
            </p>
          </div>
          <FeatureVisualGrid />
        </section>

        <section className="mt-24 space-y-8">
          <div className="max-w-3xl">
            <Badge variant="success">Connected workflow</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Animated connectors make the order journey easy to explain internally.
            </h2>
          </div>
          <WorkflowVisualStrip />
        </section>

        <section className="mt-24 grid gap-4 xl:grid-cols-2">
          {sections.map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <Badge variant="muted">{section.eyebrow}</Badge>
                <CardTitle className="mt-4 font-display text-2xl">{section.title}</CardTitle>
                <CardDescription className="text-base leading-8 text-white/68">{section.text}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm leading-7 text-white/72">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <CheckCircle2 className="mt-1 size-4 shrink-0 text-cyan-200" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </section>

        <TestimonialsSection title={testimonialsTitle} description={testimonialsDescription} />

        <section className="mt-24 grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="max-w-2xl">
            <Badge variant="violet">FAQ</Badge>
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Answers buyers ask once they start comparing rollout options seriously.
            </h2>
            <p className="mt-4 text-base leading-8 text-white/64">
              These detailed answers are written for customer-facing evaluation conversations, not placeholder marketing filler.
            </p>
          </div>
          <FaqAccordion items={faqItems} />
        </section>

        <section className="mt-24 pb-6">
          <div className="panel rounded-[32px] px-6 py-8 sm:px-8 sm:py-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <Badge>Next step</Badge>
                <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Turn the evaluation into a rollout plan your team can support.
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-white/68">
                  OrderPilot is designed to help buyers explain the workflow clearly to operations, IT, and customer service stakeholders before launch.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button asChild size="lg"><Link href={primaryCta.href}>{primaryCta.label} <ArrowRight className="size-4" /></Link></Button>
                <Button asChild size="lg" variant="secondary"><Link href={secondaryCta.href}>{secondaryCta.label}</Link></Button>
              </div>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}