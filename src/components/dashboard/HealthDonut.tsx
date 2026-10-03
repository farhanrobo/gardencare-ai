const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function HealthDonut({ healthy, attention }: { healthy: number; attention: number }) {
  const total = healthy + attention;
  const healthyFrac = total > 0 ? healthy / total : 0;
  const healthyPercent = Math.round(healthyFrac * 100);

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
      <div className="relative">
        <svg viewBox="0 0 130 130" className="size-36" role="img" aria-label={`${healthyPercent}% of scans were healthy`}>
          <circle cx="65" cy="65" r={RADIUS} fill="none" stroke="var(--color-line)" strokeWidth="13" />
          {total > 0 ? (
            <>
              <circle
                cx="65"
                cy="65"
                r={RADIUS}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="13"
                strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                transform="rotate(-90 65 65)"
              />
              <circle
                cx="65"
                cy="65"
                r={RADIUS}
                fill="none"
                stroke="var(--color-moss-500)"
                strokeWidth="13"
                strokeDasharray={`${CIRCUMFERENCE * healthyFrac} ${CIRCUMFERENCE}`}
                strokeLinecap="round"
                transform="rotate(-90 65 65)"
              />
            </>
          ) : null}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-semibold text-ink tabular-nums">
            {total > 0 ? `${healthyPercent}%` : "—"}
          </span>
          <span className="text-[11px] text-ink-muted">healthy</span>
        </div>
      </div>
      <ul className="w-full space-y-3 sm:flex-1">
        <li className="flex items-center justify-between gap-3 text-sm">
          <span className="flex items-center gap-2 text-ink-soft">
            <span className="size-2.5 rounded-full bg-moss-500" aria-hidden="true" />
            Healthy results
          </span>
          <span className="font-mono font-medium text-ink tabular-nums">{healthy}</span>
        </li>
        <li className="flex items-center justify-between gap-3 text-sm">
          <span className="flex items-center gap-2 text-ink-soft">
            <span className="size-2.5 rounded-full bg-amber-500" aria-hidden="true" />
            Needs attention
          </span>
          <span className="font-mono font-medium text-ink tabular-nums">{attention}</span>
        </li>
      </ul>
    </div>
  );
}
