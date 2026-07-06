import { motion } from 'framer-motion'
import { rise, stagger } from '../../lib/anim'

// Band 3: Der wahre Jesus
// Thema: Jesus' eigene Lehren vs. spätkirchlice Dogmen
// Quelle: Jesus-Teile aus Kapitel 2 + Kapitel 3
export default function WahrerJesusSeal() {
  return (
    <main className="shell">
      <div className="wrap" style={{ paddingTop: 'clamp(1.5rem, 5vh, 2.5rem)', paddingBottom: '4rem' }}>
        <motion.section
          className="front"
          style={{ paddingTop: 'clamp(1.5rem, 5vh, 3rem)' }}
          initial="hidden"
          animate="shown"
          variants={stagger}
        >
          <motion.span variants={rise} style={{ display: 'inline-block' }}>
          </motion.span>
          <motion.p className="kicker" variants={rise} style={{ marginTop: '1.5rem' }}>
            Buch 3
          </motion.p>
          <motion.h1 variants={rise}>Der wahre Jesus</motion.h1>
          <motion.p className="seek__note" variants={rise} style={{ marginTop: '1rem', fontSize: '0.95rem' }}>
            Dieses Buch wird gerade illuminiert — es folgt in Kürze.
          </motion.p>
        </motion.section>
      </div>
    </main>
  )
}
