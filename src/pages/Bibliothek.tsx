import { motion, useReducedMotion } from 'framer-motion'
import ModulePlate from '../components/ModulePlate'
import Bookshelf from '../components/Bookshelf'
import { modules } from '../data/modules'
import { regalBaende, regalTitel, regalVerlag } from '../data/regal'
import { regalJesusBaende, regalJesusTitel, regalJesusVerlag } from '../data/regal-jesus'
import { rise, stagger, EASE } from '../lib/anim'

// "Die Bibliothek" — der Bibliothekssaal: beide Buchreihen als physische
// Regale. Suche + Frage-Feld wohnen auf der Startseite (Home). Kommende
// Module stehen als ruhige Tafeln darunter.
export default function Bibliothek() {
  const reduce = useReducedMotion()
  const kommend = modules.filter((m) => m.status !== 'available')

  return (
    <main className="shell">
      <div className="wrap">
        {/* ---- Frontispiz ---- */}
        <motion.section className="front" initial={reduce ? false : 'hidden'} animate="shown" variants={stagger}>
          <motion.h1 className="front__title gilt" variants={rise}>
            Die Bibliothek
          </motion.h1>
        </motion.section>
      </div>

      {/* ---- Der Saal: das Buchregal als Herzstück (Breakout-Breite) ---- */}
      <section className="hall" aria-label="Der versiegelte Nektar — die Buchreihe">
        <motion.header
          className="sec__head hall__head"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <h2 className="sec__title sec__title--green">
            Der versiegelte Nektar
          </h2>
        </motion.header>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          <Bookshelf titel={regalTitel} verlag={regalVerlag} baende={regalBaende} />
        </motion.div>
      </section>

      {/* ---- Der Saal: die zweite Buchreihe (Jesus, der Gesandte Gottes) ---- */}
      <section className="hall" aria-label="Jesus, der Gesandte Gottes — die Buchreihe">
        <motion.header
          className="sec__head hall__head"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <h2 className="sec__title sec__title--green">
            Jesus, der Gesandte Gottes
          </h2>
        </motion.header>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          <Bookshelf titel={regalJesusTitel} verlag={regalJesusVerlag} baende={regalJesusBaende} variant="jesus" />
        </motion.div>
      </section>

      {/* ---- Kommende Module ---- */}
      {kommend.length > 0 && (
        <div className="wrap">
          <section className="journey" aria-label="Kommende Module">
            <motion.p
              className="journey__eyebrow"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <i />
              Weitere Stationen folgen
              <i />
            </motion.p>

            <div className="mods">
              <motion.div
                className="mods__list"
                initial={reduce ? false : 'hidden'}
                whileInView="shown"
                viewport={{ once: true, amount: 0.15 }}
                variants={stagger}
              >
                {kommend.map((m) => (
                  <ModulePlate key={m.id} module={m} />
                ))}
              </motion.div>
            </div>
          </section>
        </div>
      )}

      <footer className="foot">
        <p>Die Bibliothek</p>
      </footer>
    </main>
  )
}
