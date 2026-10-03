/**
 * Downloads a small set of real PlantVillage leaf photos into public/samples/.
 * These power the "try a sample image" feature and the automated tests.
 *
 * Source: spMohanty/PlantVillage-Dataset (raw/color), Mohanty et al. 2016.
 * Safe to re-run: existing files are skipped unless --force is passed.
 */
import { mkdir, writeFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const RAW_BASE =
  "https://raw.githubusercontent.com/spMohanty/PlantVillage-Dataset/master/raw/color";

const SAMPLES = [
  ["Tomato___Early_blight", "0012b9d2-2130-4a06-a834-b1f3af34f57e___RS_Erly.B 8389.JPG", "tomato-early-blight.jpg"],
  ["Tomato___healthy", "000146ff-92a4-4db6-90ad-8fce2ae4fddd___GH_HL Leaf 259.1.JPG", "tomato-healthy.jpg"],
  ["Potato___Late_blight", "0051e5e8-d1c4-4a84-bf3a-a426cdad6285___RS_LB 4640.JPG", "potato-late-blight.jpg"],
  ["Apple___Apple_scab", "00075aa8-d81a-4184-8541-b692b78d398a___FREC_Scab 3335.JPG", "apple-scab.jpg"],
  ["Grape___Black_rot", "00090b0f-c140-4e77-8d20-d39f67b75fcc___FAM_B.Rot 0376.JPG", "grape-black-rot.jpg"],
  ["Corn_(maize)___Common_rust_", "RS_Rust 1563.JPG", "corn-common-rust.jpg"],
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

console.log("Downloading PlantVillage sample images...");
for (const [folder, fileName, outName] of SAMPLES) {
  const target = join(ROOT, "public", "samples", outName);
  if (!force && (await exists(target))) {
    console.log(`  skipped (exists): ${outName}`);
    continue;
  }
  const url = `${RAW_BASE}/${folder}/${encodeURIComponent(fileName)}`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, buf);
  console.log(`  saved public/samples/${outName} (${(buf.length / 1024).toFixed(1)} KiB)`);
}
console.log("Sample images ready.");
