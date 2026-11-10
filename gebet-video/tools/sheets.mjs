#!/usr/bin/env node
// Rendert die Zellen der Figurenblätter und setzt sie zu fertigen Blättern (JPG) zusammen.
//   node tools/sheets.mjs                 alle Blätter
//   node tools/sheets.mjs --sheet A       nur Blätter, deren Dateiname "A" enthält
//   node tools/sheets.mjs --only A_emo    nur Zellen, deren Kennung so beginnt (Vorschau-Raster nach out/sheets/vorschau.jpg)
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { fileURLToPath } from 'node:url'; import { createRequire } from 'node:module';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { SHEETS, ALL_CELLS } = await import(path.join(ROOT, 'web/sheets/cells.js'));
const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i >= 0 ? argv[i + 1] : d; };
const only = arg('only'); const sheetSel = arg('sheet');
const CW = +arg('w', 640), CH = +arg('h', 960);

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => { const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); fs.createReadStream(f).pipe(res); });
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });

const cellDir = path.join(ROOT, 'out/sheets/cells'); fs.mkdirSync(cellDir, { recursive: true });
const sheets = SHEETS.filter((s) => !sheetSel || s.file.includes(sheetSel));
let cells = only ? ALL_CELLS.filter((c) => only.split(',').some((o) => c.id.startsWith(o))) : sheets.flatMap((s) => s.sections.flatMap((x) => x.cells));

const page = await browser.newPage({ viewport: { width: CW, height: CH } });
page.on('console', (m) => { if (m.type() === 'error') console.log('[seite]', m.text()); });
page.on('pageerror', (e) => console.log('[fehler]', e.message));
await page.goto(`${base}/web/index.html?shot=sheet&w=${CW}&h=${CH}&layers=3d`);
await page.waitForFunction(() => window.ready || window.bootError, null, { timeout: 120000 });
const err = await page.evaluate(() => window.bootError); if (err) { console.error(err); process.exit(1); }
const t0 = Date.now();
for (const c of cells) {
  const b64 = await page.evaluate((id) => { window.__dbg.shot.setCell(id); return window.grabFrame(0, 1, 'image/png'); }, c.id);
  fs.writeFileSync(path.join(cellDir, c.id + '.png'), Buffer.from(b64, 'base64'));
}
console.log(`${cells.length} Zellen gerendert in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
await page.close();

const css = `
@font-face{font-family:"Montserrat";font-weight:500;src:url("/node_modules/@fontsource/montserrat/files/montserrat-latin-500-normal.woff2") format("woff2");}
@font-face{font-family:"Montserrat";font-weight:700;src:url("/node_modules/@fontsource/montserrat/files/montserrat-latin-700-normal.woff2") format("woff2");}
@font-face{font-family:"Montserrat";font-weight:800;src:url("/node_modules/@fontsource/montserrat/files/montserrat-latin-800-normal.woff2") format("woff2");}
*{box-sizing:border-box}body{margin:0;background:#F6F1E6;font-family:Montserrat,sans-serif;color:#212242;width:1800px}
header{background:#212242;color:#F3E9D6;padding:44px 56px 40px}
header h1{margin:0 0 18px;font-weight:800;font-size:54px;letter-spacing:-.5px}
header .k{color:#D9B26A;font-weight:700;font-size:20px;letter-spacing:3px;text-transform:uppercase;margin-bottom:10px}
header ul{margin:0;padding:0;list-style:none;font-size:22px;line-height:1.55;font-weight:500;columns:2;column-gap:48px}
main{padding:28px 56px 40px}
h2{font-size:27px;font-weight:800;margin:30px 0 14px;padding-left:16px;border-left:8px solid #CA9E4E}
.grid{display:grid;gap:14px}
figure{margin:0;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #e3dccb}
figure img{display:block;width:100%;height:100%;object-fit:cover}
figure .im{aspect-ratio:2/3;overflow:hidden;background:#e9e3d6}
figcaption{font-size:19px;font-weight:700;padding:10px 12px 12px;text-align:center}
footer{padding:0 56px 44px;font-size:20px;line-height:1.5;font-weight:500}
footer p{margin:6px 0}
`;
const html = (s) => `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>${css}</style></head><body>
<header><div class="k">Masjid As-Sunnah · Die Wichtigkeit des Gebets · Phase 1</div><h1>${s.title}</h1><ul>${s.facts.map((f) => `<li>${f}</li>`).join('')}</ul></header>
<main>${s.sections.map((x) => `<h2>${x.title}</h2><div class="grid" style="grid-template-columns:repeat(${x.cols},1fr)">${x.cells.map((c) =>
    `<figure><div class="im" style="${x.aspect ? `aspect-ratio:${x.aspect}` : ''}"><img src="/out/sheets/cells/${c.id}.png"></div><figcaption>${c.label}</figcaption></figure>`).join('')}</div>`).join('')}</main>
<footer>${s.foot.map((f) => `<p>${f}</p>`).join('')}</footer></body></html>`;

async function shoot(name, markup) {
  const f = path.join(ROOT, 'out/sheets', name + '.html'); fs.writeFileSync(f, markup);
  const p = await browser.newPage({ viewport: { width: 1800, height: 1200 } });
  await p.goto(`${base}/out/sheets/${name}.html`); await p.evaluate(() => document.fonts.ready);
  await p.waitForFunction(() => [...document.images].every((i) => i.complete));
  await p.screenshot({ path: path.join(ROOT, 'out/sheets', name + '.jpg'), fullPage: true, type: 'jpeg', quality: 90 });
  await p.close(); fs.unlinkSync(f);
  console.log('Blatt:', `out/sheets/${name}.jpg`);
}
if (only) {
  await shoot('vorschau', html({ title: 'Vorschau', facts: [], foot: [], sections: [{ title: only, cols: Math.min(cells.length, +arg('cols', 5)), cells }] }));
} else {
  for (const s of sheets) await shoot(s.file, html(s));
}
await browser.close(); server.close();
