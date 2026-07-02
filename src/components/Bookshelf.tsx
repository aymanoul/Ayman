import { Link } from 'react-router-dom'
import { useImageAvailable } from '../lib/useImage'
import '../styles/bookshelf.css'

// ---------------------------------------------------------------------------
// Digitales Buchregal im Stil klassischer Hadith-Editionen (Fath al-Bari).
//
// 1:1-MODUS (bevorzugt, KEINE Vektor-Ornamente): Liegt unter
// public/images/regal/spine.png eine echte Buchrücken-Textur (dunkelgrünes
// Leder, goldene Arabesken, LEERE Kartuschen — Spezifikation siehe
// public/images/regal/README.md), wird sie als Hintergrund gerendert und die
// variablen Texte (Titel, Bandname, Nummer, Autor, Verlag) werden als HTML
// exakt in die leeren Zonen gelegt.
//
// FALLBACK: Fehlt die Textur, rendert ein einfacher CSS-Rücken, damit die
// Seite nie kaputt ist. Er verschwindet automatisch, sobald spine.png da ist.
// ---------------------------------------------------------------------------

export interface Band {
  nr: number
  name: string // Bandname (arabisch)
  to: string // Ziel-Route
}

export interface BookshelfProps {
  titel: string // Werktitel (arabisch), oben auf jedem Rücken
  autor: string // unten auf dem Rücken
  verlag: string // Verlags-Kartusche ganz unten
  baende: Band[]
}

const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
const arNum = (n: number) => String(n).split('').map((d) => AR_DIGITS[+d]).join('')

const SPINE_IMG = 'images/regal/spine.png'

export default function Bookshelf({ titel, autor, verlag, baende }: BookshelfProps) {
  const src = `${import.meta.env.BASE_URL}${SPINE_IMG}`
  const imgOk = useImageAvailable(src)

  return (
    <div className="shelf-wrap">
      <div className="shelf" role="list" aria-label={`Buchreihe ${titel}`}>
        {baende.map((b) => (
          <Link
            key={b.nr}
            to={b.to}
            className={`spine${imgOk ? ' spine--img' : ''}`}
            style={imgOk ? { backgroundImage: `url(${src})` } : undefined}
            role="listitem"
            aria-label={`Band ${b.nr}: ${b.name}`}
          >
            {/* Textzonen — Positionen entsprechen den leeren Kartuschen der
                Textur (siehe README); im Fallback vom CSS-Layout gestapelt. */}
            <span className="spine__z spine__z--titel" lang="ar" dir="rtl">
              {titel}
            </span>
            <span className="spine__z spine__z--name" lang="ar" dir="rtl">
              {b.name}
            </span>
            <span className="spine__z spine__z--nr" aria-hidden>
              {arNum(b.nr)}
            </span>
            <span className="spine__z spine__z--mujallad" lang="ar" dir="rtl" aria-hidden>
              المجلد
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
    </div>
  )
}
