import { motion } from 'framer-motion'
import { danielTimeline } from '../../data/seals/daniel'
import { rise, stagger } from '../../lib/anim'

// The window of Daniel: Rome divides (395) → the Islamic state (622) → Rome
// falls (1453). Jesus (1st c.) sits centuries outside it.
export default function Timeline() {
  return (
    <motion.ol
      className="timeline"
      variants={stagger}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
    >
      {danielTimeline.map((p) => (
        <motion.li
          key={p.jahr}
          variants={rise}
          className={`tl${p.jesus ? ' tl--out' : ''}${p.islam ? ' tl--islam' : ''}`}
        >
          <span className="tl__dot" aria-hidden />
          <span className="tl__year">{p.jahr}</span>
          <span className="tl__title">{p.titel}</span>
          <span className="tl__text">{p.text}</span>
          {p.jesus && <span className="tl__badge">außerhalb des Fensters</span>}
        </motion.li>
      ))}
    </motion.ol>
  )
}
