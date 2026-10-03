"use client";

import { MapPin, Trash2 } from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { ProblemReport, ReportStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const TYPE_LABELS: Record<ProblemReport["problemType"], string> = {
  disease: "Plant disease",
  pest: "Pest",
  waste: "Waste",
  damaged: "Damaged plant",
  other: "Other",
};

export const STATUS_META: Record<ReportStatus, { label: string; tone: BadgeTone }> = {
  reported: { label: "Reported", tone: "attention" },
  under_review: { label: "Under review", tone: "info" },
  resolved: { label: "Resolved", tone: "healthy" },
};

interface ReportListProps {
  reports: ProblemReport[];
  onStatusChange: (id: string, status: ReportStatus) => void;
  onDelete: (id: string) => void;
}

export function ReportList({ reports, onStatusChange, onDelete }: ReportListProps) {
  return (
    <ul className="space-y-4">
      {reports.map((report) => (
        <li key={report.id}>
          <Card className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="neutral">{TYPE_LABELS[report.problemType]}</Badge>
              <Badge tone={STATUS_META[report.status].tone}>{STATUS_META[report.status].label}</Badge>
              <span className="text-xs text-ink-faint">{formatDate(report.createdAt)}</span>
              <button
                type="button"
                onClick={() => onDelete(report.id)}
                aria-label={`Delete ${TYPE_LABELS[report.problemType]} report from ${report.location}`}
                className="ml-auto rounded-lg p-2 text-ink-faint transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="size-3.5" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{report.description}</p>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-muted">
              <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
              {report.location}
            </p>
            {report.image ? (
              // eslint-disable-next-line @next/next/no-img-element -- small stored data-URL photo
              <img
                src={report.image}
                alt={`Photo attached to the ${TYPE_LABELS[report.problemType].toLowerCase()} report`}
                className="mt-4 max-h-44 rounded-xl border border-line object-cover"
              />
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2.5">
              {report.status === "reported" ? (
                <Button variant="secondary" size="sm" onClick={() => onStatusChange(report.id, "under_review")}>
                  Mark under review
                </Button>
              ) : null}
              {report.status !== "resolved" ? (
                <Button variant="primary" size="sm" onClick={() => onStatusChange(report.id, "resolved")}>
                  Mark resolved
                </Button>
              ) : (
                <Button variant="secondary" size="sm" onClick={() => onStatusChange(report.id, "reported")}>
                  Reopen
                </Button>
              )}
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
