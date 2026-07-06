import { registerSW } from 'virtual:pwa-register'

// Service-Worker-Steuerung, an den Offline-Schalter der Einstellungen gekoppelt.
// registerType 'autoUpdate' (vite.config) sorgt für Versionierung + automatische
// Aktualisierung bei neuen Builds. Bei ausgeschaltetem Offline-Modus wird der
// SW abgemeldet und der Precache geleert.

let updateSW: ((reload?: boolean) => Promise<void>) | null = null

export function enableOffline(): void {
  if (updateSW) return
  updateSW = registerSW({ immediate: true })
}

export async function disableOffline(): Promise<void> {
  updateSW = null
  if ('serviceWorker' in navigator) {
    const regs = await navigator.serviceWorker.getRegistrations()
    await Promise.all(regs.map((r) => r.unregister()))
  }
  if ('caches' in window) {
    const keys = await caches.keys()
    // nur Workbox/vite-pwa-Caches anfassen — nichts Fremdes
    await Promise.all(keys.filter((k) => /workbox|vite-pwa|precache|runtime|assets/i.test(k)).map((k) => caches.delete(k)))
  }
}

/** Belegter Speicher (Cache + IndexedDB), vom Browser geschätzt. */
export async function speicherInfo(): Promise<{ used: number; quota: number } | null> {
  if (navigator.storage?.estimate) {
    const { usage = 0, quota = 0 } = await navigator.storage.estimate()
    return { used: usage, quota }
  }
  return null
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  const units = ['KB', 'MB', 'GB']
  let v = n / 1024
  let i = 0
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i++
  }
  return `${v.toFixed(v < 10 ? 1 : 0).replace('.', ',')} ${units[i]}`
}
