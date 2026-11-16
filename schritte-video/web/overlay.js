// Einblendungen für „Jeder Schritt zählt“: Handy-Display, zwei Zähler, Karten, Untertitel, Titel, Beschriftungen, Logo.
// Nutzt den Baukasten des Gebet-Videos (nur lesen): /web/lib/overlay.js (Untertitel, Titel, Karten im gleichen Stil).
// window.zeichne(zustand) malt eine Ebene (durchsichtig) auf 1080 × 1920; window.bild() gibt sie als PNG zurück.
import { drawSubtitles, drawTitle, drawCard, subtitleY, TEXT } from '/web/lib/overlay.js';
import { CARDS } from '/s/web/cards.js';

const W = 1080, H = 1920;
const NAVY = '#212242', GOLD = '#CA9E4E', GOLD_L = '#D9B26A', CREAM = '#F3E9D6';
const c = document.getElementById('c');
const g = c.getContext('2d');
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const ease = (x) => { x = clamp01(x); return x * x * (3 - 2 * x); };
const fmt = (n) => Math.round(n).toLocaleString('de-DE');

function rr(x, y, w, h, r) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}

// Sohlen-Symbol (schlicht, keine Zehenpunkte – nichts Gesichtsähnliches)
function sohle(cx, cy, s, farbe, rot = 0) {
  g.save(); g.translate(cx, cy); g.rotate(rot); g.scale(s, s);
  g.beginPath();
  g.moveTo(0, -60); g.bezierCurveTo(26, -60, 30, -28, 26, -6); g.bezierCurveTo(22, 14, 16, 22, 17, 38);
  g.bezierCurveTo(18, 56, 8, 62, 0, 62); g.bezierCurveTo(-10, 62, -18, 54, -16, 38); g.bezierCurveTo(-14, 22, -24, 12, -26, -8);
  g.bezierCurveTo(-28, -32, -22, -60, 0, -60); g.closePath();
  g.fillStyle = farbe; g.fill(); g.restore();
}

let logo = null;
const logoReady = new Promise((res) => { logo = new Image(); logo.onload = res; logo.onerror = res; logo.src = '/assets/brand/logo-horizontal-weiss.svg'; });

function zeichneLogo(a = 1) {
  if (!logo || !logo.width) return;
  const h = 70, w = h * logo.width / logo.height;
  g.save(); g.globalAlpha = 0.9 * a; g.shadowColor = 'rgba(0,0,0,0.45)'; g.shadowBlur = 10;
  g.drawImage(logo, (TEXT.left + TEXT.right) / 2 - w / 2, 262, w, h); g.restore();
}

// ---- S1: Handy-Display bildschirmfüllend (eigenes Design, keine echte App)
function display({ schritte = 0, ring = 0, zeile = 0, zeileA = 1 }) {
  const bg = g.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#2a2c55'); bg.addColorStop(1, '#14152c');
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  const cx = 500, cy = 980, r = 270;
  g.lineCap = 'round';
  g.lineWidth = 34; g.strokeStyle = 'rgba(255,255,255,0.08)';
  g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.stroke();
  const gr = g.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  gr.addColorStop(0, '#E8CC8E'); gr.addColorStop(1, GOLD);
  g.strokeStyle = gr;
  g.beginPath(); g.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamp01(ring)); g.stroke();
  sohle(cx - 26, cy - 150, 0.55, GOLD_L, -0.15); sohle(cx + 26, cy - 128, 0.55, 'rgba(255,255,255,0.85)', 0.15);
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = '#ffffff'; g.font = '900 150px "Cairo"'; g.fillText(fmt(schritte), cx, cy + 20);
  g.fillStyle = 'rgba(243,233,214,0.75)'; g.font = '700 40px "Montserrat"'; g.fillText('Schritte heute', cx, cy + 120);
  // Wochenbalken
  const hs = [0.55, 0.8, 0.45, 0.95, 0.7, 0.6, clamp01(ring)];
  hs.forEach((h, i) => {
    const x = 250 + i * 84, top = 1440 - 150 * h;
    rr(x, top, 46, 1440 - top, 14); g.fillStyle = i === 6 ? GOLD : 'rgba(255,255,255,0.18)'; g.fill();
  });
  g.fillStyle = 'rgba(255,255,255,0.45)'; g.font = '700 26px "Montserrat"';
  ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].forEach((d, i) => g.fillText(d, 273 + i * 84, 1478));
  const lines = zeile === 0 ? ['Dein Handy zählt', 'jeden Schritt.'] : ['Aber manche Schritte', 'werden anders gezählt.'];
  g.globalAlpha = zeileA;
  drawTitle(g, W, H, 5, lines, { t0: 0, t1: 99, y: 470, style: 'b', size: 80 });
  g.globalAlpha = 1;
}

