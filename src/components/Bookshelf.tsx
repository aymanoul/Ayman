import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useImageAvailable } from '../lib/useImage'
import '../styles/bookshelf.css'

// ---------------------------------------------------------------------------
// Digitales Buchregal im Stil klassischer Hadith-Editionen (Fath al-Bari).
//
// 1:1-MODUS: public/images/regal/spine.png (echte Textur, leere Kartuschen)
// wird als Hintergrund gerendert; die variablen Texte liegen als HTML exakt
// in den pixel-vermessenen Zonen. Name + Nummer + المجلد bilden EINE im
// Medaillon zentrierte Gruppe (.spine__med).
//
// Zuordnung: Unter dem Regalbrett trägt jeder Band ein deutsches Schild
// (Bandnummer + deutscher Siegel-Titel) — immer sichtbar, mitklickbar;
// beim Zeigen auf Buch ODER Schild leuchten beide zusammen auf.
// ---------------------------------------------------------------------------

export interface Band {
  nr: number
  name: string // Bandname (arabisch)
  deutsch: string // deutscher Titel (Zuordnungs-Schild)
  to: string // Ziel-Route
}

export interface BookshelfProps {
  titel: string
  autor: string
  verlag: string
  baende: Band[]
}

const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
const arNum = (n: number) => String(n).split('').map((d) => AR_DIGITS[+d]).join('')

const SPINE_IMG = 'images/regal/spine.png'

export default function Bookshelf({ titel, autor, verlag, baende }: BookshelfProps) {
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
                aria-label={`Band ${b.nr}: ${b.deutsch}`}
                onMouseEnter={() => setHot(b.nr)}
                onMouseLeave={() => setHot(null)}
                onFocus={() => setHot(b.nr)}
                onBlur={() => setHot(null)}
              >
                <span className="spine__z spine__z--titel" lang="ar" dir="rtl">
                  {titel}
                </span>

                {/* Medaillon-Gruppe: als Einheit im Medaillon zentriert */}
                <span className="spine__med">
                  <span className="spine__z spine__z--name" lang="ar" dir="rtl">
                    {b.name}
                  </span>
                  <span className="spine__z spine__z--nr" aria-hidden>
                    {arNum(b.nr)}
                  </span>
                  <span className="spine__z spine__z--mujallad" lang="ar" dir="rtl" aria-hidden>
                    المجلد
                  </span>
                </span>

                <span className="spine__z spine__z--nrseal" aria-hidden>
                  {arNum(b.nr)}
                </span>
                <span className="spine__z spine__z--autor" lang="ar" dir="rtl">
                  {autor}
                </span>
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
                <span className="book-label__nr">Band {b.nr}</span>
                <span className="book-label__de">{b.deutsch}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
