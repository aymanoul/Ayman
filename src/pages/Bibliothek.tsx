import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Shamsa from '../components/Shamsa'
import SearchPanel from '../components/SearchPanel'
import ModulePlate from '../components/ModulePlate'
import { Diamond, Plus, ArabesqueDivider } from '../components/icons'
import { modules } from '../data/modules'
import { rise, stagger, EASE } from '../lib/anim'

// "Die Bibliothek" — the entry. Reads top-to-bottom like opening an
// illuminated manuscript: the frontispiece illuminates under a shaft of light,
// then the two ways in settle, then the modules rise on a single gold thread.
export default function Bibliothek() {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const ghostY = useTransform(scrollY, [0, 700], [0, 150])
  const ghostRotate = useTransform(scrollY, [0, 700], [0, 26])

  return (
    <main className="shell">
      <div className="lightshaft" aria-hidden />

      <div className="wrap">
        {/* ---- Frontispiece (hero): operator name + emblem ---- */}
        <motion.section className="front" initial={reduce ? false : 'hidden'} animate="shown" variants={stagger}>
          <motion.div className="front__ghost" aria-hidden style={reduce ? undefined : { y: ghostY, rotate: ghostRotate }}>
            <Shamsa size={820} animate={false} idle={false} glow={false} decorative />
          </motion.div>

          <motion.span className="front__emblem" variants={rise}>
            <Shamsa size={150} glow />
          </motion.span>

          {/* Placeholder — the operator replaces this with their own calligraphy */}
          <motion.h1 className="front__name shimmer" variants={rise} lang="ar" dir="rtl" title="Platzhalter — Name des Betreibers">
            اسم الناشر
          </motion.h1>

          <motion.div className="front__rule" variants={rise} aria-hidden>
            <i />
            <Diamond />
            <i />
          </motion.div>

          <motion.p className="kicker" variants={rise}>
            Die Bibliothek
          </motion.p>
        </motion.section>

        {/* ---- Two ways in ---- */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: reduce ? 0 : 0.65, ease: EASE }}
        >
          <SearchPanel />
        </motion.div>

        {/* ---- The modules, threaded on one gold line ---- */}
        <section className="mods" aria-label="Module">
          <motion.div
            className="mods__rail"
            initial={reduce ? false : { scaleY: 0, opacity: 0 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.2, delay: 0.15, ease: EASE }}
            aria-hidden
          />
          <motion.div
            className="mods__list"
            initial={reduce ? false : 'hidden'}
            whileInView="shown"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
          >
            {modules.map((m) => (
              <ModulePlate key={m.id} module={m} />
            ))}
            <motion.div className="mods__future" variants={rise}>
              <Plus aria-hidden />
              weitere Module folgen
            </motion.div>
          </motion.div>
        </section>
      </div>

      <footer className="foot">
        <ArabesqueDivider />
        <p>Die Bibliothek</p>
      </footer>
    </main>
  )
}
