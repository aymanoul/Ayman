import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import type { ModuleMeta, SealMeta } from '../data/types'
import { Chevron } from './icons'
import Shamsa from './Shamsa'
import { rise, stagger } from '../lib/anim'

// A Sparks-style title-image carousel for the seals of a module: a draggable,
// snap-scrolling row of portrait cards. Each card carries the operator's title
// image (images/siegel/<id>.jpg); until that file exists, a designed parchment
// placeholder stands in. The seal title is laid over the image automatically.
export default function SiegelCarousel({ module }: { module: ModuleMeta }) {
  const reduce = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const sync = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setAtStart(el.scrollLeft <= 2)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2)
  }, [])

  useEffect(() => {
    sync()
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      el.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [sync])

  const nudge = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>('.scard')
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * step, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <section className="carousel" aria-label="Siegel als Bildtafeln">
      <div className="carousel__head">
        <p className="carousel__eyebrow">
          <i />
          Die Siegel
          <i />
        </p>
        <div className="carousel__nav" aria-hidden={false}>
          <button
            type="button"
            className="carousel__arrow"
            onClick={() => nudge(-1)}
            disabled={atStart}
            aria-label="Zurück"
          >
            <Chevron style={{ transform: 'rotate(180deg)' }} />
          </button>
          <button
            type="button"
            className="carousel__arrow"
            onClick={() => nudge(1)}
            disabled={atEnd}
            aria-label="Weiter"
          >
            <Chevron />
          </button>
        </div>
      </div>

      <motion.div
        className="carousel__track"
        ref={trackRef}
        initial={reduce ? false : 'hidden'}
        whileInView="shown"
        viewport={{ once: true, amount: 0.1 }}
        variants={stagger}
      >
        {module.siegel.map((s) => (
          <Card key={s.id} moduleId={module.id} seal={s} />
        ))}
      </motion.div>
    </section>
  )
}

function Card({ moduleId, seal }: { moduleId: string; seal: SealMeta }) {
  const [imgOk, setImgOk] = useState(Boolean(seal.image))
  const src = seal.image ? `${import.meta.env.BASE_URL}${seal.image}` : ''
  const soon = seal.status === 'coming'

  return (
    <motion.div variants={rise} className="scard-wrap">
      <Link
        to={soon ? '#' : `/modul/${moduleId}/siegel/${seal.id}`}
        className={`scard${soon ? ' scard--soon' : ''}`}
        aria-disabled={soon}
        onClick={(e) => soon && e.preventDefault()}
        draggable={false}
      >
        <div className="scard__frame">
          {imgOk ? (
            <img
              className="scard__img"
              src={src}
              alt=""
              loading="lazy"
              draggable={false}
              onError={() => setImgOk(false)}
            />
          ) : (
            <div className="scard__placeholder" aria-hidden>
              <Shamsa size={84} />
              <span className="scard__placeholder-num">{seal.nummer}</span>
            </div>
          )}

          <span className="scard__scrim" aria-hidden />
          <span className="scard__badge">{seal.nummer}</span>

          <div className="scard__caption">
            <span className="scard__titel">{seal.titel}</span>
            {seal.arabic && (
              <span className="scard__ar" lang="ar" dir="rtl">
                {seal.arabic}
              </span>
            )}
          </div>

          {soon && <span className="scard__soon">◆ Folgt</span>}
        </div>
      </Link>
    </motion.div>
  )
}
