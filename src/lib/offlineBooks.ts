// ---------------------------------------------------------------------------
// Offline-Bücher in IndexedDB (getrennt vom Service-Worker-Cache). Jedes der
// neun Bücher wird als eigener Datensatz gespeichert — Volltext, vorab
// berechneter Such-Index (Tokens), Metadaten, Download-Datum. So funktioniert
// die Suche in heruntergeladenen Büchern auch komplett offline.
// ---------------------------------------------------------------------------

import { sealFullText } from '../data/sealText'
import { tokenize } from './search'
import { module1 } from '../data/modules'

export interface OfflineBuch {
  sealId: string
  moduleId: string
  titel: string
  nummer: string
  text: string
  tokens: string[]
  bytes: number
  downloadedAt: number
}

const DB_NAME = 'bibliothek-offline'
const DB_VERSION = 1
const STORE = 'buecher'

let dbPromise: Promise<IDBDatabase> | null = null
function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'sealId' })
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  return dbPromise
}

function run<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const req = fn(db.transaction(STORE, mode).objectStore(STORE))
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error)
      })
  )
}

const META = new Map(module1.siegel.map((s) => [s.id, s]))

/** Ein Buch für Offline speichern (Volltext + Such-Index + Metadaten). */
export async function downloadBuch(sealId: string): Promise<OfflineBuch> {
  const meta = META.get(sealId)
  const text = sealFullText[sealId] ?? ''
  const tokens = Array.from(new Set(tokenize(text)))
  const bytes = new Blob([text, tokens.join(' ')]).size
  const rec: OfflineBuch = {
    sealId,
    moduleId: 'muhammad',
    titel: meta?.titel ?? sealId,
    nummer: meta?.nummer ?? '',
    text,
    tokens,
    bytes,
    downloadedAt: Date.now(),
  }
  await run('readwrite', (s) => s.put(rec))
  return rec
}

export function listBuecher(): Promise<OfflineBuch[]> {
  return run<OfflineBuch[]>('readonly', (s) => s.getAll() as IDBRequest<OfflineBuch[]>).then((l) =>
    l.sort((a, b) => Number(a.nummer) - Number(b.nummer))
  )
}

export function istOffline(sealId: string): Promise<boolean> {
  return run('readonly', (s) => s.get(sealId)).then((v) => !!v)
}

export function removeBuch(sealId: string): Promise<void> {
  return run<undefined>('readwrite', (s) => s.delete(sealId) as IDBRequest<undefined>).then(() => undefined)
}

export async function removeAlle(): Promise<void> {
  await run<undefined>('readwrite', (s) => s.clear() as IDBRequest<undefined>)
}

/** Volltextsuche AUSSCHLIESSLICH in heruntergeladenen Büchern (offline). */
export async function sucheOffline(query: string): Promise<{ sealId: string; titel: string; nummer: string; score: number }[]> {
  const q = Array.from(new Set(tokenize(query)))
  if (q.length === 0) return []
  const books = await listBuecher()
  const out = books.map((b) => {
    const set = new Set(b.tokens)
    let score = 0
    for (const t of q) if (set.has(t)) score++
    return { sealId: b.sealId, titel: b.titel, nummer: b.nummer, score }
  })
  return out.filter((r) => r.score > 0).sort((a, b) => b.score - a.score)
}
