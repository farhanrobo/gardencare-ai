/**
 * Data access layer.
 *
 * The prototype stores everything in localStorage behind a small repository
 * interface, so the persistence target can be swapped for a real database
 * later without touching UI code.
 */
import { MAX_STORED_PREVIEWS, STORAGE_KEY } from "@/lib/constants";
import type { AppData } from "@/lib/types";

export interface DataRepository {
  load(): AppData | null;
  save(data: AppData): void;
  clear(): void;
}

export class StorageLimitError extends Error {
  constructor() {
    super("Local storage is full.");
  }
}

/**
 * Replaces the full preview of the oldest user scans with their tiny thumbnails.
 * Keeps recent scans (and all demo entries) untouched.
 */
export function prunePreviewImages(data: AppData, keep = MAX_STORED_PREVIEWS): AppData {
  const ordered = [...data.scans].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  const keepIds = new Set(
    ordered
      .filter((scan) => !scan.isDemo && scan.image.startsWith("data:"))
      .slice(0, keep)
      .map((scan) => scan.id),
  );
  const scans = data.scans.map((scan) => {
    if (scan.isDemo || !scan.image.startsWith("data:")) return scan;
    if (keepIds.has(scan.id)) return scan;
    if (scan.image === scan.thumb) return scan;
    return { ...scan, image: scan.thumb };
  });
  return { ...data, scans };
}

export class LocalStorageRepository implements DataRepository {
  load(): AppData | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed: unknown = JSON.parse(raw);
      if (
        !parsed ||
        typeof parsed !== "object" ||
        !Array.isArray((parsed as AppData).plants) ||
        !Array.isArray((parsed as AppData).scans) ||
        !Array.isArray((parsed as AppData).reports)
      ) {
        return null;
      }
      return parsed as AppData;
    } catch {
      return null;
    }
  }

  save(data: AppData): void {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return;
    } catch {
      // Likely quota exceeded — drop older previews and retry once.
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prunePreviewImages(data)));
    } catch {
      throw new StorageLimitError();
    }
  }

  clear(): void {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing sensible to do here.
    }
  }
}

export const repository: DataRepository = new LocalStorageRepository();
