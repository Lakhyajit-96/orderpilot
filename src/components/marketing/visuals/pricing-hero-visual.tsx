"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const tiers = [
  { name: "Starter", color: "rgba(114,228,255,0.9)", bg: "rgba(114,228,255,0.06)", border: "rgba(114,228,255,0.25)", features: ["Inbox visibility", "5 seats", "Basic parsing"] },
  { name: "Growth", color: "rgba(167,139,250,0.9)", bg: "rgba(167,139,250,0.06)", border: "rgba(167,139,250,0.25)", features: ["Review queue", "25 seats", "AI extraction"] },
  { name: "Enterprise", color: "rgba(94,234,212,0.9)", bg: "rgba(94,234,212,0.06)", border: "rgba(94,234,212,0.25)", features: ["Full ERP sync", "Unlimited", "Custom SLA"] },
];

export function PricingHeroVisual({ className }: { className?: string }) {
  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_24px_80px_rgba(2,8,26,0.55)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(167,139,250,0.10),transparent_60%)]" />

        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.24em] text-white/42">Plan comparison</p>

          {/* Tier Cards */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.12 }}
                className="rounded-[18px] border p-4"
                style={{ borderColor: tier.border, backgroundColor: tier.bg }}
              >
                <p className="text-sm font-bold" style={{ color: tier.color }}>{tier.name}</p>
                <div className="mt-3 space-y-2">
                  {tier.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-[11px] text-white/55">
                      <span className="size-1.5 rounded-full" style={{ backgroundColor: tier.color }} />
                      {f}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Screenshot */}
          <div className="mt-6 overflow-hidden rounded-[20px] border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
            <Image
              src="/assets/generated/pricing.png"
              alt="OrderPilot pricing plans showing Starter, Growth, and Enterprise tiers with feature comparison"
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
