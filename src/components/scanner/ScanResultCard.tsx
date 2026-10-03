"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Leaf,
  ListChecks,
  RefreshCw,
  Save,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { SelectField } from "@/components/ui/Field";
import { ConfidenceMeter } from "@/components/scanner/ConfidenceBadge";
import { getClassInfo } from "@/lib/inference/classes";
import { DISCLAIMER, LOW_CONFIDENCE_MESSAGE, MODEL_INFO } from "@/lib/constants";
import type { Plant, Prediction, Scan } from "@/lib/types";
import { cn, formatPercent } from "@/lib/utils";

interface ScanResultCardProps {
  prediction: Prediction;
  threshold: number;
  plants: Plant[];
  savedScan: Scan | null;
  onSave: (plantId: string | null) => void;
  onScanAnother: () => void;
  /** "readonly" hides the save / re-scan actions (used on the scan detail page). */
  variant?: "interactive" | "readonly";
}

export function ScanResultCard({
  prediction,
  threshold,
  plants,
  savedScan,
  onSave,
  onScanAnother,
  variant = "interactive",
}: ScanResultCardProps) {
  const info = getClassInfo(prediction.classId);
  const lowConfidence = prediction.confidence < threshold;
  const [attaching, setAttaching] = useState(false);
  const [plantId, setPlantId] = useState<string>("");

  const statusBadge = lowConfidence ? (
    <Badge tone="low">Low confidence</Badge>
  ) : info.healthy ? (
    <Badge tone="healthy">Looks healthy</Badge>
  ) : (
    <Badge tone="attention">Potential issue detected</Badge>
  );

  return (
    <div className="animate-fade-up space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {statusBadge}
          <span className="text-xs text-ink-faint">Model prediction</span>
        </div>
        {lowConfidence ? (
          <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            Unable to confidently identify the condition
          </h2>
        ) : (
          <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {info.plant} <span className="text-ink-faint">—</span> {info.condition}
          </h2>
        )}
        {lowConfidence ? (
          <p className="text-sm text-ink-muted">
            The model&apos;s best guess was{" "}
            <span className="font-medium text-ink-soft">
              {info.plant} — {info.condition}
            </span>{" "}
            at {formatPercent(prediction.confidence)}, but this is below your confidence threshold.
          </p>
        ) : null}
      </div>

      <ConfidenceMeter value={prediction.confidence} threshold={threshold} />

      {lowConfidence ? (
        <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="flex items-start gap-2.5 text-sm font-medium text-amber-900">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            Low confidence — try uploading a clearer image of the leaf.
          </p>
          <p className="text-sm text-amber-900/90">{LOW_CONFIDENCE_MESSAGE}</p>
          <Button variant="secondary" size="sm" onClick={onScanAnother}>
            <RefreshCw className="size-3.5" aria-hidden="true" />
            Try Another Image
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-ink">What the model saw</h3>
          <p className="text-sm leading-relaxed text-ink-soft">
            {info.summary}{" "}
            {!info.healthy
              ? "The model detected visual patterns commonly associated with this condition."
              : "No visual patterns associated with common diseases were detected."}
          </p>
        </div>
      )}

      {/* Alternatives */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-ink">
          {lowConfidence ? "Conditions the model considered" : "Other possibilities"}
        </h3>
        <ul className="space-y-2">
          {prediction.alternatives.map((alt, index) => {
            const altInfo = getClassInfo(alt.classId);
            return (
              <li
                key={alt.classId}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-3.5 py-2.5",
                  index === 0 ? "border-moss-200 bg-moss-50/70" : "border-line bg-surface",
                )}
              >
                <span className={cn("size-1.5 shrink-0 rounded-full", index === 0 ? "bg-moss-600" : "bg-line-strong")} aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-sm text-ink-soft">
                  {altInfo.plant} — {altInfo.condition}
                  {index === 0 ? <span className="ml-2 text-xs text-ink-faint">best match</span> : null}
                </span>
                <span className="font-mono text-xs font-medium text-ink-muted tabular-nums">
                  {formatPercent(alt.confidence)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Guidance */}
      {!lowConfidence ? (
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
            {info.healthy ? (
              <Leaf className="size-4 text-moss-600" aria-hidden="true" />
            ) : (
              <ListChecks className="size-4 text-moss-600" aria-hidden="true" />
            )}
            {info.healthy ? "Keep your plant thriving" : "Recommended next steps"}
          </h3>
          {info.healthy ? (
            <ul className="space-y-2">
              {info.guidance.map((step) => (
                <li key={step} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-soft">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-moss-400" aria-hidden="true" />
                  {step}
                </li>
              ))}
            </ul>
          ) : (
            <ol className="space-y-2">
              {info.guidance.map((step, index) => (
                <li key={step} className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-moss-100 text-[11px] font-semibold text-moss-800">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          )}
          {!info.healthy ? (
            <p className="text-xs text-ink-faint">
              If symptoms spread, or you are unsure, ask a local agricultural extension service or an experienced
              grower to confirm.
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Save (interactive mode only) */}
      {variant === "interactive" ? (
        <>
          {savedScan ? (
        <div className="space-y-3 rounded-xl border border-moss-200 bg-moss-50 p-4">
          <p className="flex items-center gap-2 text-sm font-medium text-moss-900">
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Saved to your scan history.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/history/${savedScan.id}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-moss-800 underline-offset-4 hover:underline"
            >
              View scan details
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-moss-800 underline-offset-4 hover:underline"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      ) : attaching ? (
        <div className="space-y-4 rounded-xl border border-line bg-canvas p-4">
          {plants.length > 0 ? (
            <SelectField
              label="Attach to a plant record"
              optional
              value={plantId}
              onChange={(event) => setPlantId(event.target.value)}
              hint="Scans attached to a plant appear on that plant's card."
            >
              <option value="">Don&apos;t attach to a plant</option>
              {plants.map((plant) => (
                <option key={plant.id} value={plant.id}>
                  {plant.name} — {plant.location}
                </option>
              ))}
            </SelectField>
          ) : (
            <p className="text-sm text-ink-muted">
              You don&apos;t have any plant records yet.{" "}
              <Link href="/plants" className="font-medium text-moss-700 underline-offset-4 hover:underline">
                Create one
              </Link>{" "}
              first, or save the scan on its own.
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => onSave(plantId || null)}>
              <Save className="size-4" aria-hidden="true" />
              Save to history
            </Button>
            <Button variant="ghost" onClick={() => setAttaching(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setAttaching(true)}>
            <Save className="size-4" aria-hidden="true" />
            Save Result
          </Button>
          <Button variant="secondary" onClick={onScanAnother}>
            <RefreshCw className="size-4" aria-hidden="true" />
            Scan Another Plant
          </Button>
        </div>
      )}

      {savedScan ? (
        <Button variant="secondary" onClick={onScanAnother}>
          <RefreshCw className="size-4" aria-hidden="true" />
          Scan Another Plant
        </Button>
      ) : null}
        </>
      ) : null}

      <Disclaimer
        className="text-[11px]"
        text={`${MODEL_INFO.displayName} ran locally in ${Math.max(1, Math.round(prediction.latencyMs))} ms. ${DISCLAIMER}`}
      />
    </div>
  );
}
