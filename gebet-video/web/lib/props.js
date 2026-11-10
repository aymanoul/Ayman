// Gegenstände im Gebetsraum (nach den Fotos): Uhr, Regale, Tisch, Stuhl, Mikrofone, Minbar, Roll-up,
// Stapelstühle, Schild, Wandleuchte, Gebetsteppich, Tür, Schuhregal.
// Alle Gegenstände stehen mit der Vorderseite nach +z und mit der Unterkante auf y = 0 (außer Wandteile).
import * as THREE from 'three';
import {
  PALETTE, rng, woodTexture, clockFaceTexture, phoneSignTexture, rollupTexture, velvetTexture, glowTexture, blobShadow,
} from './textures.js';

const std = (o) => new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0, ...o });
const flat = (color, o = {}) => std({ color, flatShading: true, ...o });
const box = (x, y, z) => new THREE.BoxGeometry(x, y, z);
function m(geo, mat, parent, pos, rot) {
  const o = new THREE.Mesh(geo, mat);
  if (pos) o.position.set(...pos);
  if (rot) o.rotation.set(...rot);
  o.castShadow = true; o.receiveShadow = true;
  parent.add(o);
  return o;
}
const METAL = () => std({ color: '#b9bcc2', metalness: 0.75, roughness: 0.35 });
const BLACK = () => flat('#1d1e22', { roughness: 0.6 });
let _wood;
const WOOD = () => (_wood ||= std({ map: woodTexture({ base: '#e2c591', dark: '#c49a5c' }), roughness: 0.7 }));

export function clock() {
  const g = new THREE.Group();
  const rim = m(new THREE.CylinderGeometry(0.165, 0.165, 0.05, 24), METAL(), g, [0, 0, 0.025], [Math.PI / 2, 0, 0]);
  rim.castShadow = false;
  m(new THREE.CylinderGeometry(0.146, 0.146, 0.052, 24), [std({ color: '#fbfbf8' }), std({ map: clockFaceTexture(), roughness: 0.6 }), std({ color: '#fbfbf8' })], g, [0, 0, 0.026], [Math.PI / 2, 0, 0]);
  const hour = new THREE.Group(), min = new THREE.Group();
  m(box(0.014, 0.085, 0.006), BLACK(), hour, [0, 0.036, 0]);
  m(box(0.009, 0.125, 0.006), BLACK(), min, [0, 0.055, 0]);
  hour.position.z = 0.056; min.position.z = 0.06;
  g.add(hour, min);
  m(new THREE.CylinderGeometry(0.012, 0.012, 0.012, 10), BLACK(), g, [0, 0, 0.062], [Math.PI / 2, 0, 0]);
  g.setTime = (h, mm) => { min.rotation.z = -(mm / 60) * Math.PI * 2; hour.rotation.z = -(((h % 12) + mm / 60) / 12) * Math.PI * 2; };
  g.setTime(15, 42);
  return g;
}

// Weißes Wandregal mit Büchern. kind: 'green' (grüne Bände mit Goldprägung) | 'dark'
export function shelf(kind = 'green', seed = 1) {
  const g = new THREE.Group();
  const W = 0.95, H = 0.37, D = 0.22, T = 0.02;
  const white = std({ color: '#f7f6f2', roughness: 0.6 });
  m(box(W, T, D), white, g, [0, T / 2, D / 2]);
  m(box(W, T, D), white, g, [0, H - T / 2, D / 2]);
  m(box(T, H, D), white, g, [-W / 2 + T / 2, H / 2, D / 2]);
  m(box(T, H, D), white, g, [W / 2 - T / 2, H / 2, D / 2]);
  m(box(W, H, 0.01), white, g, [0, H / 2, 0.005]);
  const r = rng(seed * 97);
  const cols = kind === 'green' ? ['#2f5a3a', '#2a5236', '#34603f', '#27492f'] : ['#2a1f1c', '#3b1d1f', '#1d2233', '#40251b', '#151517', '#5a2a22'];
  const gold = std({ color: '#c9a04e', metalness: 0.5, roughness: 0.4 });
  let x = -W / 2 + T + 0.006;
  const end = W / 2 - T - (kind === 'green' ? 0.04 : 0.2);
  while (x < end) {
    const w = 0.026 + r() * 0.016, h = 0.25 + r() * 0.045;
    const b = m(box(w, h, 0.16), flat(cols[Math.floor(r() * cols.length)], { roughness: 0.7 }), g, [x + w / 2, T + h / 2, 0.115]);
    if (kind === 'green' || r() > 0.5) m(box(w * 0.9, 0.012, 0.002), gold, b, [0, h * 0.28, 0.081]);
    x += w + 0.003;
  }
  // liegende Bücher obenauf
  for (let i = 0; i < 2; i++) {
    m(box(0.2, 0.03, 0.15), flat(cols[i % cols.length]), g, [(kind === 'green' ? -0.25 : 0.2) + i * 0.012, H + 0.015 + i * 0.031, 0.11], [0, 0.1 * i, 0]);
  }
  return g;
}

