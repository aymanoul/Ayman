import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { ModuleMeta } from '../data/types'
import { Chevron } from './icons'
import { riseSpring } from '../lib/anim'

// One module rendered as a clean editorial row: title, meta, chevron.
// No emblems, no ornament — structure carries the design.
export default function ModulePlate({ module }: { module: ModuleMeta }) {
  const open = module.status === 'available'

  const inner = (
    <>
      <span className="plate__body">
        <span className="plate__titel">
          {module.titel}
          {module.honorific && <span className="hon">{module.honorific}</span>}
        </span>
        <span className="plate__meta">
          {open ? <span>{module.siegel.length} Bücher</span> : <span className="tag-soon">bald</span>}
        </span>
      </span>
      {open && <Chevron className="plate__go" aria-hidden />}
    </>
  )

  return (
    <motion.div
      variants={riseSpring}
      whileHover={open ? { y: -5 } : undefined}
      whileTap={open ? { scale: 0.99 } : undefined}
      transition={{ type: 'spring', stiffness: 340, damping: 26 }}
      style={{ borderRadius: 18 }}
    >
      {open ? (
        <Link to={`/modul/${module.id}`} className="plate plate--open" aria-label={`Modul öffnen: ${module.titel}`}>
          {inner}
        </Link>
      ) : (
        <div className="plate plate--soon" aria-label={`${module.titel} — in Vorbereitung`}>
          {inner}
        </div>
      )}
    </motion.div>
  )
}
