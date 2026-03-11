"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, CheckCircle2, FileSearch2, Mail, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { workflowStages } from "@/components/marketing/marketing-visual-data";

const stageIcons = {
  mail: Mail,
  bot: Bot,
  "file-search": FileSearch2,
  "check-circle": CheckCircle2,
} as const;

export function WorkflowVisualStrip() {
  return (
    <div className="relative">
      <div className="absolute left-12 right-12 top-10 hidden h-px bg-[linear-gradient(90deg,rgba(114,228,255,0.05),rgba(114,228,255,0.28),rgba(124,92,255,0.28),rgba(255,255,255,0.05))] lg:block" />
      <div className="grid gap-4 lg:grid-cols-4">
        {workflowStages.map((stage, index) => {
          const Icon = stageIcons[stage.iconName];

          return (
            <motion.div
              key={stage.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="relative h-full"
            >
              <div className="panel shimmer-border relative flex h-full flex-col overflow-hidden rounded-[30px] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Badge variant={stage.variant}>{stage.label}</Badge>
                    <span className="text-[11px] uppercase tracking-[0.22em] text-white/38">0{index + 1}</span>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/[0.05] p-2 text-white/76">
                    <Icon className="size-4" />
                  </div>
                </div>

                <div className="story-grid mt-5 flex-1 rounded-[24px] border border-white/10 bg-slate-950/72 p-4">
                  <div className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-white/38">
                    <span>{stage.label} surface</span>
                    <span>{stage.metric}</span>
                  </div>
                  <div className="space-y-2.5">
                    {stage.preview.map((row, rowIndex) => (
                      <motion.div
                        key={row.primary}
                        animate={{ x: [0, rowIndex === 0 ? 4 : 0, 0] }}
                        transition={{ duration: 6 + rowIndex, repeat: Infinity, ease: "easeInOut" }}
                        className="rounded-2xl border border-white/8 bg-white/[0.05] px-3 py-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-white/82">{row.primary}</p>
                          <span className="rounded-full border border-white/10 bg-slate-950/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/56">
                            {row.badge}
                          </span>
                        </div>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/38">{row.secondary}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <p className="mt-5 text-lg font-semibold text-white">{stage.title}</p>
                <p className="mt-3 text-sm leading-7 text-white/66">{stage.text}</p>

                <div className="mt-5 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/42">
                  <span>{stage.metric}</span>
                  {index < workflowStages.length - 1 ? <ArrowRight className="size-3.5 text-white/38" /> : <Send className="size-3.5 text-cyan-200" />}
                </div>
              </div>

              {index < workflowStages.length - 1 ? (
                <div className="workflow-connector absolute right-[-20px] top-10 hidden lg:block">
                  <motion.div
                    animate={{ x: [0, 26, 0], opacity: [0.35, 1, 0.35] }}
                    transition={{ duration: 2.6, repeat: Infinity, delay: index * 0.28, ease: "easeInOut" }}
                    className="workflow-connector-dot"
                  />
                </div>
              ) : null}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}