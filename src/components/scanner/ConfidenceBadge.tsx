import { cn, formatPercent } from "@/lib/utils";

/**
 * Compact percentage chip used in tables and lists.
 * Color reflects how the value sits against the user's confidence threshold.
 */
export function ConfidenceBadge({
  value,
  threshold,
  className,
}: {
  value: number;
  threshold: number;
  className?: string;
}) {
  const tone =
    value >= 0.85
      ? "bg-moss-100 text-moss-800"
      : value >= threshold
        ? "bg-moss-50 text-moss-700"
        : "bg-amber-100 text-amber-900";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-xs font-medium tabular-nums",
        tone,
        className,
      )}
      title={`Estimated confidence ${formatPercent(value)}`}
    >
      {formatPercent(value)}
    </span>
  );
}

/**
 * Larger confidence display with a meter and the user's threshold marked.
 */
export function ConfidenceMeter({
  value,
  threshold,
  className,
}: {
  value: number;
  threshold: number;
  className?: string;
}) {
  const percent = Math.round(value * 100);
  const low = value < threshold;
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs font-medium tracking-wide text-ink-muted uppercase">
          Estimated confidence
        </span>
        <span className={cn("font-mono text-lg font-semibold tabular-nums", low ? "text-amber-700" : "text-moss-700")}>
          {percent}%
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Estimated confidence"
        className="relative h-2.5 w-full overflow-hidden rounded-full bg-line"
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-700", low ? "bg-amber-400" : "bg-moss-500")}
          style={{ width: `${Math.max(3, percent)}%` }}
        />
        <div
          className="absolute inset-y-0 w-px bg-ink/30"
          style={{ left: `${Math.round(threshold * 100)}%` }}
          title={`Your confidence threshold: ${Math.round(threshold * 100)}%`}
        />
      </div>
      <p className="text-xs text-ink-faint">
        {low
          ? `Below your ${Math.round(threshold * 100)}% confidence threshold`
          : `Meets your ${Math.round(threshold * 100)}% confidence threshold`}
      </p>
    </div>
  );
}
