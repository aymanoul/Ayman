import '../../styles/seals/erwartung.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft } from '../../components/icons'
import { BelegCard } from '../../components/Beleg'
import {
  Pruefsteine,
  Waage,
  KarteZeitplan,
  QurayzaTimeline,
  DavidischSeziertisch,
  Eingestaendnisse,
  IbnAlHaybanBanner,
  Straenge,
} from '../../components/exhibits/ErwartungExhibits'
import { rise, stagger } from '../../lib/anim'
import {
  erwartungThese,
  erwartungSteps,
  erwartungKonter,
  erwartungScholar,
  erwartungBelege,
  erwartungVernetzung,
  erwartungGleicheMassstaebe,
} from '../../data/seals/erwartung'

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

function KonterRow({ item }: { item: (typeof erwartungKonter)[number] }) {
  const [open, setOpen] = useState(false)
  const beleg = item.belegId ? erwartungBelege[item.belegId] : undefined
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

export default function ErwartungSeal() {
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
            Siegel VII
          </motion.span>
          <motion.h1 className="seal__title gilt" variants={rise}>
            Jüdische Erwartung
          </motion.h1>
          <motion.span className="seal__ar arabic" variants={rise} dir="rtl" lang="ar">
            الميزان
          </motion.span>
          <motion.p className="seal__these" variants={rise}>
            {erwartungThese}
          </motion.p>
        </motion.header>

        {/* ---- the chain ---- */}
        <section className="sec">
          <Eyebrow kicker="Debatten-Ebene" title="Die Beweiskette in vier Schritten" />
          <motion.ol className="steps" variants={stagger} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.2 }}>
            {erwartungSteps.map((s) => (
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

        {/* ---- 🔥 the map + schedule (centrepiece) ---- */}
        <section className="sec" id="karte">
          <Eyebrow kicker="Haupt-Exhibit" title="Sie erwarteten ihn — Karte und Zeitplan" />
          <p className="sec__lead">
            Jüdische Stämme zogen vor dem Islam in die härteste Wüste der Erde — weil ihre eigenen Schriften ihnen
            Ort (Jesaja 42) und Zeit (Jesaja 21, Daniel) verrieten.
          </p>
          <KarteZeitplan />
        </section>

        {/* ---- the Ibn al-Hayban banner ---- */}
        <section className="sec">
          <Eyebrow kicker="Der emotionale Anker" title="Auf dem Sterbebett" />
          <IbnAlHaybanBanner />
        </section>

        {/* ---- the belege showcase — ALL of them ---- */}
        <section className="sec">
          <Eyebrow kicker="Die Belege" title="Erwartung, Waage und Quellen" />
          <p className="sec__lead">
            Jeder Beleg öffnet sich groß und beleuchtet — Originaltext, Umschrift, Übersetzung und Fundstelle.
          </p>
          <div className="belege-grid">
            <BelegCard beleg={erwartungBelege.jes4211} />
            <BelegCard beleg={erwartungBelege.jes2113} />
            <BelegCard beleg={erwartungBelege.deut1822} />
            <BelegCard beleg={erwartungBelege.deut132} />
            <BelegCard beleg={erwartungBelege.deut1815} />
            <BelegCard beleg={erwartungBelege.hos111} />
            <BelegCard beleg={erwartungBelege.mt279} />
            <BelegCard beleg={erwartungBelege.mt2241} />
            <BelegCard beleg={erwartungBelege.spr2010} />
            <BelegCard beleg={erwartungBelege.q5507} />
            <BelegCard beleg={erwartungBelege.q5725} />
            <BelegCard beleg={erwartungBelege.q2111} />
            <BelegCard beleg={erwartungBelege.q384} />
            <BelegCard beleg={erwartungBelege.q2146} />
            <BelegCard beleg={erwartungBelege.q26197} />
            <BelegCard beleg={erwartungBelege.q285} />
            <BelegCard beleg={erwartungBelege.ibnAlHayban} />
            <BelegCard beleg={erwartungBelege.ibnHischam} />
            <BelegCard beleg={erwartungBelege.safiyya} />
            <BelegCard beleg={erwartungBelege.hidschaz} />
            <BelegCard beleg={erwartungBelege.benAbrahamson} />
            <BelegCard beleg={erwartungBelege.qurayza} />
            <BelegCard beleg={erwartungBelege.davidisch} />
            <BelegCard beleg={erwartungBelege.michaelBrown} />
            <BelegCard beleg={erwartungBelege.augustinus} />
            <BelegCard beleg={erwartungBelege.rabbinisch} />
            <BelegCard beleg={erwartungBelege.messiasWerke} />
            <BelegCard beleg={erwartungBelege.kriterien} />
            <BelegCard beleg={erwartungBelege.doppelmass} />
          </div>
        </section>

        {/* ---- the touchstones ---- */}
        <section className="sec">
          <Eyebrow kicker="Die Kriterien" title="Die Prüfsteine der Tora" />
          <Pruefsteine />
        </section>

        {/* ---- the balance ---- */}
        <section className="sec" id="waage">
          <Eyebrow kicker="Gleiche Maßstäbe" title="Eine Waage, gleiche Gewichte" />
          <Waage />
        </section>

        {/* ---- the Banu Qurayza context ---- */}
        <section className="sec" id="qurayza">
          <Eyebrow kicker="Der Einwand, entkräftet" title="Banū Qurayẓa im Kontext" />
          <QurayzaTimeline />
        </section>

        {/* ---- the davidic dissection ---- */}
        <section className="sec" id="davidisch">
          <Eyebrow kicker="Prophezeiung oder Propaganda?" title="Das davidische Narrativ" />
          <DavidischSeziertisch />
        </section>

        {/* ---- the admissions ---- */}
        <section className="sec">
          <Eyebrow kicker="Sie sagen es selbst" title="Die Eingeständnisse" />
          <Eingestaendnisse />
        </section>

        {/* ---- the synthesis ---- */}
        <section className="sec">
          <Eyebrow kicker="Die Synthese" title="Was auf der Waage liegt" />
          <Straenge />
        </section>

        {/* ---- objection / counter ---- */}
        <section className="sec">
          <Eyebrow kicker="Einwand · Konter" title="Was der Gegner sagt — und die Antwort" />
          <motion.div className="konter-list" variants={stagger} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.1 }}>
            {erwartungKonter.map((k, i) => (
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
              {erwartungScholar.map((s, i) => (
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
          <span className="massstab__label">Gleiche Maßstäbe — die große Synthese</span>
          <p>{erwartungGleicheMassstaebe}</p>
        </motion.section>

        {/* ---- the net ---- */}
        <section className="sec">
          <Eyebrow kicker="Das Netz ist geschlossen" title="Vernetzung" />
          <div className="netz">
            {erwartungVernetzung.map((v) => (
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
