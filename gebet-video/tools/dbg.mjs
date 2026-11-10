// Debug: lädt einen Shot, führt JS in der Seite aus und macht ein Standbild.
//   node tools/dbg.mjs <shot> <t> <name> "<js>" [scale]
import { spawn } from 'node:child_process';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { fileURLToPath } from 'node:url'; import { createRequire } from 'node:module';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [shot, t, name, js, sc] = process.argv.slice(2);
const scale = +(sc || 0.5); const W = 1080 * scale, H = 1920 * scale;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => { const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res); });
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await b.newPage({ viewport: { width: W, height: H } });
page.on('console', (m) => { if (!m.text().includes('PCFSoft')) console.log('[seite]', m.text()); });
page.on('pageerror', (e) => console.log('[fehler]', e.message));
await page.goto(`http://127.0.0.1:${server.address().port}/web/index.html?shot=${shot}&w=${W}&h=${H}&layers=3d&${process.argv[7] || ''}`);
await page.waitForFunction(() => window.ready || window.bootError, null, { timeout: 120000 });
const r = await page.evaluate(`(async()=>{ const {scene,camera,shot,THREE,composer,renderer}=window.__dbg; window.renderFrame(${t}); ${js || ''}; composer.render(); })()`);
if (r !== undefined) console.log(JSON.stringify(r));
fs.mkdirSync(path.join(ROOT, 'out/stills'), { recursive: true });
await page.screenshot({ path: path.join(ROOT, 'out/stills', name + '.png') });
await b.close(); server.close();
