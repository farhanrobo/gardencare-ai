/**
 * Copies the ONNX Runtime Web (wasm backend) assets from node_modules into public/ort/,
 * so inference runs fully from our own origin — no external CDN at runtime.
 *
 * Safe to re-run: existing files are overwritten so the copies always match the
 * installed onnxruntime-web version.
 */
import { mkdir, copyFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORT_DIST = join(ROOT, "node_modules", "onnxruntime-web", "dist");
const OUT_DIR = join(ROOT, "public", "ort");

const FILES = ["ort-wasm-simd-threaded.mjs", "ort-wasm-simd-threaded.wasm"];

await mkdir(OUT_DIR, { recursive: true });
for (const file of FILES) {
  const src = join(ORT_DIST, file);
  try {
    await stat(src);
  } catch {
    console.error(`Missing ${file} — run \`npm install\` first.`);
    process.exit(1);
  }
  const dest = join(OUT_DIR, file);
  await copyFile(src, dest);
  const { size } = await stat(dest);
  console.log(`copied ${file} -> public/ort/ (${(size / 1024 / 1024).toFixed(1)} MiB)`);
}
console.log("ONNX Runtime web assets ready.");
