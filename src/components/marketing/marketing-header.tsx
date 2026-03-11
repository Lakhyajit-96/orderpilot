"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/brand/orderpilot-logo";
import { resolveMarketingHref } from "@/components/marketing/marketing-header-core";
import { headerMenuGroups } from "@/components/marketing/marketing-site-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuToneClasses = {
  cyan: "text-cyan-200 border-cyan-300/20 bg-cyan-300/10",
  violet: "text-violet-200 border-violet-300/20 bg-violet-300/10",
  emerald: "text-emerald-200 border-emerald-300/20 bg-emerald-300/10",
  amber: "text-amber-100 border-amber-300/20 bg-amber-300/10",
} as const;

type MarketingHeaderProps = {
  compact?: boolean;
  sticky?: boolean;
  className?: string;
  primaryCta?: {
    label: string;
    href: string;
  };
};

export function MarketingHeader({
  compact = false,
  sticky = true,
  className,
  primaryCta = { label: "View plans", href: "/pricing" },
}: MarketingHeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const resolvedPrimaryCtaHref = resolveMarketingHref(primaryCta.href, pathname);

  const menuGroups = useMemo(
    () =>
      headerMenuGroups.map((group) => ({
        ...group,
        href: resolveMarketingHref(group.href, pathname),
        items: group.items.map((item) => ({
          ...item,
          href: resolveMarketingHref(item.href, pathname),
        })),
      })),
    [pathname],
  );

  return (
    <header
      className={cn(
        "panel z-40 rounded-[26px] px-3.5 py-3 sm:px-5",
        sticky && "sticky top-4",
        compact && "rounded-[24px] px-3 py-2.5 sm:px-4",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <BrandLogo href="/" size={compact ? "sm" : "md"} showTagline={false} />

        <div className="hidden items-center gap-1.5 xl:flex">
          {menuGroups.map((group) => (
            <div key={group.label} className="marketing-nav-group">
              <Link href={group.href} className="marketing-nav-link font-display text-[12px] font-medium uppercase tracking-[0.2em] text-white/78">
                <span className={cn("rounded-full border px-2 py-1 text-[10px] tracking-[0.17em]", menuToneClasses[group.tone])}>
                  {group.label}
                </span>
                <ChevronDown className="marketing-nav-chevron size-3.5 text-white/44 transition-transform duration-200" />
              </Link>

              <div className="marketing-nav-panel w-[760px] max-w-[calc(100vw-8rem)] rounded-[28px] border border-white/10 bg-slate-950/95 p-4 shadow-[0_24px_80px_rgba(2,8,26,0.55)] backdrop-blur-2xl">
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

        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link href={resolvedPrimaryCtaHref} onClick={closeMobileMenu}>{primaryCta.label}</Link>
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="xl:hidden"
            onClick={() => setIsMobileMenuOpen((value) => !value)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close header menu" : "Open header menu"}
          >
            {isMobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="mt-3 border-t border-white/8 pt-3 xl:hidden">
          <div className="grid gap-3">
            {menuGroups.map((group) => (
              <div key={group.label} className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-center justify-between gap-3">
                  <Link href={group.href} className="font-display text-sm font-semibold text-white" onClick={closeMobileMenu}>
                    {group.label}
                  </Link>
                  <span className={cn("rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.18em]", menuToneClasses[group.tone])}>
                    {group.label}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/60">{group.summary}</p>
                <div className="mt-4 grid gap-2">
                  {group.items.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-slate-950/55 px-3.5 py-3 text-sm text-white/74 transition hover:border-white/16 hover:text-white"
                    >
                      <span>{item.title}</span>
                      <ArrowUpRight className="size-4 text-white/36" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}