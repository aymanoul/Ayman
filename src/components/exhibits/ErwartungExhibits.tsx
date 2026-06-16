import { pruefsteine, zweierlei, straenge } from '../../data/seals/erwartung'

// Three exhibits for Siegel VII — the capstone scale:
//  · the Torah's touchstones applied to Muhammad ﷺ (reuses .merkmale list)
//  · the balance al-mīzān + the catalogue of double standards (bespoke)
//  · the rope of strands — a synthesis of all seals (reuses .netz grid)

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
          {/* base */}
          <path className="waage__line" d="M82 120 H118 M100 120 V32" />
          <path className="waage__line" d="M86 120 Q100 112 114 120" />
          {/* beam */}
          <line className="waage__line" x1="38" y1="40" x2="162" y2="40" />
          <circle className="waage__knob" cx="100" cy="32" r="3.5" />
          {/* left pan */}
          <path className="waage__line" d="M38 40 L28 66 M38 40 L52 66" />
          <path className="waage__pan" d="M22 66 Q40 86 58 66" />
          {/* right pan */}
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
