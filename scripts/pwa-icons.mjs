// Erzeugt die PWA-App-Icons nach public/icons/: Medina-grüner Grund mit
// goldenem Achtstern (khatam) — passend zur Ornamentik der Seite.
// Aufruf: node scripts/pwa-icons.mjs  (braucht sharp, devDependency)
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const GREEN = '#14563c'
const GOLD = '#d9b56a'
const CREAM = '#f6efdd'

// Achtstern aus zwei rotierten Quadraten + Kern, zentriert in 512er-Fläche.
// pad steuert den Sicherheitsrand (maskable braucht ~20 %).
function svg(pad) {
  const c = 256
  const r = 256 - pad
  const half = r * 0.62
  const sq = (rot) =>
    `<rect x="${c - half}" y="${c - half}" width="${2 * half}" height="${2 * half}"
       fill="none" stroke="${GOLD}" stroke-width="${r * 0.09}"
       transform="rotate(${rot} ${c} ${c})"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
    <rect width="512" height="512" rx="${pad > 40 ? 0 : 96}" fill="${GREEN}"/>
    ${sq(0)}${sq(45)}
    <circle cx="${c}" cy="${c}" r="${r * 0.2}" fill="${CREAM}"/>
    <circle cx="${c}" cy="${c}" r="${r * 0.08}" fill="${GOLD}"/>
  </svg>`
}

mkdirSync('public/icons', { recursive: true })
const jobs = [
  ['icon-192.png', 192, 64],
  ['icon-512.png', 512, 64],
  ['maskable-512.png', 512, 112],
  ['apple-touch-icon.png', 180, 64],
]
for (const [name, size, pad] of jobs) {
  await sharp(Buffer.from(svg(pad))).resize(size, size).png().toFile(`public/icons/${name}`)
  console.log(name, 'ok')
}
