import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { search, tokenize, type SearchResult } from '../lib/search'
import { antworte, komponiere, istKompositionsAnfrage, passageKey, type Antwort, type Komposition } from '../lib/antwort'
import { fmt } from '../lib/fmt'
import { SearchIcon, Chevron, SparkIcon, PaperPlane, BookOpenIcon, FilterIcon } from './icons'

// Zwei Wege hinein: die Suche navigiert zu Kapiteln/Belegen; das Frage-Feld
// ANTWORTET direkt im Chat — aus den Inhalten der Bücher (lib/antwort), mit
// Quellenangabe und Link. Keine externe KI, nichts verlässt den Browser.
//
// Zwei Antwort-Formen: eine einzelne passende Passage (`antwort`) für normale
// Fragen, oder ein KOMPONIERTER Text (`komposition`) — mehrere Bausteine
// desselben Buches (These, Schritte, Belege, Konter, Schluss) zu einem
// zusammenhängenden Text zusammengestellt —, wenn die Frage nach einem
// verfassten Text klingt ("Schreib mir einen Text, der erläutert, dass …").
const TYP_LABEL = { quran: 'Koran', bibel: 'Bibel', quelle: 'Quelle' } as const
const TYP_GLYPH = { quran: '۝', bibel: '✦', quelle: '❝' } as const

interface ChatTurn {
  frage: string
  antwort: Antwort | null
  komposition?: Komposition | null
}

function Folgefragen({ onAsk }: { onAsk: (msg: string) => void }) {
  return (
    <div className="chat__follow">
      <button type="button" className="chat__follow-btn" onClick={() => onAsk('Welche Belege stützen das?')}>
        Belege dazu
      </button>
      <button type="button" className="chat__follow-btn" onClick={() => onAsk('Was sagen die Gelehrten dazu?')}>
        Gelehrte
      </button>
      <button type="button" className="chat__follow-btn" onClick={() => onAsk('Welche Einwände gibt es dagegen?')}>
        Einwände
      </button>
    </div>
  )
}

