// Eigene Grafiken für „Zwischen Adhan und Iqama“ (Canvas 2D, Maße in 1080 × 1920 gedacht):
// Handy-Display (abstrakte Kacheln, keine App-Namen, Logos, Gesichter oder Emojis), Zeitbalken „IQAMA IN mm:ss“,
// Bildschirmzeit-Karte, goldene Schrift, Wörter, Beschriftungen. Stil und Schriften wie im Gebet-Video.
import { drawTitle, TEXT } from '/web/lib/overlay.js';

export const NAVY = '#212242', GOLD = '#CA9E4E', GOLD_L = '#D9B26A', CREAM = '#F3E9D6';
const clamp01 = (x) => Math.max(0, Math.min(1, x));
export const ease = (x) => { x = clamp01(x); return x * x * (3 - 2 * x); };
const CX = (TEXT.left + TEXT.right) / 2;

export function rr(g, x, y, w, h, r) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}

// ---- Handy-Display: senkrechte Liste abstrakter Kacheln, die nach oben scrollen. dunkel = 0..1 (Display geht aus)
const KACHELN = [
  ['#3d4a7a', 0.62], ['#7a5a8c', 0.42], ['#2f6f73', 0.55], ['#8c6a3d', 0.38], ['#4f5f91', 0.6], ['#6c4a5a', 0.45],
  ['#2e5a86', 0.5], ['#7d7340', 0.4], ['#5a3f7a', 0.58], ['#356b55', 0.44],
];
export function display(g, w, h, { scroll = 0, dunkel = 0 } = {}) {
  g.save();
  g.fillStyle = '#14152c'; g.fillRect(0, 0, w, h);
  const u = w / 100;
  // Statusleiste (nur Formen, keine Symbole mit Gesichtswirkung)
  g.fillStyle = 'rgba(255,255,255,0.55)';
  rr(g, 6 * u, 3 * u, 14 * u, 2.6 * u, 1.3 * u); g.fill();
  rr(g, 76 * u, 3 * u, 18 * u, 2.6 * u, 1.3 * u); g.fill();
  // Kacheln
  g.save(); g.beginPath(); g.rect(0, 9 * u, w, h - 9 * u); g.clip();
  let y = 11 * u - (scroll % 1) * 0;
  const total = KACHELN.reduce((a, [, hh]) => a + hh * 100 * u + 4 * u, 0);
  y = 11 * u - ((scroll * 60 * u) % total);
  for (let k = 0; k < 2; k++) {
    for (const [farbe, hh] of KACHELN) {
      const kh = hh * 100 * u;
      rr(g, 5 * u, y, 90 * u, kh, 4 * u); g.fillStyle = farbe; g.fill();
      // abstrakte Inhalte: weiche Fläche + zwei Zeilen
      g.fillStyle = 'rgba(255,255,255,0.14)'; rr(g, 10 * u, y + 5 * u, 80 * u, kh * 0.55, 3 * u); g.fill();
      g.fillStyle = 'rgba(255,255,255,0.5)'; rr(g, 10 * u, y + kh * 0.55 + 9 * u, 52 * u, 3 * u, 1.5 * u); g.fill();
      g.fillStyle = 'rgba(255,255,255,0.28)'; rr(g, 10 * u, y + kh * 0.55 + 15 * u, 34 * u, 3 * u, 1.5 * u); g.fill();
      y += kh + 4 * u;
    }
  }
  g.restore();
  if (dunkel > 0) { g.fillStyle = `rgba(4,4,10,${clamp01(dunkel)})`; g.fillRect(0, 0, w, h); }
  g.restore();
}

// ---- Zeitbalken „IQAMA IN mm:ss“ oben im Bild. rest = Sekunden (600 … 0), gold = 0..1 (wird zum Licht)
export function zeitbalken(g, { rest = 600, gold = 0, a = 1, y = 330 } = {}) {
  const w = 600, h = 96, x = CX - w / 2;
  g.save(); g.globalAlpha = a;
  g.shadowColor = 'rgba(0,0,0,0.35)'; g.shadowBlur = 22; g.shadowOffsetY = 8;
  rr(g, x, y, w, h, h / 2);
  g.fillStyle = gold > 0 ? mischen('#212242', '#CA9E4E', gold) : 'rgba(33,34,66,0.92)'; g.fill();
  g.shadowColor = 'transparent';
  g.lineWidth = 4; g.strokeStyle = gold > 0 ? mischen(GOLD, '#fff3d6', gold) : GOLD; g.stroke();
  // Fortschritt (Rest der Wartezeit)
  const k = clamp01(rest / 600);
  g.save(); rr(g, x + 10, y + h - 20, w - 20, 10, 5); g.clip();
  g.fillStyle = 'rgba(255,255,255,0.15)'; g.fillRect(x + 10, y + h - 20, w - 20, 10);
  g.fillStyle = gold > 0 ? '#fff3d6' : GOLD; g.fillRect(x + 10, y + h - 20, (w - 20) * k, 10);
  g.restore();
  const mm = Math.floor(Math.max(0, rest) / 60), ss = Math.floor(Math.max(0, rest) % 60);
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = '800 30px "Montserrat"'; g.fillStyle = gold > 0.5 ? NAVY : CREAM;
  g.fillText('IQAMA IN', CX - 95, y + 40);
  g.font = '900 52px "Cairo"'; g.fillStyle = gold > 0.5 ? NAVY : '#ffffff';
  g.fillText(`${mm}:${String(ss).padStart(2, '0')}`, CX + 120, y + 40);
  g.restore();
  if (gold > 0) {                                      // Leuchten um den goldenen Balken
    g.save(); g.globalAlpha = a * gold * 0.6; g.globalCompositeOperation = 'lighter';
    const rg = g.createRadialGradient(CX, y + h / 2, 10, CX, y + h / 2, 420);
    rg.addColorStop(0, 'rgba(255,214,140,0.55)'); rg.addColorStop(1, 'rgba(255,214,140,0)');
    g.fillStyle = rg; g.fillRect(CX - 440, y - 300, 880, 700);
    g.restore();
  }
}

