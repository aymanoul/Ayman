#!/usr/bin/env node
// Rendert einen Shot Bild für Bild in Headless-Chromium und baut daraus mit ffmpeg einen Clip.
//   node tools/render.mjs <shot> [--still 1.2,3.0] [--from 0 --to 5] [--scale 0.5]
//                          [--out out/clips/x.mp4] [--guides] [--layers all|3d|overlay] [--workers 2]
//                          [--ao] [--bloom]   (echte Effekte, deutlich langsamer; Standard: eingebacken)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const argv = process.argv.slice(2);
const shot = argv[0] && !argv[0].startsWith('--') ? argv[0] : 'test';
const arg = (name, def) => { const i = argv.indexOf('--' + name); return i >= 0 ? argv[i + 1] : def; };
const flag = (name) => argv.includes('--' + name);
const scale = +arg('scale', 1);
const W = Math.round(1080 * scale / 2) * 2, H = Math.round(1920 * scale / 2) * 2;
const FPS = 30;

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.wav': 'audio/wav' };

const server = http.createServer((req, res) => {
  const p = path.normalize(decodeURIComponent(req.url.split('?')[0]));
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end('404'); return; }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const qs = new URLSearchParams({ shot, w: W, h: H, layers: arg('layers', 'all') });
if (flag('guides')) qs.set('guides', '1');
if (flag('mock')) qs.set('mock', '1');
if (flag('ao')) qs.set('ao', '1');
if (flag('bloom')) qs.set('bloom', '1');
const URL_ = `http://127.0.0.1:${port}/web/index.html?${qs}`;

async function open() {
  const browser = await chromium.launch({
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist',
      '--disable-gpu-vsync', '--hide-scrollbars'],
  });
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) console.log(`[seite:${m.type()}]`, m.text()); });
  page.on('pageerror', (e) => console.log('[seitenfehler]', e.message));
  await page.goto(URL_);
  await page.waitForFunction(() => window.ready || window.bootError, null, { timeout: 180000 });
  const err = await page.evaluate(() => window.bootError);
  if (err) { console.error('Start fehlgeschlagen:\n' + err); await browser.close(); server.close(); process.exit(1); }
  return { browser, page };
}

const t0 = Date.now();
const first = await open();
const info = await first.page.evaluate(() => window.shotInfo);
console.log(`Shot "${shot}" geladen in ${((Date.now() - t0) / 1000).toFixed(1)} s – Dauer ${info.duration} s, ${W}x${H}`);

if (arg('still')) {
  fs.mkdirSync(path.join(ROOT, 'out/stills'), { recursive: true });
  for (const ts of String(arg('still')).split(',')) {
    const t = +ts;
    const b64 = await first.page.evaluate((tt) => window.grabFrame(tt, 1, 'image/png'), t);
    const name = arg('name', shot) + `_${t.toFixed(2).replace('.', '_')}${flag('guides') ? '_guides' : ''}.png`;
    const f = path.join(ROOT, 'out/stills', name);
    fs.writeFileSync(f, Buffer.from(b64, 'base64'));
    console.log('Standbild:', path.relative(ROOT, f));
  }
  await first.browser.close();
} else {
  const from = +arg('from', 0), to = +arg('to', info.duration);
  const f0 = Math.round(from * FPS), f1 = Math.round(to * FPS);
  const total = f1 - f0;
  const out = path.resolve(ROOT, arg('out', `out/clips/${shot}.mp4`));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const workers = Math.max(1, Math.min(+arg('workers', 2), total));
  const tStart = Date.now();
  let doneFrames = 0, lastLog = 0;

  // Jeder Worker rendert einen zusammenhängenden Abschnitt in eine eigene Teil-Datei
  async function part(i, a, b, ctx) {
    const file = workers === 1 ? out : out.replace(/\.mp4$/, `.part${i}.mp4`);
    const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '15', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
      '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', file], { stdio: ['pipe', 'inherit', 'inherit'] });
    const closed = new Promise((r) => ff.on('close', r));
    for (let f = a; f < b; f++) {
      const b64 = await ctx.page.evaluate((tt) => window.grabFrame(tt, 0.96), f / FPS);
      if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise((r) => ff.stdin.once('drain', r));
      doneFrames++;
      if (doneFrames - lastLog >= 30 || doneFrames === total) {
        lastLog = doneFrames;
        const per = (Date.now() - tStart) / 1000 / doneFrames;
        console.log(`  Bild ${doneFrames}/${total} – ${per.toFixed(2)} s pro Bild, Rest ca. ${Math.round(per * (total - doneFrames))} s`);
      }
    }
    ff.stdin.end();
    await closed;
    await ctx.browser.close();
    return file;
  }
  const jobs = [];
  for (let i = 0; i < workers; i++) {
    const a = f0 + Math.floor((total * i) / workers), b = f0 + Math.floor((total * (i + 1)) / workers);
    jobs.push((async () => part(i, a, b, i === 0 ? first : await open()))());
  }
  const files = await Promise.all(jobs);
  if (workers > 1) {
    const list = out.replace(/\.mp4$/, '.parts.txt');
    fs.writeFileSync(list, files.map((f) => `file '${f}'`).join('\n'));
    await new Promise((r) => spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', out],
      { stdio: 'inherit' }).on('close', r));
    for (const f of [...files, list]) fs.unlinkSync(f);
  }
  console.log(`Clip: ${path.relative(ROOT, out)} – ${total} Bilder in ${((Date.now() - tStart) / 1000).toFixed(0)} s (${workers} Worker)`);
}
server.close();
