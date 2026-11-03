// Deterministisches Rendern mit Playwright (Chromium headless).
//
//   node render.mjs sheet                 Figuren (vorn/seitlich/hinten) -> out/figuren.jpg, out/koepfe.jpg
//   node render.mjs heads id1 id2 ...     Koepfe einzelner Figuren -> out/koepfe_test.jpg
//   node render.mjs stills 1.5 4.2 ...    Einzelbilder -> out/stills/   (--zones: TikTok-Bereiche rot)
//   node render.mjs preview [--n 3] [--shots 2,4]   Bild(er) je Einstellung mit roten Zonen -> out/vorschau.jpg
//   node render.mjs check                 Pruefungen (Augen-Namen, Textbereiche, Gesichter, Kontrast, Untertitel, Zaehler, Determinismus)
//   node render.mjs export                out/untertitel.srt, out/abgleich.txt, out/bewegung.json (fuer den Ton)
//   node render.mjs frames                alle Frames -> frames/%05d.jpg (Qualitaet 93)
//   node render.mjs video                 ffmpeg (frames + out/mix.wav) -> out/video.mp4, out/cover.jpg, out/kontaktbogen.jpg
//
// Vorher: node build.mjs. Der Server (http-server dist -p 8080 -s) startet bei Bedarf automatisch.
import { chromium } from 'playwright';
import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
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
const flag = (name) => args.includes('--' + name);

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
  server = spawn('npx', ['http-server', 'dist', '-p', String(PORT), '-s', '-c-1'], { stdio: 'ignore' });
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
  await page.waitForFunction(() => window.ready === true || window.initError, null, { timeout: 180000 });
  const err = await page.evaluate(() => window.initError);
  if (err) throw new Error('Init-Fehler:\n' + err);
  if (errors.length) console.warn('Konsole:', errors.join('\n'));
  return page;
}

async function launch() {
  await ensureServer();
  return chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
}

async function shot(page, t, file, zones = false) {
  await page.evaluate(([tt, z]) => { window.showZones(z); window.renderAt(tt); }, [t, zones]);
  const jpg = file.endsWith('.jpg');
  await page.screenshot({ path: file, type: jpg ? 'jpeg' : 'png', quality: jpg ? 93 : undefined, clip: { x: 0, y: 0, width: W, height: H }, animations: 'disabled', caret: 'hide' });
}

function ffmpeg(a) { execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...a], { stdio: 'inherit' }); }

function tileSheet(inputs, out, cols, cellW, cellH) {
  const tmp = 'out/.tile';
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  inputs.forEach((f, i) => ffmpeg(['-i', f, '-vf', `scale=${cellW}:${cellH}`, path.join(tmp, String(i).padStart(4, '0') + '.png')]));
  const rows = Math.ceil(inputs.length / cols);
  ffmpeg(['-framerate', '1', '-i', path.join(tmp, '%04d.png'), '-vf', `tile=${cols}x${rows}:padding=6:margin=6:color=0x111111`, '-frames:v', '1', '-q:v', '3', out]);
  rmSync(tmp, { recursive: true, force: true });
}

