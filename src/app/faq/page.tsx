import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { faqItems } from "@/components/marketing/marketing-site-data";

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

        <section className="mt-14 grid gap-6 md:grid-cols-2">
          {faqItems.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription className="text-sm leading-7 text-white/70">{item.subtitle}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-7 text-white/72">
                <p>{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}

