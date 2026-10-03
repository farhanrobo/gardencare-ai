export const APP_NAME = "GardenCare AI";
export const APP_TAGLINE = "See the problem. Understand the plant. Care better.";
export const APP_DESCRIPTION = "AI-powered plant health analysis for smarter gardening.";
export const APP_SUBTEXT =
  "Upload a leaf photo and get a quick indication of possible plant health problems.";

export const DISCLAIMER =
  "GardenCare AI provides an AI-based indication from the uploaded image and should not be treated as a professional agricultural diagnosis.";

export const LOW_CONFIDENCE_MESSAGE =
  "Try uploading a clear close-up image of the affected leaf with good lighting.";

export const MODEL_INFO = {
  displayName: "MobileNetV2 · plant-disease classifier",
  architecture: "MobileNetV2 (ImageNet pre-trained, fine-tuned)",
  classes: 38,
  inputSize: "224 × 224 px",
  framework: "ONNX Runtime Web (WebAssembly, runs in your browser)",
  accuracyNote: "95.4% top-1 on the held-out PlantVillage-derived evaluation set",
  datasetName: "PlantVillage / New Plant Diseases Dataset (augmented)",
  datasetAuthors: "Mohanty, Hughes & Salathé (2016)",
  modelPage:
    "https://huggingface.co/onnx-community/mobilenet_v2_1.0_224-plant-disease-identification-ONNX",
  baseModelPage:
    "https://huggingface.co/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification",
  datasetRepo: "https://github.com/spMohanty/PlantVillage-Dataset",
} as const;

export const MODEL_URL = "/models/plant-disease/onnx/model.onnx";
export const ORT_WASM_PATH = "/ort/";

export const STORAGE_KEY = "gardencare-ai:v1";
/** Soft budget for localStorage payloads; older scan images get pruned when exceeded. */
export const STORAGE_BUDGET_BYTES = 4.2 * 1024 * 1024;
/** Number of most recent scans whose full-size previews are kept in storage. */
export const MAX_STORED_PREVIEWS = 24;

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const ACCEPTED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

export const DEFAULT_CONFIDENCE_THRESHOLD = 0.6;
export const CONFIDENCE_THRESHOLD_MIN = 0.4;
export const CONFIDENCE_THRESHOLD_MAX = 0.9;

export interface SampleImage {
  src: string;
  fileName: string;
  label: string;
  plant: string;
}

/** Real PlantVillage photos bundled for one-click demos and automated tests. */
export const SAMPLE_IMAGES: SampleImage[] = [
  { src: "/samples/tomato-early-blight.jpg", fileName: "tomato-early-blight.jpg", label: "Tomato leaf with spots", plant: "Tomato" },
  { src: "/samples/tomato-healthy.jpg", fileName: "tomato-healthy.jpg", label: "Healthy tomato leaf", plant: "Tomato" },
  { src: "/samples/potato-late-blight.jpg", fileName: "potato-late-blight.jpg", label: "Potato leaf, wilted edge", plant: "Potato" },
  { src: "/samples/apple-scab.jpg", fileName: "apple-scab.jpg", label: "Apple leaf with scab", plant: "Apple" },
  { src: "/samples/grape-black-rot.jpg", fileName: "grape-black-rot.jpg", label: "Grape leaf, black rot", plant: "Grape" },
  { src: "/samples/corn-common-rust.jpg", fileName: "corn-common-rust.jpg", label: "Corn leaf with rust", plant: "Corn" },
];

export const PLANT_LOCATION_PRESETS = [
  "Garden Area A",
  "Garden Area B",
  "Main Entrance",
  "Balcony",
  "Backyard",
  "Greenhouse",
] as const;

export const REPORT_LOCATION_PRESETS = [
  "Garden Area A",
  "Garden Area B",
  "Main Entrance",
] as const;
