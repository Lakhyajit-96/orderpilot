import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]",
  {
    variants: {
      variant: {
        default: "border-cyan-400/25 bg-cyan-400/10 text-cyan-100",
        violet: "border-violet-400/25 bg-violet-400/10 text-violet-100",
        success: "border-emerald-400/25 bg-emerald-400/10 text-emerald-100",
        muted: "border-white/10 bg-white/6 text-white/65",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

