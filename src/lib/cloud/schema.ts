/**
 * Shared row shapes + mappers for the Supabase backup layer.
 * Used by the browser client (camelCase app types) and the /api/cloud route
 * (snake_case database rows). Pure functions — no environment access here.
 */
import type { ClassScore, Plant, ProblemReport, Scan } from "@/lib/types";

export interface PlantRowInput {
  id: string;
  name: string;
  species: string;
  location: string;
  notes: string;
  created_at: string;
}

export interface ScanRowInput {
  id: string;
  created_at: string;
  image: string;
  thumb: string;
  file_name: string | null;
  plant_id: string | null;
  class_id: number;
  confidence: number;
  alternatives: ClassScore[];
}

export interface ReportRowInput {
  id: string;
  problem_type: string;
  location: string;
  description: string;
  image: string | null;
  status: string;
  created_at: string;
}

/** Rows as returned by `select *` (input + server-managed columns). */
export type PlantRow = PlantRowInput & { device_id: string; is_demo: boolean };
export type ScanRow = ScanRowInput & { device_id: string; is_demo: boolean };
export type ReportRow = ReportRowInput & { device_id: string; is_demo: boolean };

export interface CloudData {
  plants: Plant[];
  scans: Scan[];
  reports: ProblemReport[];
}

export function plantToRow(plant: Plant): PlantRowInput {
  return {
    id: plant.id,
    name: plant.name,
    species: plant.species,
    location: plant.location,
    notes: plant.notes,
    created_at: plant.createdAt,
  };
}

export function scanToRow(scan: Scan): ScanRowInput {
  return {
    id: scan.id,
    created_at: scan.createdAt,
    image: scan.image,
    thumb: scan.thumb,
    file_name: scan.fileName ?? null,
    plant_id: scan.plantId ?? null,
    class_id: scan.classId,
    confidence: scan.confidence,
    alternatives: scan.alternatives,
  };
}

export function reportToRow(report: ProblemReport): ReportRowInput {
  return {
    id: report.id,
    problem_type: report.problemType,
    location: report.location,
    description: report.description,
    image: report.image ?? null,
    status: report.status,
    created_at: report.createdAt,
  };
}

export function rowToPlant(row: PlantRow): Plant {
  return {
    id: row.id,
    name: row.name,
    species: row.species,
    location: row.location,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

export function rowToScan(row: ScanRow): Scan {
  return {
    id: row.id,
    createdAt: row.created_at,
    image: row.image,
    thumb: row.thumb,
    fileName: row.file_name ?? undefined,
    plantId: row.plant_id,
    classId: row.class_id,
    confidence: row.confidence,
    alternatives: row.alternatives,
  };
}

export function rowToReport(row: ReportRow): ProblemReport {
  return {
    id: row.id,
    problemType: row.problem_type as ProblemReport["problemType"],
    location: row.location,
    description: row.description,
    image: row.image ?? undefined,
    status: row.status as ProblemReport["status"],
    createdAt: row.created_at,
  };
}
