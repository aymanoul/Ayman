import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useBeleg } from '../Beleg'
import { statueZones, danielBelege, type StatueZone } from '../../data/seals/daniel'
import statueImg from '../../assets/statue.png'

// The dream image of Daniel 2 — the real statue, with an invisible clickable
// hotspot over each material zone (click → kingdom + verse). The stone already
// rests at the feet; pressing play grows the emerald mountain (the Kingdom of
// God) behind it, the stone that fills the earth.

type Phase = 'idle' | 'mountain'

// hotspot rectangles as % of the statue image box
const POS: Record<string, { l: number; t: number; w: number; h: number }> = {
  gold: { l: 37, t: 1, w: 26, h: 16 },
  silber: { l: 25, t: 17, w: 41, h: 18 },
  bronze: { l: 27, t: 35, w: 38, h: 18 },
  eisen: { l: 30, t: 53, w: 34, h: 31 },
  fuesse: { l: 29, t: 84, w: 35, h: 15 },
  stein: { l: 60, t: 75, w: 37, h: 23 },
}

export default function DanielStatue() {
  const { open } = useBeleg()
  const reduce = useReducedMotion()
  const [hover, setHover] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const struck = phase === 'mountain'

  function activate(z: StatueZone) {
    if (z.id === 'stein') setPhase('mountain')
    open(danielBelege[z.belegId])
  }

  const current = statueZones.find((z) => z.id === hover)

  return (
    <div className="statue">
      <div className="statue__stage">
        <div className="statue__figure">
          {/* the great mountain rises behind */}
          <motion.svg
            className="statue__berg"
            viewBox="0 0 400 240"
            aria-hidden
            initial={false}
            animate={struck ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0.001 : 1, ease: [0.23, 1, 0.32, 1] }}
          >
            <defs>
              <linearGradient id="bergG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8ca265" />
                <stop offset="55%" stopColor="#5f6f46" />
                <stop offset="100%" stopColor="#333f24" />
              </linearGradient>
            </defs>
            <path d="M200 12 C 250 70 320 150 400 240 L0 240 C 80 150 150 70 200 12 Z" fill="url(#bergG)" />
          </motion.svg>

          <img className="statue__img" src={statueImg} alt="Daniels Traumbild — die Statue aus Daniel 2: goldener Kopf, silberner Oberkörper, Bronze-Schurz, Eisenbeine, Füße aus Eisen und Ton, und der Stein" draggable={false} />

          <div className="statue__hotspots">
            {statueZones.map((z) => {
              const p = POS[z.id]
              return (
                <button
                  key={z.id}
                  className={`statue__hot${hover === z.id ? ' is-hover' : ''}`}
                  style={{ left: `${p.l}%`, top: `${p.t}%`, width: `${p.w}%`, height: `${p.h}%` }}
                  aria-label={`${z.material} — ${z.reich}`}
                  onClick={() => activate(z)}
                  onMouseEnter={() => setHover(z.id)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(z.id)}
                  onBlur={() => setHover(null)}
                />
              )
            })}
          </div>
        </div>

        <p className="statue__readout" aria-live="polite">
          {current ? (
            <>
              <span className="statue__readout-reich">{current.reich}</span>
              <span className="statue__readout-meta">
                {current.material} · {current.jahr}
              </span>
            </>
          ) : (
            <span className="statue__readout-hint">Berühre ein Material — oder lass den Stein zum Berg werden.</span>
          )}
        </p>
      </div>

      <div className="statue__side">
        <button className="statue__play" onClick={() => setPhase(struck ? 'idle' : 'mountain')}>
          {struck ? 'Zurücksetzen' : 'Der Stein wird zum Berg'}
        </button>

        <ul className="statue__legend">
          {statueZones.map((z) => (
            <li key={z.id}>
              <button
                className={`statue__chip statue__chip--${z.id}${hover === z.id ? ' is-hover' : ''}`}
                onClick={() => activate(z)}
                onMouseEnter={() => setHover(z.id)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(z.id)}
                onBlur={() => setHover(null)}
              >
                <span className="statue__chip-swatch" aria-hidden />
                <span className="statue__chip-text">
                  <span className="statue__chip-reich">{z.reich}</span>
                  <span className="statue__chip-mat">{z.material}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
