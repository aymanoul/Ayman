// ---------------------------------------------------------------------------
// Lokale Datenhaltung (IndexedDB) für Nutzer-Daten: Favoriten, Notizen,
// Zuletzt gelesen. Alles bleibt auf dem Gerät — es gibt kein Backend, also
// keine Übertragung; die Daten überleben Reloads, Offline-Phasen und
// App-Neustarts. Kleine promisifizierte Hülle, keine Abhängigkeit.
// ---------------------------------------------------------------------------

export interface FavoritEintrag {
  sealId: string
  moduleId: string
  titel: string
  nummer: string
  ts: number
}

export interface NotizEintrag {
  sealId: string
  moduleId: string
  titel: string
  text: string
  ts: number
}

export interface VerlaufEintrag {
  sealId: string
  moduleId: string
  titel: string
  nummer: string
  ts: number
}

const DB_NAME = 'bibliothek'
const DB_VERSION = 1
const STORES = ['favoriten', 'notizen', 'verlauf'] as const
type StoreName = (typeof STORES)[number]

let dbPromise: Promise<IDBDatabase> | null = null

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      for (const name of STORES) {
        if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, { keyPath: 'sealId' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  return dbPromise
}

function tx<T>(store: StoreName, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(store, mode)
        const req = fn(t.objectStore(store))
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error)
      })
  )
}

// ---- Favoriten --------------------------------------------------------------
export const favoriten = {
  alle: () => tx<FavoritEintrag[]>('favoriten', 'readonly', (s) => s.getAll() as IDBRequest<FavoritEintrag[]>),
  hat: (sealId: string) => tx('favoriten', 'readonly', (s) => s.get(sealId)).then((v) => !!v),
  setze: (e: Omit<FavoritEintrag, 'ts'>) => tx('favoriten', 'readwrite', (s) => s.put({ ...e, ts: Date.now() })),
  entferne: (sealId: string) => tx('favoriten', 'readwrite', (s) => s.delete(sealId)),
}

// ---- Notizen ----------------------------------------------------------------
export const notizen = {
  alle: () => tx<NotizEintrag[]>('notizen', 'readonly', (s) => s.getAll() as IDBRequest<NotizEintrag[]>),
  lies: (sealId: string) => tx<NotizEintrag | undefined>('notizen', 'readonly', (s) => s.get(sealId) as IDBRequest<NotizEintrag | undefined>),
  schreibe: (e: Omit<NotizEintrag, 'ts'>) =>
    e.text.trim()
      ? tx('notizen', 'readwrite', (s) => s.put({ ...e, ts: Date.now() }))
      : tx('notizen', 'readwrite', (s) => s.delete(e.sealId)),
  entferne: (sealId: string) => tx('notizen', 'readwrite', (s) => s.delete(sealId)),
}

// ---- Zuletzt gelesen ----------------------------------------------------------
export const verlauf = {
  alle: () =>
    tx<VerlaufEintrag[]>('verlauf', 'readonly', (s) => s.getAll() as IDBRequest<VerlaufEintrag[]>).then((l) =>
      l.sort((a, b) => b.ts - a.ts)
    ),
  merke: (e: Omit<VerlaufEintrag, 'ts'>) => tx('verlauf', 'readwrite', (s) => s.put({ ...e, ts: Date.now() })),
  entferne: (sealId: string) => tx('verlauf', 'readwrite', (s) => s.delete(sealId)),
}

// ---- Aufräumen ---------------------------------------------------------------
export async function loescheNutzerdaten(): Promise<void> {
  const db = await openDb()
  await Promise.all(
    STORES.map(
      (name) =>
        new Promise<void>((resolve, reject) => {
          const t = db.transaction(name, 'readwrite')
          const req = t.objectStore(name).clear()
          req.onsuccess = () => resolve()
          req.onerror = () => reject(req.error)
        })
    )
  )
}
