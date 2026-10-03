"use client";

/**
 * Application data provider.
 *
 * Backed by a module-level external store so that:
 *  - localStorage is read exactly once on the client (never during SSR),
 *  - server and hydration renders agree (both show a deterministic skeleton),
 *  - every mutation persists and notifies all subscribers.
 */
import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { DEFAULT_CONFIDENCE_THRESHOLD, MAX_STORED_PREVIEWS } from "@/lib/constants";
import { buildSeedData } from "@/lib/data/seed";
import { repository } from "@/lib/data/repository";
import { getClassInfo } from "@/lib/inference/classes";
import type {
  AppData,
  AppSettings,
  ClassScore,
  Plant,
  ProblemReport,
  ReportStatus,
  Scan,
} from "@/lib/types";
import { uid } from "@/lib/utils";

export interface NewPlantInput {
  name: string;
  species: string;
  location: string;
  notes: string;
}

export interface NewScanInput {
  image: string;
  thumb: string;
  fileName?: string;
  plantId?: string | null;
  classId: number;
  confidence: number;
  alternatives: ClassScore[];
}

export interface NewReportInput {
  problemType: ProblemReport["problemType"];
  location: string;
  description: string;
  image?: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  displayName: "",
  confidenceThreshold: DEFAULT_CONFIDENCE_THRESHOLD,
};

const STORAGE_WARNING =
  "Your browser's local storage is full, so this change may not be kept after a reload. Consider removing old scans in Settings.";

interface StoreSnapshot {
  ready: boolean;
  data: AppData | null;
  storageError: string | null;
}

const EMPTY_SNAPSHOT: StoreSnapshot = { ready: false, data: null, storageError: null };

let snapshot: StoreSnapshot = EMPTY_SNAPSHOT;
let initialized = false;
const listeners = new Set<() => void>();

function withDefaults(data: AppData): AppData {
  return {
    version: 1,
    seeded: data.seeded ?? true,
    plants: data.plants ?? [],
    scans: data.scans ?? [],
    reports: data.reports ?? [],
    settings: {
      displayName: data.settings?.displayName ?? DEFAULT_SETTINGS.displayName,
      confidenceThreshold: data.settings?.confidenceThreshold ?? DEFAULT_SETTINGS.confidenceThreshold,
    },
  };
}

function emit() {
  for (const listener of listeners) listener();
}

function initStore() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  const existing = repository.load();
  const data = existing ? withDefaults(existing) : buildSeedData();
  if (!existing) {
    try {
      repository.save(data);
    } catch {
      // Seed data failing to persist is fine — it still renders.
    }
  }
  snapshot = { ready: true, data, storageError: null };
}

function subscribe(listener: () => void): () => void {
  initStore();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): StoreSnapshot {
  initStore();
  return snapshot;
}

function getServerSnapshot(): StoreSnapshot {
  return EMPTY_SNAPSHOT;
}

function mutate(updater: (prev: AppData) => AppData) {
  if (!snapshot.data) return;
  const next = updater(snapshot.data);
  let storageError: string | null = null;
  try {
    repository.save(next);
  } catch {
    storageError = STORAGE_WARNING;
  }
  snapshot = { ready: true, data: next, storageError };
  emit();
}

/* ------------------------------- actions ------------------------------- */

function addPlant(input: NewPlantInput): Plant {
  const plant: Plant = {
    id: uid("plant"),
    name: input.name.trim(),
    species: input.species.trim(),
    location: input.location.trim(),
    notes: input.notes.trim(),
    createdAt: new Date().toISOString(),
  };
  mutate((prev) => ({ ...prev, plants: [plant, ...prev.plants] }));
  return plant;
}

function updatePlant(id: string, patch: Partial<NewPlantInput>) {
  mutate((prev) => ({
    ...prev,
    plants: prev.plants.map((plant) => (plant.id === id ? { ...plant, ...patch } : plant)),
  }));
}

function deletePlant(id: string) {
  mutate((prev) => ({
    ...prev,
    plants: prev.plants.filter((plant) => plant.id !== id),
    // Keep scan history, but unlink it from the removed plant.
    scans: prev.scans.map((scan) => (scan.plantId === id ? { ...scan, plantId: null } : scan)),
  }));
}

