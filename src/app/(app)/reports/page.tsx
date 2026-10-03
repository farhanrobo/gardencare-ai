import type { Metadata } from "next";
import { ReportsView } from "./reports-view";

export const metadata: Metadata = { title: "Problem Reports" };

export default function ReportsPage() {
  return <ReportsView />;
}
