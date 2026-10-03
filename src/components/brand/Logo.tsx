import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cn("size-8", className)} role="img" aria-label="GardenCare AI logo">
      <rect width="64" height="64" rx="14" fill="#1d3d27" />
      <path d="M32 51C17.5 39.5 17.5 19.5 32 11c14.5 8.5 14.5 28.5 0 40z" fill="#98c7a3" />
      <path d="M32 13.5V49" stroke="#1d3d27" strokeWidth="2.6" strokeLinecap="round" />
      <path
        d="M32 26c4.2-1.8 7.2-4.6 8.6-8.2M32 35c-4.2-1.8-7.2-4.6-8.6-8.2"
        stroke="#1d3d27"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} />
      <span className="text-[15px] font-semibold tracking-tight text-ink">
        GardenCare <span className="text-moss-600">AI</span>
        <span className="sr-only"> — {APP_NAME}</span>
      </span>
    </span>
  );
}
