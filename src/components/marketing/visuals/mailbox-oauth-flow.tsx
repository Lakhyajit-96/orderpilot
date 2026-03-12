 "use client";
 
 import { motion } from "framer-motion";
 
 export function MailboxOAuthFlow({ className }: { className?: string }) {
   return (
     <div className={className}>
       <motion.svg
         viewBox="0 0 800 240"
         className="h-32 w-full"
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 0.6 }}
       >
         <defs>
           <linearGradient id="oauthGrad" x1="0" y1="0" x2="1" y2="0">
             <stop offset="0%" stopColor="rgba(114,228,255,0.85)" />
             <stop offset="100%" stopColor="rgba(124,92,255,0.85)" />
           </linearGradient>
         </defs>
         <motion.rect x="40" y="40" width="160" height="60" rx="10" fill="rgba(255,255,255,0.05)" stroke="url(#oauthGrad)" strokeWidth="2" />
         <motion.text x="58" y="75" fill="white" fontSize="13" opacity="0.8">Admin consent</motion.text>
 
         <motion.rect x="320" y="40" width="160" height="60" rx="10" fill="rgba(255,255,255,0.05)" stroke="url(#oauthGrad)" strokeWidth="2" />
         <motion.text x="338" y="75" fill="white" fontSize="13" opacity="0.8">Token issue</motion.text>
 
         <motion.rect x="600" y="40" width="160" height="60" rx="10" fill="rgba(255,255,255,0.05)" stroke="url(#oauthGrad)" strokeWidth="2" />
         <motion.text x="618" y="75" fill="white" fontSize="13" opacity="0.8">Rotation & revoke</motion.text>
 
         <motion.path
           d="M200 70 C 260 40, 300 40, 320 70"
           fill="none"
           stroke="url(#oauthGrad)"
           strokeWidth="2"
           initial={{ pathLength: 0 }}
           animate={{ pathLength: 1 }}
           transition={{ duration: 1.2, ease: "easeInOut" }}
         />
         <motion.path
           d="M480 70 C 540 40, 580 40, 600 70"
           fill="none"
           stroke="url(#oauthGrad)"
           strokeWidth="2"
           initial={{ pathLength: 0 }}
           animate={{ pathLength: 1 }}
           transition={{ duration: 1.2, ease: "easeInOut", delay: 0.4 }}
         />
       </motion.svg>
     </div>
   );
 }
