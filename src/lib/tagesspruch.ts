import { belegList } from '../data/belegRegistry'
import { sealInfoById } from '../data/modules'

// "Vers des Tages" — deterministisch nach Kalendertag aus dem Beleg-Register
// gezogen (kein Zufall, kein Server): derselbe Tag zeigt überall denselben
// Fund. Rotiert einmal komplett durch alle Belege, bevor sie sich wiederholen.
export interface TagesBeleg {
  ref: string
  sealId: string
  zaehler: string
  titel: string
  text: string
  fundstelle: string
  link: string
}

function dayOfYear(d: Date): number {
  const start = Date.UTC(d.getFullYear(), 0, 1)
  const now = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
  return Math.floor((now - start) / 86400000)
}

export function tagesBeleg(date: Date = new Date()): TagesBeleg | null {
  const pool = belegList.filter((b) => !!b.beleg.kurz)
  if (pool.length === 0) return null
  const idx = dayOfYear(date) % pool.length
  const entry = pool[idx]
  const info = sealInfoById[entry.sealId]
  return {
    ref: entry.ref,
    sealId: entry.sealId,
    zaehler: info?.zaehler ?? '',
    titel: info?.titel ?? '',
    // `kurz` ist die kompakte Vorschau (Design-Vertrag in data/types.ts), extra
    // fuer solche Karten gedacht — `uebersetzung` traegt teils eingebettete
    // Zitate/Kommentare und wuerde mit den umschliessenden Anfuehrungszeichen
    // dieser Karte kollidieren.
    text: entry.beleg.kurz,
    fundstelle: entry.beleg.fundstelle,
    link: `/modul/${info?.moduleId ?? 'muhammad'}/buch/${entry.sealId}?beleg=${encodeURIComponent(entry.ref)}`,
  }
}
