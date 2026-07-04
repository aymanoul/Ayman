// Schneidet die zwei hochgeladenen Mushaf-Ornament-Quellbilder (echte,
// KI-generierte Illustrationen, keine Vektoren) auf ihre border-image-fertige
// Form zu:
//
//   1. Autocrop: den leeren Cremerand um die eigentliche Zeichnung entfernen
//      (die Quellbilder haben unterschiedlich große Ränder, das würde die
//      Bordüre beim Skalieren auf CSS-Breite verwässern).
//   2. Die vermessenen Slice-Grenzen (siehe scripts/ornament-measure.py)
//      bleiben nach dem Crop gültig, weil wir exakt am Cream/Pattern-Rand
//      zuschneiden — kein zusätzlicher Versatz.
//
// Aufruf: node scripts/ornament-crop.mjs
// Erwartet: die "sharp"-Bibliothek (wird bei Bedarf installiert).

import sharp from 'sharp'
import { existsSync } from 'node:fs'

const SRC_DIR = 'src/assets/ornaments/source'
const OUT_DIR = 'src/assets/ornaments'

async function autocropToPattern(path, creamRGB, tol = 16) {
  const img = sharp(path).flatten({ background: '#ffffff' })
  const { width, height } = await img.metadata()
  const { data } = await img.raw().toBuffer({ resolveWithObject: true })

  const isCream = (r, g, b) => {
    const dr = r - creamRGB[0], dg = g - creamRGB[1], db = b - creamRGB[2]
    return Math.sqrt(dr * dr + dg * dg + db * db) < tol
  }

  let minX = width, maxX = -1, minY = height, maxY = -1
  const step = 2 // Subsampling reicht fürs Bounding-Box-Finden, spart Zeit
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 3
      if (!isCream(data[idx], data[idx + 1], data[idx + 2])) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  // kleine Sicherheitsspanne, damit keine Kante hart abgeschnitten wird
  const pad = 6
  minX = Math.max(0, minX - pad)
  minY = Math.max(0, minY - pad)
  maxX = Math.min(width - 1, maxX + pad)
  maxY = Math.min(height - 1, maxY + pad)

  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 }
}

// Vermessene Slice-Grenzen auf dem AUTOCROP-Ergebnis (siehe scripts/ornament-
// measure.py) — hier hart codiert, weil das Messen einmalig passiert ist.
// scale skaliert Bild + Slice-Werte gemeinsam auf eine web-taugliche Größe
// (die Quellbilder waren 2–2.7MB, viel größer als für eine ~120px-Bordüre
// bei 3x-DPI nötig).
const FRAME_SLICE = { top: 210, right: 205, bottom: 204, left: 203 }
const KART_SLICE = { top: 82, right: 574, bottom: 80, left: 571 }

async function run() {
  const frameSrc = `${SRC_DIR}/frame-raw.png`
  const kartSrc = `${SRC_DIR}/kartusche-raw.png`
  if (!existsSync(frameSrc) || !existsSync(kartSrc)) {
    console.error('Quellbilder fehlen in', SRC_DIR)
    process.exit(1)
  }

  const frameCream = [253, 247, 235]
  const kartCream = [252, 245, 233]

  const frameBox = await autocropToPattern(frameSrc, frameCream)
  console.log('frame bbox:', frameBox)
  const frameTargetW = 915
  const frameScale = frameTargetW / frameBox.width
  await sharp(frameSrc)
    .extract(frameBox)
    .resize({ width: frameTargetW })
    .webp({ quality: 86 })
    .toFile(`${OUT_DIR}/mushaf-frame-photo.webp`)
  const frameOut = Object.fromEntries(Object.entries(FRAME_SLICE).map(([k, v]) => [k, Math.round(v * frameScale)]))
  console.log('frame scale=%s -> slice:', frameScale.toFixed(4), frameOut)

  const kartBox = await autocropToPattern(kartSrc, kartCream)
  console.log('kartusche bbox:', kartBox)
  const kartTargetW = 1320
  const kartScale = kartTargetW / kartBox.width
  await sharp(kartSrc)
    .extract(kartBox)
    .resize({ width: kartTargetW })
    .webp({ quality: 86 })
    .toFile(`${OUT_DIR}/kartusche-photo.webp`)
  const kartOut = Object.fromEntries(Object.entries(KART_SLICE).map(([k, v]) => [k, Math.round(v * kartScale)]))
  console.log('kartusche scale=%s -> slice:', kartScale.toFixed(4), kartOut)

  console.log('done — cropped+resized assets written to', OUT_DIR)
}

run()
