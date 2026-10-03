/**
 * Downloads the plant-disease ONNX model + config files into public/models/plant-disease/.
 *
 * Model: onnx-community/mobilenet_v2_1.0_224-plant-disease-identification-ONNX
 *   MobileNetV2 fine-tuned on the "New Plant Diseases Dataset" (PlantVillage, 38 classes).
 *   The fp32 build (~9 MB) is used: the int8/quantized variants of this model lose
 *   most of their accuracy (verified with scripts/validate_model.py), while fp32
 *   classifies every validation sample correctly and is small enough to run in-browser.
 *
 * Safe to re-run: files that already exist are skipped unless --force is passed.
 */
import { mkdir, writeFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BASE_URL =
  "https://huggingface.co/onnx-community/mobilenet_v2_1.0_224-plant-disease-identification-ONNX/resolve/main";

const FILES = [
  ["onnx/model.onnx", "public/models/plant-disease/onnx/model.onnx"],
  ["config.json", "public/models/plant-disease/config.json"],
  ["preprocessor_config.json", "public/models/plant-disease/preprocessor_config.json"],
];

const force = process.argv.includes("--force");

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function download(remotePath, localRelPath) {
  const target = join(ROOT, localRelPath);
  if (!force && (await exists(target))) {
    console.log(`  skipped (exists): ${localRelPath}`);
    return;
  }
  const url = `${BASE_URL}/${remotePath}`;
  console.log(`  downloading ${url}`);
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, buf);
  console.log(`  saved ${localRelPath} (${(buf.length / 1024).toFixed(1)} KiB)`);
}

console.log("Downloading plant-disease ONNX model files...");
for (const [remote, local] of FILES) {
  await download(remote, local);
}
console.log("Model ready. Run `node scripts/download-samples.mjs` for sample images.");
