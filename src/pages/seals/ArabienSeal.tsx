import '../../styles/seals/arabien.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft } from '../../components/icons'
import { BelegCard } from '../../components/Beleg'
import {
  ArabienKarte,
  DreiAufstrahlungen,
  Textvarianten,
  ReihenfolgeBeweis,
  EtmokhVergleich,
  SynopseTabellen,
} from '../../components/exhibits/ArabienExhibits'
import { rise, stagger } from '../../lib/anim'
import {
  arabienThese,
  arabienSteps,
  arabienKonter,
  arabienScholar,
  arabienBelege,
  arabienVernetzung,
  arabienGleicheMassstaebe,
} from '../../data/seals/arabien'

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

function KonterRow({ item }: { item: (typeof arabienKonter)[number] }) {
  const [open, setOpen] = useState(false)
  const beleg = item.belegId ? arabienBelege[item.belegId] : undefined
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

export default function ArabienSeal() {
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
            Siegel III
          </motion.span>
          <motion.h1 className="seal__title gilt" variants={rise}>
            Arabische Prophezeiungen
          </motion.h1>
          <motion.span className="seal__ar arabic" variants={rise} dir="rtl" lang="ar">
            فاران
          </motion.span>
          <motion.p className="seal__these" variants={rise}>
            {arabienThese}
          </motion.p>
        </motion.header>

        {/* ---- the core verses (A–D) as the chain ---- */}
        <section className="sec">
          <Eyebrow kicker="Debatten-Ebene" title="Die Kern-Verse: vier Bücher, ein Ort" />
          <motion.ol className="steps" variants={stagger} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.2 }}>
            {arabienSteps.map((s) => (
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

        {/* ---- 🔥 HAUPT-EXHIBIT: the five-point map ---- */}
        <section className="sec" id="karte">
          <Eyebrow kicker="Haupt-Exhibit" title="Fünf Namen, vier Bücher, ein Land" />
          <p className="sec__lead">
            Paran, Kedar, Sela, Tema, Baca — fünf Eigennamen aus vier unabhängigen Büchern, alle in einem
            einzigen Wüstenstreifen. Ein geografisches Koordinatennetz, das nur auf einen Punkt zeigt.
          </p>
          <ArabienKarte />
        </section>

        {/* ---- the three shinings ---- */}
        <section className="sec" id="aufstrahlungen">
          <Eyebrow kicker="Deuteronomium 33" title="Sinai · Seir · Paran" />
          <p className="sec__lead">
            Ein einziger Vers ordnet das Licht Gottes in drei Stufen — Dämmerung, Sonnenaufgang, Zenit —, und das
            hellste Verb steht über Paran, dem Land Ismaels.
          </p>
          <DreiAufstrahlungen />
        </section>

        {/* ---- order-proof + textual variants ---- */}
        <section className="sec">
          <Eyebrow kicker="Deut 33 · Textkritik" title="Reihenfolge und Textzeugen" />
          <p className="sec__lead">
            Zwei Belege gegen die „Exodus-Route": die Chronologie der Numeri und die Textvarianten von 33,2.
          </p>
          <ReihenfolgeBeweis />
          <Textvarianten />
        </section>

        {/* ---- the belege showcase — ALL of them ---- */}
        <section className="sec">
          <Eyebrow kicker="Die Belege" title="Die Orte beim Namen" />
          <p className="sec__lead">
            Jeder Beleg öffnet sich groß und beleuchtet — Originaltext, Umschrift, Übersetzung und Fundstelle.
          </p>
          <div className="belege-grid">
            <BelegCard beleg={arabienBelege.deut332} />
            <BelegCard beleg={arabienBelege.isa4211} />
            <BelegCard beleg={arabienBelege.isa2113} />
            <BelegCard beleg={arabienBelege.ps845} />
            <BelegCard beleg={arabienBelege.hab33} />
            <BelegCard beleg={arabienBelege.gen2121} />
            <BelegCard beleg={arabienBelege.gen2513} />
            <BelegCard beleg={arabienBelege.q396} />
            <BelegCard beleg={arabienBelege.q2227} />
            <BelegCard beleg={arabienBelege.textvarianten} />
            <BelegCard beleg={arabienBelege.zehntausend} />
            <BelegCard beleg={arabienBelege.north} />
            <BelegCard beleg={arabienBelege.knechtquellen} />
            <BelegCard beleg={arabienBelege.temaquelle} />
            <BelegCard beleg={arabienBelege.bacaquelle} />
          </div>
        </section>

        {/* ---- objection / counter — ALL six ---- */}
        <section className="sec">
          <Eyebrow kicker="Einwand · Konter" title="Was der Gegner sagt — und die Antwort" />
          <motion.div className="konter-list" variants={stagger} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.1 }}>
            {arabienKonter.map((k, i) => (
              <KonterRow key={i} item={k} />
            ))}
          </motion.div>
        </section>

        {/* ---- the etmokh / etmokhah letter comparison (marble) ---- */}
        <section className="sec">
          <Eyebrow kicker="Jesaja 42 · Textkritik" title="Der Name des Knechts" />
          <EtmokhVergleich />
        </section>

        {/* ---- scholarly layer — ALL items ---- */}
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
              {arabienScholar.map((s, i) => (
                <article key={i} className={`scholar__item${s.tier === 'marble' ? ' is-marble' : ''}`}>
                  {s.tier === 'marble' && <span className="marble-tag">✦ Ergänzender Befund</span>}
                  <h3 className="scholar__h">{s.h}</h3>
                  <p className="scholar__b">{s.body}</p>
                </article>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ---- the three summary tables (Prophezeiung ↔ Erfüllung) ---- */}
        <section className="sec">
          <Eyebrow kicker="Prophezeiung ↔ Erfüllung" title="Drei Synopsen" />
          <p className="sec__lead">
            Deuteronomium 33, Jesaja 42 und Psalm 84 — Vers für Vers gegen die Erfüllung im Leben Muhammads ﷺ
            gestellt.
          </p>
          <SynopseTabellen />
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
          <p>{arabienGleicheMassstaebe}</p>
        </motion.section>

        {/* ---- the net ---- */}
        <section className="sec">
          <Eyebrow kicker="Das Netz schließt sich" title="Vernetzung" />
          <div className="netz">
            {arabienVernetzung.map((v) => (
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
