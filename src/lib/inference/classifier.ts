/**
 * ONNX Runtime Web classifier for the bundled plant-disease model.
 *
 * The model runs entirely in the browser via WebAssembly — no server round-trip
 * and no external API. The ~9 MB weights are fetched once from our own origin
 * (with real download progress) and cached by the browser afterwards.
 */
import { MODEL_URL, ORT_WASM_PATH } from "@/lib/constants";
import type { Prediction } from "@/lib/types";
import type { PreparedImage } from "./preprocess";

export type ModelProgress =
  | { phase: "downloading"; loaded: number; total: number | null }
  | { phase: "initializing" };

export class ModelLoadError extends Error {}
export class InferenceError extends Error {}

type InferenceSession = import("onnxruntime-web").InferenceSession;
// The wasm-only build avoids probing for the WebGPU/JSEP wasm binaries,
// which we don't ship.
type OrtModule = typeof import("onnxruntime-web/wasm");

let ortModulePromise: Promise<OrtModule> | null = null;
let sessionPromise: Promise<InferenceSession> | null = null;

/** Progress subscribers (the scanner UI listens while the model loads). */
const progressListeners = new Set<(p: ModelProgress) => void>();

function emitProgress(progress: ModelProgress) {
  for (const listener of progressListeners) listener(progress);
}

/** Subscribe to model load progress. Returns an unsubscribe function. */
export function subscribeToModelProgress(listener: (p: ModelProgress) => void): () => void {
  progressListeners.add(listener);
  return () => progressListeners.delete(listener);
}

async function getOrt(): Promise<OrtModule> {
  if (!ortModulePromise) {
    ortModulePromise = import("onnxruntime-web/wasm").then((ort) => {
      ort.env.wasm.wasmPaths = ORT_WASM_PATH;
      // No cross-origin isolation headers on the host → single-threaded wasm.
      ort.env.wasm.numThreads = 1;
      ort.env.logLevel = "error";
      return ort;
    });
  }
  return ortModulePromise;
}

async function fetchModelBytes(onProgress?: (p: ModelProgress) => void): Promise<Uint8Array> {
  const report = (p: ModelProgress) => {
    onProgress?.(p);
    emitProgress(p);
  };
  let res: Response;
  try {
    res = await fetch(MODEL_URL);
  } catch {
    throw new ModelLoadError(
      "We couldn't download the plant health model. Check your connection and try again.",
    );
  }
  if (!res.ok) {
    throw new ModelLoadError(
      "We couldn't download the plant health model. Check your connection and try again.",
    );
  }
  const total = Number(res.headers.get("content-length")) || null;

  if (!res.body) {
    return new Uint8Array(await res.arrayBuffer());
  }

  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      loaded += value.byteLength;
      report({ phase: "downloading", loaded, total });
    }
  }
  const bytes = new Uint8Array(loaded);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

async function createSession(
  onProgress?: (p: ModelProgress) => void,
): Promise<InferenceSession> {
  const [ort, bytes] = await Promise.all([getOrt(), fetchModelBytes(onProgress)]);
  onProgress?.({ phase: "initializing" });
  emitProgress({ phase: "initializing" });
  try {
    return await ort.InferenceSession.create(bytes, { executionProviders: ["wasm"] });
  } catch {
    throw new ModelLoadError(
      "The plant health model couldn't be started on this device. Reloading the page usually helps.",
    );
  }
}

/** Loads (or returns the already loaded) inference session. */
export function getSession(onProgress?: (p: ModelProgress) => void): Promise<InferenceSession> {
  if (!sessionPromise) {
    sessionPromise = createSession(onProgress).catch((error) => {
      sessionPromise = null; // allow retry on the next attempt
      throw error;
    });
  }
  return sessionPromise;
}

export function isModelReady(): boolean {
  return sessionPromise !== null;
}

/** Warms up the model in the background (used when the scanner page opens). */
export function preloadModel(onProgress?: (p: ModelProgress) => void): void {
  void getSession(onProgress).catch(() => {
    // Load errors surface when the user actually runs an analysis.
  });
}

export async function classify(
  prepared: PreparedImage,
  topK = 3,
): Promise<Prediction> {
  const [ort, session] = await Promise.all([getOrt(), getSession()]);
  const inputName = session.inputNames[0];
  const outputName = session.outputNames[0];
  const tensor = new ort.Tensor("float32", prepared.tensor, [1, 3, 224, 224]);

  const started = performance.now();
  let logits: Float32Array;
  try {
    const output = await session.run({ [inputName]: tensor });
    logits = output[outputName].data as Float32Array;
  } catch {
    throw new InferenceError("Something went wrong while analyzing this image. Please try again.");
  }
  const latencyMs = performance.now() - started;

  let max = -Infinity;
  for (const value of logits) if (value > max) max = value;
  let sum = 0;
  const probs = new Float32Array(logits.length);
  for (let i = 0; i < logits.length; i++) {
    const exp = Math.exp(logits[i] - max);
    probs[i] = exp;
    sum += exp;
  }
  for (let i = 0; i < probs.length; i++) probs[i] /= sum;

  const ranked = Array.from(probs.keys())
    .sort((a, b) => probs[b] - probs[a])
    .slice(0, Math.max(1, topK));
  const alternatives = ranked.map((classId) => ({
    classId,
    confidence: probs[classId],
  }));

  return {
    classId: alternatives[0].classId,
    confidence: alternatives[0].confidence,
    alternatives,
    latencyMs,
  };
}
