import {
  pruefsteine,
  zweierlei,
  karteZeitplan,
  qurayzaTimeline,
  davidischSeziertisch,
  eingestaendnisse,
  ibnAlHaybanBanner,
  straenge,
} from '../../data/seals/erwartung'

// Exhibits for Siegel VII — Jüdische Erwartung & gleiche Maßstäbe (SPEC §6.7):
//  · the Torah's touchstones (reuses .merkmale)
//  · the balance al-mīzān + double standards (reuses .waage/.zmass)
//  · 🔥 the "map + schedule" (Jes 42 = WO, Jes 21 = WANN) — reuses .kschema
//  · the Banū-Qurayẓa context timeline (5 stations)
//  · the davidic-narrative dissection table (4 layers + Deut 18,22)
//  · the admissions gallery (Brown / Augustine / Butz)
//  · the Ibn al-Haybān deathbed banner
//  · the rope of strands (reuses .netz)

const TONE: Record<string, string> = {
  muted: 'var(--ink-faint)',
  green: 'var(--green)',
  brass: 'var(--brass)',
}

export function Pruefsteine() {
  return (
    <div className="ex ex--wide merkmale">
      <h3 className="ex__title">Die Prüfsteine der Tora</h3>
      <p className="erwart__intro">{pruefsteine.intro}</p>
      <ul className="merkmale__list">
        {pruefsteine.tests.map((t) => (
          <li className="merkmal" key={t.test}>
            <span className="merkmal__kopf">
              <span className="merkmal__h">
                <span className="merkmal__check" aria-hidden>
                  ✓
                </span>{' '}
                {t.test}
              </span>
              <span className="merkmal__ref">{t.ref}</span>
            </span>
            <span className="merkmal__sinn">{t.sinn}</span>
          </li>
        ))}
      </ul>
      <p className="ex__pointe">{pruefsteine.pointe}</p>
    </div>
  )
}

export function Waage() {
  return (
    <div className="ex ex--wide waage">
      <h3 className="ex__title">Die Waage · al-mīzān</h3>
      <div className="waage__icon">
        <svg viewBox="0 0 200 132" preserveAspectRatio="xMidYMid meet" aria-hidden>
          <path className="waage__line" d="M82 120 H118 M100 120 V32" />
          <path className="waage__line" d="M86 120 Q100 112 114 120" />
          <line className="waage__line" x1="38" y1="40" x2="162" y2="40" />
          <circle className="waage__knob" cx="100" cy="32" r="3.5" />
          <path className="waage__line" d="M38 40 L28 66 M38 40 L52 66" />
          <path className="waage__pan" d="M22 66 Q40 86 58 66" />
          <path className="waage__line" d="M162 40 L148 66 M162 40 L172 66" />
          <path className="waage__pan" d="M142 66 Q160 86 178 66" />
        </svg>
        <div className="waage__pans">
          <span className="waage__pan-label">Jesus</span>
          <span className="waage__pan-label">Muhammad ﷺ</span>
        </div>
      </div>
      <p className="erwart__intro">{zweierlei.intro}</p>
      <div className="zmass">
        <div className="zmass__head" aria-hidden>
          <span>Der Maßstab</span>
          <span className="zmass__h-j">Für Jesus — großzügig</span>
          <span className="zmass__h-m">Gegen Muhammad ﷺ — streng</span>
        </div>
        {zweierlei.faelle.map((f) => (
          <div className="zmass__row" key={f.standard}>
            <span className="zmass__std">
              {f.standard}
              {f.siegel !== '—' && <em className="zmass__siegel">{f.siegel}</em>}
            </span>
            <span className="zmass__cell zmass__cell--j" data-lbl="Für Jesus">
              {f.jesus}
            </span>
            <span className="zmass__cell zmass__cell--m" data-lbl="Gegen Muhammad ﷺ">
              {f.muhammad}
            </span>
          </div>
        ))}
      </div>
      <p className="ex__pointe">{zweierlei.pointe}</p>
    </div>
  )
}

