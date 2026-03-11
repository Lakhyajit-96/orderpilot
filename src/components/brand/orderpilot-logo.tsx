import Link from "next/link";
import { cn } from "@/lib/utils";

const logoSizeClasses = {
  sm: "size-10 rounded-[18px]",
  md: "size-11 rounded-[20px]",
  lg: "size-12 rounded-[22px]",
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
        "flex items-center justify-center bg-[linear-gradient(135deg,#72e4ff_0%,#7c5cff_55%,#4b2fde_100%)] text-white shadow-[0_18px_48px_rgba(73,116,255,0.35)]",
        logoSizeClasses[size],
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1024 1024" className="size-[72%]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M260 513C260 383.8 364.8 279 494 279H598V175L818 384L598 593V489H494C480.4 489 467.7 490.2 455.8 492.6C373.4 509 311 581.7 311 669C311 769.5 392.5 851 493 851H769V969H493C327.6 969 193 834.4 193 669C193 594.6 220.4 526.6 265.7 474.6L260 513Z"
          fill="white"
        />
        <circle cx="753" cy="383" r="54" fill="#72E4FF" />
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
        <p className="font-display text-lg font-semibold tracking-[0.02em] text-white">OrderPilot</p>
        {showTagline ? <p className="text-sm text-white/66">AI order intake for distributors</p> : null}
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