function addScan(input: NewScanInput): Scan {
  const scan: Scan = {
    id: uid("scan"),
    createdAt: new Date().toISOString(),
    image: input.image,
    thumb: input.thumb,
    fileName: input.fileName,
    plantId: input.plantId ?? null,
    classId: input.classId,
    confidence: input.confidence,
    alternatives: input.alternatives,
  };
  mutate((prev) => {
    const next: AppData = { ...prev, scans: [scan, ...prev.scans] };
    // Keep storage healthy even before the quota is hit: once the number of
    // stored previews exceeds the cap, retire the oldest full image to its thumb.
    const userScans = next.scans.filter((s) => !s.isDemo && s.image.startsWith("data:"));
    if (userScans.length > MAX_STORED_PREVIEWS + 8) {
      const oldest = userScans[userScans.length - 1];
      next.scans = next.scans.map((s) =>
        s.id === oldest.id && s.image !== s.thumb ? { ...s, image: s.thumb } : s,
      );
    }
    return next;
  });
  return scan;
}

function deleteScan(id: string) {
  mutate((prev) => ({ ...prev, scans: prev.scans.filter((scan) => scan.id !== id) }));
}

function linkScan(scanId: string, plantId: string | null) {
  mutate((prev) => ({
    ...prev,
    scans: prev.scans.map((scan) => (scan.id === scanId ? { ...scan, plantId } : scan)),
  }));
}

function addReport(input: NewReportInput): ProblemReport {
  const report: ProblemReport = {
    id: uid("report"),
    problemType: input.problemType,
    location: input.location.trim(),
    description: input.description.trim(),
    image: input.image,
    status: "reported",
    createdAt: new Date().toISOString(),
  };
  mutate((prev) => ({ ...prev, reports: [report, ...prev.reports] }));
  return report;
}

function updateReportStatus(id: string, status: ReportStatus) {
  mutate((prev) => ({
    ...prev,
    reports: prev.reports.map((report) => (report.id === id ? { ...report, status } : report)),
  }));
}

function deleteReport(id: string) {
  mutate((prev) => ({ ...prev, reports: prev.reports.filter((report) => report.id !== id) }));
}

function updateSettings(patch: Partial<AppSettings>) {
  mutate((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
}

function restoreDemoData() {
  const seeded = buildSeedData();
  let storageError: string | null = null;
  try {
    repository.save(seeded);
  } catch {
    storageError = "Demo data was restored but could not be saved to local storage.";
  }
  snapshot = { ready: true, data: seeded, storageError };
  emit();
}

function clearAllData() {
  const empty: AppData = {
    version: 1,
    seeded: true,
    plants: [],
    scans: [],
    reports: [],
    settings: snapshot.data?.settings ?? { ...DEFAULT_SETTINGS },
  };
  repository.clear();
  snapshot = { ready: true, data: empty, storageError: null };
  emit();
}

/* ------------------------------- context ------------------------------- */

interface AppContextValue {
  ready: boolean;
  plants: Plant[];
  scans: Scan[];
  reports: ProblemReport[];
  settings: AppSettings;
  storageError: string | null;
  addPlant: (input: NewPlantInput) => Plant;
  updatePlant: (id: string, patch: Partial<NewPlantInput>) => void;
  deletePlant: (id: string) => void;
  addScan: (input: NewScanInput) => Scan;
  deleteScan: (id: string) => void;
  linkScan: (scanId: string, plantId: string | null) => void;
  addReport: (input: NewReportInput) => ProblemReport;
  updateReportStatus: (id: string, status: ReportStatus) => void;
  deleteReport: (id: string) => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
  restoreDemoData: () => void;
  clearAllData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const value = useMemo<AppContextValue>(
    () => ({
      ready: state.ready,
      plants: state.data?.plants ?? [],
      scans: state.data?.scans ?? [],
      reports: state.data?.reports ?? [],
      settings: state.data?.settings ?? DEFAULT_SETTINGS,
      storageError: state.storageError,
      addPlant,
      updatePlant,
      deletePlant,
      addScan,
      deleteScan,
      linkScan,
      addReport,
      updateReportStatus,
      deleteReport,
      updateSettings,
      restoreDemoData,
      clearAllData,
    }),
    [state],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppData(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppData must be used inside <AppDataProvider>.");
  return ctx;
}

/** Latest scan linked to a plant (scans are stored newest-first). */
export function latestScanForPlant(scans: Scan[], plantId: string): Scan | undefined {
  return scans.find((scan) => scan.plantId === plantId);
}

export interface PlantStatus {
  state: "healthy" | "attention" | "low" | "none";
  scan?: Scan;
}

export function plantStatus(scans: Scan[], plantId: string, threshold: number): PlantStatus {
  const scan = latestScanForPlant(scans, plantId);
  if (!scan) return { state: "none" };
  if (scan.confidence < threshold) return { state: "low", scan };
  return { state: getClassInfo(scan.classId).healthy ? "healthy" : "attention", scan };
}
