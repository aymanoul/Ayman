// ---------------------------------------------------------------------------
// Lightweight semantic-ish search — fully client-side, no API. It understands
// natural-language queries by: normalizing (diacritics, ß, umlauts), dropping
// German stop-words, canonicalizing synonyms + name variants, then scoring each
// index entry by token overlap (tags weighted high), with prefix + fuzzy
// (Levenshtein) matching for typos and partial words. So "beweis dass mohammed
// und moses ähnlich sind als jesus" → the 15-criteria comparison table.
// ---------------------------------------------------------------------------

import { searchIndex, type IndexEntry } from '../data/searchIndex'
import { sealFullText } from '../data/sealText'

export interface SearchResult {
  entry: IndexEntry
  score: number
}

// ---- normalization --------------------------------------------------------
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip remaining diacritics (Hebrew/Arabic translit etc.)
}

const STOPWORDS = new Set([
  'der', 'die', 'das', 'dass', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'einem', 'einer', 'eines',
  'und', 'oder', 'aber', 'auch', 'ist', 'sind', 'war', 'waren', 'wird', 'werden', 'sein', 'seine',
  'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'mir', 'mich', 'dir', 'dich', 'uns', 'euch', 'man',
  'dafuer', 'fuer', 'auf', 'an', 'in', 'im', 'zu', 'zum', 'zur', 'von', 'vom', 'mit', 'bei', 'aus',
  'ueber', 'unter', 'nur', 'noch', 'schon', 'sehr', 'so', 'als', 'wie', 'wenn', 'dann', 'denn', 'weil',
  'ob', 'wo', 'wann', 'warum', 'welche', 'welcher', 'welches', 'dies', 'diese', 'dieser', 'dieses',
  'hier', 'da', 'mehr', 'alle', 'alles', 'bitte', 'moechte', 'will', 'haben', 'hat', 'habe', 'gibt',
  'zeig', 'zeige', 'finde', 'such', 'suche', 'brauche', 'beispielsweise', 'etwa', 'am', 'the', 'of',
])

// variant → canonical. Collapses name spellings and near-synonyms so paraphrases
// land on the same token.
const SYNONYMS: Record<string, string> = {
  // names
  mohammed: 'muhammad', mohamed: 'muhammad', muhammed: 'muhammad', mohammad: 'muhammad', mustafa: 'muhammad',
  moses: 'mose', musa: 'mose', mosis: 'mose',
  isa: 'jesus', christus: 'jesus', christ: 'jesus',
  ahmed: 'ahmad',
  ismail: 'ismael', ismaël: 'ismael',
  mekka: 'mekka', bakka: 'mekka', baca: 'mekka', bakkah: 'mekka',
  // relational / concept synonyms
  tabelle: 'vergleich', gegenueberstellung: 'vergleich', vergleichen: 'vergleich', gegenueber: 'vergleich',
  aehnlichkeit: 'aehnlich', gleicht: 'aehnlich', gleich: 'aehnlich', ebenbild: 'aehnlich', entspricht: 'aehnlich',
  beleg: 'beweis', belege: 'beweis', beweise: 'beweis', nachweis: 'beweis', argument: 'beweis', argumente: 'beweis',
  prophezeiungen: 'prophezeiung', weissagung: 'prophezeiung', vorhersage: 'prophezeiung', voraussage: 'prophezeiung', prophetie: 'prophezeiung',
  verfaelscht: 'verfaelschung', gefaelscht: 'verfaelschung', faelschung: 'verfaelschung', tahrif: 'verfaelschung',
  landkarte: 'karte', geografie: 'karte', geographie: 'karte', ort: 'karte', orte: 'karte',
  namen: 'name',
  juedisch: 'jude', juedische: 'jude', juden: 'jude', rabbiner: 'jude',
  schwert: 'gewalt', toetung: 'gewalt', getoetet: 'gewalt', krieg: 'gewalt',
  aufhebung: 'abrogation', naskh: 'abrogation',
  kriterium: 'kriterien',
  stammbaum: 'stammbaum', abstammung: 'stammbaum', genealogie: 'stammbaum', familie: 'stammbaum',
  troester: 'paraklet', beistand: 'paraklet', parakletos: 'paraklet', periklytos: 'paraklet',
  gesetzgeber: 'gesetz', scharia: 'gesetz',
  reich: 'reiche', weltreich: 'reiche', weltreiche: 'reiche',
  prophet: 'prophet',
  // book names / common abbreviations → the form used in the data
  deut: 'deuteronomium', dtn: 'deuteronomium',
  gen: 'genesis',
  joh: 'johannes', jh: 'johannes',
  mt: 'matthaeus', matt: 'matthaeus', matthaeus: 'matthaeus',
  ps: 'psalm', psalmen: 'psalm',
  jes: 'jesaja',
  hab: 'habakuk',
  hld: 'hohelied', hoheslied: 'hohelied',
  hag: 'haggai',
  dan: 'daniel',
  mal: 'maleachi',
  jer: 'jeremia',
  sure: 'koran', quran: 'koran', qurʾan: 'koran',
  bukhari: 'bukhari', sahih: 'bukhari',
}

