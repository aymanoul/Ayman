// Logo fuer TikTok: node tools/logo.mjs [stills|alles]
//   out/logo/profilbild.png        1080 x 1080, Figur im Kreis (TikTok zeigt Profilbilder rund)
//   out/logo/logo_mit_schrift.png  1080 x 1080, Figur + Schriftzug "nursimuliert"
//   out/logo/logo_animiert.mp4     4-s-Schleife (H.264), out/logo/logo_animiert.gif
//   out/logo/pruefung_kreis.png    Profilbild mit rotem Kreis (Ausschnitt in der App)
import * as esbuild from 'esbuild';
import { chromium } from 'playwright';
import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, copyFileSync, rmSync } from 'node:fs';
import http from 'node:http';

const PORT = 8081, URL = `http://localhost:${PORT}/logo.html`, S = 1080, FPS = 30, T = 4.0;
mkdirSync('dist-logo', { recursive: true });
await esbuild.build({ entryPoints: { logo: 'src/logo/logo.js' }, bundle: true, outdir: 'dist-logo', format: 'iife', logLevel: 'warning' });
await esbuild.build({ entryPoints: { logo: 'src/logo/logo.css' }, bundle: true, outdir: 'dist-logo', loader: { '.woff2': 'file', '.woff': 'file' }, assetNames: 'fonts/[name]', logLevel: 'warning' });
copyFileSync('src/logo/logo.html', 'dist-logo/logo.html');

const ping = () => new Promise((r) => { const q = http.get(URL, (x) => { x.resume(); r(x.statusCode === 200); }); q.on('error', () => r(false)); });
const server = spawn('npx', ['http-server', 'dist-logo', '-p', String(PORT), '-s', '-c-1'], { stdio: 'ignore' });
for (let i = 0; i < 60 && !(await ping()); i++) await new Promise((r) => setTimeout(r, 250));
const ff = (a) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...a], { stdio: 'inherit' });

try {
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: S, height: S }, deviceScaleFactor: 1 });
  await page.goto(URL);
  await page.waitForFunction(() => window.ready === true, null, { timeout: 120000 });
  const bad = (await page.evaluate(() => window.meshNames())).filter((n) => /(eye|pupil|iris|lid|lash)/i.test(n));
  console.log('Augen-Pruefung (Objektnamen):', bad.length ? 'FEHLER ' + bad.join(',') : 'keine verbotenen Namen');
  mkdirSync('out/logo', { recursive: true });
  const snap = async (t, variant, file, guide = false) => {
    await page.evaluate(([tt, v, g]) => { window.showGuide(g); window.renderLogo(tt, v); }, [t, variant, guide]);
    await page.screenshot({ path: file, clip: { x: 0, y: 0, width: S, height: S } });
  };
  await snap(1.8, 'profil', 'out/logo/profilbild.png');
  await snap(1.8, 'profil', 'out/logo/pruefung_kreis.png', true);
  await snap(0.0, 'profil', 'out/logo/profilbild_ruhig.png');
  await snap(1.8, 'schrift', 'out/logo/logo_mit_schrift.png');
  console.log('Standbilder: out/logo/profilbild.png, profilbild_ruhig.png, logo_mit_schrift.png, pruefung_kreis.png');
  if (process.argv[2] === 'alles') {
    rmSync('out/logo/.frames', { recursive: true, force: true });
    mkdirSync('out/logo/.frames', { recursive: true });
    const n = Math.round(T * FPS);
    for (let f = 0; f < n; f++) await snap(f / FPS, 'profil', `out/logo/.frames/${String(f).padStart(4, '0')}.png`);
    ff(['-framerate', String(FPS), '-i', 'out/logo/.frames/%04d.png', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', 'out/logo/logo_animiert.mp4']);
    ff(['-framerate', String(FPS), '-i', 'out/logo/.frames/%04d.png', '-vf', 'fps=20,scale=540:540:flags=lanczos,split[a][b];[a]palettegen=max_colors=160[p];[b][p]paletteuse=dither=sierra2_4a', '-loop', '0', 'out/logo/logo_animiert.gif']);
    ff(['-i', 'out/logo/logo_animiert.mp4', '-vf', 'fps=3,scale=270:270,tile=6x2:padding=4:color=0x222222', '-frames:v', '1', 'out/logo/logo_ablauf.jpg']);
    rmSync('out/logo/.frames', { recursive: true, force: true });
    console.log('out/logo/logo_animiert.mp4, logo_animiert.gif, logo_ablauf.jpg');
  }
  await browser.close();
} finally {
  server.kill();
}
