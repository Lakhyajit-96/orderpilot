"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const controlNodes = [
  { label: "APPROVAL GATE", desc: "Dual-sign review", x: 20, y: 20, color: "rgba(251,191,36,0.9)", bg: "rgba(251,191,36,0.06)", border: "rgba(251,191,36,0.28)" },
  { label: "REASON CODES", desc: "Tracked exceptions", x: 240, y: 20, color: "rgba(167,139,250,0.9)", bg: "rgba(167,139,250,0.06)", border: "rgba(167,139,250,0.28)" },
  { label: "STAGED ROLLOUT", desc: "Phase control", x: 20, y: 130, color: "rgba(114,228,255,0.9)", bg: "rgba(114,228,255,0.06)", border: "rgba(114,228,255,0.28)" },
  { label: "ERP HANDOFF", desc: "Downstream release", x: 240, y: 130, color: "rgba(94,234,212,0.9)", bg: "rgba(94,234,212,0.06)", border: "rgba(94,234,212,0.28)" },
];

export function ControlsHeroVisual({ className }: { className?: string }) {
  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_24px_80px_rgba(2,8,26,0.55)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.08),transparent_50%),radial-gradient(circle_at_50%_100%,rgba(94,234,212,0.06),transparent_50%)]" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-2">
          {/* Left: Control Flow Diagram */}
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.24em] text-white/42">Control architecture</p>
            <motion.svg viewBox="0 0 440 240" className="w-full" aria-hidden>
              <defs>
                <linearGradient id="ctrlGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(251,191,36,0.7)" />
                  <stop offset="100%" stopColor="rgba(94,234,212,0.7)" />
                </linearGradient>
              </defs>

              {controlNodes.map((node, i) => (
                <motion.g key={node.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: i * 0.12 }}>
                  <rect x={node.x} y={node.y} width="200" height="80" rx="14" fill={node.bg} stroke={node.border} strokeWidth="1.5" />
                  <text x={node.x + 16} y={node.y + 34} fill={node.color} fontSize="11" fontWeight="700" letterSpacing="0.12em">{node.label}</text>
                  <text x={node.x + 16} y={node.y + 56} fill="rgba(255,255,255,0.50)" fontSize="10">{node.desc}</text>
                </motion.g>
              ))}

              {/* Connections */}
              <motion.path d="M220 60 L240 60" fill="none" stroke="url(#ctrlGrad)" strokeWidth="1.5" strokeDasharray="4 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.6 }} />
              <motion.path d="M120 100 L120 130" fill="none" stroke="url(#ctrlGrad)" strokeWidth="1.5" strokeDasharray="4 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.7 }} />
              <motion.path d="M340 100 L340 130" fill="none" stroke="url(#ctrlGrad)" strokeWidth="1.5" strokeDasharray="4 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.8 }} />
              <motion.path d="M220 170 L240 170" fill="none" stroke="url(#ctrlGrad)" strokeWidth="1.5" strokeDasharray="4 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.9 }} />

              {/* Center hub */}
              <motion.circle cx="230" cy="115" r="12" fill="rgba(114,228,255,0.08)" stroke="url(#ctrlGrad)" strokeWidth="1.5" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 1.0 }} />
              <motion.circle cx="230" cy="115" r="4" fill="url(#ctrlGrad)" animate={{ r: [4, 6, 4], opacity: [0.9, 0.4, 0.9] }} transition={{ duration: 2, repeat: Infinity }} />
            </motion.svg>
          </div>

          {/* Right: Screenshot */}
          <div className="flex flex-col justify-center">
            <div className="overflow-hidden rounded-[20px] border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
              <Image
                src="/assets/generated/controls.png"
                alt="OrderPilot controls dashboard showing approval gates, reason codes, staged rollout settings, and ERP handoff configuration"
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
