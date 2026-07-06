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
import { modules, sealInfoById } from '../data/modules'

import * as fundament from '../data/seals/fundament'
import * as abraham from '../data/seals/abraham'
import * as mose from '../data/seals/mose'
import * as arabien from '../data/seals/arabien'
import * as hohelied from '../data/seals/hohelied'
import * as daniel from '../data/seals/daniel'
import * as paraklet from '../data/seals/paraklet'
import * as erwartung from '../data/seals/erwartung'
import * as verteidigung from '../data/seals/verteidigung'
import * as wahrheitssuche from '../data/seals/wahrheitssuche'
import * as gotteskonzept from '../data/seals/gotteskonzept'
import * as wahrerJesus from '../data/seals/wahrer-jesus'
import * as kreuz from '../data/seals/kreuz'
import * as botschaft from '../data/seals/botschaft'
import * as angekuendigt from '../data/seals/angekuendigt'

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
  // Buchreihe "Jesus, der Gesandte Gottes"
  wahrheitssuche,
  gotteskonzept,
  'wahrer-jesus': wahrerJesus,
  kreuz,
  botschaft,
  angekuendigt,
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

/** Gesprächskontext für Folgefragen („Belege dazu?", „Warum?") */
export interface AntwortKontext {
  /** Buch der letzten Antwort — Folgefragen bleiben bevorzugt dort */
  sealId?: string | null
  /** Themen-Tokens der letzten Frage/Antwort (für anaphorische Fragen) */
  themaTokens?: string[]
  /** Schlüssel bereits gezeigter Passagen — nicht wiederholen */
  ausgeschlossen?: string[]
}

/** stabiler Schlüssel einer Passage (für „nicht wiederholen") */
export function passageKey(p: Passage): string {
  return [p.sealId, p.art, p.belegRef ?? p.titel ?? p.einwand ?? p.text.slice(0, 60)].join('|')
}

function quelleFuer(sealId: string): string {
  const info = sealInfoById[sealId]
  return info ? `${info.zaehler} · ${info.titel}` : sealId
}

