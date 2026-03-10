"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, FileText, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const rows = [
  { label: "Customer matched", value: "Atlas Industrial Supply", tone: "text-emerald-300" },
  { label: "Line-item confidence", value: "96% across 6 lines", tone: "text-cyan-200" },
  { label: "Exception queue", value: "Ship date confirmation", tone: "text-violet-200" },
];

export function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: "easeOut" }}
      className="panel relative overflow-hidden rounded-[30px] p-6"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(114,228,255,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(124,92,255,0.22),transparent_34%)]" />
      <div className="relative flex items-center justify-between gap-3">
        <Badge>Live extraction canvas</Badge>
        <Badge variant="muted">08:42 AM ingest</Badge>
      </div>

      <div className="relative mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-[26px] border border-white/10 bg-slate-950/70 p-5 shadow-[0_18px_80px_rgba(2,8,30,0.55)]"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Incoming purchase order</p>
              <h3 className="mt-2 text-xl font-semibold text-white">PO-10482 / Atlas Industrial</h3>
            </div>
            <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 p-3 text-cyan-200">
              <FileText className="size-5" />
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {rows.map((row, index) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: index * 0.12 + 0.2 }}
                className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3"
              >
                <p className="text-xs uppercase tracking-[0.22em] text-white/42">{row.label}</p>
                <p className={`mt-2 text-sm font-medium ${row.tone}`}>{row.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="flex flex-col gap-4">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-[24px] border border-white/10 bg-white/[0.06] p-5"
          >
            <div className="flex items-center justify-between">
              <Badge variant="violet">AI reasoning layer</Badge>
              <Bot className="size-4 text-violet-200" />
            </div>
            <p className="mt-4 text-sm leading-7 text-white/70">
              Extracts structured data, resolves customer aliases, maps SKUs, and routes every exception into a clean reviewer workflow.
            </p>
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.015, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(114,228,255,0.15),rgba(124,92,255,0.12))] p-5"
          >
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-white/48">Outcome</p>
                <h4 className="mt-2 text-2xl font-semibold">Ready for ERP</h4>
              </div>
              <Sparkles className="size-5 text-cyan-200" />
            </div>
            <div className="mt-4 flex items-center gap-3 text-sm text-white/70">
              <span>Approved in 2m 16s</span>
              <ArrowRight className="size-4 text-white/45" />
              <span>Pushed to order desk queue</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

