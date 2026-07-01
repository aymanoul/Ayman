import { motion, useReducedMotion } from 'framer-motion'
import { useId } from 'react'

// ---------------------------------------------------------------------------
// The Shamsa ("little sun") — the illuminated rosette that opens a manuscript.
// The platform's emblem and the mark of every seal: emerald girih geometry with
// brass illumination on a paper-white disk. Geometry is always drawn; the
// entrance is a single fade + scale + quarter-turn (Emil ease-out), with an
// optional slow idle turn. This is the signature element.
// ---------------------------------------------------------------------------

const C = 100 // centre
const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1]

function starPath(spikes: number, outer: number, inner: number, rot = -Math.PI / 2): string {
  const step = Math.PI / spikes
  let d = ''
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = rot + i * step
    d += `${i === 0 ? 'M' : 'L'}${(C + r * Math.cos(a)).toFixed(2)} ${(C + r * Math.sin(a)).toFixed(2)} `
  }
  return d + 'Z'
}

function ringDots(count: number, radius: number, dot: number) {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2
    return { x: C + radius * Math.cos(a), y: C + radius * Math.sin(a), r: dot }
  })
}

function rays(count: number, r1: number, r2: number) {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2
    return { x1: C + r1 * Math.cos(a), y1: C + r1 * Math.sin(a), x2: C + r2 * Math.cos(a), y2: C + r2 * Math.sin(a) }
  })
}

interface ShamsaProps {
  size?: number
  className?: string
  animate?: boolean // orchestrated entrance on mount
  idle?: boolean // slow ambient rotation
  glow?: boolean // soft halo behind
  title?: string
  decorative?: boolean // pure atmosphere — hidden from assistive tech
}

export default function Shamsa({
  size = 200,
  className,
  animate = true,
  idle = true,
  glow = false,
  title = 'Shamsa',
  decorative = false,
}: ShamsaProps) {
  const uid = useId().replace(/:/g, '')
  const reduce = useReducedMotion()
  const play = animate && !reduce
  const spin = idle && !reduce

  const dots = ringDots(40, 91, 1.2)
  const sunrays = rays(24, 70, 84)
  const spinStyle = { transformBox: 'fill-box', transformOrigin: 'center' } as const

  return (
    <motion.svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : title}
      aria-hidden={decorative || undefined}
      initial={play ? { opacity: 0, scale: 0.92, rotate: -8 } : false}
      animate={play ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
      transition={{ duration: 1, ease: EASE }}
      style={{ overflow: 'visible', transformBox: 'fill-box', transformOrigin: 'center' }}
    >
      <defs>
        <radialGradient id={`glow-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7d905a" stopOpacity="0.08" />
          <stop offset="60%" stopColor="#7d905a" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#7d905a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`green-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7d905a" />
          <stop offset="55%" stopColor="#5f6f46" />
          <stop offset="100%" stopColor="#414f2f" />
        </linearGradient>
        <linearGradient id={`brass-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d3b06a" />
          <stop offset="52%" stopColor="#b3873a" />
          <stop offset="100%" stopColor="#87651f" />
        </linearGradient>
      </defs>

      {glow && <circle cx={C} cy={C} r={99} fill={`url(#glow-${uid})`} />}

      {/* paper disk so the medallion reads on any ground */}
      <circle cx={C} cy={C} r={67} fill="var(--seal-fill)" />

      {/* slow-turning ornamental shell */}
      <motion.g
        style={spinStyle}
        animate={spin ? { rotate: 360 } : undefined}
        transition={spin ? { duration: 260, repeat: Infinity, ease: 'linear' } : undefined}
      >
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={`url(#brass-${uid})`} />
        ))}
        <circle cx={C} cy={C} r={86} fill="none" stroke={`url(#green-${uid})`} strokeWidth={1.5} />
        {sunrays.map((r, i) => (
          <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="var(--green)" strokeWidth={1.1} strokeLinecap="round" opacity={0.55} />
        ))}
        <circle cx={C} cy={C} r={66} fill="none" stroke={`url(#green-${uid})`} strokeWidth={1.6} />
      </motion.g>

      {/* fixed luminous core */}
      <g>
        <path d={starPath(16, 62, 30)} fill="rgba(95,111,70,0.06)" stroke={`url(#green-${uid})`} strokeWidth={1.5} strokeLinejoin="round" />
        <path d={starPath(8, 44, 19)} fill="rgba(179,135,58,0.1)" stroke={`url(#brass-${uid})`} strokeWidth={1.3} strokeLinejoin="round" />
        <g>
          {Array.from({ length: 8 }, (_, i) => (
            <ellipse key={i} cx={C} cy={C - 21} rx={4.6} ry={13} fill="none" stroke="var(--brass)" strokeWidth={1} transform={`rotate(${i * 45} ${C} ${C})`} opacity={0.85} />
          ))}
        </g>
        <circle cx={C} cy={C} r={11} fill="none" stroke={`url(#brass-${uid})`} strokeWidth={1.2} />
        <circle cx={C} cy={C} r={4.8} fill={`url(#brass-${uid})`} />
      </g>
    </motion.svg>
  )
}
