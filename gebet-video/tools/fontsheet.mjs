#!/usr/bin/env node
// 10 Vorschläge für Schrift und Stil der Untertitel und des Hook-Titels → out/phase6/schrift-vorschlaege.jpg
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { fileURLToPath } from 'node:url'; import { createRequire } from 'node:module';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BG = process.argv[2] || 'out/stills/film_9_00.png';

// [Nr, Schrift, Gewicht, Paket, Beschreibung, Stil]
const V = [
  [1, 'Poppins', 800, 'poppins', 'Poppins ExtraBold · weiß, schwarze Kontur, Betonung Gelb', { fill: '#fff', stroke: '#111', sw: 14, accent: '#FFD60A' }],
  [2, 'Nunito', 900, 'nunito', 'Nunito Black (rund) · weiß, Navy-Kontur, Betonung Gold', { fill: '#fff', stroke: '#212242', sw: 14, accent: '#D9B26A' }],
  [3, 'Rubik', 800, 'rubik', 'Rubik ExtraBold · weiß, schwarze Kontur, Betonung Türkis', { fill: '#fff', stroke: '#111', sw: 14, accent: '#2BD1C4' }],
  [4, 'Lilita One', 400, 'lilita-one', 'Lilita One (verspielt) · weiß, dunkle Kontur, Betonung Gelb', { fill: '#fff', stroke: '#1a1a1a', sw: 14, accent: '#FFD60A' }],
  [5, 'Outfit', 800, 'outfit', 'Outfit ExtraBold · weiß auf dunkler Box, Betonung Gold', { fill: '#fff', box: 'rgba(20,20,35,0.78)', accent: '#E8C36A' }],
  [6, 'Lexend', 700, 'lexend', 'Lexend Bold · weiß mit Schatten, Betonung als Gold-Feld', { fill: '#fff', shadow: true, pill: '#CA9E4E', pillText: '#212242' }],
  [7, 'Cairo', 900, 'cairo', 'Cairo Black (auch für Arabisch) · weiß, Navy-Kontur, Gold', { fill: '#fff', stroke: '#212242', sw: 14, accent: '#D9B26A' }],
  [8, 'Anton', 400, 'anton', 'Anton (schmal, Großbuchstaben) · weiß, Kontur, Gelb', { fill: '#fff', stroke: '#111', sw: 12, accent: '#FFD60A', upper: true }],
  [9, 'Fredoka', 700, 'fredoka', 'Fredoka Bold (rund) · Creme, Navy-Kontur, Betonung Türkis', { fill: '#F3E9D6', stroke: '#212242', sw: 14, accent: '#3FD0C9' }],
  [10, 'Inter', 900, 'inter', 'Inter Black · dunkel auf weißer Box, Betonung Gold', { fill: '#1b1b24', box: 'rgba(255,255,255,0.92)', accent: '#B8862E' }],
];

const face = ([, fam, w, pkg]) => ['latin', 'latin-ext'].map((sub) =>
  `@font-face{font-family:"${fam}";font-weight:${w};src:url("/node_modules/@fontsource/${pkg}/files/${pkg}-${sub}-${w}-normal.woff2") format("woff2");${sub === 'latin-ext' ? 'unicode-range:U+0100-024F,U+1E00-1EFF;' : ''}}`).join('\n');

function text(v, words, accentIdx, size) {
  const [, fam, w, , , s] = v;
  const base = `font-family:'${fam}';font-weight:${w};font-size:${size}px;line-height:1.15;${s.upper ? 'text-transform:uppercase;letter-spacing:1px;' : ''}`;
  const span = (t, i) => {
    const on = i === accentIdx;
    let st = `color:${on && s.accent ? s.accent : s.fill};`;
    if (s.stroke) st += `-webkit-text-stroke:${s.sw}px ${s.stroke};paint-order:stroke fill;`;
    if (s.shadow) st += 'text-shadow:0 4px 14px rgba(0,0,0,.65),0 2px 3px rgba(0,0,0,.6);';
    if (on && s.pill) st += `background:${s.pill};color:${s.pillText};padding:2px 18px;border-radius:16px;text-shadow:none;`;
    return `<span style="${st}">${t}</span>`;
  };
  const inner = words.map(span).join(' ');
  return s.box ? `<span style="${base}background:${s.box};padding:10px 26px;border-radius:22px;-webkit-box-decoration-break:clone;box-decoration-break:clone">${inner}</span>` : `<span style="${base}">${inner}</span>`;
}

const tile = (v) => `<div class="t"><div class="frame" style="background-image:url('/${BG}')">
  <div class="title">${text(v, ['Du', 'hörst', 'den', 'Adhan\u00a0–'], -1, 76)}<br>${text(v, ['und', 'gehst', 'weiter?'], -1, 76)}</div>
  <div class="sub">${text(v, ['Ich', "hol's", 'später'], 2, 90)}</div>
</div><div class="cap"><b>${v[0]}</b> ${v[4]}</div></div>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${V.map(face).join('\n')}
@font-face{font-family:"Montserrat";font-weight:700;src:url("/node_modules/@fontsource/montserrat/files/montserrat-latin-700-normal.woff2") format("woff2");}
@font-face{font-family:"Montserrat";font-weight:800;src:url("/node_modules/@fontsource/montserrat/files/montserrat-latin-800-normal.woff2") format("woff2");}
body{margin:0;background:#F6F1E6;font-family:Montserrat;width:${5 * 470 + 60}px}
h1{margin:0;padding:34px 30px 6px;font-size:44px;color:#212242}
p{margin:0 30px 20px;font-size:24px;color:#212242}
.g{display:grid;grid-template-columns:repeat(5,460px);gap:10px;padding:0 30px 30px}
.t{background:#fff;border-radius:14px;overflow:hidden}
.frame{width:1080px;height:1920px;transform:scale(${460 / 1080});transform-origin:0 0;position:relative;background-size:cover;margin-bottom:${-1920 + 1920 * 460 / 1080}px}
.title{position:absolute;left:120px;right:200px;top:380px;text-align:center}
.sub{position:absolute;left:120px;right:200px;top:1120px;text-align:center}
.cap{font-size:21px;line-height:1.35;padding:10px 14px 14px;color:#212242;font-weight:700;min-height:62px}
</style></head><body><h1>10 Vorschläge: Schrift und Stil</h1><p>Oben Hook-Titel, unten Untertitel mit betontem Wort. Text steht jetzt mittiger (sicher vor Rand und App-Knöpfen).</p>
<div class="g">${V.map(tile).join('')}</div></body></html>`;

const MIME = { '.html': 'text/html', '.woff2': 'font/woff2', '.png': 'image/png' };
fs.mkdirSync(path.join(ROOT, 'out/tmp'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'out/tmp/fontsheet.html'), html);
const server = http.createServer((req, res) => { const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res); });
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 5 * 470 + 60, height: 1200 } });
await p.goto(`http://127.0.0.1:${server.address().port}/out/tmp/fontsheet.html`);
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(500);
fs.mkdirSync(path.join(ROOT, 'out/phase6'), { recursive: true });
await p.screenshot({ path: path.join(ROOT, 'out/phase6/schrift-vorschlaege.jpg'), fullPage: true, type: 'jpeg', quality: 88 });
console.log('out/phase6/schrift-vorschlaege.jpg');
await b.close(); server.close();