// 🔥 the map + schedule: Jes 42 = WO, Jes 21 = WANN
export function KarteZeitplan() {
  const find = (id: string) => karteZeitplan.punkte.find((p) => p.id === id)!
  const pfadD = karteZeitplan.pfad
    .map(find)
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')
  return (
    <div className="ex ex--wide kz">
      <h3 className="ex__title">Karte + Zeitplan: Wo und Wann</h3>
      <p className="erwart__intro">{karteZeitplan.intro}</p>
      <div className="kschema">
        <svg className="kschema__svg" viewBox="0 0 100 120" preserveAspectRatio="xMidYMid meet" aria-hidden>
          <path className="kschema__pfad" d={pfadD} fill="none" />
          {karteZeitplan.punkte.map((p) => (
            <circle key={p.id} className="kschema__dot" cx={p.x} cy={p.y} r={p.tone === 'muted' ? 1.6 : 2.4} style={{ fill: TONE[p.tone] }} />
          ))}
        </svg>
        {karteZeitplan.punkte.map((p) => (
          <span key={p.id} className={`kschema__label kschema__label--${p.tone}`} style={{ left: `${p.x}%`, top: `${(p.y / 120) * 100}%` }}>
            <span className="kschema__name">{p.label}</span>
            <span className="kschema__sub">{p.sub}</span>
          </span>
        ))}
        <span className="kschema__kompass" aria-hidden>
          <span className="kschema__n">N</span>
          <span className="kschema__arrow">↓</span>
          <span className="kschema__s">S</span>
        </span>
      </div>
      <ul className="kz-wowann">
        {karteZeitplan.woWann.map((w) => (
          <li key={w.tag}>
            <span className="kz-wowann__tag">{w.tag}</span>
            <span className="kz-wowann__frage">{w.frage}</span>
            <span className="kz-wowann__text">{w.text}</span>
            <span className="kz-wowann__ref">{w.ref}</span>
          </li>
        ))}
      </ul>
      <p className="ex__pointe">{karteZeitplan.pointe}</p>
    </div>
  )
}

export function QurayzaTimeline() {
  return (
    <div className="ex ex--wide qz">
      <h3 className="ex__title">Banū Qurayẓa — der volle Kontext</h3>
      <p className="erwart__intro">{qurayzaTimeline.intro}</p>
      <ol className="qz-time">
        {qurayzaTimeline.stationen.map((s) => (
          <li key={s.n}>
            <span className="qz-time__n" aria-hidden>
              {s.n}
            </span>
            <span className="qz-time__titel">{s.titel}</span>
            <span className="qz-time__text">{s.text}</span>
          </li>
        ))}
      </ol>
      <p className="ex__pointe">{qurayzaTimeline.pointe}</p>
    </div>
  )
}

export function DavidischSeziertisch() {
  return (
    <div className="ex ex--wide david">
      <h3 className="ex__title">Das davidische Narrativ — der Seziertisch</h3>
      <p className="erwart__intro">{davidischSeziertisch.intro}</p>
      <div className="david__grid">
        {davidischSeziertisch.schichten.map((s) => (
          <div className="david__schicht" key={s.n}>
            <span className="david__n" aria-hidden>
              {s.n}
            </span>
            <span className="david__titel">{s.titel}</span>
            <span className="david__beleg">{s.beleg}</span>
          </div>
        ))}
      </div>
      <div className="david__todes">
        <span className="david__todes-titel">{davidischSeziertisch.todesstoss.titel}</span>
        <span className="david__todes-text">{davidischSeziertisch.todesstoss.text}</span>
      </div>
    </div>
  )
}

export function Eingestaendnisse() {
  return (
    <div className="ex ex--wide einge">
      <h3 className="ex__title">Die Eingeständnis-Galerie</h3>
      <p className="erwart__intro">{eingestaendnisse.intro}</p>
      <div className="einge__row">
        {eingestaendnisse.karten.map((k) => (
          <div className="einge__card" key={k.wer}>
            <span className="einge__wer">{k.wer}</span>
            <span className="einge__was">{k.was}</span>
            <span className="einge__zitat">{k.zitat}</span>
          </div>
        ))}
      </div>
      <p className="ex__pointe">{eingestaendnisse.pointe}</p>
    </div>
  )
}

export function IbnAlHaybanBanner() {
  return (
    <div className="ex ex--wide haybanner">
      <span className="haybanner__quelle">{ibnAlHaybanBanner.quelle}</span>
      <blockquote className="haybanner__zitat">„{ibnAlHaybanBanner.zitat}"</blockquote>
      <span className="haybanner__ref">{ibnAlHaybanBanner.fundstelle}</span>
    </div>
  )
}

export function Straenge() {
  return (
    <div className="ex ex--wide straenge">
      <h3 className="ex__title">Das Seil aus vielen Strängen</h3>
      <p className="erwart__intro">{straenge.intro}</p>
      <div className="netz">
        {straenge.items.map((it) => (
          <article className="netz__item" key={it.siegel}>
            <h3 className="netz__ziel">{it.siegel}</h3>
            <p className="netz__text">{it.was}</p>
          </article>
        ))}
      </div>
      <p className="ex__pointe">{straenge.pointe}</p>
    </div>
  )
}
