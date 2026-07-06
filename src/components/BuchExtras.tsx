import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { favoriten, notizen, verlauf } from '../lib/db'
import { StarIcon, StarFilled, NoteIcon, CloseIcon } from './icons'
import '../styles/buchextras.css'

interface Props {
  sealId: string
  moduleId: string
  titel: string
  nummer: string
}

// Schwebende Buch-Aktionen oben rechts: Favorit-Stern + Notiz. Erfasst beim
// Öffnen automatisch „Zuletzt gelesen". Alles lokal (IndexedDB).
export default function BuchExtras({ sealId, moduleId, titel, nummer }: Props) {
  const [fav, setFav] = useState(false)
  const [noteOpen, setNoteOpen] = useState(false)
  const [note, setNote] = useState('')
  const [hasNote, setHasNote] = useState(false)
  const taRef = useRef<HTMLTextAreaElement>(null)

  // Verlauf erfassen + vorhandene Daten laden
  useEffect(() => {
    verlauf.merke({ sealId, moduleId, titel, nummer }).catch(() => {})
    favoriten.hat(sealId).then(setFav).catch(() => {})
    notizen.lies(sealId).then((n) => {
      setNote(n?.text ?? '')
      setHasNote(!!n?.text)
    }).catch(() => {})
  }, [sealId, moduleId, titel, nummer])

  async function toggleFav() {
    if (fav) {
      await favoriten.entferne(sealId)
      setFav(false)
    } else {
      await favoriten.setze({ sealId, moduleId, titel, nummer })
      setFav(true)
    }
  }

  async function saveNote() {
    await notizen.schreibe({ sealId, moduleId, titel, text: note })
    setHasNote(!!note.trim())
    setNoteOpen(false)
  }

  useEffect(() => {
    if (noteOpen) taRef.current?.focus()
  }, [noteOpen])

  return (
    <>
      <div className="buchextras">
        <button
          className={`bx-btn${fav ? ' is-active' : ''}`}
          aria-label={fav ? 'Aus Favoriten entfernen' : 'Zu Favoriten'}
          onClick={toggleFav}
        >
          {fav ? <StarFilled /> : <StarIcon />}
        </button>
        <button
          className={`bx-btn${hasNote ? ' is-active' : ''}`}
          aria-label="Notiz"
          onClick={() => setNoteOpen(true)}
        >
          <NoteIcon />
          {hasNote && <i className="bx-dot" />}
        </button>
      </div>

      <AnimatePresence>
        {noteOpen && (
          <>
            <motion.div
              className="bx-scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={saveNote}
            />
            <motion.div
              className="bx-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              role="dialog"
              aria-label="Notiz"
            >
              <div className="bx-sheet__head">
                <div>
                  <span className="bx-sheet__eyebrow">Notiz · Buch {nummer}</span>
                  <span className="bx-sheet__title">{titel}</span>
                </div>
                <button className="bx-sheet__close" aria-label="Speichern & schließen" onClick={saveNote}>
                  <CloseIcon />
                </button>
              </div>
              <textarea
                ref={taRef}
                className="bx-sheet__ta"
                value={note}
                placeholder="Deinen Gedanken festhalten … (wird auf diesem Gerät gespeichert)"
                onChange={(e) => setNote(e.target.value)}
              />
              <div className="bx-sheet__foot">
                {hasNote && (
                  <button
                    className="bx-sheet__del"
                    onClick={async () => {
                      await notizen.entferne(sealId)
                      setNote('')
                      setHasNote(false)
                      setNoteOpen(false)
                    }}
                  >
                    Löschen
                  </button>
                )}
                <button className="bx-sheet__save" onClick={saveNote}>
                  Speichern
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
