import { useEffect } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft } from '../components/icons'
import { findModule, findSeal } from '../data/modules'
import { rise, stagger } from '../lib/anim'
import DanielSeal from './seals/DanielSeal'
import FundamentSeal from './seals/FundamentSeal'
import AbrahamSeal from './seals/AbrahamSeal'
import MoseSeal from './seals/MoseSeal'
import ArabienSeal from './seals/ArabienSeal'
import HoheliedSeal from './seals/HoheliedSeal'
import ParakletSeal from './seals/ParakletSeal'
import ErwartungSeal from './seals/ErwartungSeal'
import VerteidigungSeal from './seals/VerteidigungSeal'

// Placeholder seal view. Built seals render their own page; the rest get a
// graceful illuminated holding page until their content lands.
export default function SealPage() {
  const { moduleId, sealId } = useParams()
  const { hash } = useLocation()
  const reduce = useReducedMotion()
  const module = findModule(moduleId)
  const seal = findSeal(moduleId, sealId)

  // Deep-link: scroll to the exhibit named in the URL hash (set by search),
  // once the seal has rendered; otherwise start at the top.
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const id = decodeURIComponent(hash.slice(1))
    const t = setTimeout(() => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 240)
    return () => clearTimeout(t)
  }, [hash, sealId])

  if (moduleId === 'muhammad' && sealId === 'daniel') {
    return <DanielSeal />
  }
  if (moduleId === 'muhammad' && sealId === 'fundament') {
    return <FundamentSeal />
  }
  if (moduleId === 'muhammad' && sealId === 'abrahams-nachkommen') {
    return <AbrahamSeal />
  }
  if (moduleId === 'muhammad' && sealId === 'prophet-wie-mose') {
    return <MoseSeal />
  }
  if (moduleId === 'muhammad' && sealId === 'arabische-prophezeiungen') {
    return <ArabienSeal />
  }
  if (moduleId === 'muhammad' && sealId === 'hohelied') {
    return <HoheliedSeal />
  }
  if (moduleId === 'muhammad' && sealId === 'paraklet') {
    return <ParakletSeal />
  }
  if (moduleId === 'muhammad' && sealId === 'juedische-erwartung') {
    return <ErwartungSeal />
  }
  if (moduleId === 'muhammad' && sealId === 'verteidigung') {
    return <VerteidigungSeal />
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
