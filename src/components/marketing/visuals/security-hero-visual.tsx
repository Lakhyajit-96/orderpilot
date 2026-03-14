"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function SecurityHeroVisual({ className }: { className?: string }) {
  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_24px_80px_rgba(2,8,26,0.55)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(114,228,255,0.12),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(124,92,255,0.10),transparent_50%)]" />

        <div className="relative z-10">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left: Animated Security Flow Diagram */}
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.24em] text-white/42">Security architecture</p>
              <motion.svg viewBox="0 0 400 320" className="w-full" aria-hidden>
                <defs>
                  <linearGradient id="secGrad1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(114,228,255,0.9)" />
                    <stop offset="100%" stopColor="rgba(124,92,255,0.9)" />
                  </linearGradient>
                  <filter id="secGlow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                {/* OAuth Node */}
                <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                  <rect x="20" y="20" width="160" height="72" rx="14" fill="rgba(114,228,255,0.08)" stroke="rgba(114,228,255,0.35)" strokeWidth="1.5" />
                  <text x="40" y="48" fill="rgba(114,228,255,0.9)" fontSize="11" fontWeight="600" letterSpacing="0.1em">OAUTH CONSENT</text>
                  <text x="40" y="68" fill="rgba(255,255,255,0.55)" fontSize="10">Provider authorization flow</text>
                  <circle cx="160" cy="56" r="6" fill="rgba(114,228,255,0.3)" filter="url(#secGlow)" />
                </motion.g>

                {/* Token Node */}
                <motion.g initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                  <rect x="220" y="20" width="160" height="72" rx="14" fill="rgba(124,92,255,0.08)" stroke="rgba(124,92,255,0.35)" strokeWidth="1.5" />
                  <text x="240" y="48" fill="rgba(177,157,255,0.9)" fontSize="11" fontWeight="600" letterSpacing="0.1em">TOKEN VAULT</text>
                  <text x="240" y="68" fill="rgba(255,255,255,0.55)" fontSize="10">AES-256 encrypted at rest</text>
                  <circle cx="360" cy="56" r="6" fill="rgba(124,92,255,0.3)" filter="url(#secGlow)" />
                </motion.g>

                {/* Connection Line 1 */}
                <motion.path d="M180 56 L220 56" fill="none" stroke="url(#secGrad1)" strokeWidth="2" strokeDasharray="6 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.5 }} />

                {/* Webhook Node */}
                <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                  <rect x="20" y="124" width="160" height="72" rx="14" fill="rgba(94,234,212,0.08)" stroke="rgba(94,234,212,0.35)" strokeWidth="1.5" />
                  <text x="40" y="152" fill="rgba(94,234,212,0.9)" fontSize="11" fontWeight="600" letterSpacing="0.1em">WEBHOOK VERIFY</text>
                  <text x="40" y="172" fill="rgba(255,255,255,0.55)" fontSize="10">Signature + HMAC checks</text>
                </motion.g>

                {/* Audit Node */}
                <motion.g initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
                  <rect x="220" y="124" width="160" height="72" rx="14" fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.30)" strokeWidth="1.5" />
                  <text x="240" y="152" fill="rgba(251,191,36,0.9)" fontSize="11" fontWeight="600" letterSpacing="0.1em">AUDIT LOG</text>
                  <text x="240" y="172" fill="rgba(255,255,255,0.55)" fontSize="10">Timestamped + attributed</text>
                </motion.g>

                {/* Connection Lines */}
                <motion.path d="M100 92 L100 124" fill="none" stroke="rgba(94,234,212,0.4)" strokeWidth="1.5" strokeDasharray="4 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.8 }} />
                <motion.path d="M300 92 L300 124" fill="none" stroke="rgba(251,191,36,0.4)" strokeWidth="1.5" strokeDasharray="4 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.9 }} />
                <motion.path d="M180 160 L220 160" fill="none" stroke="url(#secGrad1)" strokeWidth="2" strokeDasharray="6 3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 1.0 }} />

                {/* Retention Node */}
                <motion.g initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.0 }}>
                  <rect x="120" y="230" width="160" height="72" rx="14" fill="rgba(114,228,255,0.05)" stroke="rgba(114,228,255,0.25)" strokeWidth="1.5" />
                  <text x="140" y="258" fill="rgba(114,228,255,0.85)" fontSize="11" fontWeight="600" letterSpacing="0.1em">DATA BOUNDARY</text>
                  <text x="140" y="278" fill="rgba(255,255,255,0.55)" fontSize="10">Workspace-scoped isolation</text>
                </motion.g>

                {/* Connection to retention */}
                <motion.path d="M100 196 C100 220, 200 220, 200 230" fill="none" stroke="rgba(114,228,255,0.3)" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 1.2 }} />
                <motion.path d="M300 196 C300 220, 200 220, 200 230" fill="none" stroke="rgba(114,228,255,0.3)" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 1.3 }} />

                {/* Animated pulse dots */}
                <motion.circle cx="200" cy="56" r="3" fill="rgba(114,228,255,0.8)" animate={{ r: [3, 5, 3], opacity: [0.8, 0.3, 0.8] }} transition={{ duration: 2, repeat: Infinity }} />
                <motion.circle cx="200" cy="160" r="3" fill="rgba(124,92,255,0.8)" animate={{ r: [3, 5, 3], opacity: [0.8, 0.3, 0.8] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
              </motion.svg>
            </div>

            {/* Right: Screenshot Image */}
            <div className="flex flex-col justify-center">
              <div className="overflow-hidden rounded-[20px] border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
                <Image
                  src="/assets/generated/security.png"
                  alt="OrderPilot security dashboard showing OAuth token lifecycle, webhook verification status, and audit trail overview"
                  width={600}
                  height={400}
                  className="w-full object-cover"
                  priority
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["TLS 1.2+", "AES-256", "RBAC", "SOC 2 Ready"].map((tag) => (
                  <span key={tag} className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-cyan-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
