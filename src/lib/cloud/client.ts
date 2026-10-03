/**
 * Browser-side cloud helper.
 *
 * - Manages the anonymous per-browser device id (cookie + localStorage mirror).
 * - Talks ONLY to the app's own /api/cloud route (same origin); no Supabase
 *   key ever reaches the browser.
 * - Every function is fire-and-forget safe: failures never throw, and after
 *   the first "not configured" response the layer disables itself so the app
 *   keeps working exactly like before.
 */
import type { Plant, ProblemReport, Scan } from "@/lib/types";
import {
  plantToRow,
  reportToRow,
  rowToPlant,
  rowToReport,
  rowToScan,
  scanToRow,
  type CloudData,
  type PlantRow,
  type ReportRow,
  type ScanRow,
} from "./schema";

const DEVICE_COOKIE = "gardencare_device";
const DEVICE_STORAGE_KEY = "gardencare-ai:device-id";
const DEVICE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

let disabled = false;

/** Stable anonymous id for this browser (cookie survives localStorage clears). */
export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${DEVICE_COOKIE}=`))
    ?.slice(DEVICE_COOKIE.length + 1);
  if (cookie) return cookie;

  let id = "";
  try {
    id = window.localStorage.getItem(DEVICE_STORAGE_KEY) ?? "";
  } catch {
    // ignore (storage disabled)
  }
  if (!id) id = crypto.randomUUID();
  try {
    window.localStorage.setItem(DEVICE_STORAGE_KEY, id);
  } catch {
    // ignore
  }
  document.cookie = `${DEVICE_COOKIE}=${id}; max-age=${DEVICE_MAX_AGE}; path=/; samesite=lax`;
  return id;
}

interface CloudResponse {
  status: number;
  body: { ok?: boolean; plants?: PlantRow[]; scans?: ScanRow[]; reports?: ReportRow[] } | null;
}

async function call(action: string, payload?: unknown): Promise<CloudResponse | null> {
  if (typeof window === "undefined" || disabled) return null;
  try {
    const res = await fetch("/api/cloud", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deviceId: getDeviceId(), action, payload }),
    });
    if (res.status === 503) {
      // Cloud layer not configured on this deployment — stay local-only.
      disabled = true;
      return null;
    }
    const body = await res.json().catch(() => null);
    return { status: res.status, body };
  } catch {
    return null;
  }
}

/* Fire-and-forget writes (never throw, never block the UI) */

export function cloudUpsertPlant(plant: Plant) {
  void call("upsert-plant", plantToRow(plant));
}

export function cloudDeletePlant(id: string) {
  void call("delete-plant", { id });
}

export function cloudUpsertScan(scan: Scan) {
  void call("upsert-scan", scanToRow(scan));
}

export function cloudDeleteScan(id: string) {
  void call("delete-scan", { id });
}

export function cloudUpsertReport(report: ProblemReport) {
  void call("upsert-report", reportToRow(report));
}

export function cloudDeleteReport(id: string) {
  void call("delete-report", { id });
}

/** Removes every cloud row for this device (used by clear / restore-demo). */
export function cloudWipe() {
  void call("wipe");
}

/* Reads */

export async function cloudList(): Promise<CloudData | null> {
  const res = await call("list");
  if (!res || res.status !== 200 || !res.body?.ok) return null;
  return {
    plants: (res.body.plants ?? []).map(rowToPlant),
    scans: (res.body.scans ?? []).map(rowToScan),
    reports: (res.body.reports ?? []).map(rowToReport),
  };
}

export type CloudHealth = "off" | "ok" | "error";

/** Lightweight connectivity check for the Settings screen. */
export async function cloudHealth(): Promise<CloudHealth> {
  if (typeof window === "undefined" || disabled) return "off";
  const res = await call("list");
  if (!res) return disabled ? "off" : "error";
  return res.status === 200 ? "ok" : "error";
}
