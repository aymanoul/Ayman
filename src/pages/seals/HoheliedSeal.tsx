import '../../styles/seals/hohelied.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Chevron } from '../../components/icons'
import { BelegCard } from '../../components/Beleg'
import {
  WurzelThread,
  Einsetzprobe,
  Physiognomie,
  SanhedrinPanel,
  Verknuepfung,
  Feindzeugen,
  PluralHoheit,
} from '../../components/exhibits/HoheliedExhibits'
import { rise, stagger } from '../../lib/anim'
import { fmt } from '../../lib/fmt'
import {
  hoheliedThese,
  hoheliedSteps,
  hoheliedKonter,
  hoheliedScholar,
  hoheliedBelege,
  hoheliedVernetzung,
  hoheliedGleicheMassstaebe,
} from '../../data/seals/hohelied'

function Eyebrow({ kicker, title }: { kicker: string; title: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.header
      className="sec__head"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    >
      <span className="sec__kicker">{kicker}</span>
      <h2 className="sec__title">{title}</h2>
    </motion.header>
  )
}

function KonterRow({ item }: { item: (typeof hoheliedKonter)[number] }) {
  const [open, setOpen] = useState(false)
  const beleg = item.belegId ? hoheliedBelege[item.belegId] : undefined
  return (
    <motion.div className={`konter${item.tier === 'marble' ? ' is-marble' : ''}`} variants={rise}>
      {item.tier === 'marble' && <span className="marble-tag">Ergänzender Befund</span>}
      <button className="konter__einwand" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="konter__label">Einwand</span>
        <span className="konter__text">{item.einwand}</span>
        <span className={`konter__chev${open ? ' is-open' : ''}`} aria-hidden><Chevron /></span>
      </button>
      <motion.div
        className="konter__panel"
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
        style={{ overflow: 'hidden' }}
      >
        <div className="konter__inner">
          <span className="konter__label konter__label--k">Konter</span>
          <p className="konter__ktext">{item.konter}</p>
          {beleg && <BelegCard beleg={beleg} />}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function HoheliedSeal() {
  const reduce = useReducedMotion()
  const [deep, setDeep] = useState(false)

  return (
    <main className="shell seal">
      <div className="wrap">
        <Link to="/modul/muhammad" className="stub__back" style={{ marginTop: 'clamp(1.5rem,5vh,3rem)' }}>
          <ArrowLeft /> Muhammad in der Bibel
        </Link>

        {/* ---- header ---- */}
        <motion.header className="seal__head" initial={reduce ? false : 'hidden'} animate="shown" variants={stagger}>
          <motion.span className="seal__num" variants={rise}>
            Siegel IV
          </motion.span>
          <motion.h1 className="seal__title gilt" variants={rise}>
            Das Hohelied
          </motion.h1>
          <motion.p className="seal__these" variants={rise}>
            {fmt(hoheliedThese)}
          </motion.p>
        </motion.header>

        {/* ---- the chain ---- */}
        <section className="sec">
          <Eyebrow kicker="Debatten-Ebene" title="Die Beweiskette in vier Schritten" />
          <motion.ol className="steps" variants={stagger} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.2 }}>
            {hoheliedSteps.map((s) => (
              <motion.li className="step" key={s.n} variants={rise}>
                <span className="step__n">{s.n}</span>
                <div>
                  <h3 className="step__h">{s.h}</h3>
                  <p className="step__b">{fmt(s.body)}</p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </section>

        {/* ---- 🔥 HAUPT-EXHIBIT: the Hebrew root graphic (centrepiece) ---- */}
        <section className="sec" id="wurzel">
          <Eyebrow kicker="Haupt-Exhibit" title="Die Hebräisch-Wurzel-Grafik" />
          <p className="sec__lead">
            מַחֲמַדִּים (Hld 5,16) ↔ חמדת (Haggai 2,7) ↔ أحمد / محمد — alle auf eine Wurzel zurückgeführt:
            Ḥ-M-D. Das visuelle Zentrum des Siegels.
          </p>
          <WurzelThread />
        </section>

        {/* ---- the Einsetzprobe ---- */}
        <section className="sec" id="einsetzprobe">
          <Eyebrow kicker="Nur eine Stelle passt" title="Die Einsetzprobe" />
          <Einsetzprobe />
        </section>

        {/* ---- the belege showcase — ALL of them ---- */}
        <section className="sec">
          <Eyebrow kicker="Die Belege" title="Verse, Wurzel und Zeugen" />
          <p className="sec__lead">
            Jeder Beleg öffnet sich groß und beleuchtet — Originaltext, Umschrift, Übersetzung und Fundstelle.
          </p>
          <div className="belege-grid">
            <BelegCard beleg={hoheliedBelege.song516} />
            <BelegCard beleg={hoheliedBelege.hag27} />
            <BelegCard beleg={hoheliedBelege.mal31} />
            <BelegCard beleg={hoheliedBelege.song510} />
            <BelegCard beleg={hoheliedBelege.song511} />
            <BelegCard beleg={hoheliedBelege.song515} />
            <BelegCard beleg={hoheliedBelege.q616} />
            <BelegCard beleg={hoheliedBelege.q171} />
            <BelegCard beleg={hoheliedBelege.q2146} />
            <BelegCard beleg={hoheliedBelege.wurzelhmd} />
            <BelegCard beleg={hoheliedBelege.sanhedrin} />
            <BelegCard beleg={hoheliedBelege.parkhurst} />
            <BelegCard beleg={hoheliedBelege.higgins} />
            <BelegCard beleg={hoheliedBelege.dawud} />
            <BelegCard beleg={hoheliedBelege.ojb} />
            <BelegCard beleg={hoheliedBelege.herrlichkeit} />
            <BelegCard beleg={hoheliedBelege.shalom} />
            <BelegCard beleg={hoheliedBelege.pluralverb} />
            <BelegCard beleg={hoheliedBelege.allegorie} />
            <BelegCard beleg={hoheliedBelege.pluralis} />
            <BelegCard beleg={hoheliedBelege.hesekiel16} />
            <BelegCard beleg={hoheliedBelege.physiognomie} />
            <BelegCard beleg={hoheliedBelege.davis} />
            <BelegCard beleg={hoheliedBelege.eloquenz} />
          </div>
        </section>

        {/* ---- the physiognomy side-by-side ---- */}
        <section className="sec" id="physiognomie">
          <Eyebrow kicker="Zug um Zug" title="Die Physiognomie" />
          <Physiognomie />
        </section>

        {/* ---- the Sanhedrin 43a panel ---- */}
        <section className="sec" id="sanhedrin">
          <Eyebrow kicker="Die jüdische Namens-Exegese" title="Sanhedrin 43a" />
          <SanhedrinPanel />
        </section>

        {/* ---- the cross-link diagram ---- */}
        <section className="sec">
          <Eyebrow kicker="Das Netz der Prophezeiungen" title="Der Knotenpunkt" />
          <Verknuepfung />
        </section>

        {/* ---- the hostile-witnesses panel ---- */}
        <section className="sec">
          <Eyebrow kicker="Die unwilligen Zeugen" title="Feindzeugen" />
          <Feindzeugen />
        </section>

        {/* ---- the plural of majesty ---- */}
        <section className="sec">
          <Eyebrow kicker="Die Grammatik" title="Wenn -īm Hoheit bedeutet" />
          <PluralHoheit />
        </section>

        {/* ---- objection / counter ---- */}
        <section className="sec">
          <Eyebrow kicker="Einwand · Konter" title="Was der Gegner sagt — und die Antwort" />
          <motion.div className="konter-list" variants={stagger} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.1 }}>
            {hoheliedKonter.map((k, i) => (
              <KonterRow key={i} item={k} />
            ))}
          </motion.div>
        </section>

        {/* ---- scholarly layer ---- */}
        <section className="sec">
          <Eyebrow kicker="Gelehrten-Ebene" title="Tiefer graben" />
          <button className="scholar__toggle" onClick={() => setDeep((v) => !v)} aria-expanded={deep}>
            {deep ? 'Gelehrten-Ebene schließen' : 'Gelehrten-Ebene öffnen'}
            <span className={`scholar__chev${deep ? ' is-open' : ''}`} aria-hidden><Chevron /></span>
          </button>
          <motion.div
            initial={false}
            animate={{ height: deep ? 'auto' : 0, opacity: deep ? 1 : 0 }}
            transition={{ duration: 0.36, ease: [0.23, 1, 0.32, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="scholar">
              {hoheliedScholar.map((s, i) => (
                <article key={i} className={`scholar__item${s.tier === 'marble' ? ' is-marble' : ''}`}>
                  {s.tier === 'marble' && <span className="marble-tag">Ergänzender Befund</span>}
                  <h3 className="scholar__h">{s.h}</h3>
                  <p className="scholar__b">{s.body}</p>
                </article>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ---- gleiche maßstäbe ---- */}
        <motion.section
          className="massstab"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        >
          <span className="massstab__label">Gleiche Maßstäbe</span>
          <p>{hoheliedGleicheMassstaebe}</p>
        </motion.section>

        {/* ---- the net ---- */}
        <section className="sec">
          <Eyebrow kicker="Das Netz schließt sich" title="Vernetzung" />
          <div className="netz">
            {hoheliedVernetzung.map((v) => (
              <article className="netz__item" key={v.ziel}>
                <h3 className="netz__ziel">{v.ziel}</h3>
                <p className="netz__text">{v.text}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <footer className="foot">
        <p>Die Bibliothek</p>
      </footer>
    </main>
  )
}