const srtTime = (t) => {
  const ms = Math.max(0, Math.round(t * 1000));
  const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`;
};
const norm = (w) => w.toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N}]/gu, '');

// ------------------------------------------------------------ Befehle

async function cmdSheet() {
  const story = JSON.parse(readFileSync('dist/story.json', 'utf8'));
  const people = Object.entries(story.cast).filter(([, s]) => (s.type || 'person') === 'person').map(([id]) => id);
  mkdirSync('out/turnaround', { recursive: true });
  const browser = await launch();
  const page = await openPage(browser);
  const files = [], heads = [];
  for (const id of people) {
    for (const view of ['front', 'side', 'back']) {
      const f = `out/turnaround/${id}_${view}.png`;
      const child = story.cast[id].build === 'child';
      await page.evaluate(([i, v, c]) => window.renderSheet(i, v, { dist: c ? 2.6 : 3.6, height: c ? 0.75 : 1.05, lookY: c ? 0.6 : 0.88 }), [id, view, child]);
      await page.screenshot({ path: f, clip: { x: 0, y: 0, width: W, height: H } });
      files.push(f);
    }
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
    const f = `out/stills/t_${Number(t).toFixed(2).padStart(6, '0')}.jpg`;
    const t0 = Date.now();
    await shot(page, Number(t), f, flag('zones'));
    console.log(f, (Date.now() - t0) + ' ms');
  }
  await browser.close();
}

async function cmdPreview() {
  mkdirSync('out/pruefung', { recursive: true });
  const browser = await launch();
  const page = await openPage(browser);
  const meta = await page.evaluate(() => window.storyMeta());
  const files = [];
  const n = Number(opt('n', 1));
  const only = opt('shots', '').split(',').filter(Boolean).map(Number);
  for (const s of meta.shots) {
    if (only.length && !only.includes(s.id)) continue;
    for (let j = 0; j < n; j++) {
      const k = n === 1 ? 0.55 : 0.08 + (0.84 * j) / (n - 1);
      const t = Math.round((s.start + (s.end - s.start) * k) * 30) / 30;
      const f = `out/pruefung/einstellung_${String(s.id).padStart(2, '0')}${n > 1 ? '_' + j : ''}.jpg`;
      await shot(page, t, f, true);
      files.push(f);
      console.log(f, 't=' + t.toFixed(2));
    }
  }
  await browser.close();
  const out = n === 1 && !only.length ? 'out/vorschau.jpg' : 'out/vorschau_detail.jpg';
  tileSheet(files, out, n === 1 ? 7 : Math.min(n * 2, 6), 270, 480);
  console.log(out);
}

async function cmdCheck() {
  let fail = 0;
  const story = JSON.parse(readFileSync('dist/story.json', 'utf8'));
  // 1) Augen: kein Objekt mit verbotenem Namen (Quelltext und Szene)
  const srcFiles = [];
  const walk = (d) => { for (const f of readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) walk(p); else if (p.endsWith('.js')) srcFiles.push(p); } };
  walk('src');
  for (const f of srcFiles) {
    readFileSync(f, 'utf8').split('\n').forEach((ln, i) => {
      for (const m of ln.matchAll(/['"`]([A-Za-z0-9_\-]+)['"`]/g)) if (FORBIDDEN.test(m[1])) { console.log(`FEHLER ${f}:${i + 1}: Name "${m[1]}"`); fail++; }
    });
  }
  const browser = await launch();
  const page = await openPage(browser);
  const names = await page.evaluate(() => window.meshNames());
  const bad = [...new Set(names.filter((n) => FORBIDDEN.test(n)))];
  if (bad.length) { console.log('FEHLER Szene: verbotene Namen', bad); fail++; }
  console.log(`Augen-Namen: ${srcFiles.length} Quelldateien, ${names.length} Objekte, verbotene Namen: ${bad.length}`);
  const meta = await page.evaluate(() => window.storyMeta());
  if (meta.draft) console.log('HINWEIS: Zeiten sind ein ENTWURF (keine Stimme vorhanden).');

  // 2) Texte ausserhalb der TikTok-Bereiche (alle 0,1 s)
  let layoutBad = 0;
  for (let t = 0; t <= meta.duration; t += 0.1) {
    const out = await page.evaluate((tt) => window.checkLayout(tt), t);
    if (out.length) { layoutBad++; if (layoutBad <= 5) console.log('FEHLER Text in TikTok-Bereich bei t=' + t.toFixed(2), JSON.stringify(out[0])); }
  }
  if (layoutBad) fail++;
  console.log('Texte:', layoutBad ? layoutBad + ' Zeitpunkte mit Ueberschneidung' : 'alle ausserhalb der TikTok-Bereiche');

  // 3) Gesichter, Haende, Fuehrerschein nicht unter Texten / TikTok-Elementen (alle 0,2 s)
  let kpBad = 0;
  const kpSeen = new Set();
  for (let t = 0; t <= meta.duration; t += 0.2) {
    const out = await page.evaluate((tt) => window.keyPointCheck(tt), t);
    for (const b of out) {
      const key = b.name + '|' + b.where;
      kpBad++;
      if (!kpSeen.has(key)) { kpSeen.add(key); console.log(`FEHLER t=${t.toFixed(1)} ${b.name} unter ${b.where} (x ${b.x}, y ${b.y})`); }
    }
  }
  if (kpBad) fail++;
  console.log('Gesichter/Haende:', kpBad ? kpBad + ' Treffer' : 'frei von Texten und TikTok-Bereichen');

  // 4) Kontrast des Titels (mind. 4,5 : 1)
  const tt = story.title.end;
  let minRatio = 99;
  for (const t of [0.2, tt * 0.5, tt - 0.1]) {
    const res = await page.evaluate((x) => window.titleContrast(x), t);
    for (const r of res) minRatio = Math.min(minRatio, r.ratio);
    console.log(`Titel-Kontrast t=${t.toFixed(1)}: ` + res.map((r) => `"${r.text}" ${r.ratio}:1`).join(', '));
  }
  if (minRatio < 4.5) { console.log('FEHLER Titel-Kontrast unter 4,5 : 1'); fail++; }

  // 5) Untertitel Wort fuer Wort = Sprechertext
  const cues = await page.evaluate(() => window.subtitleCues());
  for (const s of story.script) {
    if (s.subtitle === false) continue;
    const want = s.display ?? s.text.toLowerCase();
    const got = cues.filter((c) => c.text && want.includes(c.text)).map((c) => c.text).join(' ');
    if (got !== want) { console.log(`FEHLER Untertitel Satz ${s.id}: "${got}" statt "${want}"`); fail++; }
  }
  console.log(`Untertitel: ${cues.length} Eintraege, Text gegen Sprechertext geprueft`);

  // 6) Zaehler: 0:00 genau beim Wortanfang
  for (const c of story.counters) {
    const w = story.timing.sentences.find((s) => s.id === c.zeroAt.sentence).words.find((x) => norm(x.word) === norm(c.zeroAt.word));
    const f0 = Math.ceil(w.start * 30 - 1e-6);
    const vals = await page.evaluate(([a, b]) => [a, b].map((f) => { window.renderAt(f / 30); return document.querySelector('.c-num').textContent; }), [f0 - 1, f0]);
    const ok = vals[1] === '0:00' && vals[0] === '0:01';
    console.log(`Zaehler "${c.zeroAt.word}" (Wort ab ${w.start.toFixed(3)} s): Frame ${f0 - 1} ${vals[0]}, Frame ${f0} ${vals[1]} ${ok ? 'OK' : 'FEHLER'}`);
    if (!ok) fail++;
  }

  // 7) Determinismus
  const hashes = [];
  for (let i = 0; i < 2; i++) {
    await page.evaluate(() => window.renderAt(9.3));
    hashes.push(createHash('md5').update(await page.screenshot({ clip: { x: 0, y: 0, width: W, height: H } })).digest('hex'));
    await page.evaluate(() => window.renderAt(30.1));
  }
  console.log('Determinismus:', hashes[0] === hashes[1] ? 'gleich' : 'UNTERSCHIEDLICH');
  if (hashes[0] !== hashes[1]) fail++;
  await browser.close();
  if (fail) { console.log('PRUEFUNG FEHLGESCHLAGEN (' + fail + ')'); process.exitCode = 1; } else console.log('PRUEFUNG OK');
}