export function table() {
  const g = new THREE.Group();
  const W = 1.5, D = 0.7, Y = 0.74;
  m(box(W, 0.03, D), WOOD(), g, [0, Y - 0.015, 0]);
  m(box(W + 0.01, 0.012, D + 0.01), std({ color: '#c9a868' }), g, [0, Y - 0.036, 0]).castShadow = false;
  const grey = std({ color: '#8e949c', metalness: 0.5, roughness: 0.5 });
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) m(box(0.03, Y - 0.04, 0.03), grey, g, [sx * (W / 2 - 0.12), (Y - 0.04) / 2, sz * (D / 2 - 0.08)]);
    m(box(0.03, 0.03, D - 0.16), grey, g, [sx * (W / 2 - 0.12), 0.1, 0]);
  }
  m(box(W - 0.24, 0.03, 0.03), grey, g, [0, Y - 0.07, 0]);
  g.add(blobShadow(W * 1.25, D * 1.7, 0.75));
  return g;
}

export function chair() {
  const g = new THREE.Group();
  const dark = flat('#2a2a2e', { roughness: 0.7 }), leg = BLACK();
  m(box(0.43, 0.045, 0.43), dark, g, [0, 0.455, 0]);
  m(box(0.41, 0.34, 0.04), dark, g, [0, 0.78, -0.2], [-0.1, 0, 0]);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) m(box(0.025, 0.45, 0.025), leg, g, [sx * 0.19, 0.225, sz * 0.19]);
  for (const sx of [-1, 1]) m(box(0.025, 0.38, 0.025), leg, g, [sx * 0.19, 0.62, -0.205], [-0.1, 0, 0]);
  g.add(blobShadow(0.75, 0.75, 0.7));
  return g;
}

// Schwanenhals-Mikrofon. kind 'table' (mit Fuß für den Tisch) | 'floor' (kleiner Bodenfuß vor dem Mihrab)
export function gooseneckMic(kind = 'table') {
  const g = new THREE.Group();
  const blk = BLACK();
  if (kind === 'table') m(box(0.11, 0.022, 0.15), blk, g, [0, 0.011, 0]);
  else m(new THREE.CylinderGeometry(0.075, 0.085, 0.025, 12), blk, g, [0, 0.0125, 0]);
  const len = kind === 'table' ? 0.36 : 0.4;
  const neck = new THREE.Group();
  neck.position.set(0, 0.02, -0.03); neck.rotation.x = 0.42;
  m(new THREE.CylinderGeometry(0.006, 0.008, len, 6), blk, neck, [0, len / 2, 0]);
  m(new THREE.CylinderGeometry(0.014, 0.011, 0.07, 8), blk, neck, [0, len + 0.03, 0.006], [0.35, 0, 0]);
  g.add(neck);
  return g;
}

