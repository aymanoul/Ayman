// Erzeugt die Schrift-Textur für Blender (arabische Schrift braucht einen Browser für die richtige Buchstabenverbindung).
//   node tools/blender_tex.mjs   → blender/tex/kalligraphie.png
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const font = fs.readFileSync(path.join(ROOT, 'node_modules/@fontsource/amiri/files/amiri-arabic-700-normal.woff2')).toString('base64');
const html = `<html><head><style>
@font-face { font-family: Amiri; font-weight: 700; src: url(data:font/woff2;base64,${font}) format('woff2'); }
body { margin: 0 } </style></head><body><canvas id="c" width="1280" height="320"></canvas><script>
document.fonts.load('700 100px Amiri').then(() => {
  const c = document.getElementById('c'), g = c.getContext('2d');
  g.fillStyle = '#2a1d0c'; g.fillRect(0, 0, 1280, 320);
  g.strokeStyle = '#c99b45'; g.lineWidth = 14; g.strokeRect(16, 16, 1248, 288);
  g.strokeStyle = '#8a6a2c'; g.lineWidth = 4; g.strokeRect(34, 34, 1212, 252);
  g.fillStyle = '#e2bb62'; g.font = '700 150px Amiri'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.direction = 'rtl';
  g.fillText('لا إله إلا الله محمد رسول الله', 640, 150, 1140);
  window.done = c.toDataURL('image/png');
});
</script></body></html>`;
const b = await chromium.launch();
const p = await b.newPage();
await p.setContent(html);
await p.waitForFunction('window.done');
const data = await p.evaluate('window.done');
fs.writeFileSync(path.join(ROOT, 'blender/tex/kalligraphie.png'), Buffer.from(data.split(',')[1], 'base64'));
await b.close();
console.log('blender/tex/kalligraphie.png');
