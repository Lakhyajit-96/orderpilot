"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const modules = [
  { icon: "📥", label: "Inbox", desc: "Shared mailbox ingest", delay: 0.1 },
  { icon: "🔍", label: "Review", desc: "Exception queue", delay: 0.2 },
  { icon: "📊", label: "Dashboard", desc: "Real-time metrics", delay: 0.3 },
  { icon: "⚙️", label: "Settings", desc: "Workspace config", delay: 0.4 },
  { icon: "🔗", label: "ERP Sync", desc: "Downstream handoff", delay: 0.5 },
  { icon: "👥", label: "Team", desc: "Role-based access", delay: 0.6 },
];

export function PlatformHeroVisual({ className }: { className?: string }) {
  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_24px_80px_rgba(2,8,26,0.55)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_50%,rgba(114,228,255,0.10),transparent_50%),radial-gradient(circle_at_90%_50%,rgba(124,92,255,0.08),transparent_50%)]" />

        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.24em] text-white/42">Unified workspace</p>

          {/* Module Grid */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            {modules.map((mod) => (
              <motion.div
                key={mod.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: mod.delay }}
                className="rounded-[16px] border border-white/8 bg-white/[0.03] p-4"
              >
                <span className="text-xl">{mod.icon}</span>
                <p className="mt-2 text-sm font-semibold text-white/90">{mod.label}</p>
                <p className="text-[11px] text-white/45">{mod.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Screenshot */}
          <div className="mt-6 overflow-hidden rounded-[20px] border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
            <Image
              src="/assets/generated/platform.png"
              alt="OrderPilot platform overview showing unified workspace with inbox, review queue, dashboard metrics, and settings"
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
