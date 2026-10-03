/**
 * Deterministic demo data so the dashboard looks complete on first launch.
 * Every seeded record carries `isDemo: true` and the UI marks it as such.
 * Numbers here mirror the prototype spec: 12 plants, 28 scans (19 healthy /
 * 9 with findings), 6 problem reports.
 */
import type { AppData, ClassScore, ProblemReport, Plant, Scan } from "@/lib/types";
import { DEFAULT_CONFIDENCE_THRESHOLD } from "@/lib/constants";
import { demoLeafImage, type DemoLeafStyle } from "./demo-images";

const DAY = 24 * 60 * 60 * 1000;

function daysAgo(base: number, days: number, hour = 10): string {
  const d = new Date(base - days * DAY);
  d.setHours(hour, 15, 0, 0);
  return d.toISOString();
}

/** Plausible runner-up classes for each prediction (mostly the same crop). */
const CONFUSION_PARTNERS: Record<number, [number, number]> = {
  0: [3, 1],
  3: [0, 4],
  8: [10, 7],
  10: [8, 9],
  11: [14, 13],
  14: [11, 12],
  17: [16, 19],
  19: [18, 17],
  21: [30, 20],
  22: [21, 20],
  23: [24, 19],
  25: [5, 27],
  26: [27, 25],
  27: [26, 19],
  29: [32, 20],
  33: [29, 34],
  37: [29, 31],
};

function makeAlternatives(classId: number, confidence: number): ClassScore[] {
  const partners = CONFUSION_PARTNERS[classId] ?? [37, 19];
  return [
    { classId, confidence },
    { classId: partners[0], confidence: Math.round(confidence * 0.11 * 1000) / 1000 },
    { classId: partners[1], confidence: Math.round(confidence * 0.05 * 1000) / 1000 },
  ];
}

interface ScanSpec {
  id: string;
  plantId: string;
  classId: number;
  confidence: number;
  days: number;
  image: string;
  fileName?: string;
}

function sample(src: string, fileName: string): { image: string; fileName: string } {
  return { image: src, fileName };
}

function svg(style: DemoLeafStyle, variant: number): { image: string; fileName?: string } {
  return { image: demoLeafImage(style, variant), fileName: `scan-${style}-${variant}.jpg` };
}

