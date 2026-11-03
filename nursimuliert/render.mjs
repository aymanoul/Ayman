// Deterministisches Rendern mit Playwright (Chromium headless).
//
//   node render.mjs sheet                 Figuren-Standbilder (vorn/seitlich/hinten) -> out/figuren.jpg
//   node render.mjs stills 1.5 4.2 ...    Einzelbilder -> out/stills/
//   node render.mjs preview               Bild aus der Mitte jeder Einstellung -> out/vorschau.jpg
//   node render.mjs check                 Augen-Pruefung (Namen), Textbereich, Determinismus
//   node render.mjs frames [--workers 3]  alle Frames -> frames/%05d.png
//   node render.mjs video                 ffmpeg -> out/video.mp4, out/cover.jpg, out/kontaktbogen.jpg
//   node render.mjs all                   check + frames + video
//
// Vorher: node build.mjs (oder npm run build). Der Server (http-server dist -p 8080 -s)
// wird bei Bedarf automatisch gestartet.
import { chromium } from 'playwright';
import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, existsSync, readdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import http from 'node:http';
import path from 'node:path';

const PORT = 8080;
const URL = `http://localhost:${PORT}/index.html`;
const W = 1080, H = 1920;
const FORBIDDEN = /(eye|pupil|iris|lid|lash)/i;

const args = process.argv.slice(2);
const cmd = args[0] || 'help';
const opt = (name, def) => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : def; };

function ping() {
  return new Promise((res) => {
    const req = http.get(URL, (r) => { r.resume(); res(r.statusCode === 200); });
    req.on('error', () => res(false));
    req.setTimeout(1000, () => { req.destroy(); res(false); });
  });
}

let server = null;
async function ensureServer() {
  if (await ping()) return;
  server = spawn('npx', ['http-server', 'dist', '-p', String(PORT), '-s', '-c-1'], { stdio: 'ignore', detached: false });
  for (let i = 0; i < 60; i++) {
    if (await ping()) return;
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('Server startet nicht');
}

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(URL);
  await page.waitForFunction(() => window.ready === true || window.initError, null, { timeout: 120000 });
  const err = await page.evaluate(() => window.initError);
  if (err) throw new Error('Init-Fehler:\n' + err);
  if (errors.length) console.warn('Konsole:', errors.join('\n'));
  return page;
}

async function launch() {
  await ensureServer();
  return chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
}

async function shot(page, t, file) {
  await page.evaluate((tt) => window.renderAt(tt), t);
  await page.screenshot({ path: file, type: file.endsWith('.jpg') ? 'jpeg' : 'png', quality: file.endsWith('.jpg') ? 92 : undefined, clip: { x: 0, y: 0, width: W, height: H }, animations: 'disabled', caret: 'hide' });
}

function ffmpeg(a) { execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...a], { stdio: 'inherit' }); }

function tileSheet(inputs, out, cols, cellW, cellH) {
  // Kontaktbogen aus Einzelbildern
  const tmp = 'out/.tile';
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  inputs.forEach((f, i) => ffmpeg(['-i', f, '-vf', `scale=${cellW}:${cellH}`, path.join(tmp, String(i).padStart(4, '0') + '.png')]));
  const rows = Math.ceil(inputs.length / cols);
  ffmpeg(['-framerate', '1', '-i', path.join(tmp, '%04d.png'), '-vf', `tile=${cols}x${rows}:padding=6:margin=6:color=0x111111`, '-frames:v', '1', '-q:v', '3', out]);
  rmSync(tmp, { recursive: true, force: true });
}

// ------------------------------------------------------------ Befehle

async function cmdSheet() {
  const story = JSON.parse(readFileSync('dist/story.json', 'utf8'));
  const people = Object.entries(story.cast).filter(([, s]) => (s.type || 'person') === 'person').map(([id]) => id);
  mkdirSync('out/turnaround', { recursive: true });
  const browser = await launch();
  const page = await openPage(browser);
  const files = [];
  for (const id of people) {
    for (const view of ['front', 'side', 'back']) {
      const f = `out/turnaround/${id}_${view}.png`;
      const child = story.cast[id].build === 'child';
      await page.evaluate(([i, v, c]) => window.renderSheet(i, v, { dist: c ? 2.6 : 3.6, height: c ? 0.75 : 1.05, lookY: c ? 0.6 : 0.88 }), [id, view, child]);
      await page.screenshot({ path: f, clip: { x: 0, y: 0, width: W, height: H } });
      files.push(f);
    }
  }
  const heads = [];
  // Nahaufnahmen der Koepfe (vorn und schraeg) zur Augen-Pruefung
  for (const id of people) {
    for (const view of ['front', 'threequarter']) {
      const f = `out/turnaround/${id}_kopf_${view}.png`;
      const h = story.cast[id].build === 'child' ? 1.0 : 1.55;
      await page.evaluate(([i, hh, v]) => window.renderSheet(i, v, { dist: 1.25, height: hh, lookY: hh }), [id, h, view]);
      await page.screenshot({ path: f, clip: { x: 0, y: 0, width: W, height: H } });
      heads.push(f);
    }
  }
  await browser.close();
  tileSheet(files, 'out/figuren.jpg', 6, 270, 480);
  tileSheet(heads, 'out/koepfe.jpg', 4, 324, 576);
  console.log('out/figuren.jpg, out/koepfe.jpg');
}