// ---- Zwei Zähler im oberen Drittel
function zaehler({ s = 0, r = 0, blitz = null, a = 1, y = 380 }) {
  g.save(); g.globalAlpha = a;
  const felder = [['Sünden getilgt', s, GOLD, 'sunde'], ['Rangstufen erhöht', r, '#ffffff', 'rang']];
  felder.forEach(([label, n, farbe, key], i) => {
    const x = 120 + i * 390, w = 370, h = 210;
    g.shadowColor = 'rgba(0,0,0,0.35)'; g.shadowBlur = 24; g.shadowOffsetY = 8;
    rr(x, y, w, h, 28); g.fillStyle = 'rgba(33,34,66,0.9)'; g.fill();
    g.shadowColor = 'transparent';
    const glow = blitz && blitz.feld === key ? clamp01(1 - blitz.alter / 0.45) : 0;
    g.lineWidth = 4 + 6 * glow; g.strokeStyle = glow ? (i === 0 ? '#ffd98a' : '#ffffff') : (i === 0 ? GOLD : 'rgba(255,255,255,0.55)'); g.stroke();
    if (glow) { g.save(); g.globalAlpha = 0.35 * glow * a; rr(x, y, w, h, 28); g.fillStyle = i === 0 ? GOLD : '#ffffff'; g.fill(); g.restore(); }
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = farbe; g.font = `900 ${Math.round(104 * (1 + 0.12 * glow))}px "Cairo"`; g.fillText(String(n), x + w / 2, y + 88);
    g.fillStyle = CREAM; g.font = '700 32px "Montserrat"'; g.fillText(label, x + w / 2, y + 168);
  });
  g.restore();
}

// ---- S8: Handy in der Hand (Grafik): alter Zähler und daneben die neuen Zähler
function handyKarte({ alt = 8432, s = 0, r = 1, a = 1 }) {
  g.save(); g.globalAlpha = a;
  const x = 230, y = 520, w = 540, h = 900;
  g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 40; g.shadowOffsetY = 16;
  rr(x - 16, y - 16, w + 32, h + 32, 70); g.fillStyle = '#17181c'; g.fill();
  g.shadowColor = 'transparent';
  const bg = g.createLinearGradient(0, y, 0, y + h); bg.addColorStop(0, '#2a2c55'); bg.addColorStop(1, '#14152c');
  rr(x, y, w, h, 56); g.fillStyle = bg; g.fill();
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = 'rgba(243,233,214,0.7)'; g.font = '700 30px "Montserrat"'; g.fillText('Schritte heute', x + w / 2, y + 120);
  g.fillStyle = '#ffffff'; g.font = '900 120px "Cairo"'; g.fillText(fmt(alt), x + w / 2, y + 220);
  g.strokeStyle = 'rgba(255,255,255,0.15)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x + 50, y + 330); g.lineTo(x + w - 50, y + 330); g.stroke();
  g.fillStyle = GOLD_L; g.font = '700 30px "Montserrat"'; g.fillText('Schritte zur Moschee', x + w / 2, y + 400);
  [['Sünden getilgt', s, GOLD], ['Rangstufen erhöht', r, '#ffffff']].forEach(([label, n, f], i) => {
    const bx = x + 40 + i * 240, by = y + 460;
    rr(bx, by, 220, 230, 26); g.fillStyle = 'rgba(255,255,255,0.06)'; g.fill();
    g.lineWidth = 3; g.strokeStyle = i === 0 ? GOLD : 'rgba(255,255,255,0.5)'; g.stroke();
    g.fillStyle = f; g.font = '900 96px "Cairo"'; g.fillText(String(n), bx + 110, by + 95);
    g.fillStyle = CREAM; g.font = '700 22px "Montserrat"';
    label.split(' ').forEach((ln, k) => g.fillText(ln, bx + 110, by + 170 + k * 28));
  });
  sohle(x + w / 2 - 22, y + 790, 0.5, GOLD_L, -0.15); sohle(x + w / 2 + 22, y + 810, 0.5, 'rgba(255,255,255,0.85)', 0.15);
  g.restore();
}

