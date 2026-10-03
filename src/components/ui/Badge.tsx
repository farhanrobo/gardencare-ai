import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "healthy" | "attention" | "low" | "demo" | "neutral" | "info";

const TONES: Record<BadgeTone, string> = {
  healthy: "bg-moss-100 text-moss-800",
  attention: "bg-amber-100 text-amber-900",
  low: "bg-slate-200/70 text-slate-700",
  demo: "border border-dashed border-line-strong bg-transparent text-ink-muted",
  neutral: "bg-moss-50 text-ink-soft",
  info: "bg-moss-600/10 text-moss-800",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
