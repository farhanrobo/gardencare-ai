import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingState } from "@/components/ui/LoadingState";
import { HistoryView } from "./history-view";

export const metadata: Metadata = { title: "Scan History" };

export default function HistoryPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading scan history…" />}>
      <HistoryView />
    </Suspense>
  );
}
