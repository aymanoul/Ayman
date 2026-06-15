import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { ModuleMeta } from '../data/types'
import Shamsa from './Shamsa'
import { Chevron } from './icons'
import { rise } from '../lib/anim'

// One module rendered as an illuminated plate. Title only — no description,
// per the minimalist brief. Available plates light up and lead inward;
// forthcoming plates sit quiet with a "bald" mark.
export default function ModulePlate({ module }: { module: ModuleMeta }) {
  const open = module.status === 'available'

  const inner = (
    <>
      <span className="plate__seal" aria-hidden>
        <Shamsa size={66} animate={false} idle={open} glow={false} />
      </span>
      <span className="plate__body">
        <span className="plate__titel">
          {module.titel}
          {module.honorific && <span className="hon">{module.honorific}</span>}
        </span>
        <span className="plate__meta">
          <span className="plate__ar" lang="ar" dir="rtl">
            {module.arabic}
          </span>
          {open ? <span>{module.siegel.length} Siegel</span> : <span className="tag-soon">bald</span>}
        </span>
      </span>
      {open && <Chevron className="plate__go" aria-hidden />}
    </>
  )

  return (
    <motion.div variants={rise}>
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