function buildScans(base: number): Scan[] {
  const specs: ScanSpec[] = [
    // --- healthy history (19) ---
    { id: "demo-s1", plantId: "demo-p1", classId: 37, confidence: 0.97, days: 30, ...sample("/samples/tomato-healthy.jpg", "IMG_2041.jpg") },
    { id: "demo-s2", plantId: "demo-p1", classId: 37, confidence: 0.98, days: 16, ...sample("/samples/tomato-healthy.jpg", "IMG_2178.jpg") },
    { id: "demo-s3", plantId: "demo-p2", classId: 37, confidence: 0.99, days: 25, ...sample("/samples/tomato-healthy.jpg", "IMG_2093.jpg") },
    { id: "demo-s4", plantId: "demo-p3", classId: 22, confidence: 0.96, days: 28, ...svg("healthy", 1) },
    { id: "demo-s5", plantId: "demo-p3", classId: 22, confidence: 0.95, days: 12, ...svg("healthy", 2) },
    { id: "demo-s6", plantId: "demo-p4", classId: 3, confidence: 0.93, days: 35, ...svg("healthy", 3) },
    { id: "demo-s7", plantId: "demo-p4", classId: 3, confidence: 0.97, days: 18, ...svg("healthy", 4) },
    { id: "demo-s8", plantId: "demo-p5", classId: 14, confidence: 0.94, days: 26, ...svg("healthy", 5) },
    { id: "demo-s9", plantId: "demo-p5", classId: 14, confidence: 0.96, days: 9, ...svg("healthy", 6) },
    { id: "demo-s10", plantId: "demo-p6", classId: 10, confidence: 0.92, days: 22, ...svg("healthy", 7) },
    { id: "demo-s11", plantId: "demo-p10", classId: 4, confidence: 0.89, days: 20, ...svg("healthy", 8) },
    { id: "demo-s12", plantId: "demo-p7", classId: 27, confidence: 0.91, days: 15, ...svg("healthy", 9) },
    { id: "demo-s13", plantId: "demo-p8", classId: 19, confidence: 0.9, days: 13, ...svg("healthy", 10) },
    { id: "demo-s14", plantId: "demo-p9", classId: 17, confidence: 0.88, days: 11, ...svg("healthy", 11) },
    { id: "demo-s15", plantId: "demo-p1", classId: 37, confidence: 0.93, days: 5, ...sample("/samples/tomato-healthy.jpg", "IMG_2260.jpg") },
    { id: "demo-s16", plantId: "demo-p11", classId: 23, confidence: 0.9, days: 8, ...svg("healthy", 12) },
    { id: "demo-s17", plantId: "demo-p6", classId: 10, confidence: 0.95, days: 6, ...svg("healthy", 13) },
    { id: "demo-s18", plantId: "demo-p8", classId: 19, confidence: 0.92, days: 4, ...svg("healthy", 14) },
    { id: "demo-s19", plantId: "demo-p3", classId: 22, confidence: 0.97, days: 2, ...svg("healthy", 15) },
    // --- findings (9) ---
    { id: "demo-s20", plantId: "demo-p1", classId: 29, confidence: 0.84, days: 21, ...sample("/samples/tomato-early-blight.jpg", "IMG_2114.jpg") },
    { id: "demo-s21", plantId: "demo-p2", classId: 29, confidence: 0.78, days: 14, ...sample("/samples/tomato-early-blight.jpg", "IMG_2196.jpg") },
    { id: "demo-s22", plantId: "demo-p3", classId: 21, confidence: 0.67, days: 10, ...sample("/samples/potato-late-blight.jpg", "IMG_2223.jpg") },
    { id: "demo-s23", plantId: "demo-p4", classId: 0, confidence: 0.98, days: 7, ...sample("/samples/apple-scab.jpg", "IMG_2247.jpg") },
    { id: "demo-s24", plantId: "demo-p5", classId: 11, confidence: 0.99, days: 3, ...sample("/samples/grape-black-rot.jpg", "IMG_2281.jpg") },
    { id: "demo-s25", plantId: "demo-p6", classId: 8, confidence: 0.97, days: 1, ...sample("/samples/corn-common-rust.jpg", "IMG_2298.jpg") },
    { id: "demo-s26", plantId: "demo-p7", classId: 26, confidence: 0.61, days: 6, ...svg("scorch", 1) },
    { id: "demo-s27", plantId: "demo-p12", classId: 25, confidence: 0.72, days: 4, ...svg("mildew", 1) },
    { id: "demo-s28", plantId: "demo-p2", classId: 33, confidence: 0.45, days: 1, ...svg("stipple", 1) },
  ];

  return specs
    .map((spec) => ({
      id: spec.id,
      createdAt: daysAgo(base, spec.days, 9 + (spec.classId % 8)),
      image: spec.image,
      thumb: spec.image,
      fileName: spec.fileName,
      plantId: spec.plantId,
      classId: spec.classId,
      confidence: spec.confidence,
      alternatives: makeAlternatives(spec.classId, spec.confidence),
      isDemo: true,
    }))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

function buildPlants(base: number): Plant[] {
  const specs: Array<[string, string, string, string, number]> = [
    ["demo-p1", "Tomato 'Moneymaker'", "Tomato (Solanum lycopersicum)", "Garden Area A", 60],
    ["demo-p2", "Cherry Tomato", "Tomato (Solanum lycopersicum var. cerasiforme)", "Balcony", 55],
    ["demo-p3", "Potato 'Kennebec'", "Potato (Solanum tuberosum)", "Garden Area B", 58],
    ["demo-p4", "Apple 'Gala'", "Apple (Malus domestica)", "Backyard", 400],
    ["demo-p5", "Grape 'Concord'", "Grape (Vitis labrusca)", "Main Entrance", 380],
    ["demo-p6", "Sweet Corn", "Corn (Zea mays)", "Garden Area B", 70],
    ["demo-p7", "Strawberry 'Albion'", "Strawberry (Fragaria × ananassa)", "Garden Area A", 65],
    ["demo-p8", "Bell Pepper 'California Wonder'", "Bell Pepper (Capsicum annuum)", "Greenhouse", 50],
    ["demo-p9", "Peach 'Elberta'", "Peach (Prunus persica)", "Backyard", 350],
    ["demo-p10", "Blueberry 'Bluecrop'", "Blueberry (Vaccinium corymbosum)", "Backyard", 320],
    ["demo-p11", "Raspberry 'Heritage'", "Raspberry (Rubus idaeus)", "Garden Area B", 300],
    ["demo-p12", "Zucchini 'Black Beauty'", "Zucchini (Cucurbita pepo)", "Garden Area A", 45],
  ];
  return specs.map(([id, name, species, location, createdDays]) => ({
    id,
    name,
    species,
    location,
    notes: "",
    createdAt: daysAgo(base, createdDays, 8),
    isDemo: true,
  }));
}

function buildReports(base: number): ProblemReport[] {
  const specs: Array<[string, ProblemReport["problemType"], string, string, ProblemReport["status"], number]> = [
    ["demo-r1", "pest", "Garden Area B", "Aphid clusters on the undersides of the potato leaves near the east row.", "under_review", 6],
    ["demo-r2", "disease", "Garden Area A", "Dark spots spreading on the lower tomato leaves after the wet week.", "reported", 2],
    ["demo-r3", "waste", "Main Entrance", "Pile of pruned branches and grass clippings needs collecting for the green-waste pickup.", "reported", 1],
    ["demo-r4", "damaged", "Garden Area A", "Young zucchini seedling snapped off — likely snails overnight.", "resolved", 9],
    ["demo-r5", "other", "Greenhouse", "Condensation dripping from the roof panel is soaking one pepper bed.", "under_review", 4],
    ["demo-r6", "disease", "Garden Area A", "White powdery coating on zucchini leaves — flagged after a scan.", "resolved", 5],
  ];
  return specs.map(([id, problemType, location, description, status, days]) => ({
    id,
    problemType,
    location,
    description,
    status,
    createdAt: daysAgo(base, days, 12),
    isDemo: true,
  }));
}

export function buildSeedData(base: number = Date.now()): AppData {
  return {
    version: 1,
    seeded: true,
    plants: buildPlants(base),
    scans: buildScans(base),
    reports: buildReports(base),
    settings: {
      displayName: "",
      confidenceThreshold: DEFAULT_CONFIDENCE_THRESHOLD,
    },
  };
}
