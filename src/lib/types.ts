export type ProblemType = "disease" | "pest" | "waste" | "damaged" | "other";
export type ReportStatus = "reported" | "under_review" | "resolved";

export interface ClassScore {
  classId: number;
  confidence: number;
}

export interface Plant {
  id: string;
  name: string;
  species: string;
  location: string;
  notes: string;
  createdAt: string;
  isDemo?: boolean;
}

export interface Scan {
  id: string;
  createdAt: string;
  /** Downscaled JPEG data URL, or a /samples/... path for demo entries. */
  image: string;
  thumb: string;
  fileName?: string;
  /** Linked plant record, if any. */
  plantId?: string | null;
  notes?: string;
  /** Winning class id (0–37) from the model. */
  classId: number;
  /** Top-1 softmax probability (0–1). */
  confidence: number;
  /** Ranked alternatives including the winner, best first. */
  alternatives: ClassScore[];
  isDemo?: boolean;
}

export interface ProblemReport {
  id: string;
  problemType: ProblemType;
  location: string;
  description: string;
  image?: string;
  status: ReportStatus;
  createdAt: string;
  isDemo?: boolean;
}

export interface AppSettings {
  displayName: string;
  /** Results below this probability are presented as low-confidence. */
  confidenceThreshold: number;
}

export interface AppData {
  version: number;
  seeded: boolean;
  plants: Plant[];
  scans: Scan[];
  reports: ProblemReport[];
  settings: AppSettings;
}

export interface Prediction {
  classId: number;
  confidence: number;
  alternatives: ClassScore[];
  latencyMs: number;
}
