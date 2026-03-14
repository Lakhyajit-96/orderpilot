"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { testimonials } from "@/components/marketing/marketing-site-data";
import { Badge } from "@/components/ui/badge";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
};

export function TestimonialsSection() {
  const [highlight, secondary, ...others] = testimonials;

  return (
    <section id="testimonials" className="mt-20 space-y-8">
      <div className="max-w-3xl">
        <Badge variant="violet">Testimonials</Badge>
        <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Teams buy faster when the workflow feels credible to the people actually running the desk.
        </h2>
        <p className="mt-4 text-base leading-8 text-white/64">
          These stories reflect the outcomes operations leaders care about most: less inbox chaos, fewer manual re-entry steps, and faster review without losing control.
        </p>
      </div>

      {/* Highlight banner testimonial */}
      <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(114,228,255,0.10),rgba(124,92,255,0.08))] p-8 shadow-[0_24px_80px_rgba(2,8,24,0.35)]">
          <div className="absolute -right-20 -top-20 size-60 rounded-full bg-cyan-300/5 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
            <div className="flex-1">
              <div className="mb-4 flex items-center gap-1 text-amber-200">
                {Array.from({ length: highlight.rating }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <Quote className="mb-3 size-8 text-cyan-200/40" />
              <p className="text-lg leading-8 text-white/85">&ldquo;{highlight.quote}&rdquo;</p>
              <p className="mt-4 text-sm leading-7 text-white/55">{highlight.detail}</p>
            </div>
            <div className="flex shrink-0 flex-col items-center gap-3 rounded-[24px] border border-white/10 bg-slate-950/50 px-8 py-6 text-center lg:min-w-[220px]">
              <p className="font-display text-3xl font-semibold text-cyan-200">{highlight.metric.split(" ")[0]}</p>
              <p className="text-sm text-white/60">{highlight.metric.split(" ").slice(1).join(" ")}</p>
              <div className="mt-2 h-px w-full bg-white/10" />
              <p className="text-sm font-semibold text-white">{highlight.name}</p>
              <p className="text-xs text-white/50">{highlight.role}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/60">{highlight.company}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Two-column split testimonial */}
      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.08 }}>
          <div className="flex h-full flex-col rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-4 flex items-center gap-1 text-amber-200">
              {Array.from({ length: secondary.rating }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-current" />
              ))}
            </div>
            <p className="flex-1 text-sm leading-7 text-white/75">&ldquo;{secondary.quote}&rdquo;</p>
            <div className="mt-5 flex items-center gap-4 border-t border-white/8 pt-5">
              <div className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-sm font-bold text-cyan-200">
                {secondary.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{secondary.name}</p>
                <p className="text-xs text-white/50">{secondary.role}, {secondary.company}</p>
              </div>
            </div>
            <div className="mt-4 inline-flex self-start rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
              {secondary.metric}
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4">
          {others.slice(0, 2).map((item, index) => (
            <motion.div key={item.name} {...fadeUp} transition={{ duration: 0.4, delay: 0.12 + index * 0.08 }}>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-xs font-bold text-cyan-200">
                      {item.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.name}</p>
                      <p className="text-[11px] text-white/45">{item.role}, {item.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-200">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="size-3 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-7 text-white/68">&ldquo;{item.quote}&rdquo;</p>
                <div className="mt-3 inline-flex rounded-full border border-cyan-200/15 bg-cyan-200/8 px-2.5 py-1 text-[11px] font-medium text-cyan-200">
                  {item.metric}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom row - remaining testimonials as compact cards */}
      {others.length > 2 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.slice(2).map((item, index) => (
            <motion.div key={item.name} {...fadeUp} transition={{ duration: 0.4, delay: 0.16 + index * 0.08 }}>
              <div className="h-full rounded-[20px] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-sm leading-7 text-white/65">&ldquo;{item.quote}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] text-[10px] font-bold text-cyan-200">
                    {item.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{item.name}</p>
                    <p className="text-[10px] text-white/40">{item.company}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
