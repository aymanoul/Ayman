// ---------------------------------------------------------------------------
// Die Antwort-Engine des Frage-Felds: beantwortet Fragen DIREKT aus den
// Inhalten der Website (keine externe KI, kein API-Schlüssel, nichts verlässt
// den Browser). Sie sammelt alle kuratierten Prosa-Passagen der neun Bücher —
// These, Beweisschritte, Einwand→Konter, Gelehrten-Notizen, Belege — und
// wählt per Token-Überlappung (gleiche Normalisierung/Synonyme wie die Suche)
// die beste Passage als Antwort aus, mit Quellenangabe und Link ins Buch.
//
// Bewusste Eigenschaft: Fragen, die wie ein bekannter EINWAND klingen
// („Wurde die Bibel nicht verfälscht?"), matchen auf den Einwand-Text,
// beantwortet wird aber mit dem KONTER — Frage → Antwort, nicht Frage → Echo.
// ---------------------------------------------------------------------------

import { tokenize, normalize, search } from './search'
import { belegList } from '../data/belegRegistry'
import { module1 } from '../data/modules'

import * as fundament from '../data/seals/fundament'
import * as abraham from '../data/seals/abraham'
import * as mose from '../data/seals/mose'
import * as arabien from '../data/seals/arabien'
import * as hohelied from '../data/seals/hohelied'
import * as daniel from '../data/seals/daniel'
import * as paraklet from '../data/seals/paraklet'
import * as erwartung from '../data/seals/erwartung'
import * as verteidigung from '../data/seals/verteidigung'

