// ---------------------------------------------------------------------------
// Auto-extracted full-text per seal. We import every seal's data module and
// recursively collect ALL string values (Beleg fundstellen → verse numbers &
// book names; konter & scholar bodies → scholar names; theses & exhibits →
// descriptions). This becomes the catch-all layer of the search index, so a
// query for "Blenkinsopp", "16,7", "Habakuk" or "Sanhedrin 43a" finds the
// right seal even when it isn't a curated tag.
// ---------------------------------------------------------------------------

import * as fundament from './seals/fundament'
import * as abraham from './seals/abraham'
import * as mose from './seals/mose'
import * as arabien from './seals/arabien'
import * as hohelied from './seals/hohelied'
import * as daniel from './seals/daniel'
import * as paraklet from './seals/paraklet'
import * as erwartung from './seals/erwartung'
import * as verteidigung from './seals/verteidigung'

// sealId (route slug) → its data module
const MODULES: Record<string, Record<string, unknown>> = {
  fundament,
  'abrahams-nachkommen': abraham,
  'prophet-wie-mose': mose,
  'arabische-prophezeiungen': arabien,
  hohelied,
  daniel,
  paraklet,
  'juedische-erwartung': erwartung,
  verteidigung,
}

function collect(value: unknown, out: string[], depth: number): void {
  if (depth > 7) return
  if (typeof value === 'string') {
    if (value.length) out.push(value)
  } else if (Array.isArray(value)) {
    for (const v of value) collect(v, out, depth + 1)
  } else if (value && typeof value === 'object') {
    for (const v of Object.values(value as Record<string, unknown>)) collect(v, out, depth + 1)
  }
}

export const sealFullText: Record<string, string> = {}
for (const [sealId, mod] of Object.entries(MODULES)) {
  const out: string[] = []
  for (const exported of Object.values(mod)) collect(exported, out, 0)
  sealFullText[sealId] = out.join(' · ')
}
