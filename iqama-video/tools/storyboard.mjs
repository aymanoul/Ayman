#!/usr/bin/env node
// Phase 2: Storyboard-Standbilder rendern (Three.js im Headless-Chromium, wie beim Gebet-Video).
//   node tools/storyboard.mjs [--w 540] [--only S1,S6]
// → out/phase2/cells/<Shot>.png (mit Einblendungen), out/phase2/einzel/*.png (Handy-Display, Zeitbalken, Licht-Tor)
// Server: /iq/… = iqama-video, alles andere = gebet-video (Bausteine, Schriften, Logo werden nur gelesen).
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { fileURLToPath } from 'node:url'; import { createRequire } from 'node:module';

const IQ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GV = path.resolve(IQ, '..', 'gebet-video');
const { chromium } = createRequire(path.join(GV, 'package.json'))('playwright');
const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf('--' + n); return i >= 0 ? argv[i + 1] : d; };
const W = +arg('w', 540), H = Math.round(W * 16 / 9);
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.woff': 'font/woff', '.otf': 'font/otf', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0]);
  const [root, rel] = p.startsWith('/iq/') ? [IQ, p.slice(4)] : [GV, p];
  const f = path.join(root, rel);
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });

async function seite(w, h, extra = '') {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  page.on('console', (m) => { if (m.type() === 'error') console.log('[seite]', m.text()); });
  page.on('pageerror', (e) => console.log('[fehler]', e.message));
  await page.goto(`${base}/iq/web/index.html?shot=board&w=${w}&h=${h}${extra}`);
  await page.waitForFunction(() => window.ready || window.bootError, null, { timeout: 180000 });
  const err = await page.evaluate(() => window.bootError); if (err) { console.error(err); process.exit(1); }
  return page;
}
const out = path.join(IQ, 'out/phase2'); const cells = path.join(out, 'cells'), einzel = path.join(out, 'einzel');
fs.mkdirSync(cells, { recursive: true }); fs.mkdirSync(einzel, { recursive: true });
const { SHOTS } = await import(path.join(IQ, 'web/board-data.js'));
const only = arg('only');
const page = await seite(W, H);
const t0 = Date.now();
for (const s of SHOTS.filter((x) => !only || only.split(',').includes(x.id))) {
  const b64 = await page.evaluate((id) => { window.__dbg.shot.setCell(id); return window.grabFrame(0, 1, 'image/png'); }, s.id);
  fs.writeFileSync(path.join(cells, s.id + '.png'), Buffer.from(b64, 'base64'));
  console.log('Bild', s.id);
}
if (!only) {
  // Einzelbilder: Handy-Display hell/dunkel, Licht-Tor nah (3D), Zeitbalken normal/gold (nur Einblendung)
  for (const [name, d] of [['handy_display', 0], ['handy_display_dunkel', 0.92]]) {
    const b64 = await page.evaluate((dd) => window.__dbg.shot.displayBild(dd), d);
    fs.writeFileSync(path.join(einzel, name + '.png'), Buffer.from(b64, 'base64'));
  }
  const tor = await page.evaluate(() => {
    const s = window.__dbg.shot; s.setCell('S6');
    s.placeCam({ pos: [0, 1.7, 0.2], look: [0, 1.9, -5], fov: 50 });
    const keep = s.overlay; s.overlay = () => {}; const b = window.grabFrame(0, 1, 'image/png'); s.overlay = keep; return b;
  });
  fs.writeFileSync(path.join(einzel, 'licht_tor.png'), Buffer.from(tor, 'base64'));
  await page.close();
  const ov = await seite(1080, 1920, '&layers=overlay');
  for (const [name, cfg] of [['zeitbalken', { rest: 600 }], ['zeitbalken_gold', { rest: 290, gold: 1 }]]) {
    const b64 = await ov.evaluate((c) => {
      const s = window.__dbg.shot; const keep = s.overlay;
      s.overlay = (g) => { g.fillStyle = '#4a4f63'; g.fillRect(0, 0, 1080, 1920); window.__zb(g, c); };
      const b = window.grabFrame(0, 1, 'image/png'); s.overlay = keep; return b;
    }, cfg).catch(async () => null);
    if (b64) fs.writeFileSync(path.join(einzel, name + '.png'), Buffer.from(b64, 'base64'));
  }
}
console.log(`fertig in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
await browser.close(); server.close();
