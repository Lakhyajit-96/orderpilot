"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { testimonials } from "@/components/marketing/marketing-site-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function HeadshotAvatar({
  id,
  accentColor,
  hairColor,
}: {
  id: string;
  accentColor: string;
  hairColor: string;
}) {
  return (
    <svg viewBox="0 0 120 120" className="size-[72px] overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/70 shadow-[0_16px_40px_rgba(4,8,24,0.32)]" role="img" aria-label="Generated testimonial headshot">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.88" />
          <stop offset="100%" stopColor="#0B122B" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="28" fill={`url(#${id}-bg)`} />
      <circle cx="60" cy="44" r="18" fill="#F3D7C8" />
      <path d="M39 44C40.6 27.5 51 18 64 18C76 18 85.5 23.5 90 38.5C84.4 36 78.7 34.8 72.8 34.8C58.2 34.8 47.5 39 39 44Z" fill={hairColor} />
      <path d="M30 113C34.9 89.8 47 78 60 78C73 78 85.1 89.8 90 113" fill="#13233F" />
      <circle cx="53" cy="45" r="1.8" fill="#1F2437" />
      <circle cx="67" cy="45" r="1.8" fill="#1F2437" />
      <path d="M54 55C56 57.2 58.5 58.2 61.5 58.2C64.2 58.2 66.6 57.2 68.8 55" stroke="#B56A68" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M42 89C47.1 84.2 52.9 81.8 60 81.8C67.1 81.8 72.9 84.2 78 89" stroke={accentColor} strokeOpacity="0.78" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function TestimonialsSection() {
  const [featured, ...rest] = testimonials;
  const featuredProof = featured.proofPoints;

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

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45 }}
          className={`h-full rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 shadow-[0_24px_80px_rgba(2,8,24,0.35)] ${featured.tone}`}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-4">
              <HeadshotAvatar id="featured-headshot" accentColor={featured.accentColor} hairColor={featured.hairColor} />
              <div>
                <p className="font-display text-xl font-semibold text-white">{featured.name}</p>
                <p className="mt-1 text-sm text-white/60">{featured.role}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-cyan-100/74">{featured.company}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-amber-200">
              {Array.from({ length: featured.rating }).map((_, index) => (
                <Star key={index} className="size-4 fill-current" />
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-white/10 bg-slate-950/65 p-5">
            <Quote className="size-6 text-cyan-200" />
            <p className="mt-4 max-w-3xl text-lg leading-8 text-white/80">“{featured.quote}”</p>
            <p className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-7 text-white/70">
              {featured.detail}
            </p>
            <div className="mt-5 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
              {featured.metric}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProof.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs leading-6 text-white/68">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2">
          {rest.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Card className="h-full overflow-hidden border-white/12 bg-white/[0.05]">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <HeadshotAvatar id={`headshot-${index}`} accentColor={item.accentColor} hairColor={item.hairColor} />
                      <div>
                        <p className="font-display text-lg font-semibold text-white">{item.name}</p>
                        <p className="mt-1 text-sm text-white/58">{item.role}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/40">{item.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-200">
                      {Array.from({ length: item.rating }).map((_, starIndex) => (
                        <Star key={starIndex} className="size-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-white/72">“{item.quote}”</p>
                  <p className="mt-4 text-sm leading-7 text-white/58">{item.detail}</p>
                  <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/58">
                    {item.metric}
                  </div>
                  <div className="mt-4 space-y-2">
                    {item.proofPoints.slice(0, 2).map((proof) => (
                      <div key={proof} className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2 text-xs leading-6 text-white/60">
                        {proof}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}