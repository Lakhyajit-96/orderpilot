 "use client";
 
 import { motion } from "framer-motion";
 
 export function ErpMappingDiagram({ className }: { className?: string }) {
   return (
     <div className={className}>
       <motion.svg
         viewBox="0 0 800 360"
         className="h-40 w-full"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.6 }}
       >
         <defs>
           <linearGradient id="erpGrad" x1="0" y1="0" x2="1" y2="0">
             <stop offset="0%" stopColor="rgba(114,228,255,0.95)" />
             <stop offset="100%" stopColor="rgba(124,92,255,0.95)" />
           </linearGradient>
         </defs>
         <motion.rect
           x="40"
           y="40"
           width="220"
           height="80"
           rx="12"
           fill="rgba(255,255,255,0.05)"
           stroke="url(#erpGrad)"
           strokeWidth="2"
         />
         <motion.text x="52" y="90" fill="white" fontSize="14" opacity="0.8">
           Customer SKUs → ERP items
         </motion.text>
         <motion.rect
           x="540"
           y="220"
           width="220"
           height="80"
           rx="12"
           fill="rgba(255,255,255,0.05)"
           stroke="url(#erpGrad)"
           strokeWidth="2"
         />
         <motion.text x="552" y="270" fill="white" fontSize="14" opacity="0.8">
           Approved draft → ERP handoff
         </motion.text>
         <motion.path
           d="M260 80 C 420 80, 600 220, 640 220"
           fill="none"
           stroke="url(#erpGrad)"
           strokeWidth="2"
           initial={{ pathLength: 0 }}
           animate={{ pathLength: 1 }}
           transition={{ duration: 2.0, ease: "easeInOut" }}
         />
       </motion.svg>
     </div>
   );
 }
