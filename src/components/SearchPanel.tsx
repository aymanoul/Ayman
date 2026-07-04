import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { search, type SearchResult } from '../lib/search'
import { SearchIcon } from './icons'
import { GradientAIChatInput } from './ui/gradient-ai-chat-input'

// Two ways in, one brain: a smart search that understands natural language and
// jumps straight to the right exhibit (e.g. "Vergleich Mohammed Moses Jesus" →
// the 15-criteria table) or opens a single verse/source directly; and a
// question box that runs the same engine.
const TYP_LABEL = { quran: 'Koran', bibel: 'Bibel', quelle: 'Quelle' } as const
const TYP_GLYPH = { quran: '۝', bibel: '✦', quelle: '❝' } as const

export default function SearchPanel() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [askNote, setAskNote] = useState('')
  const boxRef = useRef<HTMLDivElement>(null)

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
    let to = `/modul/${moduleId}/siegel/${sealId}`
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
    const found = search(q, 1)
    if (found[0]) {
      setAskNote('')
      go(found[0])
    } else {
      setAskNote('Dazu finde ich noch nichts — versuch es mit einem Stichwort wie „Vergleich Mose", „Paraklet" oder „Daniel".')
    }
  }

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

      {/* question box — same engine, full sentences welcome */}
      <div className="seek seek--ask">
        <GradientAIChatInput
          placeholder="Stell eine Frage — z. B. „Warum gleicht Muhammad dem Mose mehr als Jesus?“"
          onSend={onAsk}
        />
      </div>
      {askNote && <p className="seek__note">{askNote}</p>}
    </div>
  )
}
