import '../../styles/seals/daniel.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Chevron } from '../../components/icons'
import { BelegCard } from '../../components/Beleg'
import DanielStatue from '../../components/exhibits/DanielStatue'
import Timeline from '../../components/exhibits/Timeline'
import {
  PelachTable,
  HmdBridge,
  KonstantinCard,
  FuenfReiche,
  VierTiere,
  SteinBedingungen,
  FormalFunktional,
  EcksteinSynopse,
  ZweiDimensionen,
} from '../../components/exhibits/MoreExhibits'
import MapExhibit from '../../components/exhibits/MapExhibit'
import { rise, stagger } from '../../lib/anim'
import { fmt } from '../../lib/fmt'
import {
  danielThese,
  danielMethodik,
  danielSteps,
  danielKonter,
  danielScholar,
  danielBelege,
  danielVernetzung,
  danielGleicheMassstaebe,
} from '../../data/seals/daniel'

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

function KonterRow({ item }: { item: (typeof danielKonter)[number] }) {
  const [open, setOpen] = useState(false)
  const beleg = item.belegId ? danielBelege[item.belegId] : undefined
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

export default function DanielSeal() {
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
            Buch 6
          </motion.span>
          <motion.h1 className="seal__title gilt" variants={rise}>
            Daniel
          </motion.h1>
          <motion.p className="seal__these" variants={rise}>
            {fmt(danielThese)}
          </motion.p>
        </motion.header>

        {/* ---- the chain ---- */}
        <section className="sec">
          <Eyebrow kicker="Debatten-Ebene" title="Die Beweiskette in vier Schritten" />
          <motion.ol className="steps" variants={stagger} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.2 }}>
            {danielSteps.map((s) => (
              <motion.li className="step" key={s.n} variants={rise}>
                <span className="step__n">{s.n}</span>
                <div>
                  <h3 className="step__h">{s.h}</h3>
                  <p className="step__b">{fmt(s.body)}</p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
          <p className="daniel-methodik">{danielMethodik}</p>
        </section>

        {/* ---- the statue (centrepiece) ---- */}
        <section className="sec" id="statue">
          <Eyebrow kicker="Haupt-Exhibit" title="Das Traumbild" />
          <p className="sec__lead">
            Fünf Materialien, fünf Reiche. Berühre eine Zone, um Reich und Beleg zu sehen — und lass den Stein
            zum großen Berg werden, der die Erde füllt.
          </p>
          <DanielStatue />
        </section>

        {/* ---- the five kingdoms + four beasts ---- */}
        <section className="sec">
          <Eyebrow kicker="Daniel liefert die Belege selbst" title="Fünf Reiche, vier Tiere" />
          <FuenfReiche />
          <div style={{ height: '1rem' }} />
          <VierTiere />
        </section>

        {/* ---- the four conditions of the stone ---- */}
        <section className="sec">
          <Eyebrow kicker="Daniel 2,44-45" title="Die vier Bedingungen des Steins" />
          <SteinBedingungen />
        </section>

        {/* ---- the belege showcase ---- */}
        <section className="sec">
          <Eyebrow kicker="Die Belege" title="Vom Stein zum Berg, der die Erde füllt" />
          <div className="belege-grid">
            <BelegCard beleg={danielBelege.quran619} />
            <BelegCard beleg={danielBelege.dan238} />
            <BelegCard beleg={danielBelege.dan820} />
            <BelegCard beleg={danielBelege.dan821} />
            <BelegCard beleg={danielBelege.dan240} />
            <BelegCard beleg={danielBelege.dan241} />
            <BelegCard beleg={danielBelege.dan244} />
            <BelegCard beleg={danielBelege.dan245} />
            <BelegCard beleg={danielBelege.dan713} />
            <BelegCard beleg={danielBelege.dan725} />
            <BelegCard beleg={danielBelege.dan727} />
            <BelegCard beleg={danielBelege.dan923} />
            <BelegCard beleg={danielBelege.joh1836} />
            <BelegCard beleg={danielBelege.mt2018} />
            <BelegCard beleg={danielBelege.mt2143} />
            <BelegCard beleg={danielBelege.bukhari3535} />
            <BelegCard beleg={danielBelege.bukhari3235} />
            <BelegCard beleg={danielBelege.pelach} />
            <BelegCard beleg={danielBelege.formalfunktional} />
            <BelegCard beleg={danielBelege.habakuk} />
            <BelegCard beleg={danielBelege.josephus} />
            <BelegCard beleg={danielBelege.iddan} />
            <BelegCard beleg={danielBelege.talmud} />
            <BelegCard beleg={danielBelege.kirchenvaeter} />
            <BelegCard beleg={danielBelege.benabrahamson} />
          </div>
        </section>

        {/* ---- the timeline ---- */}
        <section className="sec" id="zeitstrahl">
          <Eyebrow kicker="Historischer Beweis" title="Das Zeitfenster" />
          <Timeline />
        </section>

        {/* ---- the map ---- */}
        <section className="sec">
          <Eyebrow kicker="Geografischer Beweis" title="Das geteilte Rom" />
          <MapExhibit />
        </section>

        {/* ---- formal vs functional ---- */}
        <section className="sec">
          <Eyebrow kicker="War Rom zu Jesu Zeit geteilt?" title="Formal, nicht funktional" />
          <FormalFunktional />
        </section>

        {/* ---- objection / counter ---- */}
        <section className="sec">
          <Eyebrow kicker="Einwand · Konter" title="Was der Gegner sagt — und die Antwort" />
          <motion.div className="konter-list" variants={stagger} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.1 }}>
            {danielKonter.map((k, i) => (
              <KonterRow key={i} item={k} />
            ))}
          </motion.div>
        </section>

        {/* ---- supporting exhibits ---- */}
        <section className="sec">
          <Eyebrow kicker="Exhibits" title="Sprache, Wurzel, Geschichte" />
          <div className="exhibits-grid">
            <PelachTable />
            <HmdBridge />
            <KonstantinCard />
          </div>
        </section>

        {/* ---- two dimensions of the kingdom ---- */}
        <section className="sec">
          <Eyebrow kicker="Geistlich und physisch" title="Zwei Dimensionen des Reiches" />
          <ZweiDimensionen />
        </section>

        {/* ---- the cornerstone / the brick ---- */}
        <section className="sec" id="eckstein">
          <Eyebrow kicker="Mt 21,42 ↔ Bukhārī 3535" title="Der Eckstein / der Ziegel" />
          <EcksteinSynopse />
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
              {danielScholar.map((s, i) => (
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
          <p>{danielGleicheMassstaebe}</p>
        </motion.section>

        {/* ---- the net ---- */}
        <section className="sec">
          <Eyebrow kicker="Das Netz schließt sich" title="Vernetzung" />
          <div className="netz">
            {danielVernetzung.map((v) => (
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