// Koepfe ausgewaehlter Figuren (vorn, schraeg, aus 3 m Entfernung) -> out/koepfe_test.jpg
async function cmdHeads(ids) {
  const story = JSON.parse(readFileSync('dist/story.json', 'utf8'));
  mkdirSync('out/turnaround', { recursive: true });
  const browser = await launch();
  const page = await openPage(browser);
  const files = [];
  for (const [view, dist] of [['front', 1.25], ['threequarter', 1.25], ['front', 3.2]]) {
    for (const id of ids) {
      const f = `out/turnaround/test_${id}_${view}_${dist}.png`;
      const h = story.cast[id].build === 'child' ? 1.0 : 1.55;
      await page.evaluate(([i, hh, v, d]) => window.renderSheet(i, v, { dist: d, height: hh, lookY: hh }), [id, h, view, dist]);
      await page.screenshot({ path: f, clip: { x: 0, y: 0, width: W, height: H } });
      files.push(f);
    }
  }
  await browser.close();
  tileSheet(files, 'out/koepfe_test.jpg', ids.length, 270, 480);
  console.log('out/koepfe_test.jpg');
}

async function cmdStills(times) {
  mkdirSync('out/stills', { recursive: true });
  const browser = await launch();
  const page = await openPage(browser);
  for (const t of times) {
    const f = `out/stills/t_${Number(t).toFixed(2).padStart(6, '0')}.png`;
    const t0 = Date.now();
    await shot(page, Number(t), f);
    console.log(f, (Date.now() - t0) + ' ms');
  }
  await browser.close();
}

async function cmdPreview() {
  mkdirSync('out/preview', { recursive: true });
  const browser = await launch();
  const page = await openPage(browser);
  const meta = await page.evaluate(() => window.storyMeta());
  const files = [];
  const n = Number(opt('n', 1));
  const only = opt('shots', '').split(',').filter(Boolean).map(Number);
  for (const s of meta.shots) {
    if (only.length && !only.includes(s.id)) continue;
    for (let j = 0; j < n; j++) {
      const k = n === 1 ? 0.5 : 0.08 + (0.84 * j) / (n - 1);
      const t = Math.round((s.start + (s.end - s.start) * k) * 30) / 30;
      const f = `out/preview/einstellung_${String(s.id).padStart(2, '0')}_${j}.png`;
      await shot(page, t, f);
      files.push(f);
      console.log(f, 't=' + t.toFixed(2));
    }
  }
  await browser.close();
  const out = n === 1 && !only.length ? 'out/vorschau.jpg' : 'out/vorschau_detail.jpg';
  tileSheet(files, out, n === 1 ? 5 : Math.min(n * 2, 6), 324, 576);
  console.log(out);
}

