import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { Beleg } from '../data/types'

// ---------------------------------------------------------------------------
// The Beleg system. Every verse / source is a compact shimmering card; a click
// dims the whole page and opens it large and illuminated — Quran verses in
// glowing green + gold, Bible verses with the original word ablaze, sources as
// a manuscript citation. One provider, one modal, reused everywhere.
// ---------------------------------------------------------------------------

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1]

const BelegCtx = createContext<{ open: (b: Beleg) => void }>({ open: () => {} })
export const useBeleg = () => useContext(BelegCtx)

const LABEL: Record<Beleg['typ'], string> = { quran: 'Koran', bibel: 'Bibel', quelle: 'Quelle' }

export function BelegProvider({ children }: { children: ReactNode }) {
  const [beleg, setBeleg] = useState<Beleg | null>(null)
  const open = useCallback((b: Beleg) => setBeleg(b), [])
  const close = useCallback(() => setBeleg(null), [])

  useEffect(() => {
    if (!beleg) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [beleg, close])

  return (
    <BelegCtx.Provider value={{ open }}>
      {children}
      <AnimatePresence>{beleg && <BelegModal beleg={beleg} onClose={close} />}</AnimatePresence>
    </BelegCtx.Provider>
  )
}

function Rays() {
  return (
    <svg className="beleg-rays" viewBox="0 0 400 400" aria-hidden>
      <defs>
        <radialGradient id="rayglow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.5" />
          <stop offset="45%" stopColor="#d9b24a" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#d9b24a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="200" fill="url(#rayglow)" />
      {Array.from({ length: 36 }, (_, i) => {
        const a = (i / 36) * Math.PI * 2
        const long = i % 2 === 0
        const r1 = 40
        const r2 = long ? 210 : 150
        return (
          <line
            key={i}
            x1={200 + r1 * Math.cos(a)}
            y1={200 + r1 * Math.sin(a)}
            x2={200 + r2 * Math.cos(a)}
            y2={200 + r2 * Math.sin(a)}
            stroke="#e9c766"
            strokeWidth={long ? 1.4 : 0.8}
            opacity={long ? 0.5 : 0.28}
          />
        )
      })}
    </svg>
  )
}

function BelegModal({ beleg, onClose }: { beleg: Beleg; onClose: () => void }) {
  const reduce = useReducedMotion()
  const rtl = beleg.sprache === 'ar' || beleg.sprache === 'he'
  const scriptClass = beleg.sprache === 'ar' ? 'arabic' : beleg.sprache === 'he' ? 'hebrew' : ''

  return (
    <motion.div
      className="beleg-scrim"
      initial={reduce ? { opacity: 0 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: EASE }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${LABEL[beleg.typ]} — ${beleg.fundstelle}`}
    >
      <motion.article
        className={`beleg-panel beleg-panel--${beleg.typ}`}
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 6 }}
        transition={{ duration: 0.34, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
      >
        {beleg.typ === 'quran' && <Rays />}

        <header className="beleg-panel__head">
          <span className="beleg-panel__label">{LABEL[beleg.typ]}</span>
          <span className="beleg-panel__ref">{beleg.fundstelle}</span>
        </header>

        <button className="beleg-close" onClick={onClose} aria-label="Schließen">
          ✕
        </button>

        <div className="beleg-panel__body">
          {beleg.typ === 'bibel' && beleg.kern && (
            <p className={`beleg-kern ${scriptClass}`} dir={rtl ? 'rtl' : undefined}>
              {beleg.kern}
            </p>
          )}

          {beleg.original && (
            <p className={`beleg-original ${scriptClass} ${beleg.typ === 'quran' ? 'is-hero' : ''}`} dir={rtl ? 'rtl' : undefined} lang={beleg.sprache}>
              {beleg.original}
            </p>
          )}

          {beleg.translit && <p className="beleg-translit">{beleg.translit}</p>}

          <p className="beleg-trans">{beleg.uebersetzung || beleg.kurz}</p>

          {beleg.status && <span className="beleg-status">{beleg.status}</span>}
        </div>
      </motion.article>
    </motion.div>
  )
}

const GLYPH: Record<Beleg['typ'], string> = { quran: '۝', bibel: '✦', quelle: '❝' }

export function BelegCard({ beleg, className = '' }: { beleg: Beleg; className?: string }) {
  const { open } = useBeleg()
  return (
    <button className={`beleg-card beleg-card--${beleg.typ} ${className}`} onClick={() => open(beleg)}>
      <span className="beleg-card__head">
        <span className="beleg-card__glyph" aria-hidden>
          {GLYPH[beleg.typ]}
        </span>
        <span className="beleg-card__label">{LABEL[beleg.typ]}</span>
        <span className="beleg-card__ref">{beleg.fundstelle}</span>
      </span>
      {beleg.typ === 'quran' && beleg.kern && (
        <span className="beleg-card__ar arabic" dir="rtl" aria-hidden>
          {beleg.kern}
        </span>
      )}
      <span className="beleg-card__kurz">{beleg.kurz}</span>
      <span className="beleg-card__open" aria-hidden>
        Öffnen
      </span>
    </button>
  )
}
