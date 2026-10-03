"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, History as HistoryIcon, Link2, Plus, Trash2 } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/LoadingState";
import { Modal } from "@/components/ui/Modal";
import { ScanResultCard } from "@/components/scanner/ScanResultCard";
import { useAppData } from "@/lib/data/DataContext";
import { formatDate } from "@/lib/utils";

export function ScanDetailView({ scanId }: { scanId: string }) {
  const router = useRouter();
  const { ready, scans, plants, settings, deleteScan, linkScan } = useAppData();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [attachChoice, setAttachChoice] = useState("");

  if (!ready) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-5 w-36" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-[420px]" />
          <Skeleton className="h-[420px]" />
        </div>
      </div>
    );
  }

  const scan = scans.find((item) => item.id === scanId);

  if (!scan) {
    return (
      <div className="rounded-2xl border border-line bg-surface shadow-soft">
        <EmptyState
          icon={HistoryIcon}
          title="Scan not found"
          description="This scan may have been deleted, or the link is incorrect."
          action={<LinkButton href="/history">Back to scan history</LinkButton>}
        />
      </div>
    );
  }

  const linkedPlant = scan.plantId ? plants.find((plant) => plant.id === scan.plantId) : undefined;

  return (
    <div>
      <Link
        href="/history"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to scan history
      </Link>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        {/* Image + meta */}
        <Card className="overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element -- stored preview, not optimizable by next/image */}
          <img
            src={scan.image}
            alt={scan.fileName ? `Scanned leaf image: ${scan.fileName}` : "Scanned leaf image"}
            className="max-h-[440px] w-full bg-moss-50 object-contain"
          />
          <div className="space-y-4 p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
              <span>{formatDate(scan.createdAt)}</span>
              {scan.fileName ? (
                <>
                  <span className="text-line-strong" aria-hidden="true">
                    ·
                  </span>
                  <span className="truncate font-medium text-ink-soft">{scan.fileName}</span>
                </>
              ) : null}
            </div>

            <div className="rounded-xl border border-line p-4">
              <p className="flex items-center gap-2 text-xs font-medium tracking-wide text-ink-muted uppercase">
                <Link2 className="size-3.5 text-moss-600" aria-hidden="true" />
                Linked plant
              </p>
              {linkedPlant ? (
                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{linkedPlant.name}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">{linkedPlant.location}</p>
                  </div>
                  <LinkButton href={`/plants`} variant="secondary" size="sm">
                    View plants
                  </LinkButton>
                </div>
              ) : plants.length > 0 ? (
                <div className="mt-2.5 space-y-3">
                  <p className="text-xs text-ink-muted">
                    This scan is not attached to a plant record yet.
                  </p>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <label htmlFor="attach-plant" className="sr-only">
                      Choose a plant to attach this scan to
                    </label>
                    <select
                      id="attach-plant"
                      value={attachChoice}
                      onChange={(event) => setAttachChoice(event.target.value)}
                      className="min-w-0 flex-1 rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-moss-500 focus:outline-none focus:ring-2 focus:ring-moss-500/25"
                    >
                      <option value="">Select a plant…</option>
                      {plants.map((plant) => (
                        <option key={plant.id} value={plant.id}>
                          {plant.name} — {plant.location}
                        </option>
                      ))}
                    </select>
                    <Button
                      size="sm"
                      disabled={!attachChoice}
                      onClick={() => {
                        if (attachChoice) linkScan(scan.id, attachChoice);
                        setAttachChoice("");
                      }}
                    >
                      Attach
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-2.5 space-y-3">
                  <p className="text-xs text-ink-muted">You have no plant records yet.</p>
                  <LinkButton href="/plants" variant="secondary" size="sm">
                    <Plus className="size-3.5" aria-hidden="true" />
                    Create a plant record
                  </LinkButton>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2.5">
              <LinkButton href="/scanner" variant="secondary" size="sm">
                Scan another plant
              </LinkButton>
              {linkedPlant ? (
                <LinkButton href={`/scanner?plant=${linkedPlant.id}`} variant="secondary" size="sm">
                  Rescan this plant
                </LinkButton>
              ) : null}
              <Button variant="danger" size="sm" onClick={() => setConfirmOpen(true)}>
                <Trash2 className="size-3.5" aria-hidden="true" />
                Delete scan
              </Button>
              {scan.isDemo ? <Badge tone="demo">Demo data</Badge> : null}
            </div>
          </div>
        </Card>

        {/* Read-only result */}
        <Card className="p-5 sm:p-6">
          <ScanResultCard
            variant="readonly"
            prediction={{
              classId: scan.classId,
              confidence: scan.confidence,
              alternatives: scan.alternatives,
              latencyMs: 0,
            }}
            threshold={settings.confidenceThreshold}
            plants={plants}
            savedScan={scan}
            onSave={() => undefined}
            onScanAnother={() => router.push("/scanner")}
          />
        </Card>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete scan?"
        description="This permanently removes the scan and its result from your history."
      >
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              deleteScan(scan.id);
              router.push("/history");
            }}
          >
            Delete scan
          </Button>
        </div>
      </Modal>
    </div>
  );
}
