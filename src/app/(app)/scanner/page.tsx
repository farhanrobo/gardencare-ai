import type { Metadata } from "next";
import { Suspense } from "react";
import { LoadingState } from "@/components/ui/LoadingState";
import { ScannerView } from "./scanner-view";

export const metadata: Metadata = { title: "Plant Scanner" };

export default function ScannerPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading scanner…" />}>
      <ScannerView />
    </Suspense>
  );
}
