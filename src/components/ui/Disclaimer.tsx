import { Info } from "lucide-react";
import { DISCLAIMER } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Disclaimer({ className, text = DISCLAIMER }: { className?: string; text?: string }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-xl bg-moss-50 px-3.5 py-3 text-xs leading-relaxed text-ink-soft",
        className,
      )}
    >
      <Info className="mt-0.5 size-3.5 shrink-0 text-moss-600" aria-hidden="true" />
      <p>{text}</p>
    </div>
  );
}
