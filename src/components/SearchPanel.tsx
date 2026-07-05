import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { search, type SearchResult } from '../lib/search'
import { antworte, type Antwort } from '../lib/antwort'
import { fmt } from '../lib/fmt'
import { SearchIcon, Chevron } from './icons'
import { GradientAIChatInput } from './ui/gradient-ai-chat-input'

// Zwei Wege hinein: die Suche navigiert zu Kapiteln/Belegen; das Frage-Feld
// ANTWORTET direkt im Chat — aus den Inhalten der Bücher (lib/antwort), mit
// Quellenangabe und Link. Keine externe KI, nichts verlässt den Browser.
const TYP_LABEL = { quran: 'Koran', bibel: 'Bibel', quelle: 'Quelle' } as const
const TYP_GLYPH = { quran: '۝', bibel: '✦', quelle: '❝' } as const

interface ChatTurn {
  frage: string
  antwort: Antwort | null
}

export default function SearchPanel() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [dialog, setDialog] = useState<ChatTurn[]>([])
  const boxRef = useRef<HTMLDivElement>(null)
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
    setDialog((d) => [...d, { frage: q, antwort: antworte(q) }])
  }

  // neue Antwort sanft ins Bild holen
  useEffect(() => {
    if (dialog.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [dialog.length])

  return (
    <div className="seek" ref={boxRef}>
      {/* smart search */}
      <form className="seek__field" onSubmit={onSearchSubmit} role="search">
        <SearchIcon aria-hidden />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Suche — Thema, Vers (18,18), Gelehrter (Teeple) oder „Vergleich Mose“ …"
          aria-label="Suche im Werk"
          autoComplete="off"
        />
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

      {/* Frage-Feld — antwortet direkt aus den Inhalten der Bücher */}
      <div className="seek seek--ask">
        <GradientAIChatInput
          placeholder="Stell eine Frage — z. B. „Warum gleicht Muhammad dem Mose mehr als Jesus?“"
          onSend={onAsk}
        />
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

                {t.antwort ? (
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
                  </div>
                ) : (
                  <div className="chat__antwort chat__antwort--leer">
                    <p className="chat__text">
                      Dazu finde ich in der Bibliothek noch keine Antwort. Versuch es konkreter — z. B.
                      „Wurde die Bibel verfälscht?", „Was bedeutet maḥamaddīm?" oder „Welche vier Reiche sah Daniel?".
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
