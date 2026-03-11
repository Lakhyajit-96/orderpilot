"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { faqItems } from "@/components/marketing/marketing-site-data";
import { cn } from "@/lib/utils";

type FaqAccordionProps = {
  items?: ReadonlyArray<{
    question: string;
    answer: string;
  }>;
};

export function FaqAccordion({ items = faqItems }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={item.question} className={cn("rounded-[24px] border border-white/10 bg-white/[0.045] px-5 py-4 transition-colors", isOpen && "border-cyan-300/20 bg-cyan-300/[0.06]")}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 text-left"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              aria-expanded={isOpen}
            >
              <span className="font-display text-lg font-semibold text-white">{item.question}</span>
              <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition-transform", isOpen && "rotate-180 border-cyan-300/20 bg-cyan-300/10 text-cyan-100")}>
                <ChevronDown className="size-4" />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="pt-4 text-sm leading-7 text-white/68">{item.answer}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}