// Minbar aus hellem Holz: Treppe steigt zur Wand hin (-z) an, Geländer, Sitz mit Rückenlehne
export function minbar() {
  const g = new THREE.Group();
  const wood = WOOD();
  const trim = std({ color: '#c79c5d', roughness: 0.7 });
  const W = 0.82, RISE = 0.23, RUN = 0.3, N = 4;
  for (let i = 0; i < N; i++) {
    const h = (i + 1) * RISE;
    m(box(W, h, RUN), wood, g, [0, h / 2, -i * RUN - RUN / 2]);
    m(box(W + 0.04, 0.025, RUN + 0.02), trim, g, [0, h + 0.0125, -i * RUN - RUN / 2 + 0.01]);
  }
  const topY = N * RISE, platZ = -N * RUN;
  m(box(W, topY, 0.55), wood, g, [0, topY / 2, platZ - 0.275]);
  m(box(W + 0.04, 0.025, 0.57), trim, g, [0, topY + 0.0125, platZ - 0.275]);
  m(box(W + 0.04, 1.15, 0.05), wood, g, [0, topY + 0.575, platZ - 0.525]);
  m(box(W + 0.1, 0.05, 0.1), trim, g, [0, topY + 1.17, platZ - 0.52]);
  // Geländer mit Stäben
  for (const sx of [-1, 1]) {
    const x = sx * (W / 2 + 0.01);
    for (let i = 0; i <= N; i++) {
      const y0 = Math.min(i + 1, N) * RISE, z = -i * RUN - (i < N ? 0.06 : 0.3);
      m(box(0.035, 0.78, 0.035), trim, g, [x, y0 + 0.39, z]);
    }
    const len = Math.hypot(N * RUN, (N - 1) * RISE) + 0.12;
    m(box(0.05, 0.045, len), trim, g, [x, (N + 1) * RISE / 2 + 0.78 + 0.08, -N * RUN / 2 - 0.02], [Math.atan2((N - 1) * RISE, N * RUN), 0, 0]);
    m(box(0.05, 0.045, 0.3), trim, g, [x, topY + 0.8, platZ - 0.17]);
  }
  g.add(blobShadow(1.6, 2.6, 0.8));
  return g;
}

// Roll-up-Banner (steht auf der Fensterbank)
export function rollup(logo) {
  const g = new THREE.Group();
  const W = 0.8, H = 1.85;
  m(box(W + 0.06, 0.07, 0.12), METAL(), g, [0, 0.035, 0]);
  const white = std({ color: '#f4f3ef' });
  m(box(W, H, 0.006), [white, white, white, white, std({ map: rollupTexture(logo), roughness: 0.7 }), white], g, [0, 0.07 + H / 2, 0.02]);
  m(box(W + 0.02, 0.025, 0.02), METAL(), g, [0, 0.07 + H + 0.012, 0.02]);
  return g;
}

// Brauner Stapelstuhl mit Chromgestell
export function stackChair() {
  const g = new THREE.Group();
  const shell = flat('#4f3527', { roughness: 0.55 }), chrome = std({ color: '#d5d8dc', metalness: 0.9, roughness: 0.25 });
  m(box(0.44, 0.028, 0.42), shell, g, [0, 0.455, 0.01], [0.05, 0, 0]);
  m(box(0.43, 0.3, 0.028), shell, g, [0, 0.74, -0.2], [-0.2, 0, 0]);
  m(box(0.3, 0.1, 0.02), shell, g, [0, 0.55, -0.185], [-0.2, 0, 0]);
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) m(new THREE.CylinderGeometry(0.011, 0.011, 0.45, 6), chrome, g, [sx * 0.2, 0.225, sz * 0.18], [sz * 0.08, 0, 0]);
    m(new THREE.CylinderGeometry(0.011, 0.011, 0.4, 6), chrome, g, [sx * 0.2, 0.44, 0], [Math.PI / 2, 0, 0]);
  }
  g.add(blobShadow(0.8, 0.8, 0.6));
  return g;
}

export function phoneSign() {
  const g = new THREE.Group();
  const p = m(new THREE.PlaneGeometry(0.21, 0.294), std({ map: phoneSignTexture(), roughness: 0.8 }), g, [0, 0, 0.004]);
  p.castShadow = false;
  return g;
}

// Goldene Wandleuchte über dem Mihrab (strahlt nach oben)
export function wallLamp() {
  const g = new THREE.Group();
  const gold = std({ color: '#d2a84f', metalness: 0.8, roughness: 0.3, side: THREE.DoubleSide, flatShading: true });
  m(new THREE.CylinderGeometry(0.03, 0.16, 0.25, 7, 1, true, -Math.PI / 2, Math.PI), gold, g, [0, 0, 0.005]);
  m(box(0.3, 0.035, 0.05), gold, g, [0, -0.135, 0.025]);
  m(new THREE.IcosahedronGeometry(0.035, 0), gold, g, [0, 0.14, 0.03]);
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), new THREE.MeshBasicMaterial({ map: glowTexture(), color: '#ffe2ae', transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }));
  glow.position.set(0, -0.3, 0.012); glow.renderOrder = 3;
  g.add(glow);
  return g;
}

