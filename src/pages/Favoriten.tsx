import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { favoriten, type FavoritEintrag } from '../lib/db'
import { StarFilled, Chevron } from '../components/icons'
import PageHead from '../components/PageHead'
import '../styles/pages.css'

export default function Favoriten() {
  const [items, setItems] = useState<FavoritEintrag[] | null>(null)
  useEffect(() => {
    favoriten.alle().then((l) => setItems(l.sort((a, b) => b.ts - a.ts)))
  }, [])

  return (
    <main className="shell">
      <div className="wrap page">
        <PageHead kicker="Gemerkt" title="Favoriten" />
        {items && items.length === 0 && (
          <p className="page-empty">
            Noch keine Favoriten. Tippe auf einer Buch-Seite oben rechts auf den Stern, um es hier zu sammeln.
          </p>
        )}
        <div className="listcards">
          {items?.map((f) => (
            <motion.div key={f.sealId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Link to={`/modul/${f.moduleId}/buch/${f.sealId}`} className="listcard">
                <StarFilled className="listcard__lead" aria-hidden />
                <span className="listcard__body">
                  <span className="listcard__eyebrow">Buch {f.nummer}</span>
                  <span className="listcard__title">{f.titel}</span>
                </span>
                <Chevron className="listcard__go" aria-hidden />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  )
}
