import { HeartPulse } from "lucide-react";
import { buttonStyles } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfidenceBadge } from "@/components/scanner/ConfidenceBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { plantStatus } from "@/lib/data/DataContext";
import { getClassInfo } from "@/lib/inference/classes";
import type { Plant, Scan } from "@/lib/types";
import { cn, timeAgo } from "@/lib/utils";
import Link from "next/link";

export function AttentionList({
  scans,
  plants,
  threshold,
}: {
  scans: Scan[];
  plants: Plant[];
  threshold: number;
}) {
  const items = plants
    .map((plant) => ({ plant, status: plantStatus(scans, plant.id, threshold) }))
    .filter(({ status }) => (status.state === "attention" || status.state === "low") && status.scan)
    .sort((a, b) => (a.status.scan!.createdAt < b.status.scan!.createdAt ? 1 : -1));

  if (items.length === 0) {
    return (
      <EmptyState
        icon={HeartPulse}
        title="Nothing needs attention"
        description="Plants whose latest scan found an issue — or was low confidence — will be listed here."
      />
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map(({ plant, status }) => {
        const scan = status.scan!;
        const info = getClassInfo(scan.classId);
        const low = status.state === "low";
        return (
          <li key={plant.id}>
            <Card className="flex h-full flex-col gap-4 p-5">
              <div className="flex items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element -- small stored thumbnail */}
                <img
                  src={scan.thumb}
                  alt=""
                  width={44}
                  height={44}
                  className="size-11 shrink-0 rounded-xl border border-line object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{plant.name}</p>
                  <p className="mt-0.5 truncate text-xs text-ink-muted">
                    {info.plant} — {info.condition}
                    {low ? " (uncertain)" : ""}
                  </p>
                </div>
                <ConfidenceBadge value={scan.confidence} threshold={threshold} />
              </div>
              <p className="text-xs text-ink-faint">Last scan {timeAgo(scan.createdAt)}</p>
              <div className="mt-auto flex flex-wrap gap-2.5">
                <Link href={`/history/${scan.id}`} className={buttonStyles("secondary", "sm")}>
                  View scan
                </Link>
                <Link href={`/scanner?plant=${plant.id}`} className={cn(buttonStyles("primary", "sm"))}>
                  Rescan plant
                </Link>
              </div>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
