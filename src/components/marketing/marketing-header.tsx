import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { BrandLogo } from "@/components/brand/orderpilot-logo";
import { headerMenuGroups } from "@/components/marketing/marketing-site-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuToneClasses = {
  cyan: "text-cyan-200 border-cyan-300/20 bg-cyan-300/10",
  violet: "text-violet-200 border-violet-300/20 bg-violet-300/10",
  emerald: "text-emerald-200 border-emerald-300/20 bg-emerald-300/10",
  amber: "text-amber-100 border-amber-300/20 bg-amber-300/10",
} as const;

export function MarketingHeader() {
  return (
    <header className="panel sticky top-2 z-40 rounded-[24px] px-3 py-2.5 sm:px-3.5 sm:py-2.5">
      <div className="flex items-center justify-between gap-3">
        <BrandLogo href="/" size="xs" showTagline={false} />

        <div className="hidden items-center gap-1.5 xl:flex">
          {headerMenuGroups.map((group) => (
            <div key={group.label} className="marketing-nav-group">
              <Link href={group.href} className="marketing-nav-link font-display text-[13px] font-medium uppercase tracking-[0.22em] text-white/78">
                <span className={cn("rounded-full border px-2 py-1 text-[10px] tracking-[0.18em]", menuToneClasses[group.tone])}>
                  {group.label}
                </span>
                <ChevronDown className="marketing-nav-chevron size-3.5 text-white/44 transition-transform duration-200" />
              </Link>

              <div className="marketing-nav-panel w-[720px] max-w-[calc(100vw-6rem)] rounded-[26px] border border-white/10 bg-slate-950/95 p-3.5 shadow-[0_24px_80px_rgba(2,8,26,0.55)] backdrop-blur-2xl">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
                  <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5">
                    <div className={cn("inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]", menuToneClasses[group.tone])}>
                      {group.label}
                    </div>
                    <p className="mt-4 text-lg font-semibold text-white">Explore the product surface buyers ask about first.</p>
                    <p className="mt-3 text-sm leading-7 text-white/62">{group.summary}</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {group.items.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4 transition-transform duration-200 hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.06]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-semibold text-white">{item.title}</p>
                          <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-white/38" />
                        </div>
                        <p className="mt-3 text-sm leading-6 text-white/60">{item.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button asChild size="sm">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
