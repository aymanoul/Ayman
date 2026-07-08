import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Chevron, LocateIcon, MapPinIcon, InfoIcon, SparkIcon } from '../components/icons'
import { KaabaBadge, KaabaIllustration } from '../components/KaabaArt'
import { qiblaBearing, distanceToKaaba, richtungswort, formatKm } from '../lib/qibla'
import { naheStadt, formatKoordinate } from '../data/staedte'
import { rise, stagger, EASE } from '../lib/anim'
import '../styles/qibla.css'

type OrtStatus = 'lädt' | 'ok' | 'verweigert' | 'fehler'
type KompassStatus = 'idle' | 'aktiv' | 'verweigert' | 'nicht-verfuegbar'

// Vom Rand einer <g> mit Ursprung (150,150) aus per CSS-Transform gedreht —
// die Ziffernblatt-Elemente (Ticks, N/O/S/W) bleiben fix, nur die Nadel dreht.
function Kompassrose({ needleAngle, aligned }: { needleAngle: number; aligned: boolean }) {
  const R = 130
  function polar(r: number, deg: number) {
    const rad = ((deg - 90) * Math.PI) / 180
    return { x: 150 + r * Math.cos(rad), y: 150 + r * Math.sin(rad) }
  }
  const ticks = []
  for (let deg = 0; deg < 360; deg += 6) {
    const major = deg % 90 === 0
    const mid = deg % 30 === 0
    const outer = polar(R, deg)
    const inner = polar(R - (major ? 16 : mid ? 11 : 6), deg)
    ticks.push(
      <line
        key={deg}
        x1={outer.x}
        y1={outer.y}
        x2={inner.x}
        y2={inner.y}
        stroke={major ? 'var(--azur-deep)' : 'var(--line-strong)'}
        strokeWidth={major ? 2 : 1}
        strokeLinecap="round"
      />
    )
  }
  const labels: [string, number][] = [
    ['N', 0],
    ['O', 90],
    ['S', 180],
    ['W', 270],
  ]

  return (
    <svg viewBox="0 0 300 300" className="qc__svg" role="img" aria-label="Kompass">
      <circle cx="150" cy="150" r="145" fill="url(#qc-glow)" />
      <circle cx="150" cy="150" r={R} fill="#fffdf8" stroke="var(--line)" strokeWidth="1.5" />
      {ticks}
      {labels.map(([l, deg]) => {
        const pos = polar(R - 30, deg)
        return (
          <text key={l} x={pos.x} y={pos.y} className="qc__label" textAnchor="middle" dominantBaseline="middle">
            {l}
          </text>
        )
      })}

      {/* Nadel — dreht sich, Ziffernblatt bleibt fest */}
      <g style={{ transform: `rotate(${needleAngle}deg)`, transformOrigin: '150px 150px' }} className="qc__needle">
        <path d="M150 38 L163 150 L150 224 L137 150 Z" fill="var(--azur-deep)" />
        <path d="M150 38 L156.5 150 L150 224" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none" />
      </g>
      <circle cx="150" cy="150" r="9" fill="#fffdf8" stroke="var(--azur-deep)" strokeWidth="2" />

      <defs>
        <radialGradient id="qc-glow" cx="50%" cy="46%" r="60%">
          <stop offset="0%" stopColor="#fffaf0" />
          <stop offset="100%" stopColor="#f3e9d2" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* fixe Zielmarke oben — hier soll die Nadel einrasten */}
      <path
        d="M150 8 L159 24 L141 24 Z"
        fill={aligned ? '#2f8f5b' : 'var(--gold)'}
        style={{ transition: 'fill 0.25s ease' }}
      />
    </svg>
  )
}

