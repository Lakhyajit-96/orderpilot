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
          d="M306 744V280H540C675.3 280 760 355.7 760 474C760 592.3 675.3 668 540 668H420V744H306ZM420 566H526C590.7 566 644 529.7 644 474C644 418.3 590.7 382 526 382H420V566Z"
          fill="white"
          fillRule="evenodd"
          clipRule="evenodd"
        />
        <path
          d="M536 474L716 294V394H836V554H716V654L536 474Z"
          fill="#72E4FF"
        />
        <circle cx="737" cy="474" r="40" fill="white" fillOpacity="0.22" />
        <circle cx="737" cy="474" r="18" fill="white" />
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