// Bildausschnitt-Optimierer: schreibt camera.adjust in story/shots.json
async function cmdFrame() {
  const only = (args[1] || '').split(',').filter(Boolean).map(Number);
  const browser = await launch();
  const page = await openPage(browser);
  const meta = await page.evaluate(() => window.storyMeta());
  const story = JSON.parse(readFileSync('story/shots.json', 'utf8'));
  for (const s of meta.shots) {
    if (only.length && !only.includes(s.id)) continue;
    const r = await page.evaluate((id) => window.solveFraming(id), s.id);
    const sh = story.shots.find((x) => x.id === s.id);
    const adj = r.best;
    if (adj.pan === 0 && adj.tilt === 0 && adj.zoom === 1) delete sh.camera.adjust; else sh.camera.adjust = adj;
    console.log(`Einstellung ${s.id}: vorher ${r.before} Treffer -> pan ${adj.pan}, tilt ${adj.tilt}, zoom ${adj.zoom}, Rest: ${r.issues.length ? r.issues.join(' | ') : 'keine'}`);
  }
  writeFileSync('story/shots.json', JSON.stringify(story, null, 1));
  await browser.close();
}

// Schnellpruefung: Gesichter/Haende je Einstellung (alle 0,2 s)
async function cmdKeypoints() {
  const browser = await launch();
  const page = await openPage(browser);
  const meta = await page.evaluate(() => window.storyMeta());
  const only = (args[1] || '').split(',').filter(Boolean).map(Number);
  for (const s of meta.shots) {
    if (only.length && !only.includes(s.id)) continue;
    const seen = new Map();
    for (let t = s.start + 0.02; t < s.end; t += 0.2) {
      const out = await page.evaluate((tt) => window.keyPointCheck(tt), t);
      for (const b of out) { const k = b.name + ' ' + b.where; if (!seen.has(k)) seen.set(k, `t=${t.toFixed(1)} (${b.x},${b.y})`); else seen.set(k, seen.get(k).replace(/ \+\d+$/, '') + ' +'); }
    }
    console.log(`Einstellung ${s.id}: ` + (seen.size ? [...seen].map(([k, v]) => k + ' ' + v).join(' | ') : 'OK'));
  }
  await browser.close();
}

