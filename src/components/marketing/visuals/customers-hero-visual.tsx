"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const metrics = [
  { value: "62%", label: "Faster order review", color: "rgba(114,228,255,0.9)" },
  { value: "3.2x", label: "Throughput increase", color: "rgba(167,139,250,0.9)" },
  { value: "89%", label: "Fewer re-entry loops", color: "rgba(94,234,212,0.9)" },
  { value: "4.8★", label: "Ops leader rating", color: "rgba(251,191,36,0.9)" },
];

export function CustomersHeroVisual({ className }: { className?: string }) {
  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_24px_80px_rgba(2,8,26,0.55)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(94,234,212,0.08),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(251,191,36,0.06),transparent_50%)]" />

        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.24em] text-white/42">Customer outcomes</p>

          {/* Metrics Row */}
          <div className="mt-5 grid grid-cols-4 gap-3">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="rounded-[16px] border border-white/8 bg-white/[0.03] p-3 text-center"
              >
                <p className="text-2xl font-bold" style={{ color: m.color }}>{m.value}</p>
                <p className="mt-1 text-[10px] leading-tight text-white/45">{m.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Animated bar chart */}
          <div className="mt-6">
            <motion.svg viewBox="0 0 800 120" className="w-full" aria-hidden>
              {[0.62, 0.85, 0.73, 0.91, 0.68, 0.79, 0.88, 0.95].map((h, i) => (
                <motion.rect
                  key={i}
                  x={i * 100 + 10}
                  y={120 - h * 100}
                  width="60"
                  height={h * 100}
                  rx="6"
                  fill={i % 2 === 0 ? "rgba(114,228,255,0.15)" : "rgba(167,139,250,0.15)"}
                  stroke={i % 2 === 0 ? "rgba(114,228,255,0.3)" : "rgba(167,139,250,0.3)"}
                  strokeWidth="1"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  style={{ transformOrigin: "bottom" }}
                />
              ))}
            </motion.svg>
          </div>

          {/* Screenshot */}
          <div className="mt-4 overflow-hidden rounded-[20px] border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
            <Image
              src="/assets/generated/customers.png"
              alt="OrderPilot customer success metrics and testimonial highlights from distributor operations teams"
              width={800}
              height={450}
              className="w-full object-cover"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
