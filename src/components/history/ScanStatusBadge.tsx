import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { getClassInfo } from "@/lib/inference/classes";
import type { Scan } from "@/lib/types";

export function scanStatusMeta(scan: Scan, threshold: number): { tone: BadgeTone; label: string } {
  const info = getClassInfo(scan.classId);
  if (scan.confidence < threshold) return { tone: "low", label: "Low confidence" };
  if (info.healthy) return { tone: "healthy", label: "Healthy" };
  return { tone: "attention", label: "Needs attention" };
}

export function ScanStatusBadge({ scan, threshold }: { scan: Scan; threshold: number }) {
  const { tone, label } = scanStatusMeta(scan, threshold);
  return <Badge tone={tone}>{label}</Badge>;
}
