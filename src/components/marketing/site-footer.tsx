import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandLogo } from "@/components/brand/orderpilot-logo";
import { footerLinkGroups } from "@/components/marketing/marketing-site-data";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-white/8 pt-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="space-y-5">
          <BrandLogo href="/" size="lg" />
          <p className="max-w-xl text-sm leading-7 text-white/58">
            OrderPilot gives distributor operations teams one place to capture inbound orders, route exceptions, and release ERP-ready drafts with confidence.
          </p>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-white/42">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">Shared inbox intake</span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">Reviewer workflow</span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">ERP handoff readiness</span>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {footerLinkGroups.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/42">{group.title}</p>
              <div className="mt-4 space-y-3 text-sm text-white/66">
                {group.links.map((link) => (
                  <Link key={link.label} href={link.href} className="flex items-center gap-2 transition hover:text-white">
                    <span>{link.label}</span>
                    <ArrowUpRight className="size-3.5 text-white/34" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-2 border-t border-white/8 pt-5 text-xs uppercase tracking-[0.2em] text-white/34 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} OrderPilot</span>
        <span>Distributor order intake, review, and handoff</span>
      </div>
    </footer>
  );
}