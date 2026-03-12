 "use client";
 
 import { motion } from "framer-motion";
 import { cn } from "@/lib/utils";
 
 export function VisualCanvas({
   children,
   className,
   accent = "cyan",
   rotation = { x: 2, y: -1 },
 }: {
   children: React.ReactNode;
   className?: string;
   accent?: "cyan" | "violet" | "emerald" | "amber";
   rotation?: { x: number; y: number };
 }) {
   const accentGlow =
     accent === "violet"
       ? "from-violet-300/20 to-cyan-300/10"
       : accent === "emerald"
       ? "from-emerald-300/20 to-cyan-300/10"
       : accent === "amber"
       ? "from-amber-300/20 to-cyan-300/10"
       : "from-cyan-300/20 to-violet-300/10";
 
   return (
     <motion.div
       className={cn(
         "relative rounded-[26px] border border-white/10 shadow-[0_24px_80px_rgba(2,8,26,0.55)] overflow-hidden",
         "transform-gpu will-change-transform",
         className,
       )}
       initial={{ opacity: 0, y: 8 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.5 }}
       style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
     >
       <div className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${accentGlow}`} />
       {children}
     </motion.div>
   );
 }
