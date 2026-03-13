import Link from "next/link";
import { cn } from "@/lib/utils";

const logoSizeClasses = {
  xs: "size-8 rounded-[16px]",
  sm: "size-9 rounded-[18px]",
  md: "size-10 rounded-[20px]",
  lg: "size-11 rounded-[22px]",
} as const;

const wordmarkSizeClasses = {
  xs: "text-[0.95rem]",
  sm: "text-[0.98rem]",
  md: "text-[1.02rem]",
  lg: "text-[1.08rem]",
} as const;

const taglineSizeClasses = {
  xs: "text-[0.7rem] tracking-[0.12em]",
  sm: "text-[0.74rem] tracking-[0.12em]",
  md: "text-[0.78rem] tracking-[0.13em]",
  lg: "text-[0.82rem] tracking-[0.14em]",
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
        "flex items-center justify-center border border-white/14 bg-[linear-gradient(145deg,#060d1a_0%,#0f2d5e_54%,#4f46e5_100%)] text-white shadow-[0_20px_54px_rgba(54,88,255,0.36),0_0_20px_rgba(114,228,255,0.12)] ring-1 ring-white/8",
        logoSizeClasses[size],
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1024 1024" className="size-[72%]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M758 342C701 279 611 242 512 242C363 242 242 363 242 512C242 661 363 782 512 782C622 782 716 719 759 626"
          stroke="white"
          strokeWidth="96"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M571 318L805 312L734 548L668 480L524 624L458 558L602 414L571 318Z" fill="#72E4FF" />
        <circle cx="336" cy="676" r="38" fill="#A78BFA" />
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
        <p className={cn("font-display font-semibold tracking-[0.012em] text-white", wordmarkSizeClasses[size])}>OrderPilot</p>
        {showTagline ? (
          <p className={cn("uppercase text-white/54", taglineSizeClasses[size])}>AI order intake for distributors</p>
        ) : null}
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
