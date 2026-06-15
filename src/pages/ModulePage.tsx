import { Link, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Shamsa from '../components/Shamsa'
import { ArrowLeft, Chevron } from '../components/icons'
import { findModule } from '../data/modules'
import { rise, stagger } from '../lib/anim'

// The seals of a module, each as a quiet medallion row — title only.
export default function ModulePage() {
  const { moduleId } = useParams()
  const reduce = useReducedMotion()
  const module = findModule(moduleId)

  if (!module) {
    return (
      <main className="stub">
        <div className="stub__inner">
          <h1>Nicht gefunden</h1>
          <Link to="/" className="stub__back">
            <ArrowLeft /> Zur Bibliothek
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="shell">
      <div className="wrap" style={{ paddingTop: 'clamp(2rem, 7vh, 4rem)', paddingBottom: '4rem' }}>
        <Link to="/" className="stub__back" style={{ marginTop: 0 }}>
          <ArrowLeft /> Bibliothek
        </Link>

        <motion.section
          className="front"
          style={{ paddingTop: 'clamp(1.5rem, 5vh, 3rem)' }}
          initial={reduce ? false : 'hidden'}
          animate="shown"
          variants={stagger}
        >
          <motion.span className="front__emblem" variants={rise}>
            <Shamsa size={96} />
          </motion.span>
          <motion.h1 className="front__name gilt" variants={rise} lang="ar" dir="rtl" style={{ fontFamily: 'var(--font-arabic)', fontSize: 'clamp(2rem,7vw,3.4rem)' }}>
            {module.arabic}
          </motion.h1>
          <motion.p className="plate__titel" variants={rise} style={{ marginTop: '0.6rem' }}>
            {module.titel}
            {module.honorific && <span className="hon">{module.honorific}</span>}
          </motion.p>
        </motion.section>

        {module.siegel.length > 0 ? (
          <motion.div
            className="stub__list"
            initial={reduce ? false : 'hidden'}
            animate="shown"
            variants={stagger}
            style={{ marginTop: '2rem' }}
          >
            {module.siegel.map((s) => (
              <motion.div key={s.id} variants={rise}>
                <Link to={`/modul/${module.id}/siegel/${s.id}`} className={`srow${s.status === 'coming' ? ' srow--soon' : ''}`}>
                  <span className="srow__num">{s.nummer}</span>
                  <span className="srow__titel">{s.titel}</span>
                  <span className="srow__ar" lang="ar" dir="rtl">
                    {s.arabic}
                  </span>
                  <Chevron className="plate__go" style={{ opacity: 0.5 }} aria-hidden />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="seek__note" style={{ textAlign: 'center', marginTop: '3rem' }}>
            Die Inhalte dieses Moduls folgen — im selben Siegel-System.
          </p>
        )}
      </div>
    </main>
  )
}
