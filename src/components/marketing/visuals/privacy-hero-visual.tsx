"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const privacyLayers = [
  { label: "COLLECTION", desc: "Minimal data scope", icon: "📋", delay: 0.1 },
  { label: "PROCESSING", desc: "Purpose-limited use", icon: "⚙️", delay: 0.2 },
  { label: "STORAGE", desc: "Encrypted at rest", icon: "🔒", delay: 0.3 },
  { label: "RIGHTS", desc: "Access & deletion", icon: "✋", delay: 0.4 },
];

export function PrivacyHeroVisual({ className }: { className?: string }) {
  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-[0_24px_80px_rgba(2,8,26,0.55)]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(114,228,255,0.08),transparent_50%)]" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.24em] text-white/42">Data lifecycle</p>
            <div className="space-y-3">
              {privacyLayers.map((layer, i) => (
                <motion.div
                  key={layer.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: layer.delay }}
                  className="flex items-center gap-4 rounded-[16px] border border-white/8 bg-white/[0.03] px-4 py-3"
                >
                  <span className="text-lg">{layer.icon}</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-cyan-200/80">{layer.label}</p>
                    <p className="text-[11px] text-white/45">{layer.desc}</p>
                  </div>
                  {i < privacyLayers.length - 1 && (
                    <motion.div
                      className="ml-auto h-px w-8 bg-gradient-to-r from-cyan-300/30 to-transparent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.4, delay: layer.delay + 0.2 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="overflow-hidden rounded-[20px] border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
              <Image
                src="/assets/generated/privacy.png"
                alt="OrderPilot privacy policy overview showing data collection scope, processing rules, storage encryption, and user rights"
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
