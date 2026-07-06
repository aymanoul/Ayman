import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useImageAvailable } from '../lib/useImage'
import '../styles/bookshelf.css'

// ---------------------------------------------------------------------------
// Digitales Buchregal im Stil klassischer Hadith-Editionen (Fath al-Bari).
//
// 1:1-MODUS: public/images/regal/spine.png (echte Textur, leere Kartuschen)
// wird als Hintergrund gerendert; die variablen Texte liegen als HTML exakt
// in den pixel-vermessenen Zonen:
//   • Kopf-Feld  → Reihentitel (arab. الرحيق المختوم), auf allen Baenden gleich
//   • Medaillon  → DEUTSCHER Buchtitel, auto-gefittet (nie ueber den Rahmen)
//   • Raute      → Bandnummer (1–9), exakt zentriert
//   • Fuss-Kartusche → Verlag (arab. دار السنة)
// Kein Autorenname mehr. Unter dem Regalbrett traegt jeder Band ein deutsches
// Schild (Buchnummer + Titel) — mitklickbar; Hover koppelt Buch + Schild.
// ---------------------------------------------------------------------------

export interface Band {
  nr: number
  name: string // arabischer Originaltitel (Referenz, nicht gerendert)
  deutsch: string // deutscher Buchtitel (Medaillon + Zuordnungs-Schild)
  to: string // Ziel-Route
}

export interface BookshelfProps {
  titel: string // Reihentitel (arabisch), Kopf jedes Ruckens
  verlag: string // Verlag (arabisch), Fuss-Kartusche
  baende: Band[]
}

const SPINE_IMG = 'images/regal/spine.png'

// Skaliert den deutschen Titel so weit herunter, bis er ohne Ueberlauf in die
// vermessene Medaillon-Flaeche passt — Vorrang hat kleinere Schrift vor
// unsauberen Umbruechen. Binaere Suche zwischen MIN und MAX (px).
function useFitText(text: string) {
  const ref = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    const box = el?.parentElement
    if (!el || !box) return

    const MAX = 15.5
    const MIN = 6.5
    const fit = () => {
      const availW = box.clientWidth
      const availH = box.clientHeight
      if (!availW || !availH) return
      let lo = MIN
      let hi = MAX
      let best = MIN
      for (let i = 0; i < 14; i++) {
        const mid = (lo + hi) / 2
        el.style.fontSize = `${mid}px`
        const fits = el.scrollWidth <= availW && el.scrollHeight <= availH
        if (fits) {
          best = mid
          lo = mid
        } else {
          hi = mid
        }
      }
      el.style.fontSize = `${best}px`
    }

    fit()
    // Nach dem Laden der Webfonts neu vermessen (andere Glyphen-Metrik).
    if (document.fonts?.status !== 'loaded') {
      document.fonts?.ready.then(fit).catch(() => {})
    }
    const ro = new ResizeObserver(fit)
    ro.observe(box)
    return () => ro.disconnect()
  }, [text])
  return ref
}

function SpineTitle({ text }: { text: string }) {
  const ref = useFitText(text)
  return (
    <span ref={ref} className="spine__z spine__z--buch">
      {text}
    </span>
  )
}

export default function Bookshelf({ titel, verlag, baende }: BookshelfProps) {
  const src = `${import.meta.env.BASE_URL}${SPINE_IMG}`
  const imgOk = useImageAvailable(src)
  const [hot, setHot] = useState<number | null>(null)

  return (
    <div className="shelf-wrap">
      <div className="shelf-scroll">
        <div className="shelf-inner">
          <div className="shelf" role="list" aria-label={`Buchreihe ${titel}`}>
            {baende.map((b) => (
              <Link
                key={b.nr}
                to={b.to}
                className={`spine${imgOk ? ' spine--img' : ''}${hot === b.nr ? ' is-hot' : ''}`}
                style={imgOk ? { backgroundImage: `url(${src})` } : undefined}
                role="listitem"
                aria-label={`Buch ${b.nr}: ${b.deutsch}`}
                onMouseEnter={() => setHot(b.nr)}
                onMouseLeave={() => setHot(null)}
                onFocus={() => setHot(b.nr)}
                onBlur={() => setHot(null)}
              >
                {/* Kopf-Feld: Reihentitel (auf allen Baenden identisch) */}
                <span className="spine__z spine__z--titel" lang="ar" dir="rtl">
                  {titel}
                </span>

                {/* Medaillon: deutscher Buchtitel, auto-gefittet + zentriert */}
                <span className="spine__med">
                  <SpineTitle text={b.deutsch} />
                </span>

                {/* Raute: Bandnummer, exakt zentriert */}
                <span className="spine__z spine__z--nr" aria-hidden>
                  {b.nr}
                </span>

                {/* Fuss-Kartusche: Verlag */}
                <span className="spine__z spine__z--verlag" lang="ar" dir="rtl">
                  {verlag}
                </span>
              </Link>
            ))}
          </div>

          <span className="shelf__board" aria-hidden />

          {/* Deutsche Zuordnungs-Schilder unter dem Brett */}
          <div className="shelf-labels" aria-hidden>
            {baende.map((b) => (
              <Link
                key={b.nr}
                to={b.to}
                tabIndex={-1}
                className={`book-label${hot === b.nr ? ' is-hot' : ''}`}
                onMouseEnter={() => setHot(b.nr)}
                onMouseLeave={() => setHot(null)}
              >
                <span className="book-label__nr">Buch {b.nr}</span>
                <span className="book-label__de">{b.deutsch}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
