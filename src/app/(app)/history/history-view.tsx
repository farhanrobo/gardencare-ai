"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, History as HistoryIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button, LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/LoadingState";
import { ConfidenceBadge } from "@/components/scanner/ConfidenceBadge";
import { ScanStatusBadge } from "@/components/history/ScanStatusBadge";
import { useAppData } from "@/lib/data/DataContext";
import { getClassInfo } from "@/lib/inference/classes";
import { cn, formatDate, pluralize } from "@/lib/utils";

type Filter = "all" | "healthy" | "attention" | "low";

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "All scans" },
  { value: "healthy", label: "Healthy" },
  { value: "attention", label: "Needs attention" },
  { value: "low", label: "Low confidence" },
];

function parseFilter(value: string | null): Filter {
  return value === "healthy" || value === "attention" || value === "low" ? value : "all";
}

export function HistoryView() {
  const searchParams = useSearchParams();
  const { ready, scans, plants, settings } = useAppData();

  const router = useRouter();
  const pathname = usePathname();
  // Filters live in the URL so views are shareable and the back button works.
  const filter = parseFilter(searchParams.get("filter"));
  const plantFilter = searchParams.get("plant") ?? "all";

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (!value || value === "all") params.delete(key);
      else params.set(key, value);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const threshold = settings.confidenceThreshold;

  const filtered = useMemo(() => {
    return scans.filter((scan) => {
      const info = getClassInfo(scan.classId);
      if (plantFilter !== "all" && scan.plantId !== plantFilter) return false;
      if (filter === "healthy") return info.healthy && scan.confidence >= threshold;
      if (filter === "attention") return !info.healthy;
      if (filter === "low") return scan.confidence < threshold;
      return true;
    });
  }, [scans, filter, plantFilter, threshold]);

  const plantsById = useMemo(() => new Map(plants.map((plant) => [plant.id, plant])), [plants]);
  const hasFilters = filter !== "all" || plantFilter !== "all";

  if (!ready) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-12 w-full max-w-xl" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-20" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Scan History"
        description="Every analysis you have run, newest first. Open a scan to see the full result again."
        actions={
          <LinkButton href="/scanner">
            New scan
          </LinkButton>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter scans by result">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => updateParams({ filter: value })}
              aria-pressed={filter === value}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                filter === value
                  ? "border-moss-700 bg-moss-700 text-white"
                  : "border-line-strong bg-surface text-ink-soft hover:border-moss-300 hover:bg-moss-50",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {plants.length > 0 ? (
          <div className="ml-auto">
            <label htmlFor="history-plant-filter" className="sr-only">
              Filter by plant
            </label>
            <select
              id="history-plant-filter"
              value={plantFilter}
              onChange={(event) => updateParams({ plant: event.target.value })}
              className="rounded-xl border border-line-strong bg-surface px-3.5 py-2 text-sm text-ink focus:border-moss-500 focus:outline-none focus:ring-2 focus:ring-moss-500/25"
            >
              <option value="all">All plants</option>
              {plants.map((plant) => (
                <option key={plant.id} value={plant.id}>
                  {plant.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {scans.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface shadow-soft">
          <EmptyState
            icon={HistoryIcon}
            title="No scans yet"
            description="Once you analyze a plant leaf, every result will be saved here for comparison."
            action={<LinkButton href="/scanner">Scan your first plant</LinkButton>}
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface shadow-soft">
          <EmptyState
            icon={HistoryIcon}
            title="No scans match these filters"
            description="Try a different result filter or choose another plant."
            action={
              <Button
                variant="secondary"
                onClick={() => updateParams({ filter: null, plant: null })}
              >
                Clear filters
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <p className="mb-3 text-xs text-ink-faint">
            Showing {filtered.length} of {pluralize(scans.length, "scan")}
            {hasFilters ? " (filters applied)" : ""}
          </p>
          <ul className="space-y-3">
            {filtered.map((scan) => {
              const info = getClassInfo(scan.classId);
              const plant = scan.plantId ? plantsById.get(scan.plantId) : undefined;
              return (
                <li key={scan.id}>
                  <Link
                    href={`/history/${scan.id}`}
                    className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 shadow-soft transition-all hover:border-moss-200 hover:shadow-lift"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- small stored thumbnail */}
                    <img
                      src={scan.thumb}
                      alt=""
                      width={56}
                      height={56}
                      className="size-14 shrink-0 rounded-xl border border-line object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">
                        {info.plant} — {info.condition}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-ink-muted">
                        {plant ? plant.name : "Not linked to a plant"} · {formatDate(scan.createdAt)}
                      </p>
                    </div>
                    <div className="hidden shrink-0 items-center gap-2 sm:flex">
                      <ConfidenceBadge value={scan.confidence} threshold={threshold} />
                      <ScanStatusBadge scan={scan} threshold={threshold} />
                    </div>
                    <ChevronRight className="size-4 shrink-0 text-ink-faint" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
