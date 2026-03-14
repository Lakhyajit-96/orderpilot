"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const categories = [
  { label: "Setup", count: 4, color: "rgba(114,228,255,0.9)", bg: "rgba(114,228,255,0.06)" },
  { label: "Integration", count: 6, color: "rgba(167,139,250,0.9)", bg: "rgba(167,139,250,0.06)" },
  { label: "Security", count: 5, color: "rgba(94,234,212,0.9)", bg: "rgba(94,234,212,0.06)" },
  { label: "Billing", count: 3, color: "rgba(251,191,36,0.9)", bg: "rgba(251,191,36,0.06)" },
];

export function FaqHeroVisual({ className }: { className?: string }) {
  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_24px_80px_rgba(2,8,26,0.55)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(114,228,255,0.08),transparent_60%)]" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-2">
          {/* Left: Category cards */}
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.24em] text-white/42">Question categories</p>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="rounded-[16px] border border-white/8 p-4"
                  style={{ backgroundColor: cat.bg }}
                >
                  <p className="text-sm font-bold" style={{ color: cat.color }}>{cat.label}</p>
                  <p className="mt-1 text-[11px] text-white/40">{cat.count} questions</p>
                </motion.div>
              ))}
            </div>

            {/* Animated search indicator */}
            <motion.div
              className="mt-4 flex items-center gap-3 rounded-[14px] border border-white/8 bg-white/[0.02] px-4 py-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span className="text-white/30">🔍</span>
              <motion.span
                className="text-sm text-white/30"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Search questions...
              </motion.span>
            </motion.div>
          </div>

          {/* Right: Screenshot */}
          <div className="flex flex-col justify-center">
            <div className="overflow-hidden rounded-[20px] border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
              <Image
                src="/assets/generated/faq.png"
                alt="OrderPilot FAQ page showing categorized questions about setup, integration, security, and billing"
                width={600}
                height={400}
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
