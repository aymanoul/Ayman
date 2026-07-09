import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import SearchPanel from '../components/SearchPanel'
import { Chevron, ClockIcon, StarIcon, NoteIcon, DownloadIcon, ShareIcon, DiceIcon, BookOpenIcon } from '../components/icons'
import { KaabaEmblem } from '../components/KaabaArt'
import { favoriten, notizen, verlauf, type VerlaufEintrag } from '../lib/db'
import { speicherInfo, formatBytes } from '../lib/pwa'
import { wann } from '../lib/zeit'
import { tagesBeleg, type TagesBeleg } from '../lib/tagesspruch'
import { search } from '../lib/search'
import { sealInfoById } from '../data/modules'
import { regalBaende, regalTitel } from '../data/regal'
import { regalJesusBaende, regalJesusTitel } from '../data/regal-jesus'
import { belegList } from '../data/belegRegistry'
import type { Band } from '../components/Bookshelf'
import { rise, stagger, EASE } from '../lib/anim'
import '../styles/home.css'

// Zwiebel-/Ogee-Kuppel über den ganzen Hero: volle runde Schultern, klare
// Spitze oben, die Flanken laufen in einer S-Kurve zu den Bildschirmraendern
// aus und treten dort seitlich aus (keine senkrechten Schienen — wie im
// Entwurf). Derselbe Pfad dient als CSS-Maske für Innenraum-Glow und
// Strahlenkranz — eine Quelle, keine Drift zwischen Linie und Maske.
const ARCH_PATH =
  'M0,415 C30,398 70,362 100,302 C145,232 240,168 345,118 C375,96 392,58 400,18 C408,58 425,96 455,118 C560,168 655,232 700,302 C730,362 770,398 800,415'
const ARCH_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 560' preserveAspectRatio='none'><path d='${ARCH_PATH} L800,560 L0,560 Z' fill='black'/></svg>`
)}")`

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const BEISPIEL_FRAGEN = [
  'Schreib mir einen Text über 5. Mose 18,18',
  'Wurde die Bibel verfälscht?',
  'Was bedeutet maḥamaddīm im Hohelied?',
]

const THEMEN = [
  { label: '5. Mose 18,18', query: '18:18 mose' },
  { label: 'Der Paraklet', query: 'paraklet' },
  { label: 'Hohelied 5,16', query: '5:16 hohelied' },
  { label: 'Das Kreuz', query: 'kreuzigung suehne' },
  { label: 'Die Dreifaltigkeit', query: 'dreifaltigkeit tauhid' },
  { label: 'Daniels vier Reiche', query: 'daniel vier reiche' },
]

function slugOf(to: string): string {
  return to.split('/').pop()!
}

function reihenFortschritt(baende: Band[], gelesen: Set<string>): number {
  return baende.filter((b) => gelesen.has(slugOf(b.to))).length
}

