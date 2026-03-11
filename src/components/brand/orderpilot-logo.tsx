import Link from "next/link";
import { cn } from "@/lib/utils";

const logoSizeClasses = {
  sm: "size-9 rounded-[18px]",
  md: "size-10 rounded-[20px]",
  lg: "size-11 rounded-[22px]",
} as const;

type BrandLogoProps = {
  href?: string;
  size?: keyof typeof logoSizeClasses;
  showTagline?: boolean;
  align?: "left" | "center";
  className?: string;
  wordmarkClassName?: string;
};

export function BrandMark({ className, size = "md" }: { className?: string; size?: keyof typeof logoSizeClasses }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center border border-white/14 bg-[linear-gradient(145deg,#7ae6ff_0%,#7c5cff_54%,#3a22bf_100%)] text-white shadow-[0_20px_54px_rgba(73,116,255,0.34)] ring-1 ring-white/6",
        logoSizeClasses[size],
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1024 1024" className="size-[72%]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="brand-mark-dot" x1="676" y1="216" x2="790" y2="330" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E7FBFF" />
            <stop offset="1" stopColor="#72E4FF" />
          </linearGradient>
        </defs>
        <path
          d="M220 610C220 409.5 382.5 247 583 247H649C716.4 247 771 301.6 771 369C771 436.4 716.4 491 649 491H529C463.8 491 411 543.8 411 609C411 674.2 463.8 727 529 727H804V837H529C403.1 837 301 734.9 301 609C301 483.1 403.1 381 529 381H649C682 381 709 354 709 321C709 288 682 261 649 261H583C443.8 261 331 373.8 331 513V610H220Z"
          fill="white"
        />
        <path d="M564 182L822 440L564 698V570H478V452H564V182Z" fill="white" />
        <circle cx="728" cy="296" r="48" fill="url(#brand-mark-dot)" />
      </svg>
    </div>
  );
}

export function BrandLogo({
  href,
  size = "md",
  showTagline = true,
  align = "left",
  className,
  wordmarkClassName,
}: BrandLogoProps) {
  const content = (
    <div className={cn("flex items-center gap-3", align === "center" && "justify-center text-center", className)}>
      <BrandMark size={size} />
      <div className={cn("min-w-0", align === "center" && "text-center", wordmarkClassName)}>
        <p className="font-display text-[1.02rem] font-semibold tracking-[0.015em] text-white">OrderPilot</p>
        {showTagline ? <p className="text-[0.8rem] text-white/64">AI order intake for distributors</p> : null}
      </div>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} aria-label="OrderPilot home" className="inline-flex">
      {content}
    </Link>
  );
}