// ---- Beschriftungen (Gebetsnamen), Wudu-Symbol
function schild(text, x, y, a = 1) {
  g.save(); g.globalAlpha = a;
  g.font = '800 40px "Montserrat"'; const w = g.measureText(text).width + 44;
  x = Math.max(TEXT.left + w / 2, Math.min(TEXT.right - w / 2, x));
  y = Math.max(300, Math.min(1500, y));
  g.shadowColor = 'rgba(0,0,0,0.4)'; g.shadowBlur = 16;
  rr(x - w / 2, y - 34, w, 68, 34); g.fillStyle = NAVY; g.fill();
  g.shadowColor = 'transparent'; g.lineWidth = 4; g.strokeStyle = GOLD; g.stroke();
  g.fillStyle = '#ffffff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, x, y + 2);
  g.restore();
}
function wudu(a = 1, y = 1150) {
  g.save(); g.globalAlpha = a;
  const cx = 500;
  g.beginPath(); g.moveTo(cx, y - 110); g.bezierCurveTo(cx + 20, y - 60, cx + 70, y - 20, cx + 70, y + 30);
  g.arc(cx, y + 30, 70, 0, Math.PI); g.bezierCurveTo(cx - 70, y - 20, cx - 20, y - 60, cx, y - 110); g.closePath();
  const gr = g.createLinearGradient(0, y - 110, 0, y + 100); gr.addColorStop(0, '#9fe3f0'); gr.addColorStop(1, '#2b9c9a');
  g.fillStyle = gr; g.shadowColor = 'rgba(0,0,0,0.35)'; g.shadowBlur = 20; g.fill();
  g.shadowColor = 'transparent';
  g.restore();
  g.save(); g.globalAlpha = a;
  drawTitle(g, W, H, 5, ['Wudu zu Hause'], { t0: 0, t1: 99, y: y + 170, style: 'b', size: 72 });
  g.restore();
}

// Untertitel aus einem Satz: letzte Gruppe (≤ 3 Wörter), letztes Wort betont – für Standbilder
function untertitelStill(text, y) {
  const ws = text.split(/\s+/);
  const words = ws.map((w, k) => ({ w, t0: k === ws.length - 1 ? 0 : 9, t1: 1 }));
  drawSubtitles(g, W, H, 0.5, [{ t0: 0, t1: 1, words }], { style: 'b', y });
}

const SCHRIFTEN = ['900 84px "Cairo"', '500 34px "Montserrat"', '700 34px "Montserrat"', '800 34px "Montserrat"', '400 42px "Amiri"', '700 42px "Amiri"'];
const schriftenGeladen = Promise.all(SCHRIFTEN.map((f) => document.fonts.load(f, 'Aaß')));
window.zeichne = async (z) => {
  await logoReady;
  await schriftenGeladen;
  await document.fonts.ready;
  g.clearRect(0, 0, W, H);
  if (z.display) display(z.display);
  if (z.logo) zeichneLogo(z.logo);
  if (z.zaehler) zaehler(z.zaehler);
  if (z.handy) handyKarte(z.handy);
  (z.schilder || []).forEach((s) => schild(s.text, s.xy[0], s.xy[1], s.a ?? 1));
  if (z.wudu) wudu(z.wudu, z.wuduY || 1150);
  let card = null;
  if (z.karte) card = drawCard(g, 5, CARDS[z.karte], { t0: 0, t1: 99 });
  if (z.titel) drawTitle(g, W, H, 5, z.titel, { t0: 0, t1: 99, y: z.titelY || 900, style: 'b', size: 84 });
  if (z.fuss) { g.save(); g.font = '700 30px "Montserrat"'; g.fillStyle = 'rgba(255,255,255,0.85)'; g.textAlign = 'center'; g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 10; g.fillText(z.fuss, 500, 1440); g.restore(); }
  // steht oben ein Zähler und unten eine Karte, rückt der Untertitel unter die Karte (über den unteren 20 %)
  if (z.untertitel) untertitelStill(z.untertitel, z.untertitelY || (card && z.zaehler ? 1450 : subtitleY(card)));
  return true;
};
window.bild = () => c.toDataURL('image/png');
window.bereit = true;
