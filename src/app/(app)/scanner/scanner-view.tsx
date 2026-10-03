"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Cpu, Leaf, ScanSearch, ShieldCheck, Sprout } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { AnalysisProgress } from "@/components/scanner/AnalysisProgress";
import { PlantImageUploader } from "@/components/scanner/PlantImageUploader";
import { ScanResultCard } from "@/components/scanner/ScanResultCard";
import { MODEL_INFO } from "@/lib/constants";
import { SCAN_QUALITY_TIPS } from "@/lib/content/tips";
import { useAppData } from "@/lib/data/DataContext";
import { classify, preloadModel, subscribeToModelProgress } from "@/lib/inference/classifier";
import { prepareImageFile, prepareImageFromUrl, type PreparedImage } from "@/lib/inference/preprocess";
import { getClassInfo } from "@/lib/inference/classes";
import type { Prediction, Scan } from "@/lib/types";

type Phase = "idle" | "analyzing" | "result";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function ScannerView() {
  const searchParams = useSearchParams();
  const plantParam = searchParams.get("plant");
  const { ready, plants, settings, addScan } = useAppData();

  const [prepared, setPrepared] = useState<PreparedImage | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [stageIndex, setStageIndex] = useState(0);
  const [download, setDownload] = useState<{ loaded: number; total: number | null } | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [savedScan, setSavedScan] = useState<Scan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const preselectedPlant = useMemo(
    () => (plantParam ? plants.find((plant) => plant.id === plantParam) : undefined),
    [plantParam, plants],
  );

  // Warm the model up as soon as the page opens and mirror download progress.
  useEffect(() => {
    preloadModel();
    return subscribeToModelProgress((progress) => {
      if (progress.phase === "downloading") {
        setDownload({ loaded: progress.loaded, total: progress.total });
      }
    });
  }, []);

  const resetResult = useCallback(() => {
    setPrediction(null);
    setSavedScan(null);
    setPhase("idle");
    setStageIndex(0);
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      resetResult();
      try {
        const preparedImage = await prepareImageFile(file);
        setPrepared(preparedImage);
      } catch (err) {
        setPrepared(null);
        setError(err instanceof Error ? err.message : "We couldn't read that image. Please try another photo.");
      }
    },
    [resetResult],
  );

  const handleSample = useCallback(
    async (src: string, fileName: string) => {
      setError(null);
      resetResult();
      try {
        const preparedImage = await prepareImageFromUrl(src, fileName);
        setPrepared(preparedImage);
      } catch (err) {
        setPrepared(null);
        setError(err instanceof Error ? err.message : "We couldn't load that sample. Please try again.");
      }
    },
    [resetResult],
  );

  const handleClear = useCallback(() => {
    setPrepared(null);
    setError(null);
    resetResult();
  }, [resetResult]);

  const handleAnalyze = useCallback(async () => {
    if (!prepared) return;
    setError(null);
    setPrediction(null);
    setSavedScan(null);
    setPhase("analyzing");
    setStageIndex(0);
    try {
      await sleep(250);
      setStageIndex(1);
      const result = await classify(prepared, 3);
      setStageIndex(2);
      await sleep(320);
      setStageIndex(3);
      await sleep(300);
      setPrediction(result);
      setPhase("result");
      if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
        window.setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      }
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong while analyzing this image. Please try again.",
      );
      setPhase("idle");
      setStageIndex(0);
    }
  }, [prepared]);

  const handleSave = useCallback(
    (plantId: string | null) => {
      if (!prepared || !prediction) return;
      const scan = addScan({
        image: prepared.preview,
        thumb: prepared.thumb,
        fileName: prepared.fileName,
        plantId,
        classId: prediction.classId,
        confidence: prediction.confidence,
        alternatives: prediction.alternatives,
      });
      setSavedScan(scan);
    },
    [prepared, prediction, addScan],
  );

  const announcement =
    phase === "result" && prediction
      ? `Analysis complete. ${getClassInfo(prediction.classId).plant} — ${getClassInfo(prediction.classId).condition} at ${Math.round(prediction.confidence * 100)} percent confidence.`
      : "";

  return (
    <div>
      <PageHeader
        title="Plant Scanner"
        description={
          preselectedPlant ? (
            <>
              Scanning for{" "}
              <span className="font-medium text-ink-soft">
                {preselectedPlant.name} · {preselectedPlant.location}
              </span>
              . Saved results can be attached to this plant.
            </>
          ) : (
            "Upload a leaf photo to identify possible plant health problems. Everything is analyzed locally on your device."
          )
        }
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <PlantImageUploader
            prepared={prepared}
            busy={phase === "analyzing"}
            error={error}
            onFile={handleFile}
            onSample={handleSample}
            onClear={handleClear}
            onAnalyze={handleAnalyze}
          />
        </Card>

        <div ref={resultRef} className="scroll-mt-20">
          <Card className="p-5 sm:p-6">
            {phase === "analyzing" ? (
              <AnalysisProgress stageIndex={stageIndex} download={stageIndex === 1 ? download : null} />
            ) : prediction ? (
              <ScanResultCard
                prediction={prediction}
                threshold={settings.confidenceThreshold}
                plants={plants}
                savedScan={savedScan}
                onSave={handleSave}
                onScanAnother={handleClear}
              />
            ) : (
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-moss-100 text-moss-700">
                    <ScanSearch className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-ink">How it works</h2>
                    <p className="mt-1 text-sm text-ink-muted">
                      Upload or snap a photo of a leaf — the model checks it against 38 common plant conditions and
                      shows what it found.
                    </p>
                  </div>
                </div>

                <ul className="space-y-3">
                  {SCAN_QUALITY_TIPS.map(({ icon: Icon, title, description }) => (
                    <li key={title} className="flex items-start gap-3 rounded-xl bg-canvas p-3.5">
                      <Icon className="mt-0.5 size-4 shrink-0 text-moss-600" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-ink-soft">{title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{description}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="space-y-2 rounded-xl border border-line p-4">
                  <p className="flex items-center gap-2 text-xs font-medium text-ink-soft">
                    <Cpu className="size-3.5 text-moss-600" aria-hidden="true" />
                    {MODEL_INFO.architecture}
                  </p>
                  <p className="flex items-center gap-2 text-xs text-ink-muted">
                    <Leaf className="size-3.5 text-moss-600" aria-hidden="true" />
                    Trained on {MODEL_INFO.datasetName}
                  </p>
                  <p className="flex items-center gap-2 text-xs text-ink-muted">
                    <ShieldCheck className="size-3.5 text-moss-600" aria-hidden="true" />
                    Private by design — runs fully in your browser
                  </p>
                </div>

                {plants.length === 0 && ready ? (
                  <p className="flex items-start gap-2 text-xs text-ink-muted">
                    <Sprout className="mt-0.5 size-3.5 shrink-0 text-moss-600" aria-hidden="true" />
                    <span>
                      Tip:{" "}
                      <Link href="/plants" className="font-medium text-moss-700 underline-offset-4 hover:underline">
                        create plant records
                      </Link>{" "}
                      to attach scans and track each plant&apos;s health over time.
                    </span>
                  </p>
                ) : null}

                <Disclaimer className="text-[11px]" />
              </div>
            )}
          </Card>
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
