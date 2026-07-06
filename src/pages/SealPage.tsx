import { useEffect } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft } from '../components/icons'
import { findModule, findSeal } from '../data/modules'
import { rise, stagger } from '../lib/anim'
import BuchExtras from '../components/BuchExtras'
import DanielSeal from './seals/DanielSeal'
import FundamentSeal from './seals/FundamentSeal'
import AbrahamSeal from './seals/AbrahamSeal'
import MoseSeal from './seals/MoseSeal'
import ArabienSeal from './seals/ArabienSeal'
import HoheliedSeal from './seals/HoheliedSeal'
import ParakletSeal from './seals/ParakletSeal'
import ErwartungSeal from './seals/ErwartungSeal'
import VerteidigungSeal from './seals/VerteidigungSeal'
import WahrheitssucheSeal from './seals/WahrheitssucheSeal'
import GotteskonzeptSeal from './seals/GotteskonzeptSeal'
import WahrerJesusSeal from './seals/WahrerJesusSeal'
import KreuzSeal from './seals/KreuzSeal'
import BotschaftSeal from './seals/BotschaftSeal'
import AngekuendigtSeal from './seals/AngekuendigtSeal'

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

  // Fertige Buecher je Modul. Nicht gelistete Baende fallen auf die
  // illuminierte Halteseite zurueck, bis ihr Inhalt landet.
  const BUILT: Record<string, Record<string, () => JSX.Element>> = {
    muhammad: {
      daniel: DanielSeal,
      fundament: FundamentSeal,
      'abrahams-nachkommen': AbrahamSeal,
      'prophet-wie-mose': MoseSeal,
      'arabische-prophezeiungen': ArabienSeal,
      hohelied: HoheliedSeal,
      paraklet: ParakletSeal,
      'juedische-erwartung': ErwartungSeal,
      verteidigung: VerteidigungSeal,
    },
    jesus: {
      wahrheitssuche: WahrheitssucheSeal,
      gotteskonzept: GotteskonzeptSeal,
      'wahrer-jesus': WahrerJesusSeal,
      kreuz: KreuzSeal,
      botschaft: BotschaftSeal,
      angekuendigt: AngekuendigtSeal,
    },
  }
  const Built = moduleId && sealId ? BUILT[moduleId]?.[sealId] : undefined
  if (Built && module && seal) {
    // Das fertige Buch + die Buch-Extras (Favorit/Notiz, Verlauf-Erfassung)
    return (
      <>
        <Built />
        <BuchExtras sealId={seal.id} moduleId={module.id} titel={seal.titel} nummer={seal.nummer} />
      </>
    )
  }

  if (!module || !seal) {
    return (
      <main className="stub">
        <div className="stub__inner">
          <h1>Buch nicht gefunden</h1>
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
          Buch {seal.nummer}
        </motion.p>
        <motion.h1 variants={rise}>{seal.titel}</motion.h1>
        <motion.p className="seek__note" variants={rise} style={{ marginTop: '1rem', fontSize: '0.95rem' }}>
          Dieses Buch wird gerade illuminiert — es folgt in Kürze.
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
