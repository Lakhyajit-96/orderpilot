"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const stages = [
  { label: "INGEST", desc: "Mailbox capture", color: "rgba(114,228,255,0.9)", bg: "rgba(114,228,255,0.08)", border: "rgba(114,228,255,0.35)" },
  { label: "PARSE", desc: "AI extraction", color: "rgba(167,139,250,0.9)", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.35)" },
  { label: "REVIEW", desc: "Exception queue", color: "rgba(251,191,36,0.9)", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.30)" },
  { label: "RELEASE", desc: "ERP handoff", color: "rgba(94,234,212,0.9)", bg: "rgba(94,234,212,0.08)", border: "rgba(94,234,212,0.35)" },
];

export function WorkflowHeroVisual({ className }: { className?: string }) {
  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_24px_80px_rgba(2,8,26,0.55)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(114,228,255,0.10),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(94,234,212,0.08),transparent_50%)]" />

        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.24em] text-white/42">Four-stage pipeline</p>

          {/* Animated Pipeline */}
          <div className="mt-6">
            <motion.svg viewBox="0 0 800 120" className="w-full" aria-hidden>
              <defs>
                <linearGradient id="wfGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(114,228,255,0.8)" />
                  <stop offset="50%" stopColor="rgba(167,139,250,0.8)" />
                  <stop offset="100%" stopColor="rgba(94,234,212,0.8)" />
                </linearGradient>
              </defs>

              {stages.map((stage, i) => {
                const x = i * 200 + 10;
                return (
                  <motion.g key={stage.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.15 }}>
                    <rect x={x} y="20" width="170" height="70" rx="14" fill={stage.bg} stroke={stage.border} strokeWidth="1.5" />
                    <text x={x + 16} y="50" fill={stage.color} fontSize="12" fontWeight="700" letterSpacing="0.12em">{stage.label}</text>
                    <text x={x + 16} y="70" fill="rgba(255,255,255,0.50)" fontSize="10">{stage.desc}</text>
                    {i < stages.length - 1 && (
                      <motion.path
                        d={`M${x + 170} 55 L${x + 200} 55`}
                        fill="none"
                        stroke="url(#wfGrad)"
                        strokeWidth="2"
                        strokeDasharray="4 3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.6, delay: i * 0.15 + 0.3 }}
                      />
                    )}
                  </motion.g>
                );
              })}

              {/* Animated progress dot */}
              <motion.circle
                r="4"
                fill="rgba(114,228,255,0.9)"
                animate={{ cx: [30, 230, 430, 630, 770], cy: [55, 55, 55, 55, 55] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
              />
            </motion.svg>
          </div>

          {/* Screenshot */}
          <div className="mt-6 overflow-hidden rounded-[20px] border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
            <Image
              src="/assets/generated/workflow.png"
              alt="OrderPilot workflow pipeline showing email ingest, AI parsing, exception review queue, and ERP release stages"
              width={800}
              height={450}
              className="w-full object-cover"
              priority
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
