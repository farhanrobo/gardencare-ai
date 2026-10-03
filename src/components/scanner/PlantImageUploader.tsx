"use client";

import { useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from "react";
import { AlertCircle, Camera, ImagePlus, ShieldCheck, UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MAX_UPLOAD_BYTES, SAMPLE_IMAGES } from "@/lib/constants";
import type { PreparedImage } from "@/lib/inference/preprocess";
import { cn, humanFileSize } from "@/lib/utils";

interface PlantImageUploaderProps {
  prepared: PreparedImage | null;
  busy: boolean;
  error: string | null;
  onFile: (file: File) => void;
  onSample: (src: string, fileName: string) => void;
  onClear: () => void;
  onAnalyze: () => void;
}

export function PlantImageUploader({
  prepared,
  busy,
  error,
  onFile,
  onSample,
  onClear,
  onAnalyze,
}: PlantImageUploaderProps) {
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const openPicker = () => {
    if (!busy) uploadInputRef.current?.click();
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFile(file);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (busy) return;
    const file = event.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  const handleZoneKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openPicker();
    }
  };

  return (
    <section aria-label="Plant image upload" className="space-y-5">
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        className="sr-only"
        onChange={handleInputChange}
        aria-hidden="true"
        tabIndex={-1}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={handleInputChange}
        aria-hidden="true"
        tabIndex={-1}
      />

      {prepared ? (
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-xl border border-line bg-moss-50">
            {/* eslint-disable-next-line @next/next/no-img-element -- data-URL preview, not optimizable by next/image */}
            <img
              src={prepared.preview}
              alt={prepared.fileName ? `Selected plant image: ${prepared.fileName}` : "Selected plant image preview"}
              className="mx-auto max-h-[440px] w-full object-contain"
            />
            {busy ? (
              <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute inset-x-0 top-0 h-1 animate-scan-sweep bg-gradient-to-r from-transparent via-moss-400/80 to-transparent" />
              </div>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-ink-muted">
            <span className="truncate">
              {prepared.fileName ? <span className="font-medium text-ink-soft">{prepared.fileName}</span> : "Image ready"}
              <span className="mx-2 text-line-strong">·</span>
              {prepared.width} × {prepared.height} px
            </span>
            <button
              type="button"
              onClick={onClear}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 font-medium text-ink-muted transition-colors hover:bg-moss-50 hover:text-ink disabled:opacity-50"
            >
              <X className="size-3.5" aria-hidden="true" />
              Remove image
            </button>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={onAnalyze} disabled={busy} size="lg" className="flex-1">
              {busy ? "Analyzing…" : "Analyze Plant"}
            </Button>
            <Button variant="secondary" size="lg" onClick={openPicker} disabled={busy}>
              <ImagePlus className="size-4" aria-hidden="true" />
              Different image
            </Button>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload a plant image — drag and drop, or press Enter to browse"
          onClick={openPicker}
          onKeyDown={handleZoneKey}
          onDragOver={(event) => {
            event.preventDefault();
            if (!busy) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors sm:py-16",
            dragging ? "border-moss-400 bg-moss-50" : "border-line-strong bg-surface hover:border-moss-300 hover:bg-moss-50/60",
          )}
        >
          <span className="flex size-14 items-center justify-center rounded-2xl bg-moss-100 text-moss-700">
            <UploadCloud className="size-7" aria-hidden="true" />
          </span>
          <span className="mt-4 text-base font-semibold text-ink">Upload plant image</span>
          <span className="mt-1.5 text-sm text-ink-muted">Drag &amp; drop your image here, or</span>
          <span className="mt-4 inline-flex h-10 items-center rounded-xl bg-moss-700 px-5 text-sm font-medium text-white">
            Choose image
          </span>
          <span className="mt-4 text-xs text-ink-faint">
            JPG / PNG / WEBP · up to {humanFileSize(MAX_UPLOAD_BYTES)}
          </span>
        </div>
      )}

      {!prepared ? (
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => cameraInputRef.current?.click()}
            disabled={busy}
            aria-label="Take a photo with your camera"
          >
            <Camera className="size-4" aria-hidden="true" />
            Take a photo
          </Button>
          <p className="flex items-center gap-1.5 text-xs text-ink-faint">
            <ShieldCheck className="size-3.5 text-moss-600" aria-hidden="true" />
            Analyzed on your device — nothing is uploaded.
          </p>
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>{error}</p>
        </div>
      ) : null}

      {!prepared ? (
        <div className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
          <p className="text-xs font-medium tracking-wide text-ink-muted uppercase">No photo handy? Try a sample</p>
          <ul className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {SAMPLE_IMAGES.map((sample) => (
              <li key={sample.src}>
                <button
                  type="button"
                  onClick={() => onSample(sample.src, sample.fileName)}
                  disabled={busy}
                  className="group flex w-full items-center gap-2.5 rounded-xl border border-line bg-surface p-2 text-left transition-colors hover:border-moss-300 hover:bg-moss-50 disabled:opacity-50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- tiny bundled sample */}
                  <img
                    src={sample.src}
                    alt=""
                    width={40}
                    height={40}
                    className="size-10 shrink-0 rounded-lg object-cover"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-medium text-ink">{sample.plant}</span>
                    <span className="block truncate text-[11px] text-ink-muted">{sample.label}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-ink-faint">
            Samples are real photos from the open PlantVillage dataset.
          </p>
        </div>
      ) : null}
    </section>
  );
}
