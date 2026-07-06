import '../../styles/seals/paraklet.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Chevron } from '../../components/icons'
import { BelegCard } from '../../components/Beleg'
import {
  KriterienMatrix,
  PeriklytosGrafik,
  Textkritik,
  BrownListe,
  Busfahrer,
  DeutBruecke,
  KirchenPanel,
} from '../../components/exhibits/ParakletExhibits'
import { rise, stagger } from '../../lib/anim'
import { fmt } from '../../lib/fmt'
import {
  parakletThese,
  parakletSteps,
  parakletKonter,
  parakletScholar,
  parakletBelege,
  parakletVernetzung,
  parakletGleicheMassstaebe,
} from '../../data/seals/paraklet'

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

function KonterRow({ item }: { item: (typeof parakletKonter)[number] }) {
  const [open, setOpen] = useState(false)
  const beleg = item.belegId ? parakletBelege[item.belegId] : undefined
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

export default function ParakletSeal() {
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
            Buch 7
          </motion.span>
          <motion.h1 className="seal__title gilt" variants={rise}>
            Der Paraklet
          </motion.h1>
          <motion.p className="seal__these" variants={rise}>
            {fmt(parakletThese)}
          </motion.p>
        </motion.header>

        {/* ---- the chain ---- */}
        <section className="sec">
          <Eyebrow kicker="Debatten-Ebene" title="Die Beweiskette in vier Schritten" />
          <motion.ol className="steps" variants={stagger} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.2 }}>
            {parakletSteps.map((s) => (
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

        {/* ---- 🔥 the four-criteria matrix (centrepiece) ---- */}
        <section className="sec" id="matrix">
          <Eyebrow kicker="Haupt-Exhibit" title="Geist oder Gesandter?" />
          <p className="sec__lead">
            Vier Kriterien aus Jesu eigenen Worten — alle erfüllt von einem kommenden Menschen. Der „Heilige
            Geist" scheitert an dreien.
          </p>
          <KriterienMatrix />
        </section>

        {/* ---- the periklytos graphic ---- */}
        <section className="sec" id="periklytos">
          <Eyebrow kicker="Der Name" title="Ein Klangschritt, ein Name" />
          <PeriklytosGrafik />
        </section>

        {/* ---- the belege showcase — ALL of them ---- */}
        <section className="sec">
          <Eyebrow kicker="Die Belege" title="Verheißung, Name und Beschreibung" />
          <p className="sec__lead">
            Auch der stärkste Gegen-Vers (14,26) steht offen dabei.
          </p>
          <div className="belege-grid">
            <BelegCard beleg={parakletBelege.john1416} />
            <BelegCard beleg={parakletBelege.john1417} />
            <BelegCard beleg={parakletBelege.john1426} />
            <BelegCard beleg={parakletBelege.john1526} />
            <BelegCard beleg={parakletBelege.john167} />
            <BelegCard beleg={parakletBelege.john1613} />
            <BelegCard beleg={parakletBelege.john1615} />
            <BelegCard beleg={parakletBelege.q616} />
            <BelegCard beleg={parakletBelege.q5325} />
            <BelegCard beleg={parakletBelege.q16102} />
            <BelegCard beleg={parakletBelege.periklytos} />
            <BelegCard beleg={parakletBelege.raymondBrown} />
            <BelegCard beleg={parakletBelege.metzger} />
            <BelegCard beleg={parakletBelege.nielsen} />
            <BelegCard beleg={parakletBelege.himmelfahrtMoses} />
            <BelegCard beleg={parakletBelege.kirchenPraezedenz} />
            <BelegCard beleg={parakletBelege.anMeinerStelle} />
            <BelegCard beleg={parakletBelege.maskulinePronomen} />
          </div>
        </section>

        {/* ---- text-criticism panel ---- */}
        <section className="sec">
          <Eyebrow kicker="Johannes 14,26" title="Der stärkste Gegen-Vers" />
          <Textkritik />
        </section>

        {/* ---- Brown's list ---- */}
        <section className="sec">
          <Eyebrow kicker="Selbst christliche Gelehrte" title="Paraklet = ursprünglich ein Mensch" />
          <BrownListe />
        </section>

        {/* ---- the bus-driver illustration ---- */}
        <section className="sec">
          <Eyebrow kicker="Titel ≠ Funktion" title="Das Paraklet-Problem" />
          <Busfahrer />
        </section>

        {/* ---- the Deut-18,18 bridge ---- */}
        <section className="sec">
          <Eyebrow kicker="Brücke zu Buch 3" title="Wort für Wort wie Mose" />
          <DeutBruecke />
        </section>

        {/* ---- church precedent ---- */}
        <section className="sec">
          <Eyebrow kicker="Innerchristliche Tradition" title="Die Kirche selbst" />
          <KirchenPanel />
        </section>

        {/* ---- objection / counter ---- */}
        <section className="sec">
          <Eyebrow kicker="Einwand · Konter" title="Was der Gegner sagt — und die Antwort" />
          <motion.div className="konter-list" variants={stagger} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.1 }}>
            {parakletKonter.map((k, i) => (
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
              {parakletScholar.map((s, i) => (
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
          <p>{parakletGleicheMassstaebe}</p>
        </motion.section>

        {/* ---- the net ---- */}
        <section className="sec">
          <Eyebrow kicker="Das Netz schließt sich" title="Vernetzung" />
          <div className="netz">
            {parakletVernetzung.map((v) => (
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
