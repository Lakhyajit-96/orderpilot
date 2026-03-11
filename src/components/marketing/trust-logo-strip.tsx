import { Badge } from "@/components/ui/badge";
import { trustLogos } from "@/components/marketing/marketing-site-data";

export function TrustLogoStrip() {
  const items = [...trustLogos, ...trustLogos];

  return (
    <section className="mt-6 space-y-6">
      <div className="mx-auto max-w-3xl text-center">
        <Badge variant="muted">Ecosystem fit</Badge>
        <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Built to fit the systems distributor teams already run every day.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/64">
          OrderPilot is designed for shared mailbox intake, reviewer workflow, billing readiness, and ERP handoff — not for a disconnected demo flow.
        </p>
      </div>

      <div className="logo-marquee">
        <div className="logo-marquee-track">
          {items.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="mx-2 flex min-w-[210px] items-center gap-4 rounded-[24px] border border-white/10 bg-white/[0.04] px-5 py-4"
            >
              <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/80 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100">
                {logo.name.slice(0, 2)}
              </div>
              <div>
                <p className="font-display text-base font-semibold text-white">{logo.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/42">{logo.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}