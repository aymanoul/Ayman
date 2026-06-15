import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Shamsa from '../../components/Shamsa'
import { ArrowLeft } from '../../components/icons'
import { Crown } from '../../components/Ornament'
import { BelegCard } from '../../components/Beleg'
import { Stammbaum, ZwoelfFuersten, Bundesgaben } from '../../components/exhibits/AbrahamExhibits'
import { rise, stagger } from '../../lib/anim'
import {
  abrahamThese,
  abrahamSteps,
  abrahamKonter,
  abrahamScholar,
  abrahamBelege,
  abrahamVernetzung,
  abrahamGleicheMassstaebe,
} from '../../data/seals/abraham'

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

function KonterRow({ item }: { item: (typeof abrahamKonter)[number] }) {
  const [open, setOpen] = useState(false)
  const beleg = item.belegId ? abrahamBelege[item.belegId] : undefined
  return (
    <motion.div className={`konter${item.tier === 'marble' ? ' is-marble' : ''}`} variants={rise}>
      {item.tier === 'marble' && <span className="marble-tag">✦ Ergänzender Befund</span>}
      <button className="konter__einwand" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="konter__label">Einwand</span>
        <span className="konter__text">{item.einwand}</span>
        <span className={`konter__chev${open ? ' is-open' : ''}`} aria-hidden>
          ⌄
        </span>
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

export default function AbrahamSeal() {
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
          <motion.span className="front__emblem" variants={rise}>
            <Shamsa size={92} />
          </motion.span>
          <motion.span className="seal__num" variants={rise}>
            Siegel I
          </motion.span>
          <motion.h1 className="seal__title gilt" variants={rise}>
            Abrahams Nachkommen
          </motion.h1>
          <motion.span className="seal__ar arabic" variants={rise} dir="rtl" lang="ar">
            إسماعيل
          </motion.span>
          <motion.span className="front__divider" variants={rise} aria-hidden>
            <Crown width={150} />
          </motion.span>
          <motion.p className="seal__these" variants={rise}>
            {abrahamThese}
          </motion.p>
        </motion.header>

        {/* ---- the chain ---- */}
        <section className="sec">
          <Eyebrow kicker="Debatten-Ebene" title="Die Beweiskette in vier Schritten" />
          <motion.ol className="steps" variants={stagger} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.2 }}>
            {abrahamSteps.map((s) => (
              <motion.li className="step" key={s.n} variants={rise}>
                <span className="step__n">{s.n}</span>
                <div>
                  <h3 className="step__h">{s.h}</h3>
                  <p className="step__b">{s.body}</p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </section>

        {/* ---- the family tree (centrepiece) ---- */}
        <section className="sec">
          <Eyebrow kicker="Haupt-Exhibit" title="Der Stammbaum" />
          <p className="sec__lead">
            Aus einem Vater, Abraham, gehen zwei gesegnete Linien hervor. Die rechte führt über Isaak nach Israel;
            die linke über Ismael, den Erstgeborenen, ins arabische Volk.
          </p>
          <Stammbaum />
        </section>

        {/* ---- the belege showcase ---- */}
        <section className="sec">
          <Eyebrow kicker="Die Belege" title="Der Segen über Ismael" />
          <p className="sec__lead">
            Jeder Beleg öffnet sich groß und beleuchtet — Originaltext, Umschrift, Übersetzung und Fundstelle.
          </p>
          <div className="belege-grid">
            <BelegCard beleg={abrahamBelege.gen1720} />
            <BelegCard beleg={abrahamBelege.gen2113} />
            <BelegCard beleg={abrahamBelege.q2129} />
            <BelegCard beleg={abrahamBelege.genealogie} />
          </div>
        </section>

        {/* ---- the twelve princes ---- */}
        <section className="sec">
          <Eyebrow kicker="Das große Volk" title="Zwölf Fürsten" />
          <ZwoelfFuersten />
        </section>

        {/* ---- what Ishmael received ---- */}
        <section className="sec">
          <Eyebrow kicker="Der Bund" title="Gleiche Worte, beide Söhne" />
          <Bundesgaben />
        </section>

        {/* ---- objection / counter ---- */}
        <section className="sec">
          <Eyebrow kicker="Einwand · Konter" title="Was der Gegner sagt — und die Antwort" />
          <motion.div className="konter-list" variants={stagger} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.1 }}>
            {abrahamKonter.map((k, i) => (
              <KonterRow key={i} item={k} />
            ))}
          </motion.div>
        </section>

        {/* ---- scholarly layer ---- */}
        <section className="sec">
          <Eyebrow kicker="Gelehrten-Ebene" title="Tiefer graben" />
          <button className="scholar__toggle" onClick={() => setDeep((v) => !v)} aria-expanded={deep}>
            {deep ? 'Gelehrten-Ebene schließen' : 'Gelehrten-Ebene öffnen'}
            <span className={`scholar__chev${deep ? ' is-open' : ''}`} aria-hidden>
              ⌄
            </span>
          </button>
          <motion.div
            initial={false}
            animate={{ height: deep ? 'auto' : 0, opacity: deep ? 1 : 0 }}
            transition={{ duration: 0.36, ease: [0.23, 1, 0.32, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="scholar">
              {abrahamScholar.map((s, i) => (
                <article key={i} className={`scholar__item${s.tier === 'marble' ? ' is-marble' : ''}`}>
                  {s.tier === 'marble' && <span className="marble-tag">✦ Ergänzender Befund</span>}
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
          <p>{abrahamGleicheMassstaebe}</p>
        </motion.section>

        {/* ---- the net ---- */}
        <section className="sec">
          <Eyebrow kicker="Das Netz schließt sich" title="Vernetzung" />
          <div className="netz">
            {abrahamVernetzung.map((v) => (
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
