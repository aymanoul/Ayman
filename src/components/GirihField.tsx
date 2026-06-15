import { useId } from 'react'

// ---------------------------------------------------------------------------
// Ambient girih: an eightfold star-and-cross tessellation in faint gold,
// stronger near the top (where the light falls) and dissolving downward.
// Pure atmosphere — it sits behind everything and never asks for attention.
// ---------------------------------------------------------------------------

export default function GirihField({ opacity = 0.06 }: { opacity?: number }) {
  const uid = useId().replace(/:/g, '')
  const T = 120 // tile size

  // one eightfold star centred in the tile
  const star = (cx: number, cy: number, r: number) => {
    const spikes = 8
    const inner = r * 0.42
    const step = Math.PI / spikes
    let d = ''
    for (let i = 0; i < spikes * 2; i++) {
      const rad = i % 2 === 0 ? r : inner
      const a = -Math.PI / 2 + i * step
      d += `${i === 0 ? 'M' : 'L'}${(cx + rad * Math.cos(a)).toFixed(2)} ${(cy + rad * Math.sin(a)).toFixed(2)} `
    }
    return d + 'Z'
  }

  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
      <svg width="100%" height="100%" preserveAspectRatio="xMidYMin slice">
        <defs>
          <pattern id={`girih-${uid}`} width={T} height={T} patternUnits="userSpaceOnUse">
            {/* corner stars meet to form the connecting cross between tiles */}
            <path d={star(0, 0, 26)} fill="none" stroke="var(--gold)" strokeWidth="0.6" />
            <path d={star(T, 0, 26)} fill="none" stroke="var(--gold)" strokeWidth="0.6" />
            <path d={star(0, T, 26)} fill="none" stroke="var(--gold)" strokeWidth="0.6" />
            <path d={star(T, T, 26)} fill="none" stroke="var(--gold)" strokeWidth="0.6" />
            <path d={star(T / 2, T / 2, 22)} fill="none" stroke="var(--gold)" strokeWidth="0.6" />
            <line x1={T / 2} y1="0" x2={T / 2} y2={T} stroke="var(--gold)" strokeWidth="0.3" opacity="0.5" />
            <line x1="0" y1={T / 2} x2={T} y2={T / 2} stroke="var(--gold)" strokeWidth="0.3" opacity="0.5" />
          </pattern>
          <linearGradient id={`fade-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="45%" stopColor="#fff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id={`mask-${uid}`}>
            <rect width="100%" height="100%" fill={`url(#fade-${uid})`} />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill={`url(#girih-${uid})`} opacity={opacity} mask={`url(#mask-${uid})`} />
      </svg>
    </div>
  )
}
