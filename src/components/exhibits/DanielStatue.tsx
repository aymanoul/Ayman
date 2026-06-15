import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useBeleg } from '../Beleg'
import { statueZones, danielBelege, type StatueZone } from '../../data/seals/daniel'

// ---------------------------------------------------------------------------
// The dream image of Daniel 2 — Nebuchadnezzar's statue, rebuilt as a stylised
// vector in its recognisable classic form: gold head, silver torso with crossed
// arms, bronze waist, iron legs, feet of iron and clay. Each zone is a hotspot
// (click → kingdom + verse). The stone rolls in, shatters the feet, and grows
// into the emerald mountain that fills the earth.
// ---------------------------------------------------------------------------

type Phase = 'idle' | 'rolling' | 'mountain'

export default function DanielStatue() {
  const { open } = useBeleg()
  const reduce = useReducedMotion()
  const [hover, setHover] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const struck = phase === 'mountain'

  function activate(z: StatueZone) {
    if (z.id === 'stein' && phase === 'idle') play()
    open(danielBelege[z.belegId])
  }
  function play() {
    if (reduce) return setPhase('mountain')
    setPhase('rolling')
    window.setTimeout(() => setPhase('mountain'), 1450)
  }

  function zoneProps(z: StatueZone) {
    return {
      role: 'button',
      tabIndex: 0,
      'aria-label': `${z.material} — ${z.reich}`,
      onClick: () => activate(z),
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          activate(z)
        }
      },
      onMouseEnter: () => setHover(z.id),
      onMouseLeave: () => setHover(null),
      onFocus: () => setHover(z.id),
      onBlur: () => setHover(null),
      className: `statue__zone${hover === z.id ? ' is-hover' : ''}`,
    }
  }

  const current = statueZones.find((z) => z.id === hover)

  return (
    <div className="statue">
      <div className="statue__stage">
        <svg viewBox="0 0 360 880" className="statue__svg" role="img" aria-label="Daniels Traumbild — die Statue aus Daniel 2">
          <defs>
            <linearGradient id="mGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f6e3a0" />
              <stop offset="45%" stopColor="#cda23f" />
              <stop offset="100%" stopColor="#8a6c1c" />
            </linearGradient>
            <linearGradient id="mSilver" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f3f6f8" />
              <stop offset="48%" stopColor="#c3ccd4" />
              <stop offset="100%" stopColor="#828d97" />
            </linearGradient>
            <linearGradient id="mBronze" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d29c61" />
              <stop offset="50%" stopColor="#a86a3c" />
              <stop offset="100%" stopColor="#6c4222" />
            </linearGradient>
            <linearGradient id="mIron" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#969ea7" />
              <stop offset="50%" stopColor="#565d65" />
              <stop offset="100%" stopColor="#2f343a" />
            </linearGradient>
            <linearGradient id="mClay" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#b97b50" />
              <stop offset="50%" stopColor="#9a6038" />
              <stop offset="100%" stopColor="#5f5258" />
            </linearGradient>
            <linearGradient id="mMount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#27a07a" />
              <stop offset="55%" stopColor="#0e5b43" />
              <stop offset="100%" stopColor="#07301f" />
            </linearGradient>
            <linearGradient id="mStone" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#eef3ef" />
              <stop offset="55%" stopColor="#b9c3bb" />
              <stop offset="100%" stopColor="#7e8b82" />
            </linearGradient>
          </defs>

          {/* the great mountain rises behind the figure */}
          <motion.path
            d="M180 880 L-20 880 C 60 700 120 600 180 560 C 240 600 300 700 380 880 Z"
            fill="url(#mMount)"
            style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}
            initial={false}
            animate={struck ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0.001 : 1, ease: [0.23, 1, 0.32, 1], delay: struck ? 0.1 : 0 }}
          />

          {/* ground shadow */}
          <ellipse cx="180" cy="858" rx="118" ry="14" fill="rgba(8,56,42,0.16)" />

          {/* figure dims slightly once the mountain has filled the earth */}
          <motion.g initial={false} animate={{ opacity: struck ? 0.82 : 1 }} transition={{ duration: 0.6 }}>
            {/* ===== GOLD — head, crown, beard (Babylon) ===== */}
            <g {...zoneProps(statueZones[0])}>
              <path
                d="M180 36 C 208 56 226 102 223 146 C 222 162 215 172 206 176 L206 200 C206 216 201 228 196 240 C 212 256 217 286 201 306 C 192 318 168 318 159 306 C 143 286 148 256 164 240 C 159 228 154 216 154 200 L154 176 C 145 172 138 162 137 146 C 134 102 152 56 180 36 Z"
                fill="url(#mGold)"
                stroke="#6e561a"
                strokeWidth="1"
              />
              {/* face + beard detail */}
              <path d="M163 188 C 170 184 178 184 184 188" fill="none" stroke="#6e561a" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <path d="M196 188 C 202 184 210 184 215 188" fill="none" stroke="#6e561a" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
              <path d="M168 248 C 178 256 200 256 210 248 M170 264 C 182 272 196 272 208 264 M174 280 C 184 286 194 286 204 280" fill="none" stroke="#6e561a" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
              <path d="M180 214 C 176 222 184 222 180 214" fill="none" stroke="#6e561a" strokeWidth="2" strokeLinecap="round" />
              <path d="M180 40 C 162 70 156 110 162 146" fill="none" stroke="#fbeec0" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
            </g>

            {/* ===== SILVER — chest + crossed arms (Medo-Persia) ===== */}
            <g {...zoneProps(statueZones[1])}>
              <path
                d="M150 472 C 120 452 108 404 112 362 C 114 322 122 286 152 270 C 166 261 194 261 208 270 C 238 286 246 322 248 362 C 252 404 240 452 210 472 Z"
                fill="url(#mSilver)"
                stroke="#6f7a83"
                strokeWidth="1"
              />
              {/* crossed forearms */}
              <path d="M138 312 C 168 330 196 352 226 388" fill="none" stroke="#aeb8c0" strokeWidth="26" strokeLinecap="round" />
              <path d="M222 312 C 192 330 164 352 134 388" fill="none" stroke="#cdd5db" strokeWidth="26" strokeLinecap="round" />
              <path d="M138 312 C 168 330 196 352 226 388" fill="none" stroke="#7e8891" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              {/* sheen + abdomen line */}
              <path d="M150 300 C 142 350 146 410 162 452" fill="none" stroke="#f4f7f9" strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />
              <path d="M180 398 L180 460" stroke="#7e8891" strokeWidth="1.6" opacity="0.5" />
            </g>

            {/* ===== BRONZE — waist + kilt (Greece) ===== */}
            <g {...zoneProps(statueZones[2])}>
              <path
                d="M150 470 L210 470 C 222 486 226 492 226 500 C 234 540 236 590 234 622 L232 632 L128 632 L126 622 C 124 590 126 540 134 500 C 134 492 138 486 150 470 Z"
                fill="url(#mBronze)"
                stroke="#5a3720"
                strokeWidth="1"
              />
              {/* studded belt */}
              <rect x="129" y="476" width="102" height="26" rx="4" fill="#915223" opacity="0.55" />
              {Array.from({ length: 9 }, (_, i) => (
                <path key={i} d={`M${139 + i * 11} 498 l5 -16 l5 16 Z`} fill="#e8c07e" opacity="0.85" />
              ))}
              {/* lower band + bosses + fringe */}
              <rect x="126" y="600" width="108" height="22" rx="3" fill="#915223" opacity="0.5" />
              {Array.from({ length: 9 }, (_, i) => (
                <circle key={i} cx={137 + i * 12} cy={611} r={3.6} fill="#e8c07e" opacity="0.9" />
              ))}
              {Array.from({ length: 10 }, (_, i) => (
                <path key={i} d={`M${131 + i * 11} 632 l0 14 q5 4 9 0 l0 -14`} fill="#8a4f24" opacity="0.7" />
              ))}
            </g>

            {/* ===== IRON — legs (Rome) ===== */}
            <g {...zoneProps(statueZones[3])}>
              <path d="M150 632 C 146 690 150 740 158 792 L176 792 C 178 740 178 690 176 636 Z" fill="url(#mIron)" stroke="#24282d" strokeWidth="1" />
              <path d="M210 632 C 214 690 210 740 202 792 L184 792 C 182 740 182 690 184 636 Z" fill="url(#mIron)" stroke="#24282d" strokeWidth="1" />
              <path d="M158 650 C 156 700 160 750 165 788" fill="none" stroke="#aab2ba" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
              <path d="M202 650 C 204 700 200 750 195 788" fill="none" stroke="#aab2ba" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
            </g>

            {/* ===== IRON + CLAY — feet (divided Rome) ===== */}
            <motion.g {...zoneProps(statueZones[4])} animate={{ opacity: struck ? 0.45 : 1 }} transition={{ duration: 0.4 }}>
              <path d="M150 792 L178 792 C 180 808 184 820 184 828 C 184 836 150 838 140 832 C 134 826 138 802 150 792 Z" fill="url(#mClay)" stroke="#3a3036" strokeWidth="1" />
              <path d="M210 792 L182 792 C 180 808 176 820 176 828 C 176 836 210 838 220 832 C 226 826 222 802 210 792 Z" fill="url(#mIron)" stroke="#24282d" strokeWidth="1" />
              <path d="M150 800 l8 6 m6 -4 l6 8 m44 -10 l-8 6 m-6 -4 l-6 8" stroke="#3a3036" strokeWidth="1.4" opacity="0.5" strokeLinecap="round" />
            </motion.g>

            {/* cracks when struck */}
            <motion.g initial={false} animate={{ opacity: struck ? 1 : 0 }} transition={{ duration: 0.3 }} aria-hidden>
              <path d="M150 792 L165 808 L156 822 M210 792 L196 806 L205 824 M180 794 L182 812 L172 826" stroke="#1a1f23" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            </motion.g>
          </motion.g>

          {/* the stone — cut without hands */}
          <motion.g
            initial={false}
            animate={phase === 'idle' ? { x: 250, y: -150, rotate: 0, opacity: 0 } : { x: 0, y: 0, rotate: reduce ? 0 : 560, opacity: 1 }}
            transition={phase === 'rolling' ? { duration: 1.4, ease: [0.34, 0.65, 0.4, 1] } : { duration: 0.5, ease: 'easeOut' }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          >
            <path
              d="M180 786 c 22 0 34 12 34 30 c 0 18 -14 30 -34 30 c -22 0 -36 -12 -36 -30 c 0 -18 14 -30 36 -30 Z"
              fill="url(#mStone)"
              stroke="#5d6760"
              strokeWidth="1.4"
            />
            <path d="M168 802 l10 8 l-4 12 m24 -22 l-8 10 l8 8" stroke="#7e8b82" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.7" />
          </motion.g>
        </svg>

        <p className="statue__readout" aria-live="polite">
          {current ? (
            <>
              <span className="statue__readout-reich">{current.reich}</span>
              <span className="statue__readout-meta">
                {current.material} · {current.jahr}
              </span>
            </>
          ) : (
            <span className="statue__readout-hint">Berühre ein Material — oder lass den Stein rollen.</span>
          )}
        </p>
      </div>

      <div className="statue__side">
        <button className="statue__play" onClick={() => (phase === 'idle' ? play() : setPhase('idle'))}>
          {phase === 'idle' ? 'Den Stein rollen lassen' : 'Zurücksetzen'}
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
