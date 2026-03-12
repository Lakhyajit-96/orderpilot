import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { testimonials } from "@/components/marketing/marketing-site-data";

export default function CustomersPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-glow opacity-60" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-10 sm:px-6 lg:px-8">
        <section className="max-w-3xl space-y-5">
          <Badge>Customer stories</Badge>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Outcome-focused proof from operations leaders and desk managers.
          </h1>
          <p className="text-base leading-8 text-white/70">
            Teams cite faster first-pass review, fewer re-entry loops, and clearer approvals. The workflow is valued because operators can trust it, not because the visuals look good.
          </p>
        </section>

        <section className="mt-14 grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <Card key={t.company} className="overflow-hidden">
              <CardHeader>
                <CardTitle>{t.name}</CardTitle>
                <CardDescription className="text-sm leading-7 text-white/70">{t.role} · {t.company}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-7 text-white/72">
                <p>{t.detail}</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {t.proofPoints.map((p) => (
                    <div key={p} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">{p}</div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}

