 "use client";
 
 import { motion } from "framer-motion";
 
 export function ScreenshotFrame({
   title,
   lines,
   accent = "cyan",
   className,
 }: {
   title: string;
   lines: string[];
   accent?: "cyan" | "violet" | "emerald" | "amber";
   className?: string;
 }) {
   const accentClass =
     accent === "violet"
       ? "from-violet-300/24 to-cyan-300/12"
       : accent === "emerald"
       ? "from-emerald-300/24 to-cyan-300/12"
       : accent === "amber"
       ? "from-amber-300/24 to-cyan-300/12"
       : "from-cyan-300/24 to-violet-300/12";
 
   return (
     <motion.div
       className={className}
       initial={{ opacity: 0, y: 8 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.5 }}
     >
       <div className="rounded-[26px] border border-white/10 bg-slate-950/80 p-5 shadow-[0_24px_80px_rgba(2,8,26,0.45)]">
         <div className="flex items-center gap-2">
           <span className="size-2 rounded-full bg-white/20" />
           <span className="size-2 rounded-full bg-white/26" />
           <span className="size-2 rounded-full bg-white/18" />
         </div>
 
         <div className="mt-5 rounded-[22px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4">
           <p className="text-xs uppercase tracking-[0.24em] text-white/42">Screenshot</p>
           <p className="mt-2 text-lg font-semibold text-white">{title}</p>
           <div className="mt-3 grid gap-2">
             {lines.map((line) => (
               <div key={line} className="rounded-[16px] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
                 {line}
               </div>
             ))}
           </div>
         </div>
 
         <div className={`mt-6 h-2 w-full rounded-full bg-gradient-to-r ${accentClass}`} />
       </div>
     </motion.div>
   );
 }
