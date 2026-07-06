import '../../styles/seals/verteidigung.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Chevron } from '../../components/icons'
import { BelegCard } from '../../components/Beleg'
import { Synopse, Zuwd, Abrogationsliste, PaulusDossier, ProvBanner } from '../../components/exhibits/VerteidigungExhibits'
import { rise, stagger } from '../../lib/anim'
import { fmt } from '../../lib/fmt'
import {
  verteidigungThese,
  verteidigungSteps,
  verteidigungKonter,
  verteidigungScholar,
  verteidigungBelege,
  verteidigungVernetzung,
  verteidigungGleicheMassstaebe,
} from '../../data/seals/verteidigung'

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

function KonterRow({ item }: { item: (typeof verteidigungKonter)[number] }) {
  const [open, setOpen] = useState(false)
  const beleg = item.belegId ? verteidigungBelege[item.belegId] : undefined
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

export default function VerteidigungSeal() {
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
            Buch 9 · Verteidigung
          </motion.span>
          <motion.h1 className="seal__title gilt" variants={rise}>
            Falscher Prophet?
          </motion.h1>
          <motion.p className="seal__these" variants={rise}>
            {fmt(verteidigungThese)}
          </motion.p>
        </motion.header>

        {/* ---- the chain ---- */}
        <section className="sec">
          <Eyebrow kicker="Debatten-Ebene" title="Die Beweiskette in vier Schritten" />
          <motion.ol className="steps" variants={stagger} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.2 }}>
            {verteidigungSteps.map((s) => (
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

        {/* ---- the synopsis (centrepiece) ---- */}
        <section className="sec" id="synopse">
          <Eyebrow kicker="Haupt-Exhibit" title="Der Früchte-Test, konsequent" />
          <p className="sec__lead">
            Jesu eigener Maßstab — „an ihren Früchten" — auf Muhammad ﷺ angewandt: Zug um Zug deckt sich seine
            Lehre mit dem Evangelium.
          </p>
          <Synopse />
        </section>

        {/* ---- the Paul dossier ---- */}
        <section className="sec" id="paulus">
          <Eyebrow kicker="Wer brachte die Gesetzlosigkeit?" title="Das Paulus-Dossier" />
          <PaulusDossier />
        </section>

        {/* ---- the belege showcase — ALL of them ---- */}
        <section className="sec">
          <Eyebrow kicker="Die Belege" title="Verse, Wurzeln und Quellen" />
          <div className="belege-grid">
            <BelegCard beleg={verteidigungBelege.mt517} />
            <BelegCard beleg={verteidigungBelege.mt519} />
            <BelegCard beleg={verteidigungBelege.mt721} />
            <BelegCard beleg={verteidigungBelege.mt715} />
            <BelegCard beleg={verteidigungBelege.mt1917} />
            <BelegCard beleg={verteidigungBelege.jer3131} />
            <BelegCard beleg={verteidigungBelege.dtn1820} />
            <BelegCard beleg={verteidigungBelege.dtn1822} />
            <BelegCard beleg={verteidigungBelege.gen2012} />
            <BelegCard beleg={verteidigungBelege.gen93} />
            <BelegCard beleg={verteidigungBelege.gen2928} />
            <BelegCard beleg={verteidigungBelege.ex129} />
            <BelegCard beleg={verteidigungBelege.dtn167} />
            <BelegCard beleg={verteidigungBelege.num302} />
            <BelegCard beleg={verteidigungBelege.kor1920} />
            <BelegCard beleg={verteidigungBelege.thess415} />
            <BelegCard beleg={verteidigungBelege.gal26} />
            <BelegCard beleg={verteidigungBelege.kor115} />
            <BelegCard beleg={verteidigungBelege.ps119115} />
            <BelegCard beleg={verteidigungBelege.gen4927} />
            <BelegCard beleg={verteidigungBelege.spr2010} />
            <BelegCard beleg={verteidigungBelege.q285} />
            <BelegCard beleg={verteidigungBelege.zuwdquelle} />
            <BelegCard beleg={verteidigungBelege.synopsequelle} />
            <BelegCard beleg={verteidigungBelege.paulusname} />
            <BelegCard beleg={verteidigungBelege.patristikquelle} />
            <BelegCard beleg={verteidigungBelege.aufhebungquelle} />
            <BelegCard beleg={verteidigungBelege.doppelmassquelle} />
          </div>
        </section>

        {/* ---- the zûd analysis ---- */}
        <section className="sec">
          <Eyebrow kicker="5. Mose 18,20" title={'Vorsätzlich — nicht „jeder Prophet"'} />
          <Zuwd />
        </section>

        {/* ---- the abrogation list ---- */}
        <section className="sec" id="abrogation">
          <Eyebrow kicker="Gott ändert seine Gebote" title="Aufhebung in der Bibel selbst" />
          <Abrogationsliste />
        </section>

        {/* ---- the two-measures banner ---- */}
        <section className="sec">
          <ProvBanner />
        </section>

        {/* ---- objection / counter ---- */}
        <section className="sec">
          <Eyebrow kicker="Einwand · Konter" title="Was der Gegner sagt — und die Antwort" />
          <motion.div className="konter-list" variants={stagger} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.1 }}>
            {verteidigungKonter.map((k, i) => (
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
              {verteidigungScholar.map((s, i) => (
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
          <p>{verteidigungGleicheMassstaebe}</p>
        </motion.section>

        {/* ---- the net ---- */}
        <section className="sec">
          <Eyebrow kicker="Das Netz schließt sich" title="Vernetzung" />
          <div className="netz">
            {verteidigungVernetzung.map((v) => (
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
