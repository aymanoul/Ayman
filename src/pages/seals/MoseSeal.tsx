import '../../styles/seals/mose.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Chevron } from '../../components/icons'
import { BelegCard } from '../../components/Beleg'
import { Fuenfzehn, Varianten, AugustinusPanel, DreiErwartungen, Sieb, Zeugen } from '../../components/exhibits/MoseExhibits'
import { rise, stagger } from '../../lib/anim'
import {
  moseThese,
  moseSteps,
  moseKonter,
  moseScholar,
  moseBelege,
  moseVernetzung,
  moseGleicheMassstaebe,
} from '../../data/seals/mose'

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

function KonterRow({ item }: { item: (typeof moseKonter)[number] }) {
  const [open, setOpen] = useState(false)
  const beleg = item.belegId ? moseBelege[item.belegId] : undefined
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

export default function MoseSeal() {
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
            Siegel II
          </motion.span>
          <motion.h1 className="seal__title gilt" variants={rise}>
            Prophet wie Mose
          </motion.h1>
          <motion.span className="seal__ar arabic" variants={rise} dir="rtl" lang="ar">
            موسى
          </motion.span>
          <motion.p className="seal__these" variants={rise}>
            {moseThese}
          </motion.p>
        </motion.header>

        {/* ---- the chain ---- */}
        <section className="sec">
          <Eyebrow kicker="Debatten-Ebene" title="Die Beweiskette in vier Schritten" />
          <motion.ol className="steps" variants={stagger} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.2 }}>
            {moseSteps.map((s) => (
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

        {/* ---- the 15-criteria table (centrepiece) ---- */}
        <section className="sec" id="vergleich">
          <Eyebrow kicker="Haupt-Exhibit" title="Wer gleicht Mose?" />
          <p className="sec__lead">
            Der Vers gibt selbst den Maßstab vor: „wie Mose". Fünfzehn Kriterien, drei Gestalten — und ein klares
            Bild, wer Mose gleicht und wer abweicht. Mose ↔ Muhammad ﷺ: 15/15. Jesus: 1/15.
          </p>
          <Fuenfzehn />
        </section>

        {/* ---- the belege showcase ---- */}
        <section className="sec">
          <Eyebrow kicker="Die Belege" title="Verse, Quellen und Zeugen" />
          <p className="sec__lead">
            Jeder Beleg öffnet sich groß und beleuchtet — Originaltext, Umschrift, Übersetzung und Fundstelle.
          </p>
          <div className="belege-grid">
            <BelegCard beleg={moseBelege.deut1818} />
            <BelegCard beleg={moseBelege.deut3410} />
            <BelegCard beleg={moseBelege.deut1815} />
            <BelegCard beleg={moseBelege.deut24} />
            <BelegCard beleg={moseBelege.deut237} />
            <BelegCard beleg={moseBelege.john121} />
            <BelegCard beleg={moseBelege.john1613} />
            <BelegCard beleg={moseBelege.apg322} />
            <BelegCard beleg={moseBelege.mt517} />
            <BelegCard beleg={moseBelege.john117} />
            <BelegCard beleg={moseBelege.q5334} />
            <BelegCard beleg={moseBelege.bukhari3364} />
            <BelegCard beleg={moseBelege.q2125} />
            <BelegCard beleg={moseBelege.q53} />
            <BelegCard beleg={moseBelege.mt1524} />
            <BelegCard beleg={moseBelege.john111} />
            <BelegCard beleg={moseBelege.textvarianten} />
            <BelegCard beleg={moseBelege.netbibel} />
            <BelegCard beleg={moseBelege.maimonides} />
            <BelegCard beleg={moseBelege.blenkinsopp} />
            <BelegCard beleg={moseBelege.samaritanus} />
            <BelegCard beleg={moseBelege.baden} />
            <BelegCard beleg={moseBelege.gersonides} />
            <BelegCard beleg={moseBelege.lamsa} />
            <BelegCard beleg={moseBelege.rashi} />
            <BelegCard beleg={moseBelege.luther} />
            <BelegCard beleg={moseBelege.augustinus} />
            <BelegCard beleg={moseBelege.faustus} />
            <BelegCard beleg={moseBelege.teeple} />
            <BelegCard beleg={moseBelege.hosea111} />
            <BelegCard beleg={moseBelege.johEvangelium} />
            <BelegCard beleg={moseBelege.josephus} />
            <BelegCard beleg={moseBelege.delitzsch} />
            <BelegCard beleg={moseBelege.niv} />
            <BelegCard beleg={moseBelege.greenberg} />
            <BelegCard beleg={moseBelege.dow} />
            <BelegCard beleg={moseBelege.exodus33} />
            <BelegCard beleg={moseBelege.deut1821} />
          </div>
        </section>

        {/* ---- textual variants of Deut 18:15 ---- */}
        <section className="sec" id="textkritik">
          <Eyebrow kicker="Textkritik" title={'Der Zusatz „aus deiner Mitte“'} />
          <Varianten />
        </section>

        {/* ---- the three expectations (John 1) ---- */}
        <section className="sec">
          <Eyebrow kicker="Eine eigene Erwartung" title="Messias · Elija · der Prophet" />
          <DreiErwartungen />
        </section>

        {/* ---- the Augustine panel ---- */}
        <section className="sec">
          <Eyebrow kicker="Sie sagen es selbst" title="Augustinus, Contra Faustum" />
          <AugustinusPanel />
        </section>

        {/* ---- the sieve ---- */}
        <section className="sec" id="sieb">
          <Eyebrow kicker="Alle Kandidaten" title="Das Sieb — wer bleibt übrig?" />
          <Sieb />
        </section>

        {/* ---- external witnesses ---- */}
        <section className="sec">
          <Eyebrow kicker="Externe Zeugen" title="Greenberg & Dow" />
          <Zeugen />
        </section>

        {/* ---- objection / counter ---- */}
        <section className="sec">
          <Eyebrow kicker="Einwand · Konter" title="Was der Gegner sagt — und die Antwort" />
          <motion.div className="konter-list" variants={stagger} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.1 }}>
            {moseKonter.map((k, i) => (
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
              {moseScholar.map((s, i) => (
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
          <p>{moseGleicheMassstaebe}</p>
        </motion.section>

        {/* ---- the net ---- */}
        <section className="sec">
          <Eyebrow kicker="Das Netz schließt sich" title="Vernetzung" />
          <div className="netz">
            {moseVernetzung.map((v) => (
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
