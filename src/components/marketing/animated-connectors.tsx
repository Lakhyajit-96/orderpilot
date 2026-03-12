 "use client";
 
 import { motion } from "framer-motion";
 
 export function AnimatedConnectors({ className }: { className?: string }) {
   return (
     <div className={className}>
       <motion.svg
         viewBox="0 0 800 200"
         className="h-24 w-full"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.6 }}
       >
         <defs>
           <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
             <stop offset="0%" stopColor="rgba(114,228,255,0.85)" />
             <stop offset="100%" stopColor="rgba(124,92,255,0.85)" />
           </linearGradient>
         </defs>
         <motion.path
           d="M20 100 C 200 20, 600 180, 780 100"
           fill="none"
           stroke="url(#g1)"
           strokeWidth="2"
           initial={{ pathLength: 0 }}
           animate={{ pathLength: 1 }}
           transition={{ duration: 2.0, ease: "easeInOut" }}
         />
       </motion.svg>
     </div>
   );
 }
