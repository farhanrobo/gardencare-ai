"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { CheckCircle2, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SelectField, TextAreaField, TextField } from "@/components/ui/Field";
import { REPORT_LOCATION_PRESETS } from "@/lib/constants";
import { useAppData } from "@/lib/data/DataContext";
import { prepareImageFile } from "@/lib/inference/preprocess";
import type { ProblemType, ProblemReport } from "@/lib/types";

const CUSTOM = "__custom__";

const PROBLEM_TYPE_OPTIONS: Array<{ value: ProblemType; label: string }> = [
  { value: "disease", label: "Plant disease" },
  { value: "pest", label: "Pest" },
  { value: "waste", label: "Waste" },
  { value: "damaged", label: "Damaged plant" },
  { value: "other", label: "Other" },
];

export function ProblemReportForm() {
  const { addReport } = useAppData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [problemType, setProblemType] = useState<ProblemType>("disease");
  const [locationChoice, setLocationChoice] = useState<string>(REPORT_LOCATION_PRESETS[0]);
  const [customLocation, setCustomLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imageBusy, setImageBusy] = useState(false);
  const [errors, setErrors] = useState<{ location?: string; description?: string }>({});
  const [submitted, setSubmitted] = useState<ProblemReport | null>(null);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setImageBusy(true);
    setErrors((prev) => ({ ...prev }));
    try {
      const prepared = await prepareImageFile(file);
      setImage(prepared.preview);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        description:
          error instanceof Error
            ? error.message
            : "We couldn't read that image. Please try a different photo.",
      }));
    } finally {
      setImageBusy(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    const location = locationChoice === CUSTOM ? customLocation.trim() : locationChoice;
    if (!location) nextErrors.location = "Please choose or enter a location.";
    if (description.trim().length < 10) {
      nextErrors.description = "Please describe the problem in at least a short sentence.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const report = addReport({
      problemType,
      location,
      description,
      image: image ?? undefined,
    });
    setSubmitted(report);
    setDescription("");
    setImage(null);
    setCustomLocation("");
    setLocationChoice(REPORT_LOCATION_PRESETS[0]);
  };

  if (submitted) {
    return (
      <Card className="p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-moss-100 text-moss-700">
            <CheckCircle2 className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-ink">Problem reported</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Logged at <span className="font-medium text-ink-soft">{submitted.location}</span>. Track it in the
              report list and update its status as it gets handled.
            </p>
          </div>
        </div>
        <div className="mt-5">
          <Button variant="secondary" onClick={() => setSubmitted(null)}>
            Submit another report
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="text-sm font-semibold text-ink">Report a problem</h2>
      <p className="mt-1 text-sm text-ink-muted">
        Spotted something in the garden? Log it here so nothing gets forgotten.
      </p>
      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
        <SelectField
          label="Problem type"
          value={problemType}
          onChange={(event) => setProblemType(event.target.value as ProblemType)}
        >
          {PROBLEM_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>
        <SelectField
          label="Location"
          value={locationChoice}
          onChange={(event) => setLocationChoice(event.target.value)}
          error={locationChoice === CUSTOM && !customLocation ? errors.location : undefined}
        >
          {REPORT_LOCATION_PRESETS.map((preset) => (
            <option key={preset} value={preset}>
              {preset}
            </option>
          ))}
          <option value={CUSTOM}>Custom location…</option>
        </SelectField>
        {locationChoice === CUSTOM ? (
          <TextField
            label="Custom location"
            placeholder="e.g. Vegetable bed C"
            value={customLocation}
            onChange={(event) => setCustomLocation(event.target.value)}
            error={customLocation.trim() ? undefined : errors.location}
          />
        ) : null}
        <TextAreaField
          label="Description"
          placeholder="What did you notice, and where exactly?"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          error={errors.description}
          required
        />
        <div className="space-y-2">
          <span className="block text-sm font-medium text-ink">
            Photo <span className="text-xs font-normal text-ink-faint">optional</span>
          </span>
          {image ? (
            <div className="relative w-fit">
              {/* eslint-disable-next-line @next/next/no-img-element -- local data-URL preview */}
              <img src={image} alt="Attached problem photo preview" className="max-h-40 rounded-xl border border-line object-cover" />
              <button
                type="button"
                onClick={() => setImage(null)}
                aria-label="Remove attached photo"
                className="absolute -top-2 -right-2 rounded-full border border-line bg-surface p-1.5 text-ink-muted shadow-soft transition-colors hover:text-ink"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} disabled={imageBusy}>
              <ImagePlus className="size-4" aria-hidden="true" />
              {imageBusy ? "Preparing…" : "Add photo"}
            </Button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            className="sr-only"
            onChange={handleImageChange}
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
        <div className="pt-1">
          <Button type="submit" className="w-full sm:w-auto">
            Submit report
          </Button>
        </div>
      </form>
    </Card>
  );
}
