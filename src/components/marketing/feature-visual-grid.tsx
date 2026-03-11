"use client";

import { motion } from "framer-motion";
import { CheckCircle2, CircleDashed, CreditCard, LayoutDashboard, MailCheck, PackageSearch, Settings2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  dashboardPreview,
  featureVisualCards,
  orderReviewPreview,
  settingsPreview,
} from "@/components/marketing/marketing-visual-data";

const featureIcons = {
  "layout-dashboard": LayoutDashboard,
  "package-search": PackageSearch,
  settings: Settings2,
} as const;

function DashboardSurface() {
  return (
    <div className="story-grid rounded-[24px] border border-white/10 bg-slate-950/78 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-white/38">{dashboardPreview.heading}</p>
      <p className="mt-2 text-sm text-white/68">{dashboardPreview.subheading}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
        {dashboardPreview.metrics.map((metric) => (
          <div key={metric} className="rounded-2xl border border-white/8 bg-white/[0.05] px-3 py-3 text-sm font-medium text-white/76">
            {metric}
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-2.5">
        {dashboardPreview.checklist.map((item, index) => (
          <motion.div
            key={item.title}
            animate={{ y: [0, index === 1 ? -3 : 0, 0] }}
            transition={{ duration: 7 + index, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-3"
          >
            <div className="rounded-full border border-white/10 bg-slate-950/75 p-2 text-cyan-200">
              {index === 0 ? <CircleDashed className="size-3.5" /> : <CheckCircle2 className="size-3.5" />}
            </div>
            <div>
              <p className="text-sm text-white/78">{item.title} · {item.detail}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/38">{item.status}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function OrderReviewSurface() {
  return (
    <div className="story-grid rounded-[24px] border border-white/10 bg-slate-950/78 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-white/38">Order detail</p>
      <p className="mt-2 text-sm font-medium text-white/82">{orderReviewPreview.heading}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {orderReviewPreview.badges.map((badge) => (
          <span key={badge} className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white/58">
            {badge}
          </span>
        ))}
      </div>
      <div className="mt-3 space-y-2.5">
        {orderReviewPreview.lineItems.slice(0, 2).map((line, index) => (
          <motion.div
            key={line.sku}
            animate={{ x: [0, index === 0 ? 2 : 0, 0] }}
            transition={{ duration: 6 + index, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-3"
          >
            <div className="flex items-center justify-between gap-3 text-sm text-white/78">
              <span>{line.sku}</span>
              <span className={line.state === "Review" ? "text-violet-200" : "text-emerald-300"}>{line.match}</span>
            </div>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/38">ERP mapping target · {line.mappedTo}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 rounded-2xl border border-violet-400/20 bg-violet-400/8 px-3 py-3 text-sm text-violet-50">
        {orderReviewPreview.exception}
      </div>
      <div className="mt-3 rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-3 text-sm text-white/62">
        {orderReviewPreview.shippingAddress}
      </div>
    </div>
  );
}

function SettingsSurface() {
  return (
    <div className="story-grid rounded-[24px] border border-white/10 bg-slate-950/78 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-white/38">Workspace settings</p>
      <p className="mt-2 text-sm text-white/68">{settingsPreview.heading}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
        {settingsPreview.readiness.map((item) => (
          <div key={item} className="rounded-2xl border border-white/8 bg-white/[0.05] px-3 py-3 text-sm font-medium text-white/76">
            {item}
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-2.5">
        {[settingsPreview.mailbox, settingsPreview.erp, settingsPreview.billing].map((row, index) => {
          const RowIcon = [MailCheck, PackageSearch, CreditCard][index] ?? MailCheck;

          return (
            <motion.div
              key={row}
              animate={{ y: [0, index === 1 ? -3 : 0, 0] }}
              transition={{ duration: 7 + index, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-3"
            >
              <div className="rounded-full border border-white/10 bg-slate-950/75 p-2 text-cyan-200">
                <RowIcon className="size-3.5" />
              </div>
              <p className="text-sm text-white/74">{row}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function FeatureVisualGrid() {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {featureVisualCards.map((card, index) => {
        const Icon = featureIcons[card.iconName];

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            className="panel shimmer-border relative overflow-hidden rounded-[30px] p-5"
          >
            <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,rgba(114,228,255,0.16),transparent_55%)]" />
            <div className="relative z-10 flex items-center justify-between gap-3">
              <Badge variant={card.variant}>{card.eyebrow}</Badge>
              <div className="rounded-full border border-white/10 bg-white/[0.05] p-2 text-white/78">
                <Icon className="size-4" />
              </div>
            </div>

            <div className="relative z-10 mt-5">
              {card.iconName === "layout-dashboard" ? <DashboardSurface /> : null}
              {card.iconName === "package-search" ? <OrderReviewSurface /> : null}
              {card.iconName === "settings" ? <SettingsSurface /> : null}
            </div>

            <div className="relative z-10 mt-5">
              <p className="text-lg font-semibold text-white">{card.title}</p>
              <p className="mt-3 text-sm leading-7 text-white/66">{card.text}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}