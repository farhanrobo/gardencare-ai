import Link from "next/link";
import { ScanSearch } from "lucide-react";
import { ConfidenceBadge } from "@/components/scanner/ConfidenceBadge";
import { ScanStatusBadge } from "@/components/history/ScanStatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/Button";
import { getClassInfo } from "@/lib/inference/classes";
import type { Plant, Scan } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

export function RecentScans({
  scans,
  plantsById,
  threshold,
  limit = 5,
}: {
  scans: Scan[];
  plantsById: Map<string, Plant>;
  threshold: number;
  limit?: number;
}) {
  const items = scans.slice(0, limit);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ScanSearch}
        title="No scans yet"
        description="Scan a plant leaf and your results will show up here."
        action={<LinkButton href="/scanner" size="sm">Scan your first plant</LinkButton>}
      />
    );
  }

  return (
    <ul className="divide-y divide-line">
      {items.map((scan) => {
        const info = getClassInfo(scan.classId);
        const plant = scan.plantId ? plantsById.get(scan.plantId) : undefined;
        return (
          <li key={scan.id}>
            <Link
              href={`/history/${scan.id}`}
              className="flex items-center gap-3.5 px-5 py-3.5 transition-colors hover:bg-moss-50/60 sm:px-6"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- small stored thumbnail */}
              <img
                src={scan.thumb}
                alt=""
                width={40}
                height={40}
                className="size-10 shrink-0 rounded-lg border border-line object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">
                  {info.plant} — {info.condition}
                </p>
                <p className="truncate text-xs text-ink-muted">
                  {plant ? plant.name : "Not linked to a plant"} · {timeAgo(scan.createdAt)}
                </p>
              </div>
              <span className="hidden sm:inline-flex">
                <ConfidenceBadge value={scan.confidence} threshold={threshold} />
              </span>
              <ScanStatusBadge scan={scan} threshold={threshold} />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