async function cmdExport() {
  mkdirSync('out', { recursive: true });
  const story = JSON.parse(readFileSync('dist/story.json', 'utf8'));
  const browser = await launch();
  const page = await openPage(browser);
  const cues = await page.evaluate(() => window.subtitleCues());
  const srt = cues.map((c, i) => `${i + 1}\n${srtTime(c.start)} --> ${srtTime(c.end)}\n${c.text}\n`).join('\n');
  writeFileSync('out/untertitel.srt', srt);
  const tr = existsSync('audio/transkript.json') ? JSON.parse(readFileSync('audio/transkript.json', 'utf8')) : null;
  const viaWhisper = tr && !tr.method;
  const head = story.timing.draft ? 'ENTWURF: Zeiten geschaetzt, noch keine Stimme.'
    : viaWhisper ? 'Zeiten aus audio/transkript.json (faster-whisper auf audio/stimme.wav).'
      : `Zeiten aus audio/transkript.json: ${tr.method}. Die Woerter sind der bekannte Sprechertext, am Signal ausgerichtet (keine Spracherkennung).`;
  const lines = [head + '\n'];
  for (const c of cues) lines.push(`${srtTime(c.start)} - ${srtTime(c.end)}  ${c.text}\n    ${viaWhisper ? 'erkannt' : 'Woerter'}: ${c.words.join(' ')}`);
  writeFileSync('out/abgleich.txt', lines.join('\n') + '\n');
  const track = await page.evaluate(() => window.motionTrack(1 / 60));
  const events = [];
  for (const sh of story.shots) for (const fx of sh.sfx || []) events.push({ ...fx, t: sh.start + fx.t, until: fx.until !== undefined ? sh.start + fx.until : undefined, shot: sh.id });
  writeFileSync('out/bewegung.json', JSON.stringify({
    duration: story.timing.duration, draft: story.timing.draft,
    shots: story.shots.map((s) => ({ id: s.id, start: s.start, end: s.end, set: s.set, light: s.light, black: !!s.black })),
    ambience: story.ambience, events, frames: track,
    words: story.timing.sentences.flatMap((s) => s.words.map((w) => [w.start, w.end])),
  }));
  await browser.close();
  console.log(`out/untertitel.srt (${cues.length} Untertitel), out/abgleich.txt, out/bewegung.json (${track.length} Schritte)`);
}

async function cmdFrames() {
  const workers = Number(opt('workers', 1));
  if (!flag('keep')) rmSync('frames', { recursive: true, force: true });
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
      const file = `frames/${String(f).padStart(5, '0')}.jpg`;
      if (flag('keep') && existsSync(file)) { done++; continue; }
      await shot(page, f / meta.fps, file, false);
      done++;
      if (done % 60 === 0) {
        const el = (Date.now() - t0) / 1000;
        console.log(`${done}/${to - from} Frames, ${(el / done).toFixed(2)} s/Frame, Rest ca. ${Math.round((el / done) * (to - from - done))} s`);
      }
    }
  }));
  await browser.close();
  console.log(`Frames fertig: ${to - from} in ${Math.round((Date.now() - t0) / 1000)} s (Dauer ${meta.duration} s)`);
}

async function cmdVideo() {
  mkdirSync('out', { recursive: true });
  const audio = opt('audio', 'out/mix.wav');
  ffmpeg(['-framerate', '30', '-i', 'frames/%05d.jpg', '-i', audio, '-c:v', 'libx264', '-preset', 'medium', '-crf', '22', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', opt('out', 'out/video.mp4')]);
  const video = opt('out', 'out/video.mp4');
  const base = video === 'out/video.mp4' ? 'out/' : video.replace(/\.mp4$/, '_');
  ffmpeg(['-i', 'frames/00045.jpg', '-q:v', '2', base + 'cover.jpg']);
  rmSync('out/.ks', { recursive: true, force: true });
  mkdirSync('out/.ks', { recursive: true });
  ffmpeg(['-i', video, '-vf', 'fps=1,scale=216:384', path.join('out/.ks', '%03d.png')]);
  const n = readdirSync('out/.ks').length;
  ffmpeg(['-framerate', '1', '-i', 'out/.ks/%03d.png', '-vf', `tile=8x${Math.ceil(n / 8)}:padding=4:margin=4:color=0x111111`, '-frames:v', '1', '-q:v', '3', base + 'kontaktbogen.jpg']);
  rmSync('out/.ks', { recursive: true, force: true });
  console.log(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_name,width,height,r_frame_rate,sample_rate,channels:format=duration,size', '-of', 'default=nw=1', video]).toString().trim());
}

try {
  if (cmd === 'sheet') await cmdSheet();
  else if (cmd === 'heads') await cmdHeads(args.slice(1).filter((a) => !a.startsWith('--')));
  else if (cmd === 'stills') await cmdStills(args.slice(1).filter((a) => !a.startsWith('--') && !isNaN(Number(a))));
  else if (cmd === 'preview') await cmdPreview();
  else if (cmd === 'check') await cmdCheck();
  else if (cmd === 'export') await cmdExport();
  else if (cmd === 'kp') await cmdKeypoints();
  else if (cmd === 'frame') await cmdFrame();
  else if (cmd === 'frames') await cmdFrames();
  else if (cmd === 'video') await cmdVideo();
  else console.log(readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(0, 13).join('\n'));
} finally {
  if (server) server.kill();
}
