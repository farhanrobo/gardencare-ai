import type { Metadata } from "next";
import { PlantsView } from "./plants-view";

export const metadata: Metadata = { title: "My Plants" };

export default function PlantsPage() {
  return <PlantsView />;
}