// Blauer Gebetsteppich mit goldenen Fransen (liegt flach, Fransen am vorderen Ende)
export function prayerRug() {
  const g = new THREE.Group();
  const tex = velvetTexture('#6a97cb'); tex.repeat.set(1.5, 2.6);
  const rug = m(box(0.62, 0.012, 1.12), std({ map: tex, roughness: 1 }), g, [0, 0.008, 0]);
  rug.castShadow = false;
  m(box(0.5, 0.004, 0.86), std({ color: '#5a86bb', roughness: 1 }), g, [0, 0.015, -0.04]).castShadow = false;
  const gold = flat('#d6b25c', { roughness: 0.7 });
  for (let i = 0; i < 16; i++) m(box(0.022, 0.008, 0.07), gold, g, [-0.29 + i * 0.0387, 0.006, 0.59]).castShadow = false;
  m(box(0.62, 0.01, 0.018), gold, g, [0, 0.009, 0.555]).castShadow = false;
  return g;
}

// Zweiflügelige Tür in der Rückwand; open 0..1
export function doubleDoor(w = 1.7, h = 2.15, open = 0.85) {
  const g = new THREE.Group();
  const frame = std({ color: '#efece4', roughness: 0.6 }), leaf = std({ color: '#e9e4d8', roughness: 0.6 });
  m(box(0.07, h, 0.12), frame, g, [-w / 2 - 0.035, h / 2, 0]);
  m(box(0.07, h, 0.12), frame, g, [w / 2 + 0.035, h / 2, 0]);
  m(box(w + 0.14, 0.07, 0.12), frame, g, [0, h + 0.035, 0]);
  for (const s of [-1, 1]) {
    const hinge = new THREE.Group();
    hinge.position.set(s * w / 2, 0, 0);
    hinge.rotation.y = s * open * 1.45;
    m(box(w / 2 - 0.01, h - 0.02, 0.045), leaf, hinge, [-s * w / 4, h / 2, 0]);
    m(box(w / 2 - 0.2, h * 0.36, 0.05), std({ color: '#dfe9ee', roughness: 0.3 }), hinge, [-s * w / 4, h * 0.68, 0]);
    m(box(0.02, 0.13, 0.07), METAL(), hinge, [-s * (w / 2 - 0.09), 1.02, 0]);
    g.add(hinge);
  }
  return g;
}

export function shoeRack(seed = 3) {
  const g = new THREE.Group();
  const wood = WOOD();
  const W = 1.3, H = 1.0, D = 0.32;
  for (const sx of [-1, 1]) m(box(0.03, H, D), wood, g, [sx * W / 2, H / 2, 0]);
  const r = rng(seed * 13);
  const cols = ['#2b2420', '#f0efe9', '#7b5a3c', '#30384a', '#8c8f94', '#1c1c1f'];
  for (let i = 0; i < 4; i++) {
    const y = 0.04 + i * 0.3;
    m(box(W, 0.025, D), wood, g, [0, y, 0]);
    if (i === 3) continue;
    for (let k = 0; k < 4; k++) {
      if (r() < 0.25) continue;
      const c = flat(cols[Math.floor(r() * cols.length)]);
      const x = -W / 2 + 0.2 + k * 0.3;
      m(box(0.1, 0.07, 0.25), c, g, [x - 0.06, y + 0.05, 0.01]);
      m(box(0.1, 0.07, 0.25), c, g, [x + 0.06, y + 0.05, 0.01]);
    }
  }
  return g;
}

export function socket() {
  const g = new THREE.Group();
  m(box(0.08, 0.08, 0.012), std({ color: '#f5f5f2', roughness: 0.5 }), g, [0, 0, 0.006]).castShadow = false;
  m(box(0.05, 0.05, 0.004), std({ color: '#e6e6e1' }), g, [0, 0, 0.013]).castShadow = false;
  return g;
}

export { PALETTE };
