import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Chevron } from '../../components/icons'
import { BelegCard } from '../../components/Beleg'
import { TahrifSpektrum, NameThread, Spielregeln, IbnAmrJesaja } from '../../components/exhibits/FundamentExhibits'
import { rise, stagger } from '../../lib/anim'
import { fmt } from '../../lib/fmt'
import {
  fundamentThese,
  fundamentSteps,
  fundamentKonter,
  fundamentScholar,
  fundamentBelege,
  fundamentVernetzung,
  fundamentGleicheMassstaebe,
} from '../../data/seals/fundament'

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

function KonterRow({ item }: { item: (typeof fundamentKonter)[number] }) {
  const [open, setOpen] = useState(false)
  const beleg = item.belegId ? fundamentBelege[item.belegId] : undefined
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

export default function FundamentSeal() {
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
            Buch 1
          </motion.span>
          <motion.h1 className="seal__title gilt" variants={rise}>
            Das Fundament
          </motion.h1>
          <motion.p className="seal__these" variants={rise}>
            {fmt(fundamentThese)}
          </motion.p>
        </motion.header>

        {/* ---- the chain ---- */}
        <section className="sec">
          <Eyebrow kicker="Debatten-Ebene" title="Das Fundament in vier Schritten" />
          <motion.ol className="steps" variants={stagger} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.2 }}>
            {fundamentSteps.map((s) => (
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

        {/* ---- the claim ---- */}
        <section className="sec" id="belege">
          <Eyebrow kicker="Der Anspruch" title="Eine prüfbare Behauptung" />
          <p className="sec__lead">
            Der Koran stellt sich selbst auf die Probe: der kommende Prophet sei „aufgeschrieben" bei den Leuten der Schrift.
          </p>
          <div className="belege-grid">
            <BelegCard beleg={fundamentBelege.q7157} />
            <BelegCard beleg={fundamentBelege.q616} />
            <BelegCard beleg={fundamentBelege.q2146} />
            <BelegCard beleg={fundamentBelege.q381} />
            <BelegCard beleg={fundamentBelege.q159} />
            <BelegCard beleg={fundamentBelege.q279} />
            <BelegCard beleg={fundamentBelege.q568} />
            <BelegCard beleg={fundamentBelege.q546} />
            <BelegCard beleg={fundamentBelege.doppelnatur} />
            <BelegCard beleg={fundamentBelege.bukhari2125} />
            <BelegCard beleg={fundamentBelege.funfnamen} />
            <BelegCard beleg={fundamentBelege.capstone} />
            <BelegCard beleg={fundamentBelege.tahrif} />
            <BelegCard beleg={fundamentBelege.erkenntnis} />
          </div>
        </section>

        {/* ---- the description: Bukhari 2125 ↔ Isaiah 42 ---- */}
        <section className="sec" id="synopse">
          <Eyebrow kicker="Die Beschreibung" title="Aufgeschrieben — und lesbar" />
          <p className="sec__lead">
            Kein Schriftzug, sondern eine Beschreibung: was der ṣaḥīḥ-Hadith über die Tora sagt, steht Zug um Zug
            in Jesaja 42.
          </p>
          <IbnAmrJesaja />
        </section>

        {/* ---- the name thread ---- */}
        <section className="sec" id="namen">
          <Eyebrow kicker="Der rote Faden" title="Die Wurzel, die den Namen trägt" />
          <NameThread />
        </section>

        {/* ---- the rules ---- */}
        <section className="sec">
          <Eyebrow kicker="Die Methode" title="Wie wir lesen" />
          <Spielregeln />
        </section>

        {/* ---- objection / counter ---- */}
        <section className="sec">
          <Eyebrow kicker="Einwand · Konter" title="Was der Gegner sagt — und die Antwort" />
          <motion.div className="konter-list" variants={stagger} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.1 }}>
            {fundamentKonter.map((k, i) => (
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
              {fundamentScholar.map((s, i) => (
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
          <p>{fundamentGleicheMassstaebe}</p>
        </motion.section>

        {/* ---- the net ---- */}
        <section className="sec">
          <Eyebrow kicker="Das Netz beginnt" title="Vernetzung" />
          <div className="netz">
            {fundamentVernetzung.map((v) => (
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
