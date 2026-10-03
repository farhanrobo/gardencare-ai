import type { Metadata } from "next";
import { ScanDetailView } from "./scan-detail-view";

export const metadata: Metadata = { title: "Scan Details" };

export default async function ScanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ScanDetailView scanId={id} />;
}