const SEAL_MODULES: Record<string, Record<string, unknown>> = {
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

export type PassageArt = 'these' | 'schritt' | 'konter' | 'gelehrte' | 'beleg'

export interface Passage {
  art: PassageArt
  sealId: string
  /** Überschrift der Passage (Schritt-/Gelehrten-Titel, Einwand-Text, Fundstelle) */
  titel?: string
  /** der eigentliche Antwort-Text */
  text: string
  /** nur bei art='konter': der Einwand, auf den der Text antwortet */
  einwand?: string
  /** nur bei art='beleg': Registry-Ref für das Modal (?beleg=…) */
  belegRef?: string
  fundstelle?: string
}

export interface Antwort {
  passage: Passage
  /** "Buch 6 · Daniel" */
  quelle: string
  /** Ziel-Route ins Buch (ggf. mit ?beleg=) */
  link: string
  /** bis zu 2 weitere passende Stellen (Titel + Link) */
  mehr: { label: string; quelle: string; link: string }[]
}

const SEAL_META: Record<string, { nummer: string; titel: string }> = {}
for (const s of module1.siegel) SEAL_META[s.id] = { nummer: s.nummer, titel: s.titel }

function quelleFuer(sealId: string): string {
  const m = SEAL_META[sealId]
  return m ? `Buch ${m.nummer} · ${m.titel}` : sealId
}

function linkFuer(p: Passage): string {
  const base = `/modul/muhammad/buch/${p.sealId}`
  return p.belegRef ? `${base}?beleg=${encodeURIComponent(p.belegRef)}` : base
}

// ---- Korpus (einmalig aufgebaut, memoisiert) -------------------------------
interface Prepared {
  passage: Passage
  tokens: Set<string>
  titelTokens: Set<string>
  /** Themen-Tokens des ganzen Buches (Keywords + Titel) — topischer Prior */
  sealTokens: Set<string>
  raw: string
}

let CORPUS: Prepared[] | null = null

function isSteps(v: unknown): v is { n: string; h: string; body: string }[] {
  return Array.isArray(v) && v.length > 0 && typeof (v[0] as { body?: unknown })?.body === 'string' && typeof (v[0] as { n?: unknown })?.n === 'string'
}
function isKonter(v: unknown): v is { einwand: string; konter: string }[] {
  return Array.isArray(v) && v.length > 0 && typeof (v[0] as { einwand?: unknown })?.einwand === 'string'
}
function isScholar(v: unknown): v is { h: string; body: string }[] {
  return (
    Array.isArray(v) && v.length > 0 &&
    typeof (v[0] as { h?: unknown })?.h === 'string' &&
    typeof (v[0] as { body?: unknown })?.body === 'string' &&
    (v[0] as { n?: unknown }).n === undefined &&
    (v[0] as { einwand?: unknown }).einwand === undefined
  )
}

function harvest(): Passage[] {
  const out: Passage[] = []
  for (const [sealId, mod] of Object.entries(SEAL_MODULES)) {
    for (const [key, value] of Object.entries(mod)) {
      if (/These$/.test(key) && typeof value === 'string') {
        out.push({ art: 'these', sealId, text: value })
      } else if (/Steps$/.test(key) && isSteps(value)) {
        for (const s of value) out.push({ art: 'schritt', sealId, titel: s.h, text: s.body })
      } else if (/Konter$/.test(key) && isKonter(value)) {
        for (const k of value) out.push({ art: 'konter', sealId, einwand: k.einwand, text: k.konter })
      } else if (/Scholar$/.test(key) && isScholar(value)) {
        for (const g of value) out.push({ art: 'gelehrte', sealId, titel: g.h, text: g.body })
      }
    }
  }
  // Belege: Übersetzung (bzw. Kurztext) ist zitierfähige Antwort auf Vers-Fragen
  for (const { ref, sealId, beleg } of belegList) {
    const text = beleg.uebersetzung ?? beleg.kurz
    if (!text) continue
    out.push({ art: 'beleg', sealId, titel: beleg.kurz, text, belegRef: ref, fundstelle: beleg.fundstelle })
  }
  return out
}

function corpus(): Prepared[] {
  if (CORPUS) return CORPUS
  // Buch-Themen-Tokens einmal je Buch (Keywords + Titel aus modules.ts)
  const sealTok: Record<string, Set<string>> = {}
  for (const s of module1.siegel) {
    sealTok[s.id] = new Set(tokenize([s.titel, ...s.keywords].join(' ')))
  }
  CORPUS = harvest().map((passage) => {
    const titelParts = [passage.titel ?? '', passage.einwand ?? '', passage.fundstelle ?? '']
    const titelTokens = new Set<string>(tokenize(titelParts.join(' ')))
    const tokens = new Set<string>(tokenize(passage.text))
    for (const t of titelTokens) tokens.add(t)
    const raw = normalize(titelParts.concat(passage.text).join(' '))
    return { passage, tokens, titelTokens, sealTokens: sealTok[passage.sealId] ?? new Set(), raw }
  })
  return CORPUS
}

// ---- die Antwort -----------------------------------------------------------
export function antworte(frage: string): Antwort | null {
  const qTokens = Array.from(new Set(tokenize(frage)))
  if (qTokens.length === 0) return null
  const qNorm = normalize(frage).trim()

  // Die kuratierte Suche als thematischer Kompass: ihr Top-Treffer kennt
  // Tag-Synonyme ("gleicht" → Vergleichstabelle), die reiner Prosa fehlen.
  const kompass = search(frage, 1)[0]
  const kompassSeal = kompass && kompass.score >= 6 ? kompass.entry.sealId : null

  const scored: { p: Prepared; score: number }[] = []
  for (const p of corpus()) {
    let score = 0
    let matched = 0
    for (const t of qTokens) {
      if (p.titelTokens.has(t)) {
        score += 3
        matched++
      } else if (p.tokens.has(t)) {
        score += 2
        matched++
      } else if (p.sealTokens.has(t)) {
        // Thema des Buches getroffen (z. B. "vergleich", "mose") — topischer
        // Prior, damit breite Fragen im richtigen Buch landen
        score += 1
        matched++
      }
    }
    if (matched === 0) continue
    // Phrasen-Bonus: die Frage kommt (teilweise) wörtlich vor
    if (qNorm.length > 8 && p.raw.includes(qNorm)) score += 6
    // Abdeckungs-Bonus: viele Frage-Tokens getroffen → präzisere Passage
    score += (matched / qTokens.length) * 4
    // Bei breiten Fragen ist die These die beste Tür ins Thema
    if (p.passage.art === 'these') score += 1.5
    // Buch des Such-Kompasses bevorzugen
    if (kompassSeal && p.passage.sealId === kompassSeal) score += 2.5
    // Kurze Passagen nicht bevorzugen, aber Riesen-Texte leicht dämpfen
    if (p.passage.text.length > 900) score -= 1
    scored.push({ p, score })
  }
  if (scored.length === 0) return null
  scored.sort((a, b) => b.score - a.score)

  const top = scored[0]
  // Schwelle: mindestens zwei getroffene Inhaltstoken bzw. solide Punktzahl,
  // sonst lieber ehrlich "keine Antwort" statt einer zufälligen Passage.
  const minScore = qTokens.length >= 2 ? 6 : 4
  if (top.score < minScore) return null

  const best = top.p.passage
  const mehr: Antwort['mehr'] = []
  const seen = new Set<string>([best.sealId + '|' + (best.titel ?? best.art)])

  // Kuratierter Exponat-Treffer (z. B. die 15-Kriterien-Tabelle) als
  // Direkt-Link — die Suche kennt diese Ziele, die Prosa-Passagen nicht.
  if (kompassSeal && kompass.entry.anchor) {
    mehr.push({
      label: kompass.entry.label,
      quelle: quelleFuer(kompass.entry.sealId),
      link: `/modul/${kompass.entry.moduleId}/buch/${kompass.entry.sealId}#${kompass.entry.anchor}`,
    })
    seen.add(kompass.entry.sealId + '|' + kompass.entry.label)
  }

  for (const { p, score } of scored.slice(1)) {
    if (mehr.length >= 2) break
    if (score < top.score * 0.45) break
    const key = p.passage.sealId + '|' + (p.passage.titel ?? p.passage.art)
    if (seen.has(key)) continue
    seen.add(key)
    const label =
      p.passage.art === 'beleg'
        ? p.passage.fundstelle ?? p.passage.titel ?? 'Beleg'
        : p.passage.titel ?? (p.passage.art === 'these' ? 'Die These' : 'Mehr dazu')
    mehr.push({ label, quelle: quelleFuer(p.passage.sealId), link: linkFuer(p.passage) })
  }

  return { passage: best, quelle: quelleFuer(best.sealId), link: linkFuer(best), mehr }
}
