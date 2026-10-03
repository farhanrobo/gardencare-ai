/**
 * Deterministic SVG leaf illustrations used for demo scan records.
 * Kept as inline data URIs so the seeded demo data stays tiny in localStorage.
 * All demo records that use these are marked with `isDemo: true`.
 */

export type DemoLeafStyle =
  | "healthy"
  | "spots"
  | "rust"
  | "blight"
  | "scab"
  | "mildew"
  | "scorch"
  | "stipple"
  | "mottle";

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Random points inside the leaf shape (ellipse-ish, slightly rotated). */
function leafPoints(rng: () => number, count: number): Array<[number, number]> {
  const points: Array<[number, number]> = [];
  let guard = 0;
  while (points.length < count && guard < count * 60) {
    guard++;
    const x = rng() * 2 - 1; // -1..1
    const y = rng() * 2 - 1;
    // Leaf approximated by |x|^1.9 + |y|^2.6 <= 0.62 inside the rotated group.
    if (Math.pow(Math.abs(x), 1.9) + Math.pow(Math.abs(y), 2.6) <= 0.62) {
      points.push([x * 62, y * 88]);
    }
  }
  return points;
}

function overlay(style: DemoLeafStyle, rng: () => number): string {
  const dots: string[] = [];
  switch (style) {
    case "healthy":
      return "";
    case "spots":
      for (const [x, y] of leafPoints(rng, 9)) {
        const r = 3.5 + rng() * 5;
        dots.push(
          `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#8a5a2b" opacity="0.85"/>`,
          `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r * 0.5).toFixed(1)}" fill="#5f3a18" opacity="0.9"/>`,
        );
      }
      break;
    case "rust":
      for (const [x, y] of leafPoints(rng, 22)) {
        dots.push(
          `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.8 + rng() * 2).toFixed(1)}" fill="#a4552b" opacity="0.9"/>`,
        );
      }
      break;
    case "blight":
      for (const [x, y] of leafPoints(rng, 3)) {
        dots.push(
          `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(14 + rng() * 10).toFixed(1)}" ry="${(11 + rng() * 8).toFixed(1)}" fill="#5d6a57" opacity="0.8"/>`,
          `<ellipse cx="${(x + 4).toFixed(1)}" cy="${(y + 3).toFixed(1)}" rx="8" ry="6" fill="#3f4a3b" opacity="0.7"/>`,
        );
      }
      break;
    case "scab":
      for (const [x, y] of leafPoints(rng, 7)) {
        dots.push(
          `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(6 + rng() * 5).toFixed(1)}" ry="${(4 + rng() * 4).toFixed(1)}" fill="#5c4a28" opacity="0.85"/>`,
        );
      }
      break;
    case "mildew":
      for (const [x, y] of leafPoints(rng, 5)) {
        dots.push(
          `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(11 + rng() * 9).toFixed(1)}" ry="${(8 + rng() * 6).toFixed(1)}" fill="#ffffff" opacity="0.6"/>`,
        );
      }
      break;
    case "scorch":
      for (const [x, y] of leafPoints(rng, 16)) {
        dots.push(
          `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.8 + rng() * 1.6).toFixed(1)}" fill="#5c3b4a" opacity="0.9"/>`,
        );
      }
      break;
    case "stipple":
      for (const [x, y] of leafPoints(rng, 40)) {
        dots.push(
          `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.4" fill="#d9cf87" opacity="0.95"/>`,
        );
      }
      break;
    case "mottle":
      for (const [x, y] of leafPoints(rng, 3)) {
        dots.push(
          `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(12 + rng() * 9).toFixed(1)}" ry="${(9 + rng() * 6).toFixed(1)}" fill="#cfd07a" opacity="0.55"/>`,
        );
      }
      break;
  }
  return dots.join("");
}

export function demoLeafImage(style: DemoLeafStyle, variant = 1): string {
  const rng = mulberry32(variant * 7919 + style.length * 131);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <rect width="256" height="256" fill="#edf3ea"/>
  <circle cx="216" cy="40" r="70" fill="#e2ecdf" opacity="0.8"/>
  <g transform="translate(128 130) rotate(-16)">
    <path d="M0 -92 C 60 -62, 60 62, 0 92 C -60 62, -60 -62, 0 -92 Z" fill="url(#leafGrad)"/>
    <path d="M0 -80 V80" stroke="#33683f" stroke-width="3" stroke-linecap="round" opacity="0.75"/>
    <path d="M0 -22 C 14 -30, 24 -40, 30 -52 M0 -22 C -14 -30, -24 -40, -30 -52 M0 22 C 14 30, 24 40, 30 52 M0 22 C -14 30, -24 40, -30 52" stroke="#33683f" stroke-width="2.4" stroke-linecap="round" fill="none" opacity="0.55"/>
    ${overlay(style, rng)}
  </g>
  <defs>
    <linearGradient id="leafGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#66ab76"/>
      <stop offset="1" stop-color="#3f8a52"/>
    </linearGradient>
  </defs>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg.replace(/\n/g, ""))}`;
}
