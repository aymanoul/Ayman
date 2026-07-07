import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { verlauf, type VerlaufEintrag } from '../lib/db'
import { ClockIcon, Chevron } from '../components/icons'
import PageHead from '../components/PageHead'
import { wann } from '../lib/zeit'
import '../styles/pages.css'

export default function Verlauf() {
  const [items, setItems] = useState<VerlaufEintrag[] | null>(null)
  useEffect(() => {
    verlauf.alle().then(setItems)
  }, [])

  return (
    <main className="shell">
      <div className="wrap page">
        <PageHead kicker="Leseverlauf" title="Zuletzt gelesen" />
        {items && items.length === 0 && <p className="page-empty">Noch nichts gelesen. Öffne ein Buch — es erscheint dann hier.</p>}
        <div className="listcards">
          {items?.map((v) => (
            <motion.div key={v.sealId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Link to={`/modul/${v.moduleId}/buch/${v.sealId}`} className="listcard">
                <ClockIcon className="listcard__lead" aria-hidden />
                <span className="listcard__body">
                  <span className="listcard__eyebrow">Buch {v.nummer} · {wann(v.ts)}</span>
                  <span className="listcard__title">{v.titel}</span>
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
