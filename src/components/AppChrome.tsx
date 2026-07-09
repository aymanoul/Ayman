import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useOnline } from '../lib/useOnline'
import {
  MenuIcon,
  CloseIcon,
  HomeIcon,
  BooksIcon,
  BookOpenIcon,
  PersonIcon,
  StarIcon,
  NoteIcon,
  ClockIcon,
  GearIcon,
  InfoIcon,
} from './icons'
import '../styles/chrome.css'

const NAV = [
  { to: '/', label: 'Startseite', icon: HomeIcon, end: true },
  { to: '/bibliothek', label: 'Bibliothek', icon: BooksIcon, end: false },
  { to: '/favoriten', label: 'Favoriten', icon: StarIcon, end: false },
  { to: '/notizen', label: 'Notizen', icon: NoteIcon, end: false },
  { to: '/verlauf', label: 'Zuletzt gelesen', icon: ClockIcon, end: false },
  { to: '/einstellungen', label: 'Einstellungen', icon: GearIcon, end: false },
  { to: '/ueber', label: 'Über das Projekt', icon: InfoIcon, end: false },
]

// Untere Tab-Bar (mobil): die vier Hauptziele — "Profil" führt zu den
// Einstellungen (persönlicher Bereich: Schrift, Offline, Daten).
const TABS = [
  { to: '/', label: 'Start', icon: HomeIcon, end: true },
  { to: '/bibliothek', label: 'Bibliothek', icon: BookOpenIcon, end: false },
  { to: '/verlauf', label: 'Verlauf', icon: ClockIcon, end: false },
  { to: '/einstellungen', label: 'Profil', icon: PersonIcon, end: false },
]

// Globale App-Hülle: Hamburger oben links → Side-Panel von links, plus die
// dezente Online/Offline-Statusmeldung beim Verbindungswechsel.
export default function AppChrome() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const online = useOnline()
  const [toast, setToast] = useState<null | 'online' | 'offline'>(null)
  const firstRun = useRef(true)

  // Panel bei Navigation schließen
  useEffect(() => setOpen(false), [pathname])

  // Escape schließt, Body-Scroll sperren während offen
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  // Statuswechsel → kurzer Toast (nicht beim ersten Laden)
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    setToast(online ? 'online' : 'offline')
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [online])

  return (
    <>
      <button className="chrome-burger" aria-label="Menü öffnen" onClick={() => setOpen(true)}>
        <MenuIcon />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="chrome-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="sidepanel"
              role="dialog"
              aria-label="Navigation"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className="sidepanel__head">
                <span className="sidepanel__brand gilt">Dar as-Sunnah</span>
                <button className="sidepanel__close" aria-label="Schließen" onClick={() => setOpen(false)}>
                  <CloseIcon />
                </button>
              </div>

              <nav className="sidepanel__nav">
                {NAV.map(({ to, label, icon: Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) => `sidenav__item${isActive ? ' is-active' : ''}`}
                  >
                    <Icon aria-hidden />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="sidepanel__foot">
                <span className={`statuschip ${online ? 'is-online' : 'is-offline'}`}>
                  <i />
                  {online ? 'Online' : 'Offline'}
                </span>
                <span className="sidepanel__ver">Der versiegelte Nektar</span>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* untere Tab-Bar — nur mobil sichtbar (chrome.css) */}
      <nav className="bottomnav" aria-label="Hauptnavigation">
        {TABS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `bottomnav__item${isActive ? ' is-active' : ''}`}
          >
            <Icon aria-hidden />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <AnimatePresence>
        {toast && (
          <motion.div
            className={`statustoast ${toast === 'online' ? 'is-online' : 'is-offline'}`}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            role="status"
          >
            <i />
            {toast === 'online' ? 'Wieder online' : 'Du bist offline — alle Bücher bleiben verfügbar'}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
