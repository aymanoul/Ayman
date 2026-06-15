import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { searchSeals, type SearchHit } from '../data/modules'
import { SearchIcon, SparkIcon, SendIcon } from './icons'

// Two ways in: keyword search that jumps straight to a seal ("Daniel" → V),
// and a forthcoming question agent (UI present, placeholder logic).
export default function SearchPanel() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [ask, setAsk] = useState('')
  const [askNote, setAskNote] = useState('')
  const boxRef = useRef<HTMLDivElement>(null)

  const hits: SearchHit[] = query.trim() ? searchSeals(query).slice(0, 5) : []

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  function go(hit: SearchHit) {
    navigate(`/modul/${hit.moduleId}/siegel/${hit.sealId}`)
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (hits[0]) go(hits[0])
  }

  function onAskSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!ask.trim()) return
    setAskNote('Der Frage-Agent wird vorbereitet. Bis dahin führt die Suche zu jedem Siegel.')
  }

  return (
    <div className="seek" ref={boxRef}>
      {/* keyword search */}
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
          placeholder="Suche im Werk — etwa „Daniel“, „Paraklet“, „Jesaja 42“ …"
          aria-label="Suche im Werk"
          autoComplete="off"
        />
      </form>

      <AnimatePresence>
        {open && hits.length > 0 && (
          <motion.div
            className="seek__results"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            role="listbox"
          >
            {hits.map((h) => (
              <button key={`${h.moduleId}-${h.sealId}`} className="seek__hit" onClick={() => go(h)} role="option">
                <span className="seek__hit-num">{h.nummer}</span>
                <span className="seek__hit-titel">{h.titel}</span>
                <span className="seek__hit-mod">{h.moduleTitel}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* question agent (placeholder) */}
      <form className="seek seek--ask" onSubmit={onAskSubmit}>
        <div className="seek__field">
          <SparkIcon aria-hidden />
          <input
            type="text"
            value={ask}
            onChange={(e) => setAsk(e.target.value)}
            placeholder="Stell eine Frage …"
            aria-label="Stell eine Frage"
            autoComplete="off"
          />
          <button type="submit" className="seek__send" aria-label="Frage senden">
            <SendIcon aria-hidden />
          </button>
        </div>
      </form>
      {askNote && <p className="seek__note">{askNote}</p>}
    </div>
  )
}
