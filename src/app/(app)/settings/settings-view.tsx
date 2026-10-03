"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Cloud,
  Database,
  Download,
  ExternalLink,
  RefreshCw,
  Trash2,
  UserRound,
  Waves,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { TextField } from "@/components/ui/Field";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/LoadingState";
import {
  CONFIDENCE_THRESHOLD_MAX,
  CONFIDENCE_THRESHOLD_MIN,
  MODEL_INFO,
  STORAGE_BUDGET_BYTES,
} from "@/lib/constants";
import { useAppData } from "@/lib/data/DataContext";
import { cloudHealth, type CloudHealth } from "@/lib/cloud/client";
import { humanFileSize, pluralize } from "@/lib/utils";

export function SettingsView() {
  const {
    ready,
    plants,
    scans,
    reports,
    settings,
    updateSettings,
    restoreDemoData,
    clearAllData,
    restoreFromCloud,
  } = useAppData();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);
  const [confirmRestore, setConfirmRestore] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const usedBytes = useMemo(() => {
    if (!ready) return 0;
    try {
      return JSON.stringify({ plants, scans, reports, settings }).length;
    } catch {
      return 0;
    }
  }, [ready, plants, scans, reports, settings]);

  const [cloudStatus, setCloudStatus] = useState<CloudHealth | "checking">("checking");
  const [restoring, setRestoring] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    cloudHealth().then((status) => {
      if (alive) setCloudStatus(status);
    });
    return () => {
      alive = false;
    };
  }, []);

  const handleRestore = async () => {
    setRestoring(true);
    setRestoreMessage(null);
    const added = await restoreFromCloud();
    setRestoreMessage(
      added > 0
        ? `Restored ${pluralize(added, "record")} from Supabase.`
        : "Nothing new to restore — this browser already has everything.",
    );
    setRestoring(false);
  };

  if (!ready) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-48" />
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-48" />
        ))}
      </div>
    );
  }

  const nameValue = displayName ?? settings.displayName;
  const usagePercent = Math.min(100, Math.round((usedBytes / STORAGE_BUDGET_BYTES) * 100));

  const handleExport = () => {
    const payload = {
      app: "GardenCare AI",
      exportedAt: new Date().toISOString(),
      settings,
      plants,
      scans,
      reports,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `gardencare-ai-export-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Settings" description="Preferences and data for this local prototype." />

      {/* Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-moss-100 text-moss-700">
              <UserRound className="size-4.5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Used for the greeting on your dashboard.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <div className="space-y-4 px-5 pb-6 sm:px-6">
          <TextField
            label="Your name"
            optional
            placeholder="e.g. Sam"
            value={nameValue}
            maxLength={40}
            onChange={(event) => {
              setDisplayName(event.target.value);
              setProfileSaved(false);
            }}
          />
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={() => {
                updateSettings({ displayName: nameValue.trim() });
                setProfileSaved(true);
                window.setTimeout(() => setProfileSaved(false), 2500);
              }}
            >
              Save profile
            </Button>
            {profileSaved ? (
              <span className="text-xs font-medium text-moss-700" role="status">
                Saved
              </span>
            ) : null}
          </div>
        </div>
      </Card>

      {/* Analysis */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-moss-100 text-moss-700">
              <Waves className="size-4.5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle>Analysis</CardTitle>
              <CardDescription>
                Results below this confidence are shown as “low confidence” with a clearer-image suggestion.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <div className="space-y-3 px-5 pb-6 sm:px-6">
          <label htmlFor="threshold" className="flex items-baseline justify-between gap-3 text-sm font-medium text-ink">
            Confidence threshold
            <span className="font-mono text-sm text-moss-700 tabular-nums">
              {Math.round(settings.confidenceThreshold * 100)}%
            </span>
          </label>
          <input
            id="threshold"
            type="range"
            min={CONFIDENCE_THRESHOLD_MIN * 100}
            max={CONFIDENCE_THRESHOLD_MAX * 100}
            step={5}
            value={Math.round(settings.confidenceThreshold * 100)}
            onChange={(event) => updateSettings({ confidenceThreshold: Number(event.target.value) / 100 })}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-line accent-moss-600"
            aria-valuetext={`${Math.round(settings.confidenceThreshold * 100)} percent`}
          />
          <p className="text-xs text-ink-faint">
            Default is 60%. Lower values accept more predictions; higher values demand stronger certainty before a
            result is presented as confident.
          </p>
        </div>
      </Card>

      {/* Data */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-moss-100 text-moss-700">
              <Database className="size-4.5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle>Your data</CardTitle>
              <CardDescription>
                Everything is stored in this browser only (localStorage) — export it any time.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <div className="space-y-5 px-5 pb-6 sm:px-6">
          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-3 text-xs text-ink-muted">
              <span>Local storage used</span>
              <span className="font-mono tabular-nums">
                {humanFileSize(usedBytes)} of ~{humanFileSize(STORAGE_BUDGET_BYTES)}
              </span>
            </div>
            <div
              role="progressbar"
              aria-label="Local storage used"
              aria-valuenow={usagePercent}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-1.5 w-full overflow-hidden rounded-full bg-line"
            >
              <div
                className={`h-full rounded-full ${usagePercent > 85 ? "bg-amber-400" : "bg-moss-500"}`}
                style={{ width: `${Math.max(2, usagePercent)}%` }}
              />
            </div>
            <p className="text-xs text-ink-faint">
              {plants.length} plants · {scans.length} scans · {reports.length} reports
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Button variant="secondary" size="sm" onClick={handleExport}>
              <Download className="size-3.5" aria-hidden="true" />
              Export data (JSON)
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setConfirmRestore(true)}>
              <RefreshCw className="size-3.5" aria-hidden="true" />
              Restore demo data
            </Button>
            <Button variant="danger" size="sm" onClick={() => setConfirmClear(true)}>
              <Trash2 className="size-3.5" aria-hidden="true" />
              Clear all data
            </Button>
          </div>
        </div>
      </Card>

      {/* Cloud backup */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-moss-100 text-moss-700">
              <Cloud className="size-4.5" aria-hidden="true" />
            </span>
            <div>
              <CardTitle>Cloud backup</CardTitle>
              <CardDescription>
                Plants, scans and reports are also stored in a Supabase database, so your history can be
                restored after clearing local data.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <div className="space-y-4 px-5 pb-6 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            {cloudStatus === "checking" ? (
              <Badge tone="neutral">Checking…</Badge>
            ) : cloudStatus === "ok" ? (
              <Badge tone="healthy">Connected</Badge>
            ) : cloudStatus === "off" ? (
              <Badge tone="neutral">Not configured</Badge>
            ) : (
              <Badge tone="attention">Connection issue</Badge>
            )}
            <p className="text-xs text-ink-muted">
              No account needed — records are linked to this browser&apos;s anonymous key.
            </p>
          </div>
          {cloudStatus === "ok" ? (
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" onClick={handleRestore} disabled={restoring}>
                <Download className="size-3.5" aria-hidden="true" />
                {restoring ? "Restoring…" : "Restore from cloud"}
              </Button>
              {restoreMessage ? (
                <span className="text-xs font-medium text-moss-700" role="status">
                  {restoreMessage}
                </span>
              ) : null}
            </div>
          ) : null}
          <p className="text-xs leading-relaxed text-ink-muted">
            The browser never talks to Supabase directly — a server route in this app holds the key.
            Row Level Security is enabled and blocks all public access to the database.
          </p>
        </div>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About this prototype</CardTitle>
        </CardHeader>
        <div className="space-y-4 px-5 pb-6 text-sm text-ink-soft sm:px-6">
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium tracking-wide text-ink-muted uppercase">Model</dt>
              <dd className="mt-1">{MODEL_INFO.architecture}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium tracking-wide text-ink-muted uppercase">Inference</dt>
              <dd className="mt-1">{MODEL_INFO.framework}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium tracking-wide text-ink-muted uppercase">Classes</dt>
              <dd className="mt-1">{MODEL_INFO.classes} plant / condition classes</dd>
            </div>
            <div>
              <dt className="text-xs font-medium tracking-wide text-ink-muted uppercase">Dataset</dt>
              <dd className="mt-1">{MODEL_INFO.datasetName}</dd>
            </div>
          </dl>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href={MODEL_INFO.modelPage}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-moss-700 underline-offset-4 hover:underline"
              >
                ONNX model card
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </li>
            <li>
              <a
                href={MODEL_INFO.baseModelPage}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-moss-700 underline-offset-4 hover:underline"
              >
                Base model (fine-tuned MobileNetV2)
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </li>
            <li>
              <a
                href={MODEL_INFO.datasetRepo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-moss-700 underline-offset-4 hover:underline"
              >
                PlantVillage dataset (Mohanty, Hughes &amp; Salathé, 2016)
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </li>
          </ul>
          <p className="text-xs leading-relaxed text-ink-muted">
            The base model builds on google/mobilenet_v2_1.0_224 (Apache-2.0). The fine-tuned checkpoint and its ONNX
            conversion are published on Hugging Face; the dataset is an open-access research dataset. See the project
            README for the full license notes and limitations.
          </p>
          <Disclaimer />
        </div>
      </Card>

      <Modal
        open={confirmRestore}
        onClose={() => setConfirmRestore(false)}
        title="Restore demo data?"
        description="This replaces everything currently stored — plants, scans and reports — with the original demo dataset. Export first if you want to keep your data."
      >
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="ghost" onClick={() => setConfirmRestore(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              restoreDemoData();
              setConfirmRestore(false);
            }}
          >
            Restore demo data
          </Button>
        </div>
      </Modal>

      <Modal
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Clear all data?"
        description="This permanently deletes your plants, scans and problem reports from this browser. It cannot be undone."
      >
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="ghost" onClick={() => setConfirmClear(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              clearAllData();
              setConfirmClear(false);
            }}
          >
            Delete everything
          </Button>
        </div>
      </Modal>
    </div>
  );
}
