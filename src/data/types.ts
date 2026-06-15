// ---------------------------------------------------------------------------
// Data contract for the platform. Every Siegel (seal) is a data object so new
// modules and seals drop straight in. Full verse / source texts live on the
// `Beleg` records and surface only inside the immersive modal — never as body
// copy on the surface.
// ---------------------------------------------------------------------------

export type Tier = 'stone' | 'marble' | 'red'
export type BelegTyp = 'quran' | 'bibel' | 'quelle'
export type Sprache = 'ar' | 'he' | 'grc'

export interface Beleg {
  typ: BelegTyp
  kurz: string // compact preview shown on the shimmering card
  original?: string // arabic / hebrew / greek source text
  sprache?: Sprache
  translit?: string
  uebersetzung?: string // German rendering, shown large in the modal
  fundstelle: string // Sure:Vers · Buch Kap,Vers · Werk, Band, Seite
  status?: string // e.g. "ṣaḥīḥ", "umstritten"
  kern?: string // the single word/phrase to illuminate
}

export interface SealMeta {
  id: string
  nummer: string // "Fundament" · "I"…"VII" · "Verteidigung"
  titel: string
  arabic?: string
  keywords: string[]
  status: 'ready' | 'coming'
}

export interface ModuleMeta {
  id: string
  titel: string
  honorific?: string // e.g. the ﷺ glyph
  arabic: string
  status: 'available' | 'coming'
  siegel: SealMeta[]
}
