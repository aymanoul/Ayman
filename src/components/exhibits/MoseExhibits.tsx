import { fuenfzehn, varianten, augustinusPanel, dreiErwartungen, sieb, zeugen } from '../../data/seals/mose'

// Six exhibits for Siegel II — "Prophet wie Mose":
//  1. Fuenfzehn       — the 15-criteria table (Mose · Muhammad ﷺ · Jesus), .vgl
//  2. Varianten       — textual variants of Deut 18:15 (4 witnesses)
//  3. AugustinusPanel — "they say it themselves" (Contra Faustum)
//  4. DreiErwartungen — John 1:19-21 schema (three questions → three persons)
//  5. Sieb            — the sieve: candidates sifted out, Muhammad ﷺ remains
//  6. Zeugen          — Greenberg + Dow (external witnesses)
// Global classes (.ex, .vgl, .erwart*) are reused; new classes live in mose.css.

// 1 — THE CENTREPIECE: fifteen criteria, three figures -----------------------
export function Fuenfzehn() {
  return (
    <div className="ex ex--wide fuenfzehn">
      <h3 className="ex__title">Wer gleicht Mose? — fünfzehn Kriterien</h3>
      <div className="vgl">
        <div className="vgl__head">
          <span className="vgl__corner" aria-hidden />
          <span className="vgl__col">{fuenfzehn.spalten[0]}</span>
          <span className="vgl__col vgl__col--hl">{fuenfzehn.spalten[1]}</span>
          <span className="vgl__col">{fuenfzehn.spalten[2]}</span>
        </div>
        {fuenfzehn.zeilen.map((z) => (
          <div className="vgl__row" key={z.k}>
            <span className="vgl__k">{z.k}</span>
            <span className="vgl__cell vgl__cell--hl" data-fig={fuenfzehn.spalten[0]}>
              {z.mose}
            </span>
            <span className="vgl__cell vgl__cell--hl" data-fig={fuenfzehn.spalten[1]}>
              {z.muh}
            </span>
            <span className="vgl__cell vgl__cell--off" data-fig={fuenfzehn.spalten[2]}>
              {z.jesus}
            </span>
          </div>
        ))}
        <div className="vgl__row score-row">
          <span className="vgl__k">Score</span>
          <span className="vgl__cell vgl__cell--hl score-row__n" data-fig={fuenfzehn.spalten[0]}>
            {fuenfzehn.score.mose}
          </span>
          <span className="vgl__cell vgl__cell--hl score-row__n" data-fig={fuenfzehn.spalten[1]}>
            {fuenfzehn.score.muh}
          </span>
          <span className="vgl__cell vgl__cell--off score-row__n" data-fig={fuenfzehn.spalten[2]}>
            {fuenfzehn.score.jesus}
          </span>
        </div>
      </div>
      <p className="fuenfzehn__korrektur">{fuenfzehn.korrektur}</p>
      <p className="ex__pointe">{fuenfzehn.pointe}</p>
    </div>
  )
}

// 2 — Textual variants of Deut 18:15 -----------------------------------------
export function Varianten() {
  return (
    <div className="ex ex--wide varianten">
      <h3 className="ex__title">Textvarianten — 5. Mose 18,15</h3>
      <p className="erwart__intro">{varianten.intro}</p>
      <div className="varianten__grid">
        <div className="varianten__head">
          <span>{varianten.spalten[0]}</span>
          <span>{varianten.spalten[1]}</span>
          <span className="varianten__hcol">{varianten.spalten[2]}</span>
        </div>
        {varianten.zeilen.map((z) => (
          <div className="varianten__row" key={z.z}>
            <span className="varianten__z" data-lbl="Textzeuge">
              {z.z}
            </span>
            <span className="varianten__t" data-lbl="Lesart">
              {z.t}
            </span>
            <span
              className={`varianten__mark${z.hat ? ' varianten__mark--yes' : ' varianten__mark--no'}`}
              data-lbl="„aus deiner Mitte“"
              aria-label={z.hat ? 'enthält den Zusatz' : 'ohne den Zusatz'}
            >
              {z.hat ? '✓' : '—'}
            </span>
          </div>
        ))}
      </div>
      <p className="ex__pointe">{varianten.pointe}</p>
    </div>
  )
}

// 3 — Augustine panel: "they say it themselves" ------------------------------
export function AugustinusPanel() {
  return (
    <div className="ex ex--wide aug-panel">
      <span className="aug-panel__werk">{augustinusPanel.werk}</span>
      <blockquote className="aug-panel__zitat">„{augustinusPanel.zitat}"</blockquote>
      <span className="aug-panel__autor">— {augustinusPanel.autor}</span>
      <p className="aug-panel__kontext">{augustinusPanel.kontext}</p>
      <p className="ex__pointe">{augustinusPanel.pointe}</p>
    </div>
  )
}

// 4 — John 1:19-21 schema: three questions → three persons -------------------
export function DreiErwartungen() {
  return (
    <div className="ex ex--wide erwartungen">
      <h3 className="ex__title">Joh 1,19-21 — drei Fragen, drei Personen</h3>
      <p className="erwart__intro">{dreiErwartungen.intro}</p>
      <div className="erwart__row">
        {dreiErwartungen.fragen.map((q) => (
          <div className={`erwart__card${q.hl ? ' erwart__card--hl' : ''}`} key={q.wer}>
            <span className="erwart__wer">{q.wer}</span>
            <span className="erwart__f">„{q.f}"</span>
            <span className="erwart__a">{q.a}</span>
          </div>
        ))}
      </div>
      <p className="ex__pointe">{dreiErwartungen.pointe}</p>
    </div>
  )
}

// 5 — The sieve: candidates sifted out, Muhammad ﷺ remains -------------------
export function Sieb() {
  return (
    <div className="ex ex--wide sieb">
      <h3 className="ex__title">Die Sieb-Methode</h3>
      <p className="erwart__intro">{sieb.intro}</p>
      <ul className="sieb__list">
        {sieb.kandidaten.map((k) => (
          <li className="sieb__item sieb__item--out" key={k.name}>
            <span className="sieb__mark" aria-hidden>
              ✕
            </span>
            <span className="sieb__body">
              <span className="sieb__name">{k.name}</span>
              <span className="sieb__grund">{k.grund}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="sieb__bleibt">
        <span className="sieb__mark sieb__mark--in" aria-hidden>
          ✓
        </span>
        <span className="sieb__body">
          <span className="sieb__name sieb__name--in">{sieb.uebrig.name}</span>
          <span className="sieb__grund">{sieb.uebrig.grund}</span>
        </span>
      </div>
      <p className="ex__pointe">{sieb.pointe}</p>
    </div>
  )
}

// 6 — Greenberg + Dow: external witnesses ------------------------------------
export function Zeugen() {
  return (
    <div className="ex ex--wide zeugen">
      <h3 className="ex__title">Externe Zeugen — Greenberg & Dow</h3>
      <p className="erwart__intro">{zeugen.intro}</p>
      <div className="zeugen__row">
        {zeugen.stimmen.map((s) => (
          <figure className="zeugen__card" key={s.wer}>
            <blockquote className="zeugen__zitat">{s.was}</blockquote>
            <figcaption className="zeugen__cap">
              <span className="zeugen__wer">{s.wer}</span>
              <span className="zeugen__quelle">{s.quelle}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="ex__pointe">{zeugen.pointe}</p>
    </div>
  )
}
