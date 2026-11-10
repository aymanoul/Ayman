// 2D-Einblendungen (Titel, Wort-für-Wort-Untertitel, Hilfslinien für sichere Bereiche).
export const SAFE = { top: 250, bottom: 420, right: 160 };
export const SUB_STYLES = {
  a: { font: '800 96px "Baloo 2"', color: '#ffffff', accent: '#FFE033', stroke: '#141414', strokeW: 16 },
  b: { font: '800 80px "Montserrat"', color: '#ffffff', accent: '#D9B26A', stroke: '#212242', strokeW: 16 },
};

const easeOutBack = (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
const clamp01 = (x) => Math.max(0, Math.min(1, x));

function strokeFill(g, text, x, y, fill, stroke, lw) {
  g.lineJoin = 'round';
  g.lineWidth = lw;
  g.strokeStyle = stroke;
  g.shadowColor = 'rgba(0,0,0,0.45)';
  g.shadowBlur = 14; g.shadowOffsetY = 6;
  g.strokeText(text, x, y);
  g.shadowColor = 'transparent'; g.shadowBlur = 0; g.shadowOffsetY = 0;
  g.fillStyle = fill;
  g.fillText(text, x, y);
}

// Textbereich: links 120 px, rechts 200 px frei (App-Knöpfe rechts, Rand links) → Mitte x = 500, Breite max. 760
export const TEXT = { left: 120, right: 880, subY: 1180, titleY: 470 };
const CX = (TEXT.left + TEXT.right) / 2;
const MAXW = TEXT.right - TEXT.left;
const HONOR = /^[ﷺﷻ]$/;            // ﷺ ﷻ werden mit Amiri gesetzt

// Untertitel Wort für Wort. groups: [{t0, t1, words: [{w, t0, t1}]}], 1–3 Wörter pro Gruppe.
export function drawSubtitles(g, W, H, t, groups, { style = 'a', y = TEXT.subY } = {}) {
  const st = SUB_STYLES[style];
  const grp = groups.find((gr) => t >= gr.t0 && t < gr.t1);
  if (!grp) return;
  g.save();
  g.textBaseline = 'middle';
  g.textAlign = 'left';
  const size = parseInt(st.font.match(/(\d+)px/)[1], 10);
  const fontOf = (w) => (HONOR.test(w) ? `400 ${Math.round(size * 1.15)}px "Amiri"` : st.font);
  const gap = 24;
  const widths = grp.words.map((w) => { g.font = fontOf(w.w); return g.measureText(w.w).width; });
  const total = widths.reduce((a, b) => a + b, 0) + gap * (grp.words.length - 1);
  const fit = Math.min(1, MAXW / total);
  const pop = easeOutBack(clamp01((t - grp.t0) / 0.14));
  g.translate(CX, y);
  g.scale(fit * (0.82 + 0.18 * pop), fit * (0.82 + 0.18 * pop));
  let x = -total / 2;
  grp.words.forEach((w, i) => {
    const active = t >= w.t0 && t < w.t1;
    g.font = fontOf(w.w);
    strokeFill(g, w.w, x, HONOR.test(w.w) ? size * 0.08 : 0, active ? st.accent : st.color, st.stroke, st.strokeW);
    x += widths[i] + gap;
  });
  g.restore();
}

// Großer Text (Hook oben, Schlusssatz in der Mitte) im Stil der Untertitel
export function drawTitle(g, W, H, t, lines, { t0 = 0, t1 = 4, y = 330, style = 'a', size = 86 } = {}) {
  if (t < t0 || t > t1) return;
  const st = SUB_STYLES[style];
  const a = clamp01((t - t0) / 0.25) * clamp01((t1 - t) / 0.3);
  const pop = easeOutBack(clamp01((t - t0) / 0.3));
  g.save();
  g.globalAlpha = a;
  g.font = st.font.replace(/\d+px/, size + 'px');
  g.textAlign = 'center'; g.textBaseline = 'middle';
  const fit = Math.min(1, MAXW / Math.max(...lines.map((l) => g.measureText(l).width)));
  g.translate(CX, y); g.scale(fit * (0.85 + 0.15 * pop), fit * (0.85 + 0.15 * pop));
  lines.forEach((ln, i) => strokeFill(g, ln, 0, (i - (lines.length - 1) / 2) * size * 1.12, '#ffffff', st.stroke, st.strokeW));
  g.restore();
}

// ------------------------------------------------------------------ Beweis-Karten
export const CARD_STYLES = {
  // Quran-Text von quranenc.com ist KFGQPC-kodiert → nur mit der offiziellen KFGQPC-Schrift korrekt (Tanwīn-Varianten)
  quran: { label: 'QURAN', border: '#D9B26A', pill: ['#CA9E4E', '#D9B26A'], pillText: '#212242', ar: '"KFGQPC Hafs"', arSize: 52, arGold: true },
  hadith: { label: 'HADITH', border: '#2b9c9a', pill: ['#23898a', '#3fb3b0'], pillText: '#ffffff', ar: '"Amiri"', arSize: 42, arGold: false },
};
// Karte: 780 px breit (x 110–890), Unterkante 560 px über dem Bildrand (Beschreibung und Knöpfe bleiben frei)
const CARD = { x: 110, w: 780, bottom: 1360, pad: 34 };

function wrap(g, text, maxW) {
  const out = []; let line = '';
  for (const word of text.split(/\s+/)) {
    const test = line ? line + ' ' + word : word;
    if (g.measureText(test).width > maxW && line) { out.push(line); line = word; } else line = test;
  }
  if (line) out.push(line);
  return out;
}
function roundRect(g, x, y, w, h, r) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}

