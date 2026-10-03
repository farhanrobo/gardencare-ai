"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ScanSearch } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/LoadingState";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { HealthDonut } from "@/components/dashboard/HealthDonut";
import { RecentScans } from "@/components/dashboard/RecentScans";
import { AttentionList } from "@/components/dashboard/AttentionList";
import { useAppData } from "@/lib/data/DataContext";
import { getClassInfo } from "@/lib/inference/classes";
import { greetingFor } from "@/lib/utils";

export function DashboardView() {
  const { ready, plants, scans, settings } = useAppData();
  const plantsById = useMemo(() => new Map(plants.map((plant) => [plant.id, plant])), [plants]);

  const healthy = useMemo(
    () => scans.filter((scan) => getClassInfo(scan.classId).healthy).length,
    [scans],
  );
  const attention = scans.length - healthy;
  const allDemo = scans.length > 0 && scans.every((scan) => scan.isDemo);

  if (!ready) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-72" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-36" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const greeting = `${greetingFor()}${settings.displayName ? `, ${settings.displayName}` : ""} 🌱`;

  return (
    <div>
      <PageHeader
        title={greeting}
        description={
          allDemo ? (
            <>
              Here&apos;s what&apos;s happening with your plants. You&apos;re viewing{" "}
              <span className="font-medium text-ink-soft">demo data</span> — scan a real leaf or manage this data
              in{" "}
              <Link href="/settings" className="font-medium text-moss-700 underline-offset-4 hover:underline">
                Settings
              </Link>
              .
            </>
          ) : (
            "Here's what's happening with your plants."
          )
        }
        actions={
          <LinkButton href="/scanner">
            <ScanSearch className="size-4" aria-hidden="true" />
            Scan a plant
          </LinkButton>
        }
      />

      <DashboardStats plantCount={plants.length} scans={scans} />

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Recent scans</CardTitle>
              <CardDescription>Your latest results at a glance</CardDescription>
            </div>
            <Link
              href="/history"
              className="text-sm font-medium text-moss-700 underline-offset-4 hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <RecentScans scans={scans} plantsById={plantsById} threshold={settings.confidenceThreshold} limit={5} />
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Scan health</CardTitle>
              <CardDescription>Across all scans</CardDescription>
            </div>
          </CardHeader>
          <div className="px-5 pb-6 sm:px-6">
            <HealthDonut healthy={healthy} attention={attention} />
          </div>
        </Card>
      </div>

      <section className="mt-8" aria-labelledby="attention-heading">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="attention-heading" className="text-lg font-semibold tracking-tight text-ink">
              Plants needing attention
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              Based on the latest scan linked to each plant record.
            </p>
          </div>
          <Link
            href="/plants"
            className="text-sm font-medium text-moss-700 underline-offset-4 hover:underline"
          >
            All plants
          </Link>
        </div>
        <AttentionList scans={scans} plants={plants} threshold={settings.confidenceThreshold} />
      </section>
    </div>
  );
}
