// Einblendungen als durchsichtige PNGs rendern (Chromium + Canvas).
//   node tools/overlay.mjs <zustaende.json> <ausgabeordner>
// zustaende.json: [{ "name": "S5", "zustand": { … } }, …]  – Felder siehe web/overlay.js (window.zeichne)
// Server: /iq/… = iqama-video, alles andere = gebet-video (Schriften, Logo, Overlay-Baukasten werden nur gelesen).
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const GV = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../gebet-video');
const { chromium } = createRequire(path.join(GV, 'package.json'))('playwright');
const SV = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');   // iqama-video
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.woff': 'font/woff', '.otf': 'font/otf', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const p = decodeURIComponent(req.url.split('?')[0]);
  const [root, rel] = p.startsWith('/iq/') ? [SV, p.slice(4)] : [GV, p];
  const file = path.join(root, rel);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;
const [liste, out] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 1080, height: 1920 } });
page.on('pageerror', (e) => console.error('Seitenfehler:', e.message));
await page.goto(`http://localhost:${port}/iq/web/overlay.html`);
await page.waitForFunction('window.bereit === true');
let vorher = null, vorherDatei = null, n = 0;
for (const { name, zustand } of JSON.parse(fs.readFileSync(liste, 'utf8'))) {
  const datei = path.join(out, `${name}.png`);
  const key = JSON.stringify(zustand);
  if (key === vorher) { fs.copyFileSync(vorherDatei, datei); continue; }    // gleicher Zustand → gleiches Bild
  await page.evaluate((z) => window.zeichne(z), zustand);
  const data = await page.evaluate(() => window.bild());
  fs.writeFileSync(datei, Buffer.from(data.split(',')[1], 'base64'));
  vorher = key; vorherDatei = datei;
  if (++n % 100 === 0 || !/^f_/.test(name)) console.log('Ebene', name);
}
await b.close();
server.close();