export default function Qibla() {
  const reduce = useReducedMotion()
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [ortStatus, setOrtStatus] = useState<OrtStatus>('lädt')
  const [heading, setHeading] = useState<number | null>(null)
  const [kompassStatus, setKompassStatus] = useState<KompassStatus>('idle')
  const wasAligned = useRef(false)
  const [aligned, setAligned] = useState(false)

  function orten() {
    if (!navigator.geolocation) {
      setOrtStatus('fehler')
      return
    }
    setOrtStatus('lädt')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude })
        setOrtStatus('ok')
      },
      (err) => setOrtStatus(err.code === err.PERMISSION_DENIED ? 'verweigert' : 'fehler'),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    )
  }

  useEffect(() => {
    document.body.classList.add('is-home')
    orten()
    return () => document.body.classList.remove('is-home')
  }, [])

  async function aktiviereKompass() {
    const DOE = window.DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>
    }
    if (typeof DOE?.requestPermission === 'function') {
      try {
        const res = await DOE.requestPermission()
        setKompassStatus(res === 'granted' ? 'aktiv' : 'verweigert')
      } catch {
        setKompassStatus('verweigert')
      }
    } else if ('DeviceOrientationEvent' in window) {
      setKompassStatus('aktiv')
    } else {
      setKompassStatus('nicht-verfuegbar')
    }
  }

  useEffect(() => {
    if (kompassStatus !== 'aktiv') return
    function onOrientation(e: DeviceOrientationEvent) {
      const anyE = e as unknown as { webkitCompassHeading?: number; absolute?: boolean; alpha: number | null }
      if (typeof anyE.webkitCompassHeading === 'number') {
        setHeading(anyE.webkitCompassHeading)
      } else if (anyE.alpha != null) {
        setHeading((360 - anyE.alpha) % 360)
      }
    }
    window.addEventListener('deviceorientation', onOrientation, true)
    return () => window.removeEventListener('deviceorientation', onOrientation, true)
  }, [kompassStatus])

  const bearing = coords ? qiblaBearing(coords.lat, coords.lon) : null
  const distanz = coords ? distanceToKaaba(coords.lat, coords.lon) : null
  const stadt = coords ? naheStadt(coords.lat, coords.lon) : null
  const ortsname = coords ? (stadt ? `${stadt.name}, ${stadt.land}` : formatKoordinate(coords.lat, coords.lon)) : null
  const liveKompass = kompassStatus === 'aktiv' && heading != null
  const needleAngle = bearing == null ? 0 : liveKompass ? (bearing - (heading as number) + 360) % 360 : bearing

  useEffect(() => {
    const diff = Math.min(needleAngle, 360 - needleAngle)
    const isAligned = liveKompass && diff <= 6
    if (isAligned && !wasAligned.current && navigator.vibrate) navigator.vibrate(35)
    wasAligned.current = isAligned
    setAligned(isAligned)
  }, [needleAngle, liveKompass])

  return (
    <main className="shell home qibla">
      <Link to="/" className="qibla__back" aria-label="Zurück zur Startseite">
        <Chevron style={{ transform: 'scaleX(-1)' }} aria-hidden />
      </Link>
      <button type="button" className="home-emblem qibla__locate" onClick={orten} aria-label="Standort aktualisieren">
        <LocateIcon aria-hidden />
      </button>

      <div className="wrap qibla__inner">
        <motion.header
          className="qibla__head"
          initial={reduce ? false : 'hidden'}
          animate="shown"
          variants={stagger}
        >
          <motion.h1 className="qibla__title" variants={rise}>
            Qibla Finder
          </motion.h1>
          <motion.p className="home-hero__star" variants={rise} aria-hidden>
            <i />
            <SparkIcon />
            <i />
          </motion.p>
          <motion.p className="qibla__lead" variants={rise}>
            Finde die Richtung zur Kaaba in Mekka – wo immer du bist.
          </motion.p>
        </motion.header>

        <motion.div
          className="home-card qc"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div className="qc__badge-wrap">
            <span className={`qc__badge${aligned ? ' is-aligned' : ''}`}>
              <KaabaBadge />
            </span>
          </div>
          <Kompassrose needleAngle={needleAngle} aligned={aligned} />

          {kompassStatus !== 'aktiv' && (
            <button type="button" className="btn-home btn-home--primary qc__enable" onClick={aktiviereKompass}>
              Kompass aktivieren
            </button>
          )}
          {kompassStatus === 'verweigert' && (
            <p className="qc__hinweis">
              Kompass-Zugriff wurde nicht erlaubt. Die Nadel zeigt die Gradzahl ab Norden — richte dich zusätzlich mit
              einer Kompass-App aus.
            </p>
          )}
          {kompassStatus === 'nicht-verfuegbar' && (
            <p className="qc__hinweis">
              Dieses Gerät bietet keinen Kompass-Sensor. Die Nadel zeigt die Gradzahl ab Norden.
            </p>
          )}
        </motion.div>

        <motion.div
          className="home-card qibla__ort"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
        >
          <MapPinIcon className="qibla__ort-icon" aria-hidden />
          <span className="qibla__ort-body">
            <span className="qibla__ort-label">Dein Standort</span>
            <span className="qibla__ort-wert">
              {ortStatus === 'lädt' && 'Wird geortet …'}
              {ortStatus === 'verweigert' && 'Standort nicht erlaubt'}
              {ortStatus === 'fehler' && 'Standort nicht verfügbar'}
              {ortStatus === 'ok' && ortsname}
            </span>
          </span>
          <button type="button" className="qibla__ort-refresh" onClick={orten} aria-label="Standort neu bestimmen">
            <LocateIcon aria-hidden />
          </button>
        </motion.div>

        <motion.div
          className="home-card qibla__richtung"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
        >
          <div className="qibla__richtung-text">
            <span className="qibla__richtung-label">Richtung zur Kaaba</span>
            {bearing != null ? (
              <>
                <span className="qibla__richtung-deg">
                  {Math.round(bearing)}°<small> {richtungswort(bearing)}</small>
                </span>
                {distanz != null && <span className="qibla__richtung-km">≈ {formatKm(distanz)} bis Mekka</span>}
              </>
            ) : (
              <span className="qibla__richtung-deg qibla__richtung-deg--warten">—</span>
            )}
          </div>
          <KaabaIllustration />
        </motion.div>

        <motion.div
          className="qibla__info"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.26, ease: EASE }}
        >
          <InfoIcon aria-hidden />
          <p>Bitte halte dein Gerät waagerecht für eine genaue Richtung. Bei Abweichungen hilft eine 8er-Bewegung zur Kalibrierung.</p>
        </motion.div>

        <p className="qibla__methode">
          Berechnung per Großkreis-Peilung zu 21,4225° N, 39,8262° O — vollständig lokal auf deinem Gerät, wie in
          etablierten Gebetszeiten-Apps.
        </p>
      </div>
    </main>
  )
}
