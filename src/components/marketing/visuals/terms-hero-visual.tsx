"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const sections = [
  { label: "Service Scope", color: "rgba(114,228,255,0.9)", width: "85%" },
  { label: "Acceptable Use", color: "rgba(167,139,250,0.9)", width: "72%" },
  { label: "Payment Terms", color: "rgba(251,191,36,0.9)", width: "68%" },
  { label: "Data Handling", color: "rgba(94,234,212,0.9)", width: "90%" },
  { label: "Availability SLA", color: "rgba(114,228,255,0.9)", width: "76%" },
  { label: "Liability", color: "rgba(167,139,250,0.9)", width: "60%" },
];

export function TermsHeroVisual({ className }: { className?: string }) {
  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_24px_80px_rgba(2,8,26,0.55)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(167,139,250,0.08),transparent_50%)]" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.24em] text-white/42">Document structure</p>
            <div className="space-y-3">
              {sections.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-white/60">{s.label}</p>
                    <span className="text-[10px] text-white/30">§{i + 1}</span>
                  </div>
                  <motion.div
                    className="h-1.5 rounded-full"
                    style={{ backgroundColor: s.color.replace("0.9", "0.15") }}
                    initial={{ width: 0 }}
                    animate={{ width: s.width }}
                    transition={{ duration: 0.6, delay: i * 0.08 + 0.2 }}
                  >
                    <div className="h-full rounded-full" style={{ backgroundColor: s.color.replace("0.9", "0.4"), width: "100%" }} />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="overflow-hidden rounded-[20px] border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
              <Image
                src="/assets/generated/terms.png"
                alt="OrderPilot terms and conditions document structure showing service scope, payment, data handling, and SLA sections"
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