function linkFuer(p: Passage): string {
  const moduleId = sealInfoById[p.sealId]?.moduleId ?? 'muhammad'
  const base = `/modul/${moduleId}/buch/${p.sealId}`
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
  for (const mod of modules) {
    for (const s of mod.siegel) {
      sealTok[s.id] = new Set(tokenize([s.titel, ...s.keywords].join(' ')))
    }
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

// ---- Folgefragen: Absicht + Anapher ----------------------------------------
// Erkannt auf dem NORMALISIERTEN Text (Umlaute → ae etc., wie tokenize).
const INTENTS: [RegExp, PassageArt][] = [
  [/\b(beleg|belege|beweis|beweise|quelle|quellen|vers|verse|stelle|stellen|fundstelle|woher|zitat)\b/, 'beleg'],
  [/\b(gelehrte|gelehrten|wissenschaftler|forscher|rabbiner|professor|kommentar|autoritaet)\b/, 'gelehrte'],
  [/\b(einwand|einwaende|kritik|kritiker|gegenargument|gegenargumente|dagegen|widerspruch|entgegnung)\b/, 'konter'],
  [/\b(these|kernaussage|zusammenfassung|worum|kurzfassung)\b/, 'these'],
]
const ANAPHER = /\b(dazu|dafuer|dagegen|darauf|daran|davon|dies|dieser|diese|dieses|mehr|weiter|genauer|noch|warum|wieso|weshalb|stimmt|wirklich|sicher)\b/

// Zeigewörter tragen kein Thema — nie als Themen-Token werten.
const DEIKTIK = new Set(['dazu', 'dafuer', 'dagegen', 'darauf', 'daran', 'davon', 'dies', 'diese', 'dieser', 'dieses'])
// Intent-Trigger (kanonisierte Formen via tokenize) — bei Folgefragen aus der
// Themen-Wertung nehmen: "Einwände dagegen?" sagt WAS für eine Antwort gewünscht
// ist, nicht WORÜBER; sonst zieht das Wort selbst ins falsche Buch.
const INTENT_TRIGGER: Record<PassageArt, Set<string>> = {
  beleg: new Set(tokenize('beleg belege beweis beweise quelle quellen vers verse stelle stellen fundstelle woher zitat')),
  gelehrte: new Set(tokenize('gelehrte gelehrten wissenschaftler forscher rabbiner professor kommentar autoritaet')),
  konter: new Set(tokenize('einwand einwaende kritik kritiker gegenargument gegenargumente widerspruch entgegnung')),
  these: new Set(tokenize('these kernaussage zusammenfassung kurzfassung')),
  schritt: new Set(),
}

// ---- die Antwort -----------------------------------------------------------
export function antworte(frage: string, ctx?: AntwortKontext): Antwort | null {
  let qTokens = Array.from(new Set(tokenize(frage)))
  if (qTokens.length === 0) return null
  const qNorm = normalize(frage).trim()

  const intent = INTENTS.find(([re]) => re.test(qNorm))?.[1] ?? null
  // Folgefrage = es gibt Kontext UND die Frage ist kurz, hat eine erkennbare
  // Absicht oder verweist anaphorisch zurück ("dazu", "warum", …). Lange,
  // inhaltsreiche Fragen stehen für sich — kein klebriger Kontext.
  const folge = !!ctx && (qTokens.length <= 3 || intent !== null || (qTokens.length <= 6 && ANAPHER.test(qNorm)))
  const ctxSeal = folge ? ctx?.sealId ?? null : null
  const ctxTokens = folge && ctx?.themaTokens ? new Set(ctx.themaTokens) : null
  const ausgeschlossen = new Set(ctx?.ausgeschlossen ?? [])

  // Themen-Tokens bereinigen: Zeigewörter immer raus; in Folgefragen auch die
  // Intent-Trigger (sie beschreiben die Antwort-ART, nicht das Thema).
  qTokens = qTokens.filter((t) => !DEIKTIK.has(t))
  if (folge && intent) qTokens = qTokens.filter((t) => !INTENT_TRIGGER[intent].has(t))
  if (qTokens.length === 0 && !folge) return null

  // Die kuratierte Suche als thematischer Kompass: ihr Top-Treffer kennt
  // Tag-Synonyme ("gleicht" → Vergleichstabelle), die reiner Prosa fehlen.
  // Bei FOLGEFRAGEN gilt der Gesprächskontext, nicht der Kompass — sonst
  // zieht "Welche Einwände gibt es?" ins Einwände-Buch statt beim Thema zu
  // bleiben. (Der Exponat-Direktlink unten nutzt den Kompass trotzdem.)
  const kompass = search(frage, 1)[0]
  const kompassSeal = !folge && kompass && kompass.score >= 6 ? kompass.entry.sealId : null

  const scored: { p: Prepared; score: number }[] = []
  const verdeckt: { p: Prepared; score: number }[] = [] // bereits gezeigt
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
    // Gesprächskontext: Folgefragen bleiben im Buch der letzten Antwort und
    // erben deren Thema — so versteht die Engine "Belege dazu?" oder "Warum?"
    if (folge && ctxSeal && p.passage.sealId === ctxSeal) {
      score += 3
      matched++
    }
    if (ctxTokens) {
      for (const t of ctxTokens) if (p.tokens.has(t)) score += 0.6
    }
    if (matched === 0) continue
    // Absicht der Folgefrage: "Belege?" → Verse, "Gelehrte?" → Notizen, …
    if (intent && p.passage.art === intent) score += 3.5
    // Phrasen-Bonus: die Frage kommt (teilweise) wörtlich vor
    if (qNorm.length > 8 && p.raw.includes(qNorm)) score += 6
    // Abdeckungs-Bonus: viele Frage-Tokens getroffen → präzisere Passage
    if (qTokens.length > 0) score += (matched / qTokens.length) * 4
    // Bei breiten Fragen ist die These die beste Tür ins Thema
    if (p.passage.art === 'these') score += 1.5
    // Buch des Such-Kompasses bevorzugen
    if (kompassSeal && p.passage.sealId === kompassSeal) score += 2.5
    // Kurze Passagen nicht bevorzugen, aber Riesen-Texte leicht dämpfen
    if (p.passage.text.length > 900) score -= 1

    if (ausgeschlossen.has(passageKey(p.passage))) verdeckt.push({ p, score })
    else scored.push({ p, score })
  }
  // Nichts Neues mehr? Dann lieber eine schon gezeigte Passage als gar keine.
  if (scored.length === 0 && verdeckt.length > 0) scored.push(...verdeckt)
  if (scored.length === 0) return null
  scored.sort((a, b) => b.score - a.score)

  const top = scored[0]
  // Schwelle: mindestens zwei getroffene Inhaltstoken bzw. solide Punktzahl,
  // sonst lieber ehrlich "keine Antwort" statt einer zufälligen Passage.
  // Folgefragen mit Kontext dürfen knapper sein.
  const minScore = folge ? 4 : qTokens.length >= 2 ? 6 : 4
  if (top.score < minScore) return null

  const best = top.p.passage
  const mehr: Antwort['mehr'] = []
  const seen = new Set<string>([best.sealId + '|' + (best.titel ?? best.art)])

  // Kuratierter Exponat-Treffer (z. B. die 15-Kriterien-Tabelle) als
  // Direkt-Link — die Suche kennt diese Ziele, die Prosa-Passagen nicht.
  if (kompass && kompass.score >= 6 && kompass.entry.anchor) {
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
