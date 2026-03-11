"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleGauge, CreditCard, Inbox, PackageSearch, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Viewer } from "@/lib/auth";
import { getPlatformAccessState, isPlatformRouteActive } from "@/lib/platform-shell-core";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: CircleGauge },
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/orders", label: "Orders", icon: PackageSearch },
  { href: "/settings", label: "Settings", icon: CreditCard },
];

export function AppShell({
  children,
  viewer,
}: {
  children: React.ReactNode;
  viewer: Viewer;
}) {
  const pathname = usePathname();
  const accessState = getPlatformAccessState(viewer);
  const canNavigate = accessState === "READY";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(114,228,255,0.08),transparent_24%),radial-gradient(circle_at_80%_20%,rgba(124,92,255,0.14),transparent_26%),#050816] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 overflow-x-hidden px-4 py-4 lg:px-6">
        {canNavigate ? (
          <aside className="hidden w-[280px] shrink-0 rounded-[30px] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-2xl lg:flex lg:flex-col">
          <Link href="/" className="flex items-center gap-3 px-2 py-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#72e4ff,#7c5cff)] text-slate-950 shadow-[0_14px_30px_rgba(87,153,255,0.35)]">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-white/38">OrderPilot</p>
              <p className="mt-1 text-sm font-medium text-white/80">Order intake operations</p>
            </div>
          </Link>

          <div className="mt-8 space-y-2">
            {navItems.map(({ href, icon: Icon, label }) => {
              const active = isPlatformRouteActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/58 transition-all hover:bg-white/6 hover:text-white",
                    active && "bg-white/8 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
                  )}
                >
                  <Icon className="size-4" />
                  <span>{label}</span>
                  {active ? <span className="ml-auto size-2 rounded-full bg-cyan-300" /> : null}
                </Link>
              );
            })}
          </div>

          <div className="mt-auto rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4">
            <Badge variant="violet">Team workspace</Badge>
            <p className="mt-4 text-sm leading-7 text-white/68">
              Keep inbox intake, order review, and ERP handoff visible in one place for the whole team.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.24em] text-white/42">
              {viewer.workspace?.name ?? "Workspace access"}
            </p>
          </div>
          </aside>
        ) : null}

        <div className="flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden rounded-[30px] border border-white/10 bg-slate-950/55 backdrop-blur-2xl">
          <header className="flex min-w-0 flex-wrap items-center justify-between gap-4 border-b border-white/8 px-5 py-4 lg:px-8">
            <div className="min-w-0 flex-1">
              <p className="text-xs uppercase tracking-[0.24em] text-white/38">Workspace</p>
              <p className="mt-1 truncate text-sm text-white/76">{viewer.workspace?.name ?? "OrderPilot workspace"}</p>
            </div>
            <div className="flex max-w-full flex-wrap items-center justify-end gap-3">
              <Badge variant={viewer.isAuthenticated ? "success" : "muted"}>{viewer.modeLabel}</Badge>
              <div className="hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/72 md:block">
                {viewer.displayName}
              </div>
              {viewer.isConfigured && !viewer.isAuthenticated ? (
                <Button asChild variant="secondary" size="sm">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
              ) : null}
            </div>
          </header>
          <main className={cn("min-w-0 flex-1 overflow-x-hidden px-5 py-6 lg:px-8 lg:py-8", canNavigate && "pb-28 lg:pb-8")}>{children}</main>
          {canNavigate ? (
            <nav className="fixed inset-x-4 bottom-4 z-40 lg:hidden" aria-label="Mobile workspace navigation">
              <div className="grid grid-cols-4 gap-2 rounded-[28px] border border-white/10 bg-slate-950/90 p-2 shadow-[0_20px_50px_rgba(5,8,22,0.45)] backdrop-blur-2xl">
                {navItems.map(({ href, icon: Icon, label }) => {
                  const active = isPlatformRouteActive(pathname, href);

                  return (
                    <Link
                      key={href}
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-w-0 flex-col items-center gap-1 rounded-[20px] px-2 py-3 text-[11px] font-medium text-white/58 transition-all",
                        active && "bg-white/8 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]",
                      )}
                    >
                      <Icon className={cn("size-4", active && "text-cyan-200")} />
                      <span className="truncate">{label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          ) : null}
        </div>
      </div>
    </div>
  );
}

