import { Link, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Shamsa from '../components/Shamsa'
import { ArrowLeft } from '../components/icons'
import { findModule, findSeal } from '../data/modules'
import { rise, stagger } from '../lib/anim'
import DanielSeal from './seals/DanielSeal'

// Placeholder seal view. Built seals render their own page; the rest get a
// graceful illuminated holding page until their content lands.
export default function SealPage() {
  const { moduleId, sealId } = useParams()
  const reduce = useReducedMotion()
  const module = findModule(moduleId)
  const seal = findSeal(moduleId, sealId)

  if (sealId === 'daniel' && moduleId === 'muhammad') {
    return <DanielSeal />
  }

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
        <motion.p className="arabic" variants={rise} style={{ fontSize: '2rem', color: 'var(--green)' }}>
          {seal.arabic}
        </motion.p>
        <motion.p className="seek__note" variants={rise} style={{ marginTop: '1rem', fontSize: '0.95rem' }}>
          Dieses Siegel wird gerade illuminiert — es folgt in Kürze.
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