export default function SearchPanel({ exampleFragen }: { exampleFragen?: string[] } = {}) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [frage, setFrage] = useState('')
  const [dialog, setDialog] = useState<ChatTurn[]>([])
  const boxRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const hits: SearchResult[] = query.trim() ? search(query, 8) : []

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  function go(r: SearchResult) {
    const { moduleId, sealId, anchor, belegRef } = r.entry
    let to = `/modul/${moduleId}/buch/${sealId}`
    if (belegRef) to += `?beleg=${encodeURIComponent(belegRef)}`
    else if (anchor) to += `#${anchor}`
    navigate(to)
    setOpen(false)
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (hits[0]) go(hits[0])
  }

  function onAsk(message: string) {
    const q = message.trim()
    if (!q) return
    setDialog((d) => {
      // Gesprächskontext: letzte beantwortete Runde liefert Buch + Thema;
      // alle bereits gezeigten Passagen werden nicht wiederholt.
      const letzte = [...d].reverse().find((t) => t.antwort || t.komposition)
      const ctx = letzte
        ? {
            sealId: letzte.antwort?.passage.sealId ?? letzte.komposition?.sealId ?? null,
            themaTokens: tokenize(
              [letzte.frage, letzte.antwort?.passage.titel ?? '', letzte.antwort?.passage.einwand ?? ''].join(' ')
            ),
            ausgeschlossen: d.filter((t) => t.antwort).map((t) => passageKey(t.antwort!.passage)),
          }
        : undefined

      // Verfassungs-Absicht ("Schreib mir einen Text über …") → komponierter
      // Text aus mehreren Bausteinen desselben Buches statt einer Einzel-Passage.
      if (istKompositionsAnfrage(q)) {
        return [...d, { frage: q, antwort: null, komposition: komponiere(q, ctx) }]
      }
      return [...d, { frage: q, antwort: antworte(q, ctx), komposition: null }]
    })
  }

  // neue Antwort sanft ins Bild holen
  useEffect(() => {
    if (dialog.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [dialog.length])

  function onAskSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!frage.trim()) return
    onAsk(frage)
    setFrage('')
  }

  return (
    <div className="seek" ref={boxRef}>
      {/* ---- Such-Karte ---- */}
      <div className="hseek">
        <form className="hseek__field" onSubmit={onSearchSubmit} role="search">
          <SearchIcon aria-hidden />
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            placeholder="Suche — Thema, Vers (18,18), Gelehrter …"
            aria-label="Suche im Werk"
            autoComplete="off"
          />
          <button type="button" className="hseek__filter" aria-label="Suche fokussieren" onClick={() => searchRef.current?.focus()}>
            <FilterIcon aria-hidden />
          </button>
        </form>

        <AnimatePresence>
          {open && query.trim() && (
            <motion.div
              className="seek__results"
              initial={{ opacity: 0, scale: 0.98, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -4 }}
              transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
              style={{ transformOrigin: 'top' }}
              role="listbox"
            >
              {hits.length > 0 ? (
                hits.map((h) => {
                  const isBeleg = !!h.entry.belegRef
                  const badge = isBeleg && h.entry.typ ? TYP_LABEL[h.entry.typ] : h.entry.nummer
                  return (
                    <button key={h.entry.id} className="seek__hit" onClick={() => go(h)} role="option">
                      <span className={`seek__hit-num${isBeleg ? ' seek__hit-num--beleg' : ''}`}>{badge}</span>
                      <span className="seek__hit-body">
                        <span className="seek__hit-titel">
                          {isBeleg && h.entry.typ && <span className="seek__hit-glyph" aria-hidden>{TYP_GLYPH[h.entry.typ]} </span>}
                          {h.entry.label}
                        </span>
                        <span className="seek__hit-mod">{h.entry.kontext}</span>
                      </span>
                    </button>
                  )
                })
              ) : (
                <p className="seek__empty">Nichts gefunden — versuch ein anderes Wort, z. B. „Stein", „Kedar" oder „Aḥmad".</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---- Frage-Karte — antwortet direkt aus den Inhalten der Bücher ---- */}
      <div className="hask">
        <p className="hask__head">
          <SparkIcon aria-hidden /> Frag oder lass einen Text verfassen
        </p>
        <form className="hask__row" onSubmit={onAskSubmit}>
          <input
            type="text"
            className="hask__input"
            value={frage}
            onChange={(e) => setFrage(e.target.value)}
            placeholder={
              dialog.length > 0 ? 'Frag weiter — z. B. „Welche Belege stützen das?“' : 'Stell deine Frage oder gib einen Text ein …'
            }
            aria-label="Frage stellen"
            autoComplete="off"
          />
          <button type="submit" className="hask__send" aria-label="Senden" disabled={!frage.trim()}>
            <PaperPlane aria-hidden />
          </button>
        </form>

        {exampleFragen && exampleFragen.length > 0 && dialog.length === 0 && (
          <div className="hask__chips">
            {exampleFragen.map((f) => (
              <button key={f} type="button" className="hask__chip" onClick={() => onAsk(f)}>
                <BookOpenIcon aria-hidden /> {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {dialog.length > 0 && (
        <div className="chat" aria-live="polite">
          <AnimatePresence initial={false}>
            {dialog.map((t, i) => (
              <motion.div
                key={i}
                className="chat__turn"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              >
                <p className="chat__frage">{t.frage}</p>

                {t.komposition ? (
                  <div className="chat__antwort chat__komposition">
                    <p className="chat__komp-label">Verfasster Text — zusammengestellt aus {t.komposition.quelle}</p>
                    {t.komposition.abschnitte.map((a, ai) => {
                      if (a.art === 'konter') {
                        return (
                          <div key={ai} className="chat__komp-block">
                            {a.einwand && <p className="chat__einwand">Einwand: {a.einwand}</p>}
                            <p className="chat__text">{fmt(a.text)}</p>
                          </div>
                        )
                      }
                      if (a.art === 'beleg') {
                        return (
                          <div key={ai} className="chat__komp-block">
                            <p className="chat__text chat__text--vers">{fmt(a.text)}</p>
                            {a.fundstelle && <p className="chat__fundstelle">{a.fundstelle}</p>}
                          </div>
                        )
                      }
                      if (a.art === 'schluss') {
                        return (
                          <p key={ai} className="chat__text chat__komp-schluss">
                            {fmt(a.text)}
                          </p>
                        )
                      }
                      return (
                        <div key={ai} className="chat__komp-block">
                          {a.titel && <p className="chat__titel">{a.titel}</p>}
                          <p className="chat__text">{fmt(a.text)}</p>
                        </div>
                      )
                    })}

                    <Link className="chat__quelle" to={t.komposition.link}>
                      Aus {t.komposition.quelle} — weiterlesen <Chevron aria-hidden />
                    </Link>

                    {i === dialog.length - 1 && <Folgefragen onAsk={onAsk} />}
                  </div>
                ) : t.antwort ? (
                  <div className="chat__antwort">
                    {t.antwort.passage.art === 'konter' && t.antwort.passage.einwand && (
                      <p className="chat__einwand">Einwand: {t.antwort.passage.einwand}</p>
                    )}
                    {t.antwort.passage.art !== 'beleg' && t.antwort.passage.titel && (
                      <p className="chat__titel">{t.antwort.passage.titel}</p>
                    )}
                    <p className={`chat__text${t.antwort.passage.art === 'beleg' ? ' chat__text--vers' : ''}`}>
                      {fmt(t.antwort.passage.text)}
                    </p>
                    {t.antwort.passage.art === 'beleg' && t.antwort.passage.fundstelle && (
                      <p className="chat__fundstelle">{t.antwort.passage.fundstelle}</p>
                    )}

                    <Link className="chat__quelle" to={t.antwort.link}>
                      Aus {t.antwort.quelle} — weiterlesen <Chevron aria-hidden />
                    </Link>

                    {t.antwort.mehr.length > 0 && (
                      <div className="chat__mehr">
                        <span className="chat__mehr-label">Auch dazu:</span>
                        {t.antwort.mehr.map((m) => (
                          <Link key={m.link + m.label} className="chat__chip" to={m.link}>
                            {m.label} <i>({m.quelle})</i>
                          </Link>
                        ))}
                      </div>
                    )}

                    {i === dialog.length - 1 && <Folgefragen onAsk={onAsk} />}
                  </div>
                ) : (
                  <div className="chat__antwort chat__antwort--leer">
                    <p className="chat__text">
                      {istKompositionsAnfrage(t.frage)
                        ? 'Dazu finde ich in der Bibliothek kein passendes Buch, aus dem sich ein Text zusammenstellen ließe. Versuch es mit einem konkreteren Thema — z. B. „Schreib einen Text darüber, dass Muhammad mit 5. Mose 18,18 gemeint ist".'
                        : 'Dazu finde ich in der Bibliothek noch keine Antwort. Versuch es konkreter — z. B. „Wurde die Bibel verfälscht?", „Was bedeutet maḥamaddīm?" oder „Welche vier Reiche sah Daniel?".'}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="chat__foot">
            <button type="button" className="chat__clear" onClick={() => setDialog([])}>
              Verlauf löschen
            </button>
          </div>
          <div ref={chatEndRef} />
        </div>
      )}
    </div>
  )
}
