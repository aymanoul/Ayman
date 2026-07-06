import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { verlauf, type VerlaufEintrag } from '../lib/db'
import { ClockIcon, Chevron } from '../components/icons'
import PageHead from '../components/PageHead'
import '../styles/pages.css'

function wann(ts: number): string {
  const min = Math.floor((Date.now() - ts) / 60000)
  if (min < 1) return 'gerade eben'
  if (min < 60) return `vor ${min} Min.`
  const h = Math.floor(min / 60)
  if (h < 24) return `vor ${h} Std.`
  const d = Math.floor(h / 24)
  return d === 1 ? 'gestern' : `vor ${d} Tagen`
}

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