async function cmdCheck() {
  let fail = 0;
  // 1) Quelltext: kein Mesh/Objekt mit verbotenem Namen
  const srcFiles = [];
  const walk = (d) => { for (const f of readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) walk(p); else if (p.endsWith('.js')) srcFiles.push(p); } };
  walk('src');
  for (const f of srcFiles) {
    const lines = readFileSync(f, 'utf8').split('\n');
    lines.forEach((ln, i) => {
      for (const m of ln.matchAll(/['"`]([A-Za-z0-9_\-]+)['"`]/g)) {
        if (FORBIDDEN.test(m[1])) { console.log(`FEHLER Quelltext ${f}:${i + 1}: Name "${m[1]}"`); fail++; }
      }
      if (/\.name\s*=\s*.*(eye|pupil|iris|lid|lash)/i.test(ln)) { console.log(`FEHLER Quelltext ${f}:${i + 1}: ${ln.trim()}`); fail++; }
    });
  }
  const browser = await launch();
  const page = await openPage(browser);
  // 2) Szene: alle Objektnamen zur Laufzeit
  const names = await page.evaluate(() => window.meshNames());
  const bad = [...new Set(names.filter((n) => FORBIDDEN.test(n)))];
  if (bad.length) { console.log('FEHLER Szene: verbotene Namen', bad); fail++; }
  console.log(`Augen-Pruefung: ${srcFiles.length} Quelldateien, ${names.length} Szene-Objekte, verbotene Namen: ${bad.length}`);
  // 3) Texte im sicheren Bereich
  const meta = await page.evaluate(() => window.storyMeta());
  let layoutBad = 0;
  for (let t = 0; t <= meta.duration; t += 0.1) {
    const out = await page.evaluate((tt) => window.checkLayout(tt), t);
    if (out.length) { layoutBad++; if (layoutBad < 6) console.log('FEHLER Textbereich bei t=' + t.toFixed(2), JSON.stringify(out)); }
  }
  if (layoutBad) fail++;
  console.log('Text-Pruefung (alle 0,1 s):', layoutBad ? layoutBad + ' Zeitpunkte ausserhalb' : 'alles im sicheren Bereich');
  // 4) Determinismus: gleicher Zeitpunkt zweimal -> gleiche Pixel
  const hashes = [];
  for (let i = 0; i < 2; i++) {
    await page.evaluate(() => window.renderAt(7.3));
    hashes.push(createHash('md5').update(await page.screenshot({ clip: { x: 0, y: 0, width: W, height: H } })).digest('hex'));
    await page.evaluate(() => window.renderAt(23.1));
  }
  console.log('Determinismus:', hashes[0] === hashes[1] ? 'gleich' : 'UNTERSCHIEDLICH');
  if (hashes[0] !== hashes[1]) fail++;
  await browser.close();
  if (fail) { console.log('PRUEFUNG FEHLGESCHLAGEN'); process.exitCode = 1; } else console.log('PRUEFUNG OK');
}

async function cmdFrames() {
  const workers = Number(opt('workers', 3));
  rmSync('frames', { recursive: true, force: true });
  mkdirSync('frames', { recursive: true });
  const browser = await launch();
  const first = await openPage(browser);
  const meta = await first.evaluate(() => window.storyMeta());
  const total = Math.round(meta.duration * meta.fps);
  const from = Number(opt('from', 0)), to = Math.min(total, Number(opt('to', total)));
  const pages = [first];
  for (let i = 1; i < workers; i++) pages.push(await openPage(browser));
  let next = from, done = 0;
  const t0 = Date.now();
  await Promise.all(pages.map(async (page) => {
    while (next < to) {
      const f = next++;
      await shot(page, f / meta.fps, `frames/${String(f).padStart(5, '0')}.png`);
      done++;
      if (done % 30 === 0) {
        const el = (Date.now() - t0) / 1000;
        console.log(`${done}/${to - from} Frames, ${(el / done).toFixed(2)} s/Frame, Rest ca. ${Math.round((el / done) * (to - from - done))} s`);
      }
    }
  }));
  await browser.close();
  console.log('Frames fertig in', Math.round((Date.now() - t0) / 1000), 's');
}

async function cmdVideo() {
  mkdirSync('out', { recursive: true });
  ffmpeg(['-framerate', '30', '-i', 'frames/%05d.png', '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=stereo', '-shortest',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-movflags', '+faststart', 'out/video.mp4']);
  // Cover bei 1,5 s (mit Titel)
  ffmpeg(['-i', 'frames/00045.png', '-q:v', '2', 'out/cover.jpg']);
  // Kontaktbogen: ein Bild pro Sekunde aus dem fertigen Video
  rmSync('out/.ks', { recursive: true, force: true });
  mkdirSync('out/.ks', { recursive: true });
  ffmpeg(['-i', 'out/video.mp4', '-vf', 'fps=1,scale=216:384', path.join('out/.ks', '%03d.png')]);
  const n = readdirSync('out/.ks').length;
  const cols = 8, rows = Math.ceil(n / cols);
  ffmpeg(['-framerate', '1', '-i', 'out/.ks/%03d.png', '-vf', `tile=${cols}x${rows}:padding=4:margin=4:color=0x111111`, '-frames:v', '1', '-q:v', '3', 'out/kontaktbogen.jpg']);
  rmSync('out/.ks', { recursive: true, force: true });
  const probe = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=codec_name,width,height,r_frame_rate,nb_frames:format=duration', '-of', 'default=nw=1', 'out/video.mp4']).toString();
  console.log(probe.trim());
}

try {
  if (cmd === 'sheet') await cmdSheet();
  else if (cmd === 'heads') await cmdHeads(args.slice(1));
  else if (cmd === 'stills') await cmdStills(args.slice(1).filter((a) => !a.startsWith('--')));
  else if (cmd === 'preview') await cmdPreview();
  else if (cmd === 'check') await cmdCheck();
  else if (cmd === 'frames') await cmdFrames();
  else if (cmd === 'video') await cmdVideo();
  else if (cmd === 'all') { await cmdCheck(); if (!process.exitCode) { await cmdFrames(); await cmdVideo(); } }
  else console.log(readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(0, 12).join('\n'));
} finally {
  if (server) server.kill();
}
