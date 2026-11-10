// Prozedurale Texturen (Canvas) – Teppich, Fliesen/Putz, Holz, Kufi, Schrift.
import * as THREE from 'three';

export function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

function toTexture(c, { srgb = true } = {}) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function addNoise(ctx, w, h, amount, seed) {
  const r = rng(seed);
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (r() - 0.5) * 2 * amount;
    d[i] += n; d[i + 1] += n; d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

export const PALETTE = {
  carpet: '#2b9c9a',
  carpetDark: '#238a8c',
  meander: '#1b4c7c',
  skirting: '#1f8f93',
  tile: '#dcc7a6',
  tileBand: '#b3603d',
  grout: '#eadfc9',
  plaster: '#f3f1eb',
  navy: '#212242',
  gold: '#CA9E4E',
  goldLight: '#D9B26A',
  cream: '#F3E9D6',
};

// Teppich: 1 Kachel = 1,28 m x 1,28 m, ein Mäanderband pro Kachel (= eine Gebetsreihe).
export const CARPET_TILE_M = 1.28;
export function carpetTexture() {
  const S = 1024;
  const c = makeCanvas(S, S);
  const g = c.getContext('2d');
  g.fillStyle = PALETTE.carpet;
  g.fillRect(0, 0, S, S);
  // weiche Flecken (Florrichtung)
  const r = rng(7);
  for (let i = 0; i < 90; i++) {
    const x = r() * S, y = r() * S, rad = 40 + r() * 120;
    const gr = g.createRadialGradient(x, y, 0, x, y, rad);
    const dark = r() > 0.5;
    gr.addColorStop(0, dark ? 'rgba(20,110,115,0.10)' : 'rgba(90,200,195,0.08)');
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr;
    g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    // Kachel nahtlos halten
    if (x < rad) { g.translate(S, 0); g.fillRect(x - rad, y - rad, rad * 2, rad * 2); g.translate(-S, 0); }
    if (y < rad) { g.translate(0, S); g.fillRect(x - rad, y - rad, rad * 2, rad * 2); g.translate(0, -S); }
  }
  // Mäanderband
  const yTop = 437, yBot = 587, lw = 11;
  g.fillStyle = 'rgba(30,120,130,0.35)';
  g.fillRect(0, yTop, S, yBot - yTop);
  g.fillStyle = PALETTE.meander;
  g.fillRect(0, yTop, S, lw);
  g.fillRect(0, yBot - lw, S, lw);
  g.strokeStyle = PALETTE.meander;
  g.lineWidth = lw;
  g.lineJoin = 'miter';
  g.lineCap = 'butt';
  const U = 128, y0 = yTop + lw + 16, y1 = yBot - lw;
  for (let ox = 0; ox < S; ox += U) {
    g.beginPath();
    g.moveTo(ox + 14, y1);
    g.lineTo(ox + 14, y0);
    g.lineTo(ox + 108, y0);
    g.lineTo(ox + 108, y1 - 22);
    g.lineTo(ox + 42, y1 - 22);
    g.lineTo(ox + 42, y0 + 28);
    g.lineTo(ox + 80, y0 + 28);
    g.lineTo(ox + 80, y1 - 46);
    g.stroke();
  }
  addNoise(g, S, S, 9, 11);
  return toTexture(c);
}

// Wand/Säule: unten Fliesen mit rostrotem Band, oben weißer Putz.
// Die Textur deckt widthM x heightM Meter ab. UV = Meter / (widthM, heightM).
export const DADO_TOP = 1.5;
export function wallTextures({ widthM = 1.32, heightM = 3.4, tileW = 0.33, seed = 3 } = {}) {
  const px = 420;
  const W = Math.round(widthM * px), H = Math.round(heightM * px);
  const c = makeCanvas(W, H);
  const g = c.getContext('2d');
  const rc = makeCanvas(W, H);           // Rauheit
  const rg = rc.getContext('2d');
  const r = rng(seed);
  const Y = (m) => H - m * px;           // Meter über Boden -> Canvas-y

  g.fillStyle = PALETTE.plaster;
  g.fillRect(0, 0, W, H);
  rg.fillStyle = '#f0f0f0';
  rg.fillRect(0, 0, W, H);

  const rows = [[0, 0.55, false], [0.55, 1.1, false], [1.1, 1.18, true], [1.18, DADO_TOP, false]];
  for (const [a, b, band] of rows) {
    const tw = (band ? tileW / 2 : tileW) * px;
    const n = Math.round(W / tw);
    const tww = W / n;
    for (let i = 0; i < n; i++) {
      const x = i * tww, y = Y(b), h = (b - a) * px;
      const v = (r() - 0.5) * 14;
      if (band) g.fillStyle = `rgb(${179 + v},${96 + v * 0.6},${61 + v * 0.4})`;
      else g.fillStyle = `rgb(${220 + v},${199 + v},${166 + v})`;
      g.fillRect(x, y, tww, h);
      if (!band) {
        // Marmorierung
        g.save();
        g.beginPath(); g.rect(x, y, tww, h); g.clip();
        for (let k = 0; k < 5; k++) {
          g.strokeStyle = r() > 0.5 ? 'rgba(255,246,228,0.16)' : 'rgba(176,150,112,0.12)';
          g.lineWidth = 3 + r() * 16;
          g.beginPath();
          let vx = x + r() * tww, vy = y - 10;
          g.moveTo(vx, vy);
          while (vy < y + h + 10) {
            vx += (r() - 0.5) * 60; vy += 20 + r() * 40;
            g.lineTo(vx, vy);
          }
          g.stroke();
        }
        g.restore();
      }
      // Fuge
      g.strokeStyle = band ? 'rgba(120,60,36,0.9)' : PALETTE.grout;
      g.lineWidth = 3;
      g.strokeRect(x + 0.5, y + 0.5, tww - 1, h - 1);
    }
    rg.fillStyle = '#4a4a4a';
    rg.fillRect(0, Y(b), W, (b - a) * px);
  }
  // Abschlusskante der Fliesen
  g.fillStyle = 'rgba(150,130,100,0.55)';
  g.fillRect(0, Y(DADO_TOP) - 2, W, 4);
  // eingebackene Schatten: Boden und Decke
  let gr = g.createLinearGradient(0, H, 0, H - 0.35 * px);
  gr.addColorStop(0, 'rgba(40,50,60,0.30)'); gr.addColorStop(1, 'rgba(40,50,60,0)');
  g.fillStyle = gr; g.fillRect(0, H - 0.35 * px, W, 0.35 * px);
  gr = g.createLinearGradient(0, 0, 0, 0.5 * px);
  gr.addColorStop(0, 'rgba(60,60,70,0.22)'); gr.addColorStop(1, 'rgba(60,60,70,0)');
  g.fillStyle = gr; g.fillRect(0, 0, W, 0.5 * px);
  addNoise(g, W, H, 5, seed + 1);

  return { map: toTexture(c), roughnessMap: toTexture(rc, { srgb: false }), widthM, heightM };
}

export function woodTexture({ base = '#d7b27a', dark = '#b98a4e', seed = 5 } = {}) {
  const S = 512;
  const c = makeCanvas(S, S);
  const g = c.getContext('2d');
  g.fillStyle = base; g.fillRect(0, 0, S, S);
  const r = rng(seed);
  for (let i = 0; i < 120; i++) {
    g.strokeStyle = r() > 0.5 ? dark : '#e6c794';
    g.globalAlpha = 0.12 + r() * 0.2;
    g.lineWidth = 1 + r() * 4;
    const y = r() * S;
    g.beginPath(); g.moveTo(0, y);
    g.bezierCurveTo(S * 0.3, y + (r() - 0.5) * 30, S * 0.6, y + (r() - 0.5) * 30, S, y);
    g.stroke();
  }
  g.globalAlpha = 1;
  addNoise(g, S, S, 6, seed + 1);
  return toTexture(c);
}

// Gehäkelte Kufi: feines Lochmuster in Reihen
export function kufiTexture() {
  const S = 256;
  const c = makeCanvas(S, S);
  const g = c.getContext('2d');
  g.fillStyle = '#f7f5ef'; g.fillRect(0, 0, S, S);
  const step = 32;
  for (let y = 0; y < S; y += step) {
    for (let x = 0; x < S; x += step) {
      const off = (y / step) % 2 ? step / 2 : 0;
      g.fillStyle = 'rgba(168,163,152,0.85)';
      g.beginPath(); g.arc(x + off + step / 2, y + step / 2, 5.5, 0, Math.PI * 2); g.fill();
      g.fillStyle = 'rgba(255,255,255,0.9)';
      g.beginPath(); g.arc(x + off + step / 2 - 1.5, y + step / 2 + 2, 3, 0, Math.PI * 2); g.fill();
    }
    g.fillStyle = 'rgba(205,200,190,0.55)';
    g.fillRect(0, y, S, 2);
  }
  return toTexture(c);
}

// Tafel mit arabischer Schrift (echte Schrift, korrekt verbunden, RTL)
export function calligraphyTexture(text = 'لا إله إلا الله محمد رسول الله') {
  const W = 1024, H = 220;
  const c = makeCanvas(W, H);
  const g = c.getContext('2d');
  g.fillStyle = '#16130f'; g.fillRect(0, 0, W, H);
  const gr = g.createLinearGradient(0, 0, 0, H);
  gr.addColorStop(0, '#e7c98a'); gr.addColorStop(0.5, '#caa052'); gr.addColorStop(1, '#a37b34');
  g.strokeStyle = gr; g.lineWidth = 14; g.strokeRect(9, 9, W - 18, H - 18);
  g.fillStyle = gr;
  g.direction = 'rtl';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = '700 118px "Amiri"';
  g.fillText(text, W / 2, H / 2 + 4);
  const t = toTexture(c);
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

// Weicher Lichtschein (ersetzt Bloom): heller Kern, läuft nach außen transparent aus
export function glowTexture() {
  const S = 256;
  const c = makeCanvas(S, S);
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.35, 'rgba(255,255,255,0.55)');
  gr.addColorStop(0.7, 'rgba(255,255,255,0.14)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, S, S);
  const t = toTexture(c);
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

// Weicher Kontaktschatten unter Figuren und Gegenständen (ersetzt Ambient Occlusion)
let _blob = null;
export function blobShadowTexture() {
  if (_blob) return _blob;
  const S = 256;
  const c = makeCanvas(S, S);
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  gr.addColorStop(0, 'rgba(8,40,48,0.62)');
  gr.addColorStop(0.45, 'rgba(8,40,48,0.36)');
  gr.addColorStop(1, 'rgba(8,40,48,0)');
  g.fillStyle = gr; g.fillRect(0, 0, S, S);
  _blob = toTexture(c);
  _blob.wrapS = _blob.wrapT = THREE.ClampToEdgeWrapping;
  return _blob;
}
export function blobShadow(w, d, opacity = 1) {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, d),
    new THREE.MeshBasicMaterial({ map: blobShadowTexture(), transparent: true, depthWrite: false, opacity, toneMapped: false }),
  );
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.006;
  m.renderOrder = 2;
  return m;
}
