import Link from "next/link";
import { Activity, HeartPulse, ScanSearch, Sprout, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { getClassInfo } from "@/lib/inference/classes";
import { pluralize } from "@/lib/utils";
import type { Scan } from "@/lib/types";

interface StatItem {
  label: string;
  value: number;
  sub: string;
  icon: LucideIcon;
  href: string;
}

export function DashboardStats({ plantCount, scans }: { plantCount: number; scans: Scan[] }) {
  const healthy = scans.filter((scan) => getClassInfo(scan.classId).healthy).length;
  const attention = scans.length - healthy;

  const stats: StatItem[] = [
    {
      label: "Plants tracked",
      value: plantCount,
      sub: pluralize(plantCount, "plant record"),
      icon: Sprout,
      href: "/plants",
    },
    {
      label: "Scans completed",
      value: scans.length,
      sub: "all time",
      icon: ScanSearch,
      href: "/history",
    },
    {
      label: "Healthy results",
      value: healthy,
      sub: `of ${pluralize(scans.length, "scan")}`,
      icon: HeartPulse,
      href: "/history?filter=healthy",
    },
    {
      label: "Needs attention",
      value: attention,
      sub: `of ${pluralize(scans.length, "scan")}`,
      icon: Activity,
      href: "/history?filter=attention",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {stats.map(({ label, value, sub, icon: Icon, href }) => (
        <Link key={label} href={href} className="group rounded-2xl focus-visible:outline-2">
          <Card className="h-full p-4 transition-shadow group-hover:shadow-lift sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-moss-100 text-moss-700">
                <Icon className="size-4.5" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-3 font-mono text-2xl font-semibold tracking-tight text-ink tabular-nums">{value}</p>
            <p className="mt-0.5 text-sm font-medium text-ink-soft">{label}</p>
            <p className="mt-0.5 text-xs text-ink-faint">{sub}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
