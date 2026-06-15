import type { ModuleMeta, SealMeta } from './types'

// The nine seals of Module 1. Content for each lives in its own data object
// (added per seal); here is the spine the Bibliothek + search are built on.
const modul1Siegel: SealMeta[] = [
  {
    id: 'fundament',
    nummer: 'Fundament',
    titel: 'Das Fundament',
    arabic: 'مكتوبًا',
    status: 'ready',
    keywords: ['koran', 'bewahrung', 'ahmad', 'aḥmad', '7:157', 'maktuban', 'maktūban', 'bibel', 'fälschung', 'tahrif', 'taḥrīf', 'verfälschung', 'spielregeln', 'methode', '61:6', '2:146', '5:68', 'fundament'],
  },
  {
    id: 'abrahams-nachkommen',
    nummer: 'I',
    titel: 'Abrahams Nachkommen',
    arabic: 'إسماعيل',
    status: 'coming',
    keywords: ['abraham', 'ismael', 'nachkommen', 'bund', 'großes volk', 'genesis', 'maimonides', 'beschneidung'],
  },
  {
    id: 'prophet-wie-mose',
    nummer: 'II',
    titel: 'Prophet wie Mose',
    arabic: 'موسى',
    status: 'coming',
    keywords: ['mose', 'moses', 'deuteronomium', '18:18', 'brüder', 'esau', 'edom', '34:10'],
  },
  {
    id: 'arabische-prophezeiungen',
    nummer: 'III',
    titel: 'Arabische Prophezeiungen',
    arabic: 'فاران',
    status: 'coming',
    keywords: ['arabien', 'paran', 'kedar', 'sela', 'baca', 'mekka', 'jesaja 42', 'karte'],
  },
  {
    id: 'hohelied',
    nummer: 'IV',
    titel: 'Das Hohelied · Maḥamaddīm',
    arabic: 'محمد',
    status: 'coming',
    keywords: ['hohelied', 'machamaddim', 'maḥamaddīm', 'ḥ-m-d', 'salomo', '5:16', 'wurzel', 'stammbaum'],
  },
  {
    id: 'daniel',
    nummer: 'V',
    titel: 'Daniel',
    arabic: 'دانيال',
    status: 'ready',
    keywords: ['daniel', 'statue', 'traumbild', 'nebukadnezar', 'vier reiche', 'stein', '1453', '622', 'zeitstrahl', 'rom'],
  },
  {
    id: 'paraklet',
    nummer: 'VI',
    titel: 'Der Paraklet',
    arabic: 'أحمد',
    status: 'coming',
    keywords: ['paraklet', 'parakletos', 'periklytos', 'johannes', 'tröster', 'geist der wahrheit', 'aḥmad', '16:7'],
  },
  {
    id: 'juedische-erwartung',
    nummer: 'VII',
    titel: 'Jüdische Erwartung · Gleiche Maßstäbe',
    arabic: 'الميزان',
    status: 'coming',
    keywords: ['jüdische erwartung', 'gleiche maßstäbe', 'waage', 'kriterien', 'maßstab'],
  },
  {
    id: 'verteidigung',
    nummer: 'Verteidigung',
    titel: 'Falscher Prophet?',
    arabic: 'الدفاع',
    status: 'coming',
    keywords: ['falscher prophet', 'verteidigung', 'einwände', 'kritik', 'abrogation', 'schwert'],
  },
]

export const module1: ModuleMeta = {
  id: 'muhammad',
  titel: 'Muhammad in der Bibel',
  honorific: 'ﷺ',
  arabic: 'محمد',
  status: 'available',
  siegel: modul1Siegel,
}

export const module2: ModuleMeta = {
  id: 'jesus',
  titel: 'Jesus, der Gesandte Gottes',
  arabic: 'عيسى',
  status: 'coming',
  siegel: [],
}

export const modules: ModuleMeta[] = [module1, module2]

export function findModule(id: string | undefined): ModuleMeta | undefined {
  return modules.find((m) => m.id === id)
}

export function findSeal(moduleId: string | undefined, sealId: string | undefined) {
  const mod = findModule(moduleId)
  return mod?.siegel.find((s) => s.id === sealId)
}

// ---- Search index: keyword → destination ----------------------------------
export interface SearchHit {
  moduleId: string
  moduleTitel: string
  sealId: string
  nummer: string
  titel: string
  arabic?: string
}

export function searchSeals(query: string): SearchHit[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const hits: { hit: SearchHit; score: number }[] = []
  for (const mod of modules) {
    for (const seal of mod.siegel) {
      const hay = [seal.titel, seal.nummer, ...seal.keywords].join(' ').toLowerCase()
      let score = 0
      if (seal.titel.toLowerCase().includes(q)) score += 6
      if (seal.keywords.some((k) => k.toLowerCase() === q)) score += 5
      if (seal.keywords.some((k) => k.toLowerCase().includes(q))) score += 3
      if (hay.includes(q)) score += 1
      if (score > 0) {
        hits.push({
          score,
          hit: {
            moduleId: mod.id,
            moduleTitel: mod.titel,
            sealId: seal.id,
            nummer: seal.nummer,
            titel: seal.titel,
            arabic: seal.arabic,
          },
        })
      }
    }
  }
  return hits.sort((a, b) => b.score - a.score).map((h) => h.hit)
}
