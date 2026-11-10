// Misst die Renderzeit pro Bild für verschiedene Einstellungen.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { fileURLToPath } from 'node:url'; import { createRequire } from 'node:module';
const require = createRequire(import.meta.url); const { chromium } = require('playwright');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => { const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res); });
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const variants = process.argv.slice(2);
for (const v of variants) {
  const page = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto(`http://127.0.0.1:${server.address().port}/web/index.html?shot=test&w=1080&h=1920&${v}`);
  await page.waitForFunction(() => window.ready || window.bootError, null, { timeout: 180000 });
  const N = 4; let t0 = Date.now();
  for (let i = 0; i < N; i++) { await page.evaluate((t) => window.renderFrame(t), 1 + i / 30); await page.screenshot({ type: 'jpeg', quality: 96 }); }
  const withShot = (Date.now() - t0) / N;
  const inPage = await page.evaluate(() => { const g = window.__dbg.renderer.getContext(); const t = performance.now();
    for (let i = 0; i < 3; i++) { window.renderFrame(2 + i / 30); g.finish(); const px = new Uint8Array(4); g.readPixels(0, 0, 1, 1, g.RGBA, g.UNSIGNED_BYTE, px); }
    return (performance.now() - t) / 3; });
  t0 = Date.now();
  for (let i = 0; i < N; i++) { const b64 = await page.evaluate((t) => window.grabFrame(t), 3 + i / 30); Buffer.from(b64, 'base64'); }
  const grab = (Date.now() - t0) / N;
  console.log(`${v.padEnd(34)} Screenshot ${(withShot / 1000).toFixed(2)} s | nur Rendern ${(inPage / 1000).toFixed(2)} s | grabFrame ${(grab / 1000).toFixed(2)} s`);
  await page.close();
}
await b.close(); server.close();
