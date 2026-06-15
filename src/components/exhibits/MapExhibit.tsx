import { motion, useReducedMotion } from 'framer-motion'

// Schematic map (not to scale) of the fourth kingdom split in two — West Rome
// and East Rome (Byzantium), the statue's two iron legs — with Arabia rising
// in green to strike the eastern leg in 1453. Ties the map to the statue.
export default function MapExhibit() {
  const reduce = useReducedMotion()
  return (
    <figure className="map">
      <svg viewBox="0 0 720 400" className="map__svg" role="img" aria-label="Schematische Karte: das geteilte Rom, Ost und West, und der Aufstieg Arabiens">
        <defs>
          <linearGradient id="mapIron" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9aa1a9" />
            <stop offset="100%" stopColor="#5c636b" />
          </linearGradient>
          <linearGradient id="mapGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c8a63" />
            <stop offset="100%" stopColor="#0b4733" />
          </linearGradient>
          <marker id="mapArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="#0e5b43" />
          </marker>
        </defs>

        {/* faint graticule */}
        <g stroke="rgba(14,91,67,0.08)" strokeWidth="1">
          {[80, 160, 240, 320].map((y) => (
            <line key={y} x1="20" y1={y} x2="700" y2={y} />
          ))}
          {[160, 280, 400, 520, 640].map((x) => (
            <line key={x} x1={x} y1="30" x2={x} y2="370" />
          ))}
        </g>

        {/* West Rome (iron) */}
        <path
          d="M90 150 C 70 120 130 96 180 104 C 250 96 300 120 296 160 C 300 210 250 244 184 240 C 120 246 80 210 90 150 Z"
          fill="url(#mapIron)"
          opacity="0.5"
          stroke="#3a3f45"
          strokeWidth="1.5"
        />
        {/* East Rome / Byzantium (iron) */}
        <path
          d="M392 140 C 380 108 440 88 500 96 C 600 92 648 124 640 168 C 648 222 590 250 510 244 C 430 248 384 206 392 140 Z"
          fill="url(#mapIron)"
          opacity="0.5"
          stroke="#3a3f45"
          strokeWidth="1.5"
        />

        {/* division line — 395 */}
        <line x1="344" y1="84" x2="344" y2="262" stroke="#a8842f" strokeWidth="2" strokeDasharray="7 6" />
        <text x="344" y="74" className="map__div" textAnchor="middle">395 — die Teilung</text>

        {/* Arabia (green, the kingdom of God rising) */}
        <motion.path
          d="M360 296 C 350 268 430 256 470 264 C 540 260 560 292 552 322 C 556 352 500 366 444 360 C 388 364 356 338 360 296 Z"
          fill="url(#mapGreen)"
          opacity="0.92"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 0.92, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        />

        {/* conquest arrow → strikes the eastern leg, 1453 */}
        <motion.path
          d="M470 300 C 510 270 520 230 516 196"
          fill="none"
          stroke="#0e5b43"
          strokeWidth="2.5"
          markerEnd="url(#mapArrow)"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
        />
        <text x="540" y="250" className="map__year">1453</text>

        {/* cities */}
        {[
          { x: 180, y: 168, n: 'Rom' },
          { x: 512, y: 150, n: 'Konstantinopel' },
          { x: 432, y: 322, n: 'Medina' },
          { x: 446, y: 344, n: 'Mekka' },
        ].map((c) => (
          <g key={c.n}>
            <circle cx={c.x} cy={c.y} r="4" fill="#16201b" />
            <circle cx={c.x} cy={c.y} r="7.5" fill="none" stroke="#16201b" strokeWidth="1" opacity="0.4" />
            <text x={c.x + 11} y={c.y + 4} className="map__city">
              {c.n}
            </text>
          </g>
        ))}
      </svg>

      <ul className="map__legend">
        <li>
          <span className="map__sw map__sw--iron" /> Westrom &amp; Ostrom — das Eisen (die zwei Beine)
        </li>
        <li>
          <span className="map__sw map__sw--green" /> Arabien — der Stein, der das Eisen trifft
        </li>
      </ul>
      <figcaption className="map__cap">Schematisch, nicht maßstabsgetreu — das vierte Reich, geteilt in Ost und West.</figcaption>
    </figure>
  )
}
