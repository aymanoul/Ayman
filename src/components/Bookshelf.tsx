import { Link } from 'react-router-dom'
import '../styles/bookshelf.css'

// ---------------------------------------------------------------------------
// Digitales Buchregal im Stil klassischer Hadith-Editionen (Fath al-Bari,
// Dar Ibn al-Jawzi): tiefgrüne Buchrücken, goldene Prägeornamentik, weinrotes
// Mittelmedaillon mit Bandname + Bandnummer. Jeder Rücken ist ein Link.
// Datengetrieben — Titel, Autor, Verlag und Bände kommen als Props.
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

// Weinrotes Lappen-Medaillon (Mandorla) — die Bühne für Bandname + Nummer.
function Medaillon() {
  return (
    <svg className="spine__med-svg" viewBox="0 0 100 150" aria-hidden>
      <path
        d="M50 3 C60 13 71 15 76 27 C89 33 92 47 87 60 C94 72 94 84 87 95 C92 109 88 122 76 128 C70 139 60 142 50 147 C40 142 30 139 24 128 C12 122 8 109 13 95 C6 84 6 72 13 60 C8 47 11 33 24 27 C29 15 40 13 50 3 Z"
        fill="#54241d"
        stroke="#d9bd83"
        strokeWidth="1.6"
      />
      <path
        d="M50 11 C58 19 67 21 72 31 C83 37 85 48 81 60 C87 71 87 84 81 94 C85 106 81 116 71 121 C66 131 58 133 50 139 C42 133 34 131 29 121 C19 116 15 106 19 94 C13 84 13 71 19 60 C15 48 17 37 28 31 C33 21 42 19 50 11 Z"
        fill="none"
        stroke="#d9bd83"
        strokeWidth="0.7"
        opacity="0.85"
      />
    </svg>
  )
}

// Kleines Rauten-Siegel mit der Bandnummer (wie ١…٧ auf den Rücken).
function NrSiegel({ nr }: { nr: number }) {
  return (
    <span className="spine__nrseal" aria-hidden>
      <svg viewBox="0 0 40 40">
        <path d="M20 2 38 20 20 38 2 20Z" fill="#54241d" stroke="#d9bd83" strokeWidth="1.4" />
        <path d="M20 7 33 20 20 33 7 20Z" fill="none" stroke="#d9bd83" strokeWidth="0.7" opacity="0.8" />
      </svg>
      <i>{arNum(nr)}</i>
    </span>
  )
}

export default function Bookshelf({ titel, autor, verlag, baende }: BookshelfProps) {
  return (
    <div className="shelf-wrap">
      <div className="shelf" role="list" aria-label={`Buchreihe ${titel}`}>
        {baende.map((b) => (
          <Link
            key={b.nr}
            to={b.to}
            className="spine"
            role="listitem"
            aria-label={`Band ${b.nr}: ${b.name}`}
          >
            <span className="spine__edge" aria-hidden />
            <span className="spine__frame" aria-hidden />
            <span className="spine__band spine__band--top" aria-hidden />

            <span className="spine__titel" lang="ar" dir="rtl">
              {titel}
            </span>

            <span className="spine__flourish" aria-hidden />

            <span className="spine__med">
              <Medaillon />
              <span className="spine__med-name" lang="ar" dir="rtl">
                {b.name}
              </span>
              <span className="spine__med-nr" aria-hidden>
                {arNum(b.nr)}
              </span>
              <span className="spine__med-mujallad" lang="ar" dir="rtl">
                المجلد
              </span>
            </span>

            <NrSiegel nr={b.nr} />

            <span className="spine__autor" lang="ar" dir="rtl">
              {autor}
            </span>
            <span className="spine__verlag" lang="ar" dir="rtl">
              {verlag}
            </span>

            <span className="spine__band spine__band--bottom" aria-hidden />
          </Link>
        ))}
      </div>
      <span className="shelf__board" aria-hidden />
    </div>
  )
}
