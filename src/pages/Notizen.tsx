import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { notizen, type NotizEintrag } from '../lib/db'
import { NoteIcon, TrashIcon, Chevron } from '../components/icons'
import PageHead from '../components/PageHead'
import '../styles/pages.css'

export default function Notizen() {
  const [items, setItems] = useState<NotizEintrag[] | null>(null)
  useEffect(() => {
    notizen.alle().then((l) => setItems(l.sort((a, b) => b.ts - a.ts)))
  }, [])

  async function entferne(id: string) {
    await notizen.entferne(id)
    setItems((l) => (l ? l.filter((n) => n.sealId !== id) : l))
  }

  return (
    <main className="shell">
      <div className="wrap page">
        <PageHead kicker="Meine" title="Notizen" />
        {items && items.length === 0 && (
          <p className="page-empty">
            Noch keine Notizen. Öffne ein Buch und tippe oben rechts auf das Notiz-Symbol, um einen Gedanken festzuhalten.
          </p>
        )}
        <div className="listcards">
          {items?.map((n) => (
            <motion.div key={n.sealId} className="notecard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="notecard__head">
                <NoteIcon aria-hidden />
                <Link to={`/modul/${n.moduleId}/buch/${n.sealId}`} className="notecard__title">
                  {n.titel} <Chevron aria-hidden />
                </Link>
                <button className="iconbtn" aria-label="Notiz löschen" onClick={() => entferne(n.sealId)}>
                  <TrashIcon />
                </button>
              </div>
              <p className="notecard__text">{n.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}