// card: { kind: 'quran'|'hadith', ar?, de, src }. Gibt { top, show } zurück (Oberkante, Sichtbarkeit 0..1) oder null.
// ʾ und ʿ fehlen in Montserrat → typografische Apostrophe (nur in Quellenangaben, nie im Zitat)
const latin = (x) => x.replace(/\u02BE/g, '\u2019').replace(/\u02BF/g, '\u2018');
export function drawCard(g, t, card, { t0, t1 }) {
  if (!card || t < t0 || t > t1) return null;
  card = { ...card, src: latin(card.src) };
  const st = CARD_STYLES[card.kind];
  const inner = CARD.w - 2 * CARD.pad;
  // Maße
  g.save();
  g.font = `500 34px "Montserrat"`;
  const deLines = wrap(g, card.de, inner);
  g.font = `400 ${st.arSize}px ${st.ar}`;
  g.direction = 'rtl';
  // Zeilenumbruch: \n trennt Verse (statt Verszeichen), Anführungszeichen gehören nicht in die arabische Zeile
  const arLines = card.ar ? card.ar.replace(/[«»]/g, '').split('\n').flatMap((l) => wrap(g, l.trim(), inner)) : [];
  g.direction = 'ltr';
  g.font = `700 25px "Montserrat"`;
  const srcLines = wrap(g, card.src, inner);
  const arLH = st.arSize * 1.75, deLH = 45, srcLH = 33;
  const h = CARD.pad + 46 + 26 + arLines.length * arLH + (arLines.length ? 14 : 0) + deLines.length * deLH + 18 + srcLines.length * srcLH + CARD.pad - 10;
  const top = CARD.bottom - h;
  // Animation: weich hinein (von unten, leicht überschwingend), weich hinaus
  const kin = easeOutBack(clamp01((t - t0) / 0.38));
  const kout = clamp01((t1 - t) / 0.3);
  const dy = (1 - kin) * 90 + (1 - kout) * 40;
  g.globalAlpha = clamp01((t - t0) / 0.2) * kout;
  g.translate(0, dy);
  // Feld
  g.shadowColor = 'rgba(0,0,0,0.35)'; g.shadowBlur = 30; g.shadowOffsetY = 10;
  roundRect(g, CARD.x, top, CARD.w, h, 28);
  g.fillStyle = 'rgba(33,34,66,0.88)'; g.fill();
  g.shadowColor = 'transparent';
  g.lineWidth = 4; g.strokeStyle = st.border; g.stroke();
  // Etikett
  g.font = `800 26px "Montserrat"`;
  const pw = g.measureText(st.label).width + 44;
  const pg = g.createLinearGradient(CARD.x + CARD.pad, 0, CARD.x + CARD.pad + pw, 0);
  pg.addColorStop(0, st.pill[0]); pg.addColorStop(1, st.pill[1]);
  roundRect(g, CARD.x + CARD.pad, top + CARD.pad - 6, pw, 46, 23);
  g.fillStyle = pg; g.fill();
  g.fillStyle = st.pillText; g.textBaseline = 'middle'; g.textAlign = 'left';
  g.fillText(st.label, CARD.x + CARD.pad + 22, top + CARD.pad + 17);
  let y = top + CARD.pad + 46 + 26;
  // Arabisch (von rechts nach links, korrekt verbunden durch echte Schrift)
  if (arLines.length) {
    g.font = `400 ${st.arSize}px ${st.ar}`; g.direction = 'rtl'; g.textAlign = 'center';
    if (st.arGold) { const gg = g.createLinearGradient(0, y, 0, y + arLines.length * arLH); gg.addColorStop(0, '#E8CC8E'); gg.addColorStop(0.5, '#D9B26A'); gg.addColorStop(1, '#CA9E4E'); g.fillStyle = gg; }
    else g.fillStyle = '#F3E9D6';
    arLines.forEach((ln, i) => g.fillText(ln, CARD.x + CARD.w / 2, y + i * arLH + arLH / 2));
    y += arLines.length * arLH + 14;
    g.direction = 'ltr';
  }
  // Deutsch
  g.font = `500 34px "Montserrat"`; g.fillStyle = '#ffffff'; g.textAlign = 'left';
  deLines.forEach((ln, i) => g.fillText(ln, CARD.x + CARD.pad, y + i * deLH + deLH / 2));
  y += deLines.length * deLH + 18;
  // Quelle
  g.font = `700 25px "Montserrat"`; g.fillStyle = st.border;
  srcLines.forEach((ln, i) => g.fillText(ln, CARD.x + CARD.pad, y + i * srcLH + srcLH / 2));
  g.restore();
  const ease = (x) => x * x * (3 - 2 * x);
  return { top: top + dy, show: ease(clamp01((t - t0) / 0.38)) * ease(kout) };
}

