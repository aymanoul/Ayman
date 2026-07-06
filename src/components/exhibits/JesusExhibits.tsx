import { motion, useReducedMotion } from 'framer-motion'
import type { Fakt, Duo, RouteStation, ZeitPunkt } from '../../data/seals/wahrheitssuche'
import { rise, stagger } from '../../lib/anim'

// Gemeinsame visuelle Bausteine der Jesus-Reihe — sie brechen die Textwaende
// der Band-Seiten auf:
//  · FaktenBand   — grosse Kennzahlen direkt unter der These
//  · DuoVergleich — zwei Stimmen, Zeile fuer Zeile (Bibel <-> Qur'an, Paulus <-> Jesus)
//  · RouteBand    — Stationen mit Pfeilen (Sinai -> Seir -> Paran)
//  · KonzilLeiste — Zeitleiste (nutzt die globalen .timeline/.tl-Stile von Daniel)

export function FaktenBand({ fakten }: { fakten: Fakt[] }) {
  return (
    <motion.ul
      className="fakten"
      variants={stagger}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
      aria-label="Kennzahlen dieses Bandes"
    >
      {fakten.map((f) => (
        <motion.li key={f.label} className={`fakt${f.ton ? ` fakt--${f.ton}` : ''}`} variants={rise}>
          <span className="fakt__wert">{f.wert}</span>
          <span className="fakt__label">{f.label}</span>
        </motion.li>
      ))}
    </motion.ul>
  )
}

export function DuoVergleich({ duo }: { duo: Duo }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className="duo"
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="duo__col duo__col--links">
        <p className="duo__head">{duo.links.titel}</p>
        {duo.links.zeilen.map((z) => (
          <p className="duo__zeile" key={z.text}>
            {z.text}
            {z.ref && <span className="duo__ref">{z.ref}</span>}
          </p>
        ))}
      </div>
      <div className="duo__col duo__col--rechts">
        <p className="duo__head">{duo.rechts.titel}</p>
        {duo.rechts.zeilen.map((z) => (
          <p className="duo__zeile" key={z.text}>
            {z.text}
            {z.ref && <span className="duo__ref">{z.ref}</span>}
          </p>
        ))}
      </div>
    </motion.div>
  )
}

export function RouteBand({ stationen }: { stationen: RouteStation[] }) {
  return (
    <motion.ol
      className="route"
      variants={stagger}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
    >
      {stationen.flatMap((s, i) => {
        const stop = (
          <motion.li
            key={s.ort}
            className={`route__stop${s.ziel ? ' route__stop--ziel' : ''}`}
            variants={rise}
          >
            <span className="route__ort">{s.ort}</span>
            <span className="route__wer">{s.wer}</span>
            {s.sub && <span className="route__sub">{s.sub}</span>}
          </motion.li>
        )
        if (i < stationen.length - 1) {
          return [
            stop,
            <li key={`${s.ort}-pfeil`} className="route__arrow" aria-hidden>
              →
            </li>,
          ]
        }
        return [stop]
      })}
    </motion.ol>
  )
}

export function KonzilLeiste({ punkte }: { punkte: ZeitPunkt[] }) {
  return (
    <motion.ol
      className="timeline"
      variants={stagger}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.2 }}
    >
      {punkte.map((p) => (
        <motion.li key={p.jahr} className={`tl${p.ton ? ` tl--${p.ton}` : ''}`} variants={rise}>
          <span className="tl__dot" aria-hidden />
          <span className="tl__year">{p.jahr}</span>
          <span className="tl__title">{p.titel}</span>
          <p className="tl__text">{p.text}</p>
        </motion.li>
      ))}
    </motion.ol>
  )
}
