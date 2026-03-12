import Link from "next/link";
import {} from "lucide-react";
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

        <nav className="hidden items-center gap-2 xl:flex">
          {headerMenuGroups.map((group) => (
            <Link key={group.label} href={group.href} className="font-display text-[13px] font-medium uppercase tracking-[0.22em] text-white/78">
              <span className={cn("rounded-full border px-2 py-1 text-[10px] tracking-[0.18em]", menuToneClasses[group.tone])}>
                {group.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild size="sm">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