// Untertitel-Höhe: normal fest; steht eine Karte, gleitet die Zeile weich über die Karte und wieder zurück
export function subtitleY(card, base = TEXT.subY) {
  if (!card) return base;
  const target = Math.min(base, card.top - 85);
  return base + (target - base) * card.show;
}

export function drawGuides(g, W, H) {
  g.save();
  g.fillStyle = 'rgba(255,40,40,0.22)';
  g.fillRect(0, 0, W, SAFE.top);
  g.fillRect(0, H - SAFE.bottom, W, SAFE.bottom);
  g.fillRect(W - SAFE.right, SAFE.top, SAFE.right, H - SAFE.top - SAFE.bottom);
  g.strokeStyle = 'rgba(255,255,255,0.9)'; g.lineWidth = 3; g.setLineDash([14, 10]);
  g.strokeRect(0, SAFE.top, W - SAFE.right, H - SAFE.top - SAFE.bottom);
  g.setLineDash([]);
  g.font = '700 30px "Montserrat"'; g.fillStyle = '#fff'; g.textAlign = 'center';
  g.fillText('frei lassen: TikTok/Instagram-Oberfläche', W / 2, 130);
  g.fillText('frei lassen: Beschreibung und Knöpfe', W / 2, H - 200);
  g.restore();
}

// Nur für Vorschauen: grobe, neutrale Nachbildung einer Kurzvideo-App-Oberfläche (Knöpfe rechts, Beschreibung unten)
export function drawPlatformMock(g) {
  g.save();
  g.fillStyle = 'rgba(255,255,255,0.55)';
  for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(1010, 1000 + i * 135, 40, 0, Math.PI * 2); g.fill(); }
  g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(0, 1530, 1080, 390);
  g.fillStyle = 'rgba(255,255,255,0.7)';
  g.fillRect(40, 1560, 360, 34); g.fillRect(40, 1615, 820, 26); g.fillRect(40, 1655, 640, 26); g.fillRect(40, 1720, 520, 26);
  g.fillRect(330, 120, 420, 34);
  g.font = '700 28px "Montserrat"'; g.fillStyle = '#ffffff'; g.textAlign = 'left';
  g.fillText('Simulierte App-Oberfläche', 40, 1880);
  g.restore();
}
