"use client";

import { useMemo, useState } from "react";
import { ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/LoadingState";
import { ProblemReportForm } from "@/components/reports/ProblemReportForm";
import { ReportList, STATUS_META } from "@/components/reports/ReportList";
import { useAppData } from "@/lib/data/DataContext";
import type { ReportStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type Filter = "all" | ReportStatus;

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "All" },
  { value: "reported", label: STATUS_META.reported.label },
  { value: "under_review", label: STATUS_META.under_review.label },
  { value: "resolved", label: STATUS_META.resolved.label },
];

export function ReportsView() {
  const { ready, reports, updateReportStatus, deleteReport } = useAppData();
  const [filter, setFilter] = useState<Filter>("all");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const counts = useMemo(() => {
    const base: Record<Filter, number> = { all: reports.length, reported: 0, under_review: 0, resolved: 0 };
    for (const report of reports) base[report.status] += 1;
    return base;
  }, [reports]);

  const filtered = useMemo(
    () => (filter === "all" ? reports : reports.filter((report) => report.status === filter)),
    [reports, filter],
  );

  if (!ready) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-64" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
          <Skeleton className="h-[520px]" />
          <Skeleton className="h-[420px]" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Problem Reports"
        description="Log garden problems by area and keep track of them until they are resolved — from disease and pests to waste and damage."
      />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-6">
          <ProblemReportForm />
        </div>

        <section aria-label="Report list">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {FILTERS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                aria-pressed={filter === value}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                  filter === value
                    ? "border-moss-700 bg-moss-700 text-white"
                    : "border-line-strong bg-surface text-ink-soft hover:border-moss-300 hover:bg-moss-50",
                )}
              >
                {label} ({counts[value]})
              </button>
            ))}
          </div>

          {reports.length === 0 ? (
            <div className="rounded-2xl border border-line bg-surface shadow-soft">
              <EmptyState
                icon={ClipboardList}
                title="No problem reports yet"
                description="When something in the garden needs attention, report it here so it doesn't get forgotten."
              />
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-line bg-surface shadow-soft">
              <EmptyState
                icon={ClipboardList}
                title="Nothing in this category"
                description="No reports match the selected status — try another filter."
                action={
                  <Button variant="secondary" onClick={() => setFilter("all")}>
                    Show all reports
                  </Button>
                }
              />
            </div>
          ) : (
            <ReportList
              reports={filtered}
              onStatusChange={updateReportStatus}
              onDelete={(id) => setDeleteTarget(id)}
            />
          )}
        </section>
      </div>

      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete report?"
        description="This permanently removes the report from your list."
      >
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (deleteTarget) deleteReport(deleteTarget);
              setDeleteTarget(null);
            }}
          >
            Delete report
          </Button>
        </div>
      </Modal>
    </div>
  );
}
