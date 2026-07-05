import { Link, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import SiegelCarousel from '../components/SiegelCarousel'
import { ArrowLeft } from '../components/icons'
import { findModule } from '../data/modules'
import { rise, stagger, EASE } from '../lib/anim'
import { useImageAvailable } from '../lib/useImage'
import '../styles/carousel.css'

// A module page: a title image (hero) at the top, then the seals as a row of
// title-image cards in the carousel.
export default function ModulePage() {
  const { moduleId } = useParams()
  const reduce = useReducedMotion()
  const module = findModule(moduleId)
  const heroSrc = module?.heroImage ? `${import.meta.env.BASE_URL}${module.heroImage}` : undefined
  const heroOk = useImageAvailable(heroSrc)

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
      <div className="wrap" style={{ paddingTop: 'clamp(1.5rem, 5vh, 2.5rem)', paddingBottom: '4rem' }}>
        <Link to="/" className="stub__back" style={{ marginTop: 0 }}>
          <ArrowLeft /> Bibliothek
        </Link>

        {/* ---- Hero: title image with the module name laid over it ---- */}
        {heroOk ? (
          <motion.section
            className="mhero"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            {/* The title image already carries the module name — show it clean. */}
            <img
              className="mhero__img"
              src={heroSrc}
              alt={`${module.titel}${module.honorific ? ' ' + module.honorific : ''}`}
            />
          </motion.section>
        ) : (
          /* Fallback frontispiece until the hero image is dropped in */
          <motion.section
            className="front"
            style={{ paddingTop: 'clamp(1.5rem, 5vh, 3rem)' }}
            initial={reduce ? false : 'hidden'}
            animate="shown"
            variants={stagger}
          >
            <motion.h1 className="plate__titel" variants={rise}>
              {module.titel}
              {module.honorific && <span className="hon">{module.honorific}</span>}
            </motion.h1>
          </motion.section>
        )}

        {/* ---- The seals as a title-image carousel ---- */}
        {module.siegel.length > 0 ? (
          <SiegelCarousel module={module} />
        ) : (
          <p className="seek__note" style={{ textAlign: 'center', marginTop: '3rem' }}>
            Die Inhalte dieses Moduls folgen — im selben Siegel-System.
          </p>
        )}
      </div>
    </main>
  )
}
