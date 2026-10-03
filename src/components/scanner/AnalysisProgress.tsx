"use client";

import { Check, Loader2 } from "lucide-react";
import { cn, humanFileSize } from "@/lib/utils";

export interface AnalysisStage {
  id: string;
  label: string;
}

export const ANALYSIS_STAGES: AnalysisStage[] = [
  { id: "prepare", label: "Preparing the image" },
  { id: "model", label: "Loading the plant model" },
  { id: "examine", label: "Examining leaf patterns" },
  { id: "compare", label: "Comparing with 38 known conditions" },
];

export function AnalysisProgress({
  stageIndex,
  download,
  className,
}: {
  stageIndex: number;
  download?: { loaded: number; total: number | null } | null;
  className?: string;
}) {
  return (
    <div className={cn("space-y-6", className)} role="status" aria-live="polite">
      <div>
        <p className="text-sm font-semibold text-ink">Analyzing your plant…</p>
        <p className="mt-1 text-xs text-ink-muted">This runs locally in your browser.</p>
      </div>
      <ol className="space-y-3">
        {ANALYSIS_STAGES.map((stage, index) => {
          const state = index < stageIndex ? "done" : index === stageIndex ? "active" : "upcoming";
          return (
            <li key={stage.id} className="flex items-center gap-3">
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border",
                  state === "done" && "border-moss-200 bg-moss-100 text-moss-700",
                  state === "active" && "border-moss-300 bg-surface text-moss-700",
                  state === "upcoming" && "border-line bg-surface text-ink-faint",
                )}
              >
                {state === "done" ? (
                  <Check className="size-3.5" aria-hidden="true" />
                ) : state === "active" ? (
                  <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                )}
              </span>
              <span
                className={cn(
                  "text-sm",
                  state === "active" ? "font-medium text-ink" : state === "done" ? "text-ink-soft" : "text-ink-faint",
                )}
              >
                {stage.label}
                {state === "active" && index !== 0 ? "…" : ""}
              </span>
            </li>
          );
        })}
      </ol>
      {download && (
        <div className="space-y-2 rounded-xl bg-moss-50 px-4 py-3">
          <div className="flex items-baseline justify-between gap-3 text-xs text-ink-soft">
            <span>One-time model download (cached afterwards)</span>
            <span className="font-mono tabular-nums">
              {download.total
                ? `${humanFileSize(download.loaded)} / ${humanFileSize(download.total)}`
                : humanFileSize(download.loaded)}
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Model download progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={download.total ? Math.round((download.loaded / download.total) * 100) : undefined}
            className="h-1.5 w-full overflow-hidden rounded-full bg-moss-100"
          >
            <div
              className="h-full rounded-full bg-moss-500 transition-[width] duration-200"
              style={{ width: `${download.total ? Math.min(100, (download.loaded / download.total) * 100) : 8}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
