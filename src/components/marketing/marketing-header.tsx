 "use client";
 
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { BrandLogo } from "@/components/brand/orderpilot-logo";
import { headerMenuGroups } from "@/components/marketing/marketing-site-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const menuToneClasses = {
  cyan: "text-cyan-200 border-cyan-300/20 bg-cyan-300/10",
  violet: "text-violet-200 border-violet-300/20 bg-violet-300/10",
  emerald: "text-emerald-200 border-emerald-300/20 bg-emerald-300/10",
  amber: "text-amber-100 border-amber-300/20 bg-amber-300/10",
} as const;

const ringToneClasses = {
  cyan: "focus:ring-cyan-300/40",
  violet: "focus:ring-violet-300/40",
  emerald: "focus:ring-emerald-300/40",
  amber: "focus:ring-amber-300/40",
} as const;

export function MarketingHeader() {
  const [openIndex, setOpenIndex] = useState<number>(-1);
  const hoverOpenTimer = useRef<number | null>(null);
  const hoverCloseTimer = useRef<number | null>(null);
  const menubarRef = useRef<HTMLDivElement | null>(null);
  const groupLinkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const coarsePointerRef = useRef(false);

  useEffect(() => {
    const nav = navigator as Navigator & { maxTouchPoints?: number };
    const coarse =
      typeof window !== "undefined" &&
      (window.matchMedia?.("(pointer: coarse)").matches || (nav?.maxTouchPoints ?? 0) > 0);
    coarsePointerRef.current = !!coarse;
    return () => {
      if (hoverOpenTimer.current) window.clearTimeout(hoverOpenTimer.current);
      if (hoverCloseTimer.current) window.clearTimeout(hoverCloseTimer.current);
    };
  }, []);

  const focusGroupLink = (idx: number) => {
    const el = groupLinkRefs.current[idx];
    if (el) el.focus();
  };

  const onGroupMouseEnter = (idx: number) => {
    if (coarsePointerRef.current) return;
    if (hoverCloseTimer.current) window.clearTimeout(hoverCloseTimer.current);
    if (hoverOpenTimer.current) window.clearTimeout(hoverOpenTimer.current);
    hoverOpenTimer.current = window.setTimeout(() => setOpenIndex(idx), 100);
  };
  const onGroupMouseLeave = () => {
    if (coarsePointerRef.current) return;
    if (hoverOpenTimer.current) window.clearTimeout(hoverOpenTimer.current);
    if (hoverCloseTimer.current) window.clearTimeout(hoverCloseTimer.current);
    hoverCloseTimer.current = window.setTimeout(() => setOpenIndex(-1), 160);
  };

  const onGroupClick = (idx: number, hasPanel: boolean) => {
    if (!hasPanel) return;
    if (!coarsePointerRef.current) return;
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  };

  const onGroupKeyDown = (e: React.KeyboardEvent, idx: number, hasPanel: boolean) => {
    const last = headerMenuGroups.length - 1;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = idx === last ? 0 : idx + 1;
      setOpenIndex(-1);
      focusGroupLink(next);
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = idx === 0 ? last : idx - 1;
      setOpenIndex(-1);
      focusGroupLink(prev);
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setOpenIndex(-1);
      focusGroupLink(idx);
      return;
    }
    if ((e.key === "ArrowDown" || e.key === " ") && hasPanel) {
      e.preventDefault();
      setOpenIndex(idx);
      const panel = menubarRef.current?.querySelectorAll(".marketing-nav-group")[idx]?.querySelector(".marketing-nav-panel");
      const firstItem = panel?.querySelector("a");
      (firstItem as HTMLAnchorElement | null)?.focus();
      return;
    }
    if (e.key === "ArrowUp" && hasPanel) {
      e.preventDefault();
      setOpenIndex(idx);
      const panel = menubarRef.current?.querySelectorAll(".marketing-nav-group")[idx]?.querySelector(".marketing-nav-panel");
      const links = panel?.querySelectorAll("a");
      const lastLink = links?.[links.length - 1] as HTMLAnchorElement | undefined;
      lastLink?.focus();
      return;
    }
  };

  return (
    <header className="panel sticky top-2 z-40 rounded-[24px] px-3 py-2.5 sm:px-3.5 sm:py-2.5">
      <div className="flex items-center justify-between gap-3">
        <BrandLogo href="/" size="xs" showTagline={false} />

        <div
          ref={menubarRef}
          role="menubar"
          aria-label="Primary"
          className="hidden items-center gap-1.5 xl:flex"
        >
          {headerMenuGroups.map((group, i) => (
            <div
              key={group.label}
              className="marketing-nav-group relative"
              onMouseEnter={() => onGroupMouseEnter(i)}
              onMouseLeave={onGroupMouseLeave}
            >
              <Link
                href={group.href}
                ref={(el) => {
                  groupLinkRefs.current[i] = el;
                }}
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={openIndex === i}
                onKeyDown={(e) => onGroupKeyDown(e, i, (group.items?.length ?? 0) > 0)}
                onClick={() => onGroupClick(i, (group.items?.length ?? 0) > 0)}
                className="marketing-nav-link flex items-center gap-1 font-display text-[13px] font-medium uppercase tracking-[0.22em] text-white/78 focus:outline-none focus:ring-2 focus:ring-white/30 rounded-full"
              >
                <span className={cn("rounded-full border px-2 py-1 text-[10px] tracking-[0.18em]", menuToneClasses[group.tone])}>
                  {group.label}
                </span>
                <ChevronDown
                  className={cn(
                    "marketing-nav-chevron size-3.5 text-white/44 transition-transform duration-200",
                    openIndex === i ? "rotate-180" : "rotate-0",
                  )}
                />
              </Link>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    role="menu"
                    aria-label={group.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="marketing-nav-panel absolute left-1/2 top-full z-50 w-[720px] max-w-[calc(100vw-6rem)] -translate-x-1/2 rounded-[26px] border border-white/10 bg-slate-950/95 p-3.5 shadow-[0_24px_80px_rgba(2,8,26,0.55)] backdrop-blur-2xl"
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        e.stopPropagation();
                        setOpenIndex(-1);
                        focusGroupLink(i);
                      }
                    }}
                    onBlur={(e) => {
                      const next = e.relatedTarget as HTMLElement | null;
                      const groupEl = menubarRef.current?.querySelectorAll(".marketing-nav-group")[i] as HTMLElement | undefined;
                      if (next && groupEl && groupEl.contains(next)) return;
                      setOpenIndex(-1);
                    }}
                  >
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
                            className={cn(
                              "rounded-[22px] border border-white/10 bg-white/[0.04] p-4 transition-transform duration-200 hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.06] focus:outline-none focus:ring-2",
                              ringToneClasses[group.tone],
                            )}
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
                  </motion.div>
                )}
              </AnimatePresence>
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