function mischen(a, b, k) {
  const p = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * clamp01(k))).join(',')})`;
}

// ---- Bildschirmzeit-Karte (S9): eigenes Design, keine echte App
export function bildschirmzeit(g, { minuten = 47, a = 1 } = {}) {
  const x = 230, y = 520, w = 540, h = 860;
  g.save(); g.globalAlpha = a;
  g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 40; g.shadowOffsetY = 16;
  rr(g, x - 16, y - 16, w + 32, h + 32, 70); g.fillStyle = '#17181c'; g.fill();
  g.shadowColor = 'transparent';
  const bg = g.createLinearGradient(0, y, 0, y + h); bg.addColorStop(0, '#2a2c55'); bg.addColorStop(1, '#14152c');
  rr(g, x, y, w, h, 56); g.fillStyle = bg; g.fill();
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = 'rgba(243,233,214,0.75)'; g.font = '700 32px "Montserrat"'; g.fillText('Bildschirmzeit', x + w / 2, y + 110);
  g.fillStyle = '#ffffff'; g.font = '900 104px "Cairo"'; g.fillText(`${minuten} Min.`, x + w / 2, y + 215);
  g.fillStyle = GOLD_L; g.font = '700 30px "Montserrat"'; g.fillText('heute', x + w / 2, y + 300);
  // Balken über den Tag, fünf hervorgehoben (Wartezeiten vor den Gebeten)
  const hs = [0.2, 0.15, 0.55, 0.3, 0.25, 0.6, 0.35, 0.5, 0.3, 0.65, 0.4, 0.7];
  hs.forEach((v, i) => {
    const bx = x + 50 + i * 37, top = y + 640 - 230 * v;
    rr(g, bx, top, 24, y + 640 - top, 8); g.fillStyle = [2, 5, 7, 9, 11].includes(i) ? GOLD : 'rgba(255,255,255,0.2)'; g.fill();
  });
  g.fillStyle = 'rgba(255,255,255,0.45)'; g.font = '700 24px "Montserrat"';
  ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].forEach((n, k) => g.fillText(n, x + 62 + [2, 5, 7, 9, 11][k] * 37, y + 680 + (k % 2) * 30));
  g.fillStyle = 'rgba(243,233,214,0.7)'; g.font = '500 26px "Montserrat"';
  g.fillText('davon in der Wartezeit vor dem Gebet', x + w / 2, y + 790);
  g.restore();
}

// ---- goldene, dezente Schrift (S8) und einzelne Wörter (S10)
export function goldSchrift(g, text, { y = 640, a = 1, size = 64 } = {}) {
  g.save(); g.globalAlpha = a;
  g.font = `900 ${size}px "Cairo"`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.shadowColor = 'rgba(255,200,120,0.7)'; g.shadowBlur = 26;
  const gr = g.createLinearGradient(0, y - size / 2, 0, y + size / 2);
  gr.addColorStop(0, '#F3DCA4'); gr.addColorStop(1, GOLD);
  g.fillStyle = gr; g.fillText(text, CX, y);
  g.restore();
}
export function worte(g, liste, { y = 620, a = [1, 1, 1] } = {}) {
  liste.forEach((wort, i) => { if (a[i] > 0) drawTitle(g, 1080, 1920, 5, [wort], { t0: 0, t1: 99, y: y + i * 105, style: 'b', size: 72 }); });
}
export function beschriftung(g, text, x, y, a = 1) {
  g.save(); g.globalAlpha = a;
  g.font = '800 36px "Montserrat"'; const w = g.measureText(text).width + 40;
  x = Math.max(TEXT.left + w / 2, Math.min(TEXT.right - w / 2, x));
  g.shadowColor = 'rgba(0,0,0,0.4)'; g.shadowBlur = 14;
  rr(g, x - w / 2, y - 30, w, 60, 30); g.fillStyle = NAVY; g.fill();
  g.shadowColor = 'transparent'; g.lineWidth = 4; g.strokeStyle = GOLD; g.stroke();
  g.fillStyle = '#ffffff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, x, y + 2);
  g.restore();
}

// ---- Logo klein oben (außerhalb der Bedienflächen)
let logo = null;
export const logoBereit = new Promise((res) => { logo = new Image(); logo.onload = res; logo.onerror = res; logo.src = '/assets/brand/logo-horizontal-weiss.svg'; });
export function zeichneLogo(g, a = 1) {
  if (!logo || !logo.width) return;
  const h = 62, w = h * logo.width / logo.height;
  g.save(); g.globalAlpha = 0.9 * a; g.shadowColor = 'rgba(0,0,0,0.45)'; g.shadowBlur = 10;
  g.drawImage(logo, CX - w / 2, 254, w, h); g.restore();
}
