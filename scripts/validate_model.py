"""
Pre-flight check for the plant-disease ONNX model.

Loads the quantized model with onnxruntime, applies the exact preprocessing the
browser will use (shortest edge -> 256, center crop 224, scale to [-1, 1], NCHW)
and prints the top-3 predictions for each sample image in public/samples/.

Usage:
    pip install onnxruntime pillow numpy
    python scripts/validate_model.py
"""

import json
import sys
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
MODEL_PATH = ROOT / "public" / "models" / "plant-disease" / "onnx" / "model.onnx"
CONFIG_PATH = ROOT / "public" / "models" / "plant-disease" / "config.json"
SAMPLES_DIR = ROOT / "public" / "samples"

MEAN = 0.5
STD = 0.5
RESIZE_SHORTEST = 256
CROP = 224


def preprocess(image_path: Path) -> np.ndarray:
    img = Image.open(image_path).convert("RGB")
    w, h = img.size
    scale = RESIZE_SHORTEST / min(w, h)
    img = img.resize((round(w * scale), round(h * scale)), Image.BILINEAR)
    w, h = img.size
    left, top = (w - CROP) // 2, (h - CROP) // 2
    img = img.crop((left, top, left + CROP, top + CROP))
    x = np.asarray(img, dtype=np.float32) / 255.0
    x = (x - MEAN) / STD
    return np.transpose(x, (2, 0, 1))[None, ...]  # NCHW


def main() -> None:
    model_path = Path(sys.argv[1]) if len(sys.argv) > 1 else MODEL_PATH
    if not model_path.exists():
        raise SystemExit(f"Model not found: {model_path}. Run `node scripts/download-model.mjs` first.")

    session = ort.InferenceSession(str(model_path), providers=["CPUExecutionProvider"])
    print("inputs:", [(i.name, i.shape, i.type) for i in session.get_inputs()])
    print("outputs:", [(o.name, o.shape, o.type) for o in session.get_outputs()])

    id2label = json.loads(CONFIG_PATH.read_text())["id2label"]
    input_name = session.get_inputs()[0].name

    for sample in sorted(SAMPLES_DIR.glob("*.jpg")):
        x = preprocess(sample)
        logits = session.run(None, {input_name: x})[0][0]
        exps = np.exp(logits - logits.max())
        probs = exps / exps.sum()
        top = probs.argsort()[::-1][:3]
        print(f"\n{sample.name}")
        for i in top:
            print(f"   {id2label[str(i)]}: {probs[i] * 100:.1f}%")


if __name__ == "__main__":
    main()
