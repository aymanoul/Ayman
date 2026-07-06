import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Chevron } from '../../components/icons'
import { BelegCard } from '../../components/Beleg'
import { rise, stagger } from '../../lib/anim'
import { fmt } from '../../lib/fmt'
import {
  gotteskonzeptThese,
  gotteskonzeptSteps,
  gotteskonzeptSpielregeln,
  gotteskonzeptKonter,
  gotteskonzeptScholar,
  gotteskonzeptBelege,
  gotteskonzeptVernetzung,
  gotteskonzeptKernaussage,
} from '../../data/seals/gotteskonzept'

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

function KonterRow({ item }: { item: (typeof gotteskonzeptKonter)[number] }) {
  const [open, setOpen] = useState(false)
  const beleg = item.belegId ? gotteskonzeptBelege[item.belegId] : undefined
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
          <p className="konter__ktext">{fmt(item.konter)}</p>
          {beleg && <BelegCard beleg={beleg} />}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function GotteskonzeptSeal() {
  const reduce = useReducedMotion()
  const [deep, setDeep] = useState(false)

  return (
    <main className="shell seal">
      <div className="wrap">
        <Link to="/modul/jesus" className="stub__back" style={{ marginTop: 'clamp(1.5rem,5vh,3rem)' }}>
          <ArrowLeft /> Jesus, der Gesandte Gottes
        </Link>

        <motion.header className="seal__head" initial={reduce ? false : 'hidden'} animate="shown" variants={stagger}>
          <motion.span className="seal__num" variants={rise}>
            Band 2
          </motion.span>
          <motion.h1 className="seal__title gilt" variants={rise}>
            Das Gotteskonzept
          </motion.h1>
          <motion.p className="seal__these" variants={rise}>
            {fmt(gotteskonzeptThese)}
          </motion.p>
        </motion.header>

        <section className="sec">
          <Eyebrow kicker="Debatten-Ebene" title="Von Nicäa bis Chalcedon — in vier Schritten" />
          <motion.ol className="steps" variants={stagger} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.2 }}>
            {gotteskonzeptSteps.map((s) => (
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

        <section className="sec" id="belege">
          <Eyebrow kicker="Der Ausgangspunkt" title="Was den Vergleich trägt" />
          <p className="sec__lead">
            Die Trinität scheitert am eigenen Fälschungstest — Widerspruchsfreiheit; der Tauhid besteht ihn in vier Versen.
          </p>
          <div className="belege-grid">
            <BelegCard beleg={gotteskonzeptBelege.ikhlas} />
            <BelegCard beleg={gotteskonzeptBelege.johannes111} />
            <BelegCard beleg={gotteskonzeptBelege.johannes173} />
            <BelegCard beleg={gotteskonzeptBelege.markus1229} />
            <BelegCard beleg={gotteskonzeptBelege.q4171} />
            <BelegCard beleg={gotteskonzeptBelege.homoousios} />
          </div>
        </section>

        <section className="sec">
          <Eyebrow kicker="Die Kriterien" title="Woran man eine Offenbarung prüft" />
          <div className="netz">
            {gotteskonzeptSpielregeln.map((r) => (
              <article className="netz__item" key={r.regel}>
                <h3 className="netz__ziel">{r.regel}</h3>
                <p className="netz__text">{r.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sec">
          <Eyebrow kicker="Einwand · Konter" title="Was der Gegner sagt — und die Antwort" />
          <motion.div className="konter-list" variants={stagger} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.1 }}>
            {gotteskonzeptKonter.map((k, i) => (
              <KonterRow key={i} item={k} />
            ))}
          </motion.div>
        </section>

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
              {gotteskonzeptScholar.map((s, i) => (
                <article key={i} className={`scholar__item${s.tier === 'marble' ? ' is-marble' : ''}`}>
                  {s.tier === 'marble' && <span className="marble-tag">Ergänzender Befund</span>}
                  <h3 className="scholar__h">{s.h}</h3>
                  <p className="scholar__b">{s.body}</p>
                </article>
              ))}
            </div>
          </motion.div>
        </section>

        <motion.section
          className="massstab"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        >
          <span className="massstab__label">Kernaussage</span>
          <p>{gotteskonzeptKernaussage}</p>
        </motion.section>

        <section className="sec">
          <Eyebrow kicker="Das Netz wächst" title="Vernetzung" />
          <div className="netz">
            {gotteskonzeptVernetzung.map((v) => (
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