export default function Home() {
  const reduce = useReducedMotion()
  const navigate = useNavigate()

  const [verlaufItems, setVerlaufItems] = useState<VerlaufEintrag[] | null>(null)
  const [favCount, setFavCount] = useState<number | null>(null)
  const [noteCount, setNoteCount] = useState<number | null>(null)
  const [speicher, setSpeicher] = useState<{ used: number; quota: number } | null>(null)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)
  const [kopiert, setKopiert] = useState(false)

  useEffect(() => {
    verlauf.alle().then(setVerlaufItems)
    favoriten.alle().then((l) => setFavCount(l.length))
    notizen.alle().then((l) => setNoteCount(l.length))
    speicherInfo().then(setSpeicher)
  }, [])

  // Der Mushaf-Prachtrahmen (body::before) bleibt den Buch-Seiten vorbehalten —
  // die Startseite ist eine cleane App-Fläche (siehe home.css body.is-home).
  useEffect(() => {
    document.body.classList.add('is-home')
    return () => document.body.classList.remove('is-home')
  }, [])

  useEffect(() => {
    const standalone =
      (typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches) ||
      (navigator as unknown as { standalone?: boolean }).standalone === true
    setInstalled(!!standalone)

    function onPrompt(e: Event) {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }
    function onInstalled() {
      setInstalled(true)
      setInstallPrompt(null)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const letztes = verlaufItems?.[0] ?? null
  const gelesen = new Set((verlaufItems ?? []).map((v) => v.sealId))
  const nektarGelesen = reihenFortschritt(regalBaende, gelesen)
  const jesusGelesen = reihenFortschritt(regalJesusBaende, gelesen)
  const vers = tagesBeleg()

  function zufallsBand() {
    const alle = [...regalBaende, ...regalJesusBaende]
    const b = alle[Math.floor(Math.random() * alle.length)]
    navigate(b.to)
  }

  function themaKlick(query: string) {
    const hits = search(query, 1)
    if (hits[0]) {
      const { moduleId, sealId, anchor, belegRef } = hits[0].entry
      let to = `/modul/${moduleId}/buch/${sealId}`
      if (belegRef) to += `?beleg=${encodeURIComponent(belegRef)}`
      else if (anchor) to += `#${anchor}`
      navigate(to)
    }
  }

  async function teileVers(v: TagesBeleg) {
    const text = `„${v.text}"\n— ${v.fundstelle} · Die Bibliothek`
    const url = `${window.location.origin}${window.location.pathname}#${v.link}`
    if (navigator.share) {
      try {
        await navigator.share({ text, url })
      } catch {
        /* Nutzer hat abgebrochen — kein Fehler */
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${text}\n${url}`)
      setKopiert(true)
      setTimeout(() => setKopiert(false), 2400)
    }
  }

  async function installieren() {
    if (!installPrompt) return
    await installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(null)
  }

  return (
    <main className="shell home">
      {/* Emblem oben rechts — die goldene Kaaba, Gegenstück zum Hamburger */}
      <Link to="/qibla" className="home-emblem" aria-label="Qibla Finder öffnen">
        <KaabaEmblem />
      </Link>

      {/* ---- Hero: der Mihrab-Bogen als Rahmen für Titel und Strahlenkranz ---- */}
      <section className="home-hero">
        <div className="home-hero__arch-wrap" aria-hidden>
          <div
            className="home-hero__raysclip"
            style={{
              WebkitMaskImage: ARCH_MASK,
              maskImage: ARCH_MASK,
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
            }}
          >
            <div className="home-hero__rays" />
          </div>
          <svg className="home-hero__arch-line" viewBox="0 0 800 560" preserveAspectRatio="none">
            <path d={ARCH_PATH} fill="none" stroke="var(--brass)" strokeWidth="2.2" />
          </svg>
        </div>
        <div className="wrap home-hero__inner">
          <motion.div initial={reduce ? false : 'hidden'} animate="shown" variants={stagger}>
            <motion.h1 className="home-hero__title" variants={rise}>
              Dar as-Sunnah
            </motion.h1>
            <motion.div className="home-hero__ctas" variants={rise}>
              <Link to="/bibliothek" className="btn-home btn-home--primary btn-home--hero">
                <BookOpenIcon aria-hidden /> Zur Bibliothek <Chevron aria-hidden />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="wrap home-content">
        {/* ---- Suche + Frage ---- */}
        <motion.section
          className="home-section"
          initial={reduce ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <SearchPanel exampleFragen={BEISPIEL_FRAGEN} />
        </motion.section>

        {/* ---- Weiterlesen ---- */}
        {verlaufItems !== null && (
          <motion.section
            className="home-section"
            initial={reduce ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="home-card home-weiter">
              <div className="home-weiter__head">
                <span className="home-weiter__label">{letztes ? 'Weiterlesen' : 'Erster Besuch'}</span>
                {letztes && (
                  <span className="home-weiter__when">
                    <ClockIcon aria-hidden /> {wann(letztes.ts)}
                  </span>
                )}
              </div>
              <Link
                to={letztes ? `/modul/${letztes.moduleId}/buch/${letztes.sealId}` : '/modul/muhammad/buch/fundament'}
                className="home-weiter__row"
              >
                <span className="home-weiter__tile" aria-hidden>
                  <BookOpenIcon />
                </span>
                <span className="home-weiter__body">
                  <span className="home-weiter__eyebrow">
                    {letztes
                      ? `${sealInfoById[letztes.sealId]?.zaehler ?? `Buch ${letztes.nummer}`} · ${wann(letztes.ts)}`
                      : 'Buch 1'}
                  </span>
                  <span className="home-weiter__titel">{letztes ? letztes.titel : 'Das Fundament'}</span>
                </span>
                <Chevron className="home-weiter__go" aria-hidden />
              </Link>
            </div>
          </motion.section>
        )}

        {/* ---- Die zwei Buchreihen ---- */}
        <motion.section
          className="home-section"
          initial={reduce ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="home-reihen">
            <Link to="/modul/muhammad" className="home-reihe-card">
              <span className="home-reihe-card__arch" aria-hidden>
                {regalTitel}
              </span>
              <span className="home-reihe-card__titel">Der versiegelte Nektar</span>
              <span className="home-reihe-card__meta">{regalBaende.length} Bücher</span>
              {verlaufItems !== null && (
                <span className="home-progress">
                  <span className="home-progress__bar">
                    <i style={{ width: `${(nektarGelesen / regalBaende.length) * 100}%` }} />
                  </span>
                  <span className="home-progress__label">
                    {nektarGelesen} von {regalBaende.length} gelesen
                  </span>
                </span>
              )}
            </Link>

            <Link to="/modul/jesus" className="home-reihe-card home-reihe-card--jesus">
              <span className="home-reihe-card__arch" aria-hidden>
                {regalJesusTitel}
              </span>
              <span className="home-reihe-card__titel">Jesus, der Gesandte Gottes</span>
              <span className="home-reihe-card__meta">{regalJesusBaende.length} Bände</span>
              {verlaufItems !== null && (
                <span className="home-progress">
                  <span className="home-progress__bar">
                    <i style={{ width: `${(jesusGelesen / regalJesusBaende.length) * 100}%` }} />
                  </span>
                  <span className="home-progress__label">
                    {jesusGelesen} von {regalJesusBaende.length} gelesen
                  </span>
                </span>
              )}
            </Link>
          </div>

          <button type="button" className="home-random" onClick={zufallsBand}>
            <DiceIcon aria-hidden /> Buch zufällig aufschlagen
          </button>
        </motion.section>

        {/* ---- Vers des Tages ---- */}
        {vers && (
          <motion.section
            className="home-section"
            initial={reduce ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="home-card home-vers">
              <span className="home-vers__eyebrow">Fundstück des Tages</span>
              <p className="home-vers__text">„{vers.text}"</p>
              <div className="home-vers__foot">
                <span className="home-vers__quelle">
                  {vers.fundstelle} · {vers.zaehler} — {vers.titel}
                </span>
                <div className="home-vers__actions">
                  <button type="button" className="home-vers__share" onClick={() => teileVers(vers)}>
                    <ShareIcon aria-hidden /> {kopiert ? 'Kopiert!' : 'Teilen'}
                  </button>
                  <Link to={vers.link} className="home-vers__link">
                    Weiterlesen <Chevron aria-hidden />
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* ---- Themen-Register ---- */}
        <motion.section
          className="home-section"
          initial={reduce ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span className="home-section__kicker">Themen-Register</span>
          <div className="home-themen">
            {THEMEN.map((t) => (
              <button key={t.label} type="button" className="home-chip" onClick={() => themaKlick(t.query)}>
                {t.label}
              </button>
            ))}
          </div>
        </motion.section>

        {/* ---- Persönlicher Bereich ---- */}
        <motion.section
          className="home-section"
          initial={reduce ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="home-tiles">
            <Link to="/favoriten" className="home-tile">
              <StarIcon className="home-tile__icon" aria-hidden />
              <span className="home-tile__num">{favCount ?? '–'}</span>
              <span className="home-tile__label">Favoriten</span>
            </Link>
            <Link to="/notizen" className="home-tile">
              <NoteIcon className="home-tile__icon" aria-hidden />
              <span className="home-tile__num">{noteCount ?? '–'}</span>
              <span className="home-tile__label">Notizen</span>
            </Link>
            <Link to="/verlauf" className="home-tile">
              <ClockIcon className="home-tile__icon" aria-hidden />
              <span className="home-tile__num">{verlaufItems?.length ?? '–'}</span>
              <span className="home-tile__label">Zuletzt gelesen</span>
            </Link>
          </div>
        </motion.section>

        {/* ---- Zahlen-Leiste ---- */}
        <motion.section
          className="home-section home-stats"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span>2 Buchreihen</span>
          <i />
          <span>{regalBaende.length + regalJesusBaende.length} Bände</span>
          <i />
          <span>{belegList.length} Belege</span>
          <i />
          <span>100 % offline verfügbar</span>
        </motion.section>

        {/* ---- Als App installieren ---- */}
        {!installed && (
          <motion.section
            className="home-section"
            initial={reduce ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="home-card home-install">
              <DownloadIcon className="home-install__icon" aria-hidden />
              <span className="home-install__body">
                <span className="home-install__titel">Als App installieren</span>
                <span className="home-install__text">
                  {installPrompt
                    ? 'Auf den Homescreen legen — startet wie eine App, vollständig offline.'
                    : 'Im Browser über „Teilen" → „Zum Home-Bildschirm" hinzufügen — vollständig offline.'}
                </span>
              </span>
              {installPrompt && (
                <button type="button" className="btn-home btn-home--primary btn-home--small" onClick={installieren}>
                  Installieren
                </button>
              )}
            </div>
          </motion.section>
        )}
      </div>

      <footer className="foot home-foot">
        <p>Dar as-Sunnah</p>
        {speicher && (
          <p className="home-foot__storage">
            Vollständig offline verfügbar · {formatBytes(speicher.used)} auf deinem Gerät
          </p>
        )}
      </footer>
    </main>
  )
}