function canon(tok: string): string {
  return SYNONYMS[tok] ?? tok
}

function tokenize(s: string): string[] {
  const norm = normalize(s)
  const out: string[] = []
  // verse references first: "18,18" · "16:7" · "53,3-4" → normalised "18:18", "53:3-4"
  const verses = norm.match(/\d{1,3}[.,:]\d{1,3}(?:\s?[-–—]\s?\d{1,3})?/g)
  if (verses) {
    for (const v of verses) out.push(v.replace(/[.,]/g, ':').replace(/\s/g, '').replace(/[–—]/g, '-'))
  }
  for (const t of norm.split(/[^a-z0-9]+/)) {
    if (t.length < 2) continue
    if (STOPWORDS.has(t)) continue
    out.push(canon(t))
  }
  return out
}

// ---- capped Levenshtein (returns >max early) ------------------------------
function lev(a: string, b: string, max: number): number {
  const al = a.length
  const bl = b.length
  if (Math.abs(al - bl) > max) return max + 1
  let prev = new Array(bl + 1)
  let cur = new Array(bl + 1)
  for (let j = 0; j <= bl; j++) prev[j] = j
  for (let i = 1; i <= al; i++) {
    cur[0] = i
    let best = cur[0]
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost)
      if (cur[j] < best) best = cur[j]
    }
    if (best > max) return max + 1
    ;[prev, cur] = [cur, prev]
  }
  return prev[bl]
}

// ---- prepared index (memoised) --------------------------------------------
interface Prepared {
  entry: IndexEntry
  tagTokens: Set<string>
  bodyTokens: Set<string>
  fullTokens: Set<string> // auto-extracted seal text (overview entries only)
  all: string[] // unique tokens for prefix/fuzzy
  raw: string // normalized full text for phrase boost
  isOverview: boolean
}

let PREP: Prepared[] | null = null

function prepare(): Prepared[] {
  if (PREP) return PREP
  PREP = searchIndex.map((entry) => {
    const tagTokens = new Set<string>()
    for (const tag of entry.tags) for (const t of tokenize(tag)) tagTokens.add(t)
    for (const t of tokenize(entry.label)) tagTokens.add(t)
    const bodyTokens = new Set<string>()
    for (const t of tokenize(entry.body)) bodyTokens.add(t)
    const all = Array.from(new Set([...tagTokens, ...bodyTokens]))
    const raw = normalize([entry.label, entry.tags.join(' '), entry.body, entry.kontext].join(' '))
    const isOverview = !entry.anchor
    // the seal-overview entry carries the whole seal's text as a catch-all,
    // so verse numbers, scholar & book names anywhere in the seal are findable.
    const fullTokens = new Set<string>()
    if (isOverview) {
      const ft = sealFullText[entry.sealId]
      if (ft) for (const t of tokenize(ft)) fullTokens.add(t)
    }
    return { entry, tagTokens, bodyTokens, fullTokens, all, raw, isOverview }
  })
  return PREP
}

// ---- the search -----------------------------------------------------------
export function search(query: string, limit = 7): SearchResult[] {
  const qTokens = Array.from(new Set(tokenize(query)))
  const qNorm = normalize(query).trim()
  if (qTokens.length === 0 && qNorm.length < 2) return []

  const prep = prepare()
  const results: SearchResult[] = []

  for (const p of prep) {
    let score = 0
    let matched = 0

    for (const qt of qTokens) {
      if (p.tagTokens.has(qt)) {
        score += 6
        matched++
        continue
      }
      if (p.bodyTokens.has(qt)) {
        score += 2.5
        matched++
        continue
      }
      // catch-all: any verse number, scholar/book name or word in the seal text
      if (p.fullTokens.has(qt)) {
        score += 1.5
        matched++
        continue
      }
      // prefix match (partial words: "muham", "prophez")
      let hit = false
      for (const t of p.all) {
        if (t.length >= 3 && (t.startsWith(qt) || qt.startsWith(t))) {
          score += 1.6
          hit = true
          break
        }
      }
      if (hit) {
        matched++
        continue
      }
      // fuzzy (typos)
      if (qt.length >= 4) {
        const max = qt.length >= 7 ? 2 : 1
        for (const t of p.all) {
          if (lev(qt, t, max) <= max) {
            score += 1
            matched++
            break
          }
        }
      }
    }

    if (qTokens.length > 0) score += (matched / qTokens.length) * 3 // coverage
    if (qNorm.length >= 3 && p.raw.includes(qNorm)) score += 5 // full-phrase boost
    if (p.isOverview) score += 0.4 // gently prefer the seal overview for bare names

    if (score >= 2.4 && matched > 0) results.push({ entry: p.entry, score })
  }

  results.sort((a, b) => b.score - a.score)
  return results.slice(0, limit)
}
