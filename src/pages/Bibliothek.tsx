import { motion, useReducedMotion } from 'framer-motion'
import SearchPanel from '../components/SearchPanel'
import ModulePlate from '../components/ModulePlate'
import { Sprig } from '../components/Ornament'
import { modules } from '../data/modules'
import { rise, stagger, EASE } from '../lib/anim'

// "Die Bibliothek" — the entry, read as a journey. The frontispiece settles,
// the two ways in arrive, then the modules rise as stations along one emerald
// path. Bright vellum, intentional arabesque, motion tuned per Emil Kowalski.
export default function Bibliothek() {
  const reduce = useReducedMotion()

  return (
    <main className="shell">
      <div className="wrap">
        {/* ---- Frontispiece ---- */}
        <motion.section className="front" initial={reduce ? false : 'hidden'} animate="shown" variants={stagger}>
          {/* Placeholder — the operator replaces this with their own calligraphy */}
          <motion.h1 className="front__name gilt" variants={rise} lang="ar" dir="rtl" title="Platzhalter — Name des Betreibers">
            اسم الناشر
          </motion.h1>

          <motion.p className="kicker" variants={rise} style={{ marginTop: 'clamp(1rem, 3vh, 1.5rem)' }}>
            Die Bibliothek
          </motion.p>
        </motion.section>

        {/* ---- Two ways in ---- */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: reduce ? 0 : 0.55, ease: EASE }}
        >
          <SearchPanel />
        </motion.div>

        {/* ---- The journey: modules as stations on one path ---- */}
        <section className="journey" aria-label="Module">
          <motion.p
            className="journey__eyebrow"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <i />
            Eine Reise durch die Schrift
            <i />
          </motion.p>

          <div className="mods">
            <motion.span
              className="mods__start"
              initial={reduce ? false : { scale: 0.4, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, ease: EASE }}
              aria-hidden
            />
            <motion.div
              className="mods__path"
              initial={reduce ? false : { scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
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
                <span className="mods__future-dot" aria-hidden />
                weitere Stationen folgen
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>

      <footer className="foot">
        <Sprig width={104} />
        <p>Die Bibliothek</p>
      </footer>
    </main>
  )
}
