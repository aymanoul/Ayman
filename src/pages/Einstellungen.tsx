import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useSettings } from '../lib/settings'
import { enableOffline, disableOffline, speicherInfo, formatBytes } from '../lib/pwa'
import {
  listBuecher,
  downloadBuch,
  removeBuch,
  removeAlle,
  type OfflineBuch,
} from '../lib/offlineBooks'
import { module1 } from '../data/modules'
import { loescheNutzerdaten } from '../lib/db'
import { CheckIcon, DownloadIcon, TrashIcon } from '../components/icons'
import PageHead from '../components/PageHead'
import '../styles/pages.css'

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={`toggle${on ? ' is-on' : ''}`}
      onClick={() => onChange(!on)}
    >
      <span className="toggle__knob" />
    </button>
  )
}

function Row({ title, hint, control }: { title: string; hint?: string; control: ReactNode }) {
  return (
    <div className="setrow">
      <div className="setrow__label">
        <span className="setrow__title">{title}</span>
        {hint && <span className="setrow__hint">{hint}</span>}
      </div>
      <div className="setrow__control">{control}</div>
    </div>
  )
}

function Segment<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { v: T; label: string; disabled?: boolean }[]
  onChange: (v: T) => void
}) {
  return (
    <div className="segment" role="tablist">
      {options.map((o) => (
        <button
          key={o.v}
          role="tab"
          aria-selected={value === o.v}
          disabled={o.disabled}
          className={`segment__opt${value === o.v ? ' is-active' : ''}${o.disabled ? ' is-disabled' : ''}`}
          onClick={() => !o.disabled && onChange(o.v)}
        >
          {o.label}
          {o.disabled && <em> · bald</em>}
        </button>
      ))}
    </div>
  )
}

