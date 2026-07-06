import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

// ---------------------------------------------------------------------------
// Einstellungen — zentral, in localStorage persistiert und sofort auf das
// Dokument angewandt (Schriftgröße als :root-Font-Size, Theme als data-theme,
// Bewegung-reduzieren als data-reduce-motion). Kein Backend nötig.
// ---------------------------------------------------------------------------

export type Theme = 'light' | 'dark'
export type Sprache = 'de' | 'en' | 'ar'

export interface Settings {
  theme: Theme
  /** Schrift-Skalierung in Prozent (90–130) */
  fontScale: number
  reduceMotion: boolean
  sprache: Sprache
  /** Offline-Modus / Service-Worker aktiv */
  offline: boolean
}

const DEFAULTS: Settings = {
  theme: 'light',
  fontScale: 100,
  reduceMotion: false,
  sprache: 'de',
  offline: true,
}

const KEY = 'bibliothek:settings'

function load(): Settings {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) }
  } catch {
    /* ignore */
  }
  return DEFAULTS
}

interface Ctx {
  settings: Settings
  set: <K extends keyof Settings>(key: K, value: Settings[K]) => void
}

const SettingsCtx = createContext<Ctx | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load)

  // auf das Dokument spiegeln + persistieren
  useEffect(() => {
    const root = document.documentElement
    root.style.fontSize = `${settings.fontScale}%`
    root.dataset.theme = settings.theme
    if (settings.reduceMotion) root.dataset.reduceMotion = 'true'
    else delete root.dataset.reduceMotion
    try {
      localStorage.setItem(KEY, JSON.stringify(settings))
    } catch {
      /* ignore */
    }
  }, [settings])

  const value = useMemo<Ctx>(
    () => ({
      settings,
      set: (key, val) => setSettings((s) => ({ ...s, [key]: val })),
    }),
    [settings]
  )

  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>
}

export function useSettings(): Ctx {
  const c = useContext(SettingsCtx)
  if (!c) throw new Error('useSettings außerhalb des SettingsProvider')
  return c
}
