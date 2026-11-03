// Hilfsfunktionen: Zufall mit festem Seed, Easing, Interpolation.
import * as THREE from 'three';

export const D2R = Math.PI / 180;

// Deterministischer Zufall (mulberry32)
export function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, k) => a + (b - a) * k;
export const smooth = (k) => { k = clamp(k, 0, 1); return k * k * (3 - 2 * k); };
export const easeInOut = (k) => { k = clamp(k, 0, 1); return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
export const EASE = {
  linear: (k) => clamp(k, 0, 1),
  in: (k) => { k = clamp(k, 0, 1); return k * k; },
  out: (k) => { k = clamp(k, 0, 1); return 1 - (1 - k) * (1 - k); },
  inOut: (k) => { k = clamp(k, 0, 1); return k * k * (3 - 2 * k); },
  sine: (k) => { k = clamp(k, 0, 1); return 0.5 - 0.5 * Math.cos(Math.PI * k); },
};

// Fenster-Funktion: 0 -> 1 (Einblenden) und 1 -> 0 (Ausblenden)
export function fadeWindow(t, t0, t1, fin, fout) {
  if (t < t0 || t > t1) return 0;
  let a = 1;
  if (fin > 0) a = Math.min(a, (t - t0) / fin);
  if (fout > 0) a = Math.min(a, (t1 - t) / fout);
  return clamp(a, 0, 1);
}

// Sucht Segment i mit keys[i].t <= t < keys[i+1].t
export function findSeg(keys, t) {
  if (t <= keys[0].t) return { i: 0, k: 0 };
  const n = keys.length;
  if (t >= keys[n - 1].t) return { i: n - 1, k: 0 };
  let i = 0;
  while (i < n - 2 && keys[i + 1].t <= t) i++;
  const k = (t - keys[i].t) / Math.max(1e-6, keys[i + 1].t - keys[i].t);
  return { i, k };
}

// Kubische Hermite-Interpolation mit Catmull-Rom-Tangenten fuer Positionen:
// weiche Bewegung ohne Ruck an Zwischen-Keys. Ein Key mit hold:true hat
// Geschwindigkeit 0 (Anfahren/Abbremsen mit Ease), sonst laeuft die Bewegung durch.
export function hermiteScalar(keys, t, get) {
  const n = keys.length;
  if (n === 1) return get(keys[0]);
  const { i, k } = findSeg(keys, t);
  if (i >= n - 1) return get(keys[n - 1]);
  const t0 = keys[i].t, t1 = keys[i + 1].t, h = t1 - t0;
  const p0 = get(keys[i]), p1 = get(keys[i + 1]);
  const tan = (j) => {
    const kj = keys[j];
    if (kj.hold) return 0;               // hold: Geschwindigkeit 0 (weiches Anfahren/Abbremsen)
    const a = keys[Math.max(0, j - 1)], b = keys[Math.min(n - 1, j + 1)];
    return (get(b) - get(a)) / Math.max(1e-6, b.t - a.t);
  };
  const m0 = tan(i) * h, m1 = tan(i + 1) * h;
  const s = k, s2 = s * s, s3 = s2 * s;
  return (2 * s3 - 3 * s2 + 1) * p0 + (s3 - 2 * s2 + s) * m0 + (-2 * s3 + 3 * s2) * p1 + (s3 - s2) * m1;
}

export function hermiteVec(keys, t, field, dim) {
  const out = [];
  for (let d = 0; d < dim; d++) out.push(hermiteScalar(keys, t, (k) => k[field][d]));
  return out;
}

export function colorHex(c) { return new THREE.Color(c); }
