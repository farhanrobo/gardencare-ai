"use client";

import Link from "next/link";
import { MapPin, Pencil, ScanSearch, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ConfidenceBadge } from "@/components/scanner/ConfidenceBadge";
import { buttonStyles } from "@/components/ui/Button";
import type { PlantStatus } from "@/lib/data/DataContext";
import type { Plant } from "@/lib/types";
import { cn, formatDate, timeAgo } from "@/lib/utils";

interface PlantCardProps {
  plant: Plant;
  status: PlantStatus;
  threshold: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function PlantCard({ plant, status, threshold, onEdit, onDelete }: PlantCardProps) {
  const scan = status.scan;
  const statusBadge =
    status.state === "none" ? (
      <Badge tone="neutral">No scans yet</Badge>
    ) : status.state === "healthy" ? (
      <Badge tone="healthy">Healthy</Badge>
    ) : status.state === "attention" ? (
      <Badge tone="attention">Needs attention</Badge>
    ) : (
      <Badge tone="low">Low confidence</Badge>
    );

  return (
    <Card className="flex h-full flex-col p-5">
      <div className="flex items-start gap-3.5">
        {scan ? (
          // eslint-disable-next-line @next/next/no-img-element -- small stored thumbnail
          <img
            src={scan.thumb}
            alt=""
            width={48}
            height={48}
            className="size-12 shrink-0 rounded-xl border border-line object-cover"
          />
        ) : (
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-moss-100 text-moss-600" aria-hidden="true">
            <ScanSearch className="size-5" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-ink">{plant.name}</h3>
          {plant.species ? <p className="mt-0.5 truncate text-xs text-ink-muted">{plant.species}</p> : null}
          <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
            <MapPin className="size-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{plant.location}</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${plant.name}`}
            className="rounded-lg p-2 text-ink-faint transition-colors hover:bg-moss-50 hover:text-ink"
          >
            <Pencil className="size-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${plant.name}`}
            className="rounded-lg p-2 text-ink-faint transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {statusBadge}
        {scan ? <ConfidenceBadge value={scan.confidence} threshold={threshold} /> : null}
        {scan ? <span className="text-xs text-ink-faint">Last scan {timeAgo(scan.createdAt)}</span> : null}
      </div>

      {plant.notes ? <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-ink-muted">{plant.notes}</p> : null}

      <p className="mt-3 text-xs text-ink-faint">Added {formatDate(plant.createdAt)}</p>

      <div className="mt-auto flex flex-wrap gap-2.5 pt-4">
        <Link href={`/scanner?plant=${plant.id}`} className={cn(buttonStyles("primary", "sm"))}>
          Scan this plant
        </Link>
        <Link href={`/history?plant=${plant.id}`} className={buttonStyles("secondary", "sm")}>
          History
        </Link>
      </div>
    </Card>
  );
}
