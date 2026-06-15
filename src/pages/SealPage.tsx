import { Link, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Shamsa from '../components/Shamsa'
import { ArrowLeft } from '../components/icons'
import { findModule, findSeal } from '../data/modules'
import { rise, stagger } from '../lib/anim'

// Placeholder seal view. The full two-level seal (debate + scholarly layers,
// objection/counter boxes, exhibits, Beleg modals) is built per seal —
// Daniel first. Until then, a graceful illuminated holding page.
export default function SealPage() {
  const { moduleId, sealId } = useParams()
  const reduce = useReducedMotion()
  const module = findModule(moduleId)
  const seal = findSeal(moduleId, sealId)

  if (!module || !seal) {
    return (
      <main className="stub">
        <div className="stub__inner">
          <h1>Siegel nicht gefunden</h1>
          <Link to="/" className="stub__back">
            <ArrowLeft /> Zur Bibliothek
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="stub">
      <motion.div
        className="stub__inner"
        initial={reduce ? false : 'hidden'}
        animate="shown"
        variants={stagger}
      >
        <motion.span variants={rise} style={{ display: 'inline-block' }}>
          <Shamsa size={120} />
        </motion.span>
        <motion.p className="kicker" variants={rise} style={{ marginTop: '1.5rem' }}>
          Siegel {seal.nummer}
        </motion.p>
        <motion.h1 variants={rise}>{seal.titel}</motion.h1>
        <motion.p className="arabic" variants={rise} style={{ fontSize: '2rem', color: 'var(--gold)' }}>
          {seal.arabic}
        </motion.p>
        <motion.p className="seek__note" variants={rise} style={{ marginTop: '1rem' }}>
          Dieses Siegel wird gerade illuminiert.
        </motion.p>
        <motion.div variants={rise}>
          <Link to={`/modul/${module.id}`} className="stub__back">
            <ArrowLeft /> {module.titel}
          </Link>
        </motion.div>
      </motion.div>
    </main>
  )
}
