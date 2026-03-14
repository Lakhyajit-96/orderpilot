"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const obligations = [
  { area: "Mailbox Integration", status: "Active", color: "rgba(94,234,212,0.9)", bg: "rgba(94,234,212,0.06)" },
  { area: "ERP Handoff", status: "Controlled", color: "rgba(114,228,255,0.9)", bg: "rgba(114,228,255,0.06)" },
  { area: "Data Export", status: "Logged", color: "rgba(167,139,250,0.9)", bg: "rgba(167,139,250,0.06)" },
  { area: "Incident Response", status: "Defined", color: "rgba(251,191,36,0.9)", bg: "rgba(251,191,36,0.06)" },
];

export function LegalHeroVisual({ className }: { className?: string }) {
  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_24px_80px_rgba(2,8,26,0.55)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(251,191,36,0.06),transparent_50%)]" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.24em] text-white/42">Compliance posture</p>

            {/* Status Table */}
            <div className="rounded-[16px] border border-white/8 bg-white/[0.02] overflow-hidden">
              <div className="grid grid-cols-2 gap-px border-b border-white/8 bg-white/[0.03] px-4 py-2">
                <p className="text-[10px] uppercase tracking-[0.15em] text-white/35">Area</p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-white/35">Status</p>
              </div>
              {obligations.map((o, i) => (
                <motion.div
                  key={o.area}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  className="grid grid-cols-2 gap-px border-b border-white/5 px-4 py-3"
                  style={{ backgroundColor: o.bg }}
                >
                  <p className="text-xs text-white/70">{o.area}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: o.color }}>
                    <span className="size-1.5 rounded-full" style={{ backgroundColor: o.color }} />
                    {o.status}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Animated shield */}
            <motion.svg viewBox="0 0 200 80" className="mt-4 w-full" aria-hidden>
              <defs>
                <linearGradient id="legalGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(251,191,36,0.6)" />
                  <stop offset="100%" stopColor="rgba(94,234,212,0.6)" />
                </linearGradient>
              </defs>
              <motion.path
                d="M100 8 L140 24 L140 48 C140 60 120 72 100 76 C80 72 60 60 60 48 L60 24 Z"
                fill="none"
                stroke="url(#legalGrad)"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
              <motion.path
                d="M88 44 L96 52 L112 36"
                fill="none"
                stroke="rgba(94,234,212,0.8)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 1.5 }}
              />
            </motion.svg>
          </div>

          <div className="flex flex-col justify-center">
            <div className="overflow-hidden rounded-[20px] border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
              <Image
                src="/assets/generated/legal.png"
                alt="OrderPilot legal compliance dashboard showing mailbox integration, ERP handoff, data export, and incident response status"
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
