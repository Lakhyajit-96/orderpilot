"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, CheckCircle2, Mail, MoreHorizontal, Send, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { heroVisualSnapshot } from "@/components/marketing/marketing-visual-data";

export function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="panel shimmer-border relative isolate overflow-hidden rounded-[34px] p-6 lg:p-7 shadow-[0_32px_120px_rgba(0,0,0,0.50)]"
    >
      <div className="ambient-orb absolute -left-12 top-10 size-36 rounded-full bg-cyan-300/15" />
      <div className="ambient-orb-delayed absolute right-0 top-0 size-40 rounded-full bg-violet-400/15" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(114,228,255,0.18),transparent_34%),radial-gradient(circle_at_80%_0%,rgba(124,92,255,0.22),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_45%)]" />
      <div className="story-grid absolute inset-4 rounded-[28px] opacity-45" />

      <div className="relative z-10 flex items-center justify-between gap-3">
        <Badge>Live workspace composite</Badge>
        <Badge variant="muted">09:18 AM ingest cycle</Badge>
      </div>

      <div className="relative z-10 mt-5 rounded-[30px] border border-white/[0.08] bg-black/85 shadow-[0_28px_110px_rgba(0,0,0,0.55)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-rose-300/90" />
              <span className="size-2.5 rounded-full bg-amber-300/90" />
              <span className="size-2.5 rounded-full bg-emerald-300/90" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/40">orderpilot.app / workspace</p>
              <p className="mt-1 text-sm text-white/72">Atlas Industrial Supply</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/44">
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">Review queue live</span>
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-cyan-100">Growth plan</span>
          </div>
        </div>

        <div className="grid gap-4 p-5 xl:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {heroVisualSnapshot.navigation.map((item) => (
                <div
                  key={item.label}
                  className={item.active
                    ? "rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-cyan-100"
                    : "rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-white/72"}
                >
                  <span className="text-xs font-medium uppercase tracking-[0.18em]">{item.label}</span>
                  <span className="hidden text-[10px] uppercase tracking-[0.18em] text-white/38 sm:ml-2 sm:inline">{item.meta}</span>
                </div>
              ))}
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white/46 lg:inline-flex">
              <CheckCircle2 className="size-3.5 text-emerald-300" />
              Workspace access live
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.32fr)_minmax(320px,0.88fr)]">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="flex min-w-0 h-full flex-col rounded-[26px] border border-white/8 bg-[linear-gradient(180deg,rgba(10,15,35,0.9),rgba(13,18,42,0.74))] p-4 lg:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/42">Operations overview</p>
                  <h3 className="mt-2 max-w-2xl text-xl font-semibold text-white sm:text-2xl">
                    Move from inbox chaos to ERP-ready order flow.
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-white/62">
                    OrderPilot extracts structured order data, flags exceptions with context, and gives reviewers one place to approve faster.
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-2 text-xs uppercase tracking-[0.2em] text-cyan-100/84">
                  <Bot className="size-4" />
                  AI review active
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {heroVisualSnapshot.heroMetrics.map((metric) => (
                  <div key={metric.label} className="min-w-0 rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.24em] text-white/40">{metric.label}</p>
                    <div className="mt-2 flex items-end justify-between gap-3">
                      <p className="text-2xl font-semibold text-white">{metric.value}</p>
                      <p className="max-w-[11rem] text-right text-xs uppercase tracking-[0.2em] text-white/38">{metric.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
                <div className="min-w-0 rounded-[22px] border border-white/8 bg-white/[0.035] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-white/40">Shared order intake inbox</p>
                      <p className="mt-1 text-sm text-white/68">Recent inbound orders and files</p>
                    </div>
                    <Mail className="size-4 text-cyan-200" />
                  </div>
                  <div className="mt-4 space-y-3">
                    {heroVisualSnapshot.inboxMessages.map((message, index) => (
                      <motion.div
                        key={message.subject}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: index * 0.08 + 0.15 }}
                        className="rounded-2xl border border-white/8 bg-slate-950/72 px-4 py-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className={`min-w-0 pr-2 text-sm font-medium ${message.tone}`}>{message.subject}</p>
                          <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/58">
                            {message.status}
                          </span>
                        </div>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/38">{message.meta}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="min-w-0 rounded-[22px] border border-white/8 bg-slate-950/68 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-white/40">Line-item mapping</p>
                      <p className="mt-1 text-sm text-white/68">Each line keeps confidence and mapping state before export.</p>
                    </div>
                    <MoreHorizontal className="size-4 text-white/44" />
                  </div>
                  <div className="mt-4 overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03]">
                    <div className="grid grid-cols-[40px_minmax(0,1fr)_84px] gap-3 border-b border-white/8 px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-white/38 sm:grid-cols-[40px_minmax(0,1fr)_56px_84px] lg:grid-cols-[48px_minmax(0,1.55fr)_0.7fr_0.75fr_0.95fr]">
                      <span>Line</span>
                      <span>Requested SKU</span>
                      <span className="hidden sm:block">Qty</span>
                      <span>Match</span>
                      <span className="hidden lg:block">ERP target</span>
                    </div>
                    {heroVisualSnapshot.lineItems.map((line, index) => (
                      <motion.div
                        key={`${line.line}-${line.sku}`}
                        animate={{ backgroundColor: index === 2 ? ["rgba(255,255,255,0.02)", "rgba(124,92,255,0.10)", "rgba(255,255,255,0.02)"] : ["rgba(255,255,255,0.02)", "rgba(255,255,255,0.04)", "rgba(255,255,255,0.02)"] }}
                        transition={{ duration: 6 + index, repeat: Infinity, ease: "easeInOut" }}
                        className="grid grid-cols-[40px_minmax(0,1fr)_84px] gap-3 border-b border-white/6 px-4 py-3 text-sm text-white/74 last:border-b-0 sm:grid-cols-[40px_minmax(0,1fr)_56px_84px] lg:grid-cols-[48px_minmax(0,1.55fr)_0.7fr_0.75fr_0.95fr]"
                      >
                        <span className="font-medium text-white/84">{line.line}</span>
                        <div className="min-w-0">
                          <p className="truncate text-white/84">{line.sku}</p>
                          <p className="mt-1 truncate text-xs text-white/42">{line.description}</p>
                        </div>
                        <span className="hidden sm:block">{line.qty}</span>
                        <span className={line.state === "Review" ? "text-violet-200" : "text-emerald-300"}>{line.match}</span>
                        <span className={line.state === "Review" ? "hidden truncate text-violet-200 lg:block" : "hidden truncate text-white/78 lg:block"}>
                          {line.mappedTo}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:mt-auto">
                <div className="rounded-[22px] border border-white/8 bg-white/[0.035] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/40">Launch checklist</p>
                  <div className="mt-3 space-y-2.5">
                    {heroVisualSnapshot.launchChecklist.map((item) => (
                      <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-slate-950/66 px-4 py-3 text-sm text-white/72">
                        <CheckCircle2 className="size-4 shrink-0 text-emerald-300" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[22px] border border-white/8 bg-white/[0.035] p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/40">Desk handoff proof</p>
                  <div className="mt-3 space-y-2.5">
                    {heroVisualSnapshot.handoffSignals.map((item) => (
                      <div key={item} className="rounded-2xl border border-white/8 bg-slate-950/66 px-4 py-3 text-sm text-white/72">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
                className="visual-float min-w-0 rounded-[26px] border border-white/[0.08] bg-white/[0.045] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.40)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="violet">Structured draft order</Badge>
                  <MoreHorizontal className="size-4 text-white/44" />
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                  {heroVisualSnapshot.extractionFields.map((field) => (
                    <div key={field.label} className="rounded-2xl border border-white/8 bg-slate-950/68 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/38">{field.label}</p>
                      <p className={`mt-2 text-sm font-medium ${field.tone}`}>{field.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <div className="min-w-0 rounded-[26px] border border-white/8 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="muted">Approval chain</Badge>
                  <ShieldCheck className="size-4 text-violet-200" />
                </div>
                <div className="mt-4 space-y-2.5">
                  {heroVisualSnapshot.approvalChain.map((step) => (
                    <div key={step.step} className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-white">{step.title}</p>
                        <span className="text-xs uppercase tracking-[0.2em] text-white/38">{step.step}</span>
                      </div>
                      <p className="mt-2 text-sm text-white/58">{step.meta}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="min-w-0 rounded-[26px] border border-white/8 bg-slate-950/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="violet">Reviewer queue</Badge>
                  <ShieldCheck className="size-4 text-violet-200" />
                </div>
                <div className="mt-4 space-y-2.5">
                  {heroVisualSnapshot.reviewQueue.slice(0, 2).map((item) => (
                    <div key={item.id} className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-white">{item.id}</p>
                        <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/62">
                          {item.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-white/60">{item.detail}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/34">{item.meta}</p>
                    </div>
                  ))}
                </div>
              </div>

              <motion.div
                animate={{ scale: [1, 1.018, 1] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="visual-float-delayed min-w-0 rounded-[26px] border border-white/10 bg-[linear-gradient(135deg,rgba(114,228,255,0.18),rgba(124,92,255,0.16))] p-4 md:col-span-2 xl:col-span-1 2xl:col-span-2"
              >
                <div className="flex items-center justify-between gap-3 text-white">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-white/52">ERP handoff</p>
                    <h4 className="mt-2 text-xl font-semibold">{heroVisualSnapshot.exportSummary.title}</h4>
                  </div>
                  <Sparkles className="size-5 text-cyan-200" />
                </div>
                <p className="mt-3 text-sm text-white/72">{heroVisualSnapshot.exportSummary.detail}</p>
                <div className="mt-4 rounded-[22px] border border-white/12 bg-slate-950/55 p-4">
                  <div className="flex items-center justify-between text-sm text-white/76">
                    <span>Approval finished in 2m 16s</span>
                    <CheckCircle2 className="size-4 text-emerald-300" />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/74">
                    {heroVisualSnapshot.exportSummary.timeline.map((item, index) => (
                      <div key={item} className="flex items-center gap-3">
                        <span>{item}</span>
                        {index < heroVisualSnapshot.exportSummary.timeline.length - 1 ? <ArrowRight className="size-4 text-white/42" /> : null}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center gap-2 self-start rounded-full border border-cyan-300/20 bg-slate-950/85 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-100/80"
          >
            <Send className="size-3.5" />
            AI mapping resolved 14 SKU aliases
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

