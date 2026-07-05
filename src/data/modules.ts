import type { ModuleMeta, SealMeta } from './types'

// Die neun Buecher der Buchreihe "Der versiegelte Nektar". Inhalt je Buch
// in eigener Datendatei; dies ist das Rueckgrat fuer Bibliothek + Suche.
const modul1Siegel: SealMeta[] = [
  {
    id: 'fundament',
    nummer: '1',
    titel: 'Das Fundament',
    arabic: 'مكتوبًا',
    status: 'ready',
    keywords: ['koran', 'bewahrung', 'ahmad', 'aḥmad', '7:157', 'maktuban', 'maktūban', 'bibel', 'fälschung', 'tahrif', 'taḥrīf', 'verfälschung', 'spielregeln', 'methode', '61:6', '2:146', '5:68', 'fundament'],
  },
  {
    id: 'abrahams-nachkommen',
    nummer: '2',
    titel: 'Abrahams Nachkommen',
    arabic: 'إسماعيل',
    status: 'ready',
    keywords: ['abraham', 'ismael', 'ismail', 'nachkommen', 'bund', 'großes volk', 'goy gadol', 'genesis', 'maimonides', 'beschneidung', 'kedar', 'paran', 'hagar', 'isaak', 'zwölf fürsten', 'stammbaum', 'araber'],
  },
  {
    id: 'prophet-wie-mose',
    nummer: '3',
    titel: 'Prophet wie Mose',
    arabic: 'موسى',
    status: 'ready',
    keywords: ['mose', 'moses', 'musa', 'deuteronomium', '5. mose', '18:18', '18:15', 'brüder', 'aus ihren brüdern', 'esau', 'edom', '34:10', 'der prophet', 'paraklet', 'vergleich', 'worte in seinen mund', '73:15'],
  },
  {
    id: 'arabische-prophezeiungen',
    nummer: '4',
    titel: 'Arabische Prophezeiungen',
    arabic: 'فاران',
    status: 'ready',
    keywords: ['arabien', 'paran', 'pharan', 'kedar', 'qedar', 'sela', 'baca', 'baka', 'bakka', 'mekka', 'jesaja 42', 'jesaja 60', 'habakuk', 'teman', 'nebajot', 'zamzam', 'hadsch', 'pilgerfahrt', '5. mose 33', 'deuteronomium 33', 'psalm 84', 'drei aufstrahlungen', 'sinai', 'seir', 'karte', 'midrasch', 'sifre'],
  },
  {
    id: 'hohelied',
    nummer: '5',
    titel: 'Das Hohelied · Maḥamaddīm',
    arabic: 'محمد',
    status: 'ready',
    keywords: ['hohelied', 'schir ha-schirim', 'machamaddim', 'maḥamaddīm', 'mahamaddim', 'ḥ-m-d', 'hmd', 'chamad', 'salomo', '5:16', '5,16', 'wurzel', 'name muhammad', 'der gepriesene', 'begehrenswert', 'plural der hoheit', 'elohim', 'chamudot', 'ḥamudot', 'chemdat', 'ḥemdat', 'haggai', 'daniel 9', 'allegorie', 'targum', 'rashi'],
  },
  {
    id: 'daniel',
    nummer: '6',
    titel: 'Daniel',
    arabic: 'دانيال',
    status: 'ready',
    keywords: ['daniel', 'statue', 'traumbild', 'nebukadnezar', 'vier reiche', 'stein', '1453', '622', 'zeitstrahl', 'rom'],
  },
  {
    id: 'paraklet',
    nummer: '7',
    titel: 'Der Paraklet',
    arabic: 'أحمد',
    status: 'ready',
    keywords: ['paraklet', 'parakletos', 'paráklētos', 'periklytos', 'períklytos', 'johannes', 'johannes 14', 'johannes 16', 'tröster', 'beistand', 'geist der wahrheit', 'heiliger geist', 'aḥmad', 'ahmad', '61:6', '16:7', '16:13', '14:16', '14:26', 'geist oder gesandter', 'der gepriesene', 'griechisch'],
  },
  {
    id: 'juedische-erwartung',
    nummer: '8',
    titel: 'Jüdische Erwartung · Gleiche Maßstäbe',
    arabic: 'الميزان',
    status: 'ready',
    keywords: ['jüdische erwartung', 'gleiche maßstäbe', 'waage', 'al-mizan', 'al-mīzān', 'mizan', 'kriterien', 'maßstab', 'prüfsteine', 'prophet test', '5. mose 13', '5. mose 18', 'deuteronomium 13', 'andere götter', 'drei erwartungen', 'messias', 'elia', 'der prophet', 'qumran', '1qs', 'maimonides', 'doppelte maßstäbe', 'beweis', 'burhan', '55:7', '57:25', '2:111', '3:84'],
  },
  {
    id: 'verteidigung',
    nummer: '9',
    titel: 'Falscher Prophet?',
    arabic: 'الدفاع',
    status: 'ready',
    keywords: ['falscher prophet', 'verteidigung', 'al-difāʿ', 'einwände', 'kritik', 'abrogation', 'aufhebung', 'schwert', 'paulus', 'anomia', 'gesetzlosigkeit', 'zûd', 'zuwd', 'deut 18,20', 'früchte', 'matthäus 7', 'mt 5,17', 'jeremia 31', 'synopse', 'banu qurayza', 'doppelmaß', 'sprüche 20,10'],
  },
]

// Each seal gets a title image by convention: images/siegel/<id>.jpg.
// Drop the file in public/images/siegel/ (see public/images/README.md) and it
// appears in the carousel; until then a designed placeholder card is shown.
const withImages = (seals: SealMeta[]): SealMeta[] =>
  seals.map((s) => ({ ...s, image: `images/siegel/${s.id}.jpg` }))

export const module1: ModuleMeta = {
  id: 'muhammad',
  titel: 'Der versiegelte Nektar',
  arabic: 'الرحيق المختوم',
  status: 'available',
  heroImage: 'images/module/muhammad.jpg',
  siegel: withImages(modul1Siegel),
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
