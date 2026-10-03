/**
 * Browser-side image preparation for the plant-disease model.
 *
 * Preprocessing mirrors the model's MobileNetV2 feature extractor:
 *   1. resize so the shortest edge is 256 px (bilinear)
 *   2. center-crop to 224 × 224
 *   3. rescale to [0, 1] then normalize with mean = std = 0.5
 *   4. format as a 1 × 3 × 224 × 224 float32 NCHW tensor
 *
 * This is verified against a Python reference implementation — see
 * scripts/validate_model.py.
 */
import {
  ACCEPTED_IMAGE_EXTENSIONS,
  ACCEPTED_IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
} from "@/lib/constants";
import { humanFileSize } from "@/lib/utils";

export const MODEL_INPUT_SIZE = 224;
const RESIZE_SHORTEST = 256;
const PREVIEW_MAX_EDGE = 512;
const THUMB_MAX_EDGE = 96;

export interface PreparedImage {
  /** 1 × 3 × 224 × 224 CHW float32 tensor data, normalized to [-1, 1]. */
  tensor: Float32Array;
  /** Downscaled JPEG data URL used for previews and storage. */
  preview: string;
  /** Tiny JPEG data URL used for list thumbnails. */
  thumb: string;
  width: number;
  height: number;
  fileName?: string;
}

/** Returns a user-facing error message, or null when the file is acceptable. */
export function validateImageFile(file: File): string | null {
  const name = file.name.toLowerCase();
  const typeOk =
    ACCEPTED_IMAGE_TYPES.includes(file.type) ||
    ACCEPTED_IMAGE_EXTENSIONS.some((ext) => name.endsWith(ext));
  if (!typeOk) {
    return "That file type isn't supported. Please upload a JPG, PNG or WEBP image.";
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return `That image is larger than ${humanFileSize(MAX_UPLOAD_BYTES)}. Please upload a smaller photo.`;
  }
  return null;
}

async function decode(blob: Blob): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(blob, { imageOrientation: "from-image" });
  } catch {
    // Older browsers: fall back to default decoding.
    return await createImageBitmap(blob);
  }
}

function scaledSize(width: number, height: number, maxEdge: number) {
  const scale = Math.min(1, maxEdge / Math.max(width, height));
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function renderToDataUrl(
  bitmap: ImageBitmap,
  maxEdge: number,
  quality: number,
): { dataUrl: string; width: number; height: number } {
  const { width, height } = scaledSize(bitmap.width, bitmap.height, maxEdge);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser.");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);
  return { dataUrl: canvas.toDataURL("image/jpeg", quality), width, height };
}

function buildTensor(bitmap: ImageBitmap): Float32Array {
  // Step 1 — resize so the shortest edge is 256 px.
  const scale = RESIZE_SHORTEST / Math.min(bitmap.width, bitmap.height);
  const resizedW = Math.round(bitmap.width * scale);
  const resizedH = Math.round(bitmap.height * scale);
  const resized = document.createElement("canvas");
  resized.width = resizedW;
  resized.height = resizedH;
  const resizedCtx = resized.getContext("2d");
  if (!resizedCtx) throw new Error("Canvas is not available in this browser.");
  resizedCtx.imageSmoothingEnabled = true;
  resizedCtx.imageSmoothingQuality = "high";
  resizedCtx.drawImage(bitmap, 0, 0, resizedW, resizedH);

  // Step 2 — center-crop to 224 × 224.
  const cropped = document.createElement("canvas");
  cropped.width = MODEL_INPUT_SIZE;
  cropped.height = MODEL_INPUT_SIZE;
  const cropCtx = cropped.getContext("2d");
  if (!cropCtx) throw new Error("Canvas is not available in this browser.");
  const sx = Math.floor((resizedW - MODEL_INPUT_SIZE) / 2);
  const sy = Math.floor((resizedH - MODEL_INPUT_SIZE) / 2);
  cropCtx.drawImage(resized, sx, sy, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE, 0, 0, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE);

  // Step 3/4 — normalize to [-1, 1] and lay out as CHW.
  const { data } = cropCtx.getImageData(0, 0, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE);
  const pixels = MODEL_INPUT_SIZE * MODEL_INPUT_SIZE;
  const tensor = new Float32Array(3 * pixels);
  for (let i = 0; i < pixels; i++) {
    tensor[i] = (data[i * 4] / 255 - 0.5) / 0.5;
    tensor[pixels + i] = (data[i * 4 + 1] / 255 - 0.5) / 0.5;
    tensor[2 * pixels + i] = (data[i * 4 + 2] / 255 - 0.5) / 0.5;
  }
  return tensor;
}

async function prepare(blob: Blob, fileName?: string): Promise<PreparedImage> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await decode(blob);
  } catch {
    throw new Error(
      "We couldn't read this image — the file may be corrupted. Please try another photo.",
    );
  }
  if (bitmap.width < 40 || bitmap.height < 40) {
    bitmap.close();
    throw new Error("That image is too small to analyze. Please use a larger, clearer photo.");
  }

  try {
    const preview = renderToDataUrl(bitmap, PREVIEW_MAX_EDGE, 0.82);
    const thumb = renderToDataUrl(bitmap, THUMB_MAX_EDGE, 0.7);
    const tensor = buildTensor(bitmap);
    return {
      tensor,
      preview: preview.dataUrl,
      thumb: thumb.dataUrl,
      width: bitmap.width,
      height: bitmap.height,
      fileName,
    };
  } finally {
    bitmap.close();
  }
}

export async function prepareImageFile(file: File): Promise<PreparedImage> {
  const validationError = validateImageFile(file);
  if (validationError) throw new Error(validationError);
  return prepare(file, file.name);
}

/** Loads a bundled sample image (or any same-origin URL) into a PreparedImage. */
export async function prepareImageFromUrl(src: string, fileName?: string): Promise<PreparedImage> {
  let res: Response;
  try {
    res = await fetch(src);
  } catch {
    throw new Error("We couldn't load that sample image. Please try again.");
  }
  if (!res.ok) {
    throw new Error("We couldn't load that sample image. Please try again.");
  }
  return prepare(await res.blob(), fileName);
}