export default function Einstellungen() {
  const { settings, set } = useSettings()
  const [buecher, setBuecher] = useState<OfflineBuch[]>([])
  const [speicher, setSpeicher] = useState<{ used: number; quota: number } | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  async function refresh() {
    setBuecher(await listBuecher())
    setSpeicher(await speicherInfo())
  }
  useEffect(() => {
    refresh()
  }, [])

  const offlineIds = new Set(buecher.map((b) => b.sealId))
  const alleGeladen = offlineIds.size === module1.siegel.length

  async function toggleOffline(v: boolean) {
    set('offline', v)
    if (v) enableOffline()
    else await disableOffline()
  }

  async function ladeAlle() {
    setBusy('all')
    for (const s of module1.siegel) if (!offlineIds.has(s.id)) await downloadBuch(s.id)
    await refresh()
    setBusy(null)
  }
  async function ladeEines(id: string) {
    setBusy(id)
    await downloadBuch(id)
    await refresh()
    setBusy(null)
  }
  async function entferneEines(id: string) {
    await removeBuch(id)
    await refresh()
  }
  async function loescheAlleOffline() {
    setBusy('all')
    await removeAlle()
    try {
      await disableOffline()
      if (settings.offline) enableOffline() // Precache neu aufbauen, wenn Modus an bleibt
    } catch {
      /* ignore */
    }
    await refresh()
    setBusy(null)
  }

  return (
    <main className="shell">
      <div className="wrap page">
        <PageHead kicker="App" title="Einstellungen" />

        {/* ---------------- Darstellung ---------------- */}
        <motion.section className="card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="card__title">Darstellung</h2>

          <Row
            title="Farbschema"
            control={
              <Segment
                value={settings.theme}
                onChange={(v) => set('theme', v)}
                options={[
                  { v: 'light', label: 'Hell' },
                  { v: 'dark', label: 'Dunkel', disabled: true },
                ]}
              />
            }
          />
          <Row
            title="Schriftgröße"
            hint={`${settings.fontScale} %`}
            control={
              <div className="stepper">
                <button
                  aria-label="Kleiner"
                  disabled={settings.fontScale <= 90}
                  onClick={() => set('fontScale', Math.max(90, settings.fontScale - 10))}
                >
                  A−
                </button>
                <span className="stepper__sample" style={{ fontSize: `${settings.fontScale / 100}rem` }}>
                  Aa
                </span>
                <button
                  aria-label="Größer"
                  disabled={settings.fontScale >= 130}
                  onClick={() => set('fontScale', Math.min(130, settings.fontScale + 10))}
                >
                  A+
                </button>
              </div>
            }
          />
          <Row
            title="Animationen reduzieren"
            hint="Bewegung auf ein Minimum"
            control={<Toggle label="Animationen reduzieren" on={settings.reduceMotion} onChange={(v) => set('reduceMotion', v)} />}
          />
        </motion.section>

        {/* ---------------- Sprache ---------------- */}
        <motion.section className="card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <h2 className="card__title">Sprache</h2>
          <Row
            title="Anzeige-Sprache"
            control={
              <Segment
                value={settings.sprache}
                onChange={(v) => set('sprache', v)}
                options={[
                  { v: 'de', label: 'Deutsch' },
                  { v: 'en', label: 'English', disabled: true },
                  { v: 'ar', label: 'العربية', disabled: true },
                ]}
              />
            }
          />
          <p className="card__note">Englisch und Arabisch sind vorbereitet und folgen mit der Übersetzung der Inhalte.</p>
        </motion.section>

        {/* ---------------- Offline ---------------- */}
        <motion.section className="card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="card__title">Offline</h2>

          <Row
            title="Offline-Modus"
            hint={settings.offline ? 'Aktiviert' : 'Deaktiviert'}
            control={<Toggle label="Offline-Modus" on={settings.offline} onChange={toggleOffline} />}
          />

          <div className="offline-list">
            <div className="offline-list__head">
              <span>Heruntergeladene Inhalte</span>
              {!alleGeladen && (
                <button className="minibtn" disabled={busy === 'all'} onClick={ladeAlle}>
                  <DownloadIcon /> Alle laden
                </button>
              )}
            </div>

            {module1.siegel.map((s) => {
              const da = offlineIds.has(s.id)
              return (
                <div key={s.id} className="offbook">
                  <span className="offbook__name">
                    <span className="offbook__nr">{s.nummer}</span>
                    {s.titel}
                  </span>
                  {da ? (
                    <span className="offbook__actions">
                      <span className="offbook__ok">
                        <CheckIcon /> Verfügbar
                      </span>
                      <button className="iconbtn" aria-label="Löschen" onClick={() => entferneEines(s.id)}>
                        <TrashIcon />
                      </button>
                    </span>
                  ) : (
                    <button className="minibtn" disabled={busy === s.id} onClick={() => ladeEines(s.id)}>
                      <DownloadIcon /> {busy === s.id ? 'Lädt…' : 'Speichern'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          <div className="offline-storage">
            <span className="offline-storage__label">Speicher</span>
            <span className="offline-storage__val">
              {speicher ? `${formatBytes(speicher.used)} verwendet` : '—'}
            </span>
            {speicher && speicher.quota > 0 && (
              <div className="offline-storage__bar">
                <i style={{ width: `${Math.min(100, (speicher.used / speicher.quota) * 100)}%` }} />
              </div>
            )}
          </div>

          <button className="dangerbtn" disabled={busy === 'all' || offlineIds.size === 0} onClick={loescheAlleOffline}>
            <TrashIcon /> Alle Offline-Daten löschen
          </button>
        </motion.section>

        {/* ---------------- Daten ---------------- */}
        <motion.section className="card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h2 className="card__title">Meine Daten</h2>
          <p className="card__note">
            Favoriten, Notizen und der Leseverlauf liegen ausschließlich auf diesem Gerät. Es gibt keinen Server —
            nichts wird übertragen.
          </p>
          <button
            className="dangerbtn"
            onClick={async () => {
              await loescheNutzerdaten()
              alert('Favoriten, Notizen und Verlauf wurden gelöscht.')
            }}
          >
            <TrashIcon /> Favoriten, Notizen & Verlauf löschen
          </button>
        </motion.section>
      </div>
    </main>
  )
}
