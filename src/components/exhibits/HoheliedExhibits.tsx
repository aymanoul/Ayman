import { BelegCard } from '../Beleg'
import {
  wurzelThread,
  einsetzprobe,
  physiognomie,
  sanhedrinPanel,
  verknuepfung,
  feindzeugen,
  pluralHoheit,
  hoheliedBelege,
} from '../../data/seals/hohelied'

// Exhibits for Siegel IV — Das Hohelied (SPEC §6.4):
//  · 🔥 the Hebrew root graphic — maḥamaddim ↔ ḥimdat ↔ Aḥmad/Muhammad (reuses .namen)
//  · the Einsetzprobe table — "Muhammad" inserted into four verses (.vgl)
//  · the physiognomy side-by-side — Hld 5,10-16 ↔ hadith (.synopse)
//  · the Sanhedrin 43a panel — the Jewish name-exegesis ("your own method")
//  · the cross-link diagram — the Song as hub (Deut 18,18 / Deut 33 / Ps 84 / Haggai / Maleachi)
//  · the hostile-witnesses panel — Parkhurst + Higgins
//  · the plural of majesty (Elohim · adonaw · maḥamaddim) — kept

// 🔥 HAUPT-EXHIBIT — the Hebrew root graphic. Two Arabic name cards on the ḤMD
// root, then the Hebrew traces (RTL), maḥamaddim at the top.
export function WurzelThread() {
  return (
    <div className="ex ex--wide namen hl-root">
      <h3 className="ex__title">מַחֲמַדִּים ↔ أحمد · محمد — eine Wurzel: Ḥ-M-D</h3>

      <div className="namen__pair">
        <div className="namen__card">
          <span className="namen__ar arabic" dir="rtl" lang="ar">
            {wurzelThread.namen[0].ar}
          </span>
          <span className="namen__trans">{wurzelThread.namen[0].trans}</span>
          <span className="namen__glanz">{wurzelThread.namen[0].glanz}</span>
        </div>

        <div className="namen__bridge" aria-hidden>
          <span className="namen__root">{wurzelThread.root}</span>
          <span className="namen__bedeutung">{wurzelThread.bedeutung}</span>
        </div>

        <div className="namen__card">
          <span className="namen__ar arabic" dir="rtl" lang="ar">
            {wurzelThread.namen[1].ar}
          </span>
          <span className="namen__trans">{wurzelThread.namen[1].trans}</span>
          <span className="namen__glanz">{wurzelThread.namen[1].glanz}</span>
        </div>
      </div>

      <div className="namen__spuren">
        <span className="namen__spuren-h">Dieselbe Wurzel, quer durch den Tanach (hebräisch, RTL)</span>
        <ul className="namen__list">
          {wurzelThread.spuren.map((s) => (
            <li className={`namen__spur${s.hl ? ' hl-spur--hl' : ''}`} key={s.stelle}>
              <span className="namen__spur-heb hebrew" dir="rtl" lang="he">
                {s.heb}
              </span>
              <span className="namen__spur-wort">{s.wort}</span>
              <span className="namen__spur-sinn">{s.sinn}</span>
              <span className="namen__spur-stelle">{s.stelle}</span>
              {s.siegel && s.siegel !== '—' ? (
                <span className="namen__spur-siegel">{s.siegel}</span>
              ) : (
                <span className="namen__spur-siegel namen__spur-siegel--none" aria-hidden>
                  {s.siegel}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <p className="ex__pointe">{wurzelThread.pointe}</p>
    </div>
  )
}

// The Einsetzprobe — insert "Muhammad" into each verse; only Hld 5,16 yields sense.
export function Einsetzprobe() {
  return (
    <div className="ex ex--wide einsetz">
      <h3 className="ex__title">Die Einsetzprobe</h3>
      <p className="erwart__intro">{einsetzprobe.intro}</p>
      <div className="synopse einsetz__tab">
        <div className="synopse__head" aria-hidden>
          <span>{einsetzprobe.spalten[0]}</span>
          <span>{einsetzprobe.spalten[1]}</span>
        </div>
        {einsetzprobe.zeilen.map((z) => (
          <div className={`synopse__row${z.hl ? ' einsetz__row--hl' : ''}`} key={z.stelle}>
            <span className="synopse__a" data-lbl="Stelle">
              <span className="einsetz__he hebrew" dir="rtl" lang="he">
                {z.wort}
              </span>
              <span className="einsetz__stelle">{z.stelle}</span>
            </span>
            <span className="synopse__b" data-lbl="Eingesetzt">
              <span className="einsetz__satz">{z.satz}</span>
              <span className={`einsetz__verdikt${z.hl ? ' is-sinn' : ' is-unsinn'}`}>
                {z.hl ? '✓ Sinn' : '✗ Unsinn'} — {z.sinn}
              </span>
            </span>
          </div>
        ))}
      </div>
      <p className="ex__pointe">{einsetzprobe.pointe}</p>
    </div>
  )
}

// Physiognomy side-by-side — Hld 5,10-16 against the authentic hadith descriptions.
export function Physiognomie() {
  return (
    <div className="ex ex--wide phys">
      <h3 className="ex__title">Die Physiognomie — Hld 5,10-16 ↔ Hadith</h3>
      <p className="erwart__intro">{physiognomie.intro}</p>
      <div className="synopse">
        <div className="synopse__head" aria-hidden>
          <span>{physiognomie.spalten[0]}</span>
          <span>{physiognomie.spalten[1]}</span>
        </div>
        {physiognomie.zeilen.map((z, i) => (
          <div className="synopse__row" key={i}>
            <span className="synopse__a" data-lbl="Hohelied">
              {z.h}
            </span>
            <span className="synopse__b" data-lbl="Hadith">
              {z.j}
            </span>
          </div>
        ))}
      </div>
      <p className="ex__pointe">{physiognomie.pointe}</p>
    </div>
  )
}

// Sanhedrin 43a — the pre-Islamic Jewish name-exegesis ("your own method").
export function SanhedrinPanel() {
  return (
    <div className="ex ex--wide sanh">
      <h3 className="ex__title">Sanhedrin 43a — eure eigene Methode</h3>
      <p className="erwart__intro">{sanhedrinPanel.intro}</p>
      <ul className="sanh__list">
        {sanhedrinPanel.faelle.map((f) => (
          <li className="sanh__fall" key={f.name}>
            <span className="sanh__name">
              <span className="sanh__he hebrew" dir="rtl" lang="he">
                {f.heb}
              </span>
              {f.name}
            </span>
            <span className="sanh__deutung">{f.deutung}</span>
          </li>
        ))}
        <li className="sanh__fall sanh__fall--hl">
          <span className="sanh__name">
            <span className="sanh__he hebrew" dir="rtl" lang="he">
              מַחֲמַדִּים
            </span>
            maḥamaddim
          </span>
          <span className="sanh__deutung">
            → Muhammad ﷺ (Hld 5,16): dieselbe Methode — Beschreibung wird Eigenname.
          </span>
        </li>
      </ul>
      <p className="ex__pointe">{sanhedrinPanel.pointe}</p>
    </div>
  )
}

// The cross-link diagram — the Song as a hub with arrows to five other prophecies.
export function Verknuepfung() {
  return (
    <div className="ex ex--wide vnetz">
      <h3 className="ex__title">Das Hohelied als Knotenpunkt</h3>
      <p className="erwart__intro">{verknuepfung.intro}</p>
      <div className="vnetz__diagram">
        <div className="vnetz__nabe">
          <span className="vnetz__nabe-he hebrew" dir="rtl" lang="he">
            {verknuepfung.nabe.wort}
          </span>
          <span className="vnetz__nabe-label">{verknuepfung.nabe.stelle}</span>
        </div>
        <ul className="vnetz__speichen">
          {verknuepfung.speichen.map((s) => (
            <li className="vnetz__speiche" key={s.ziel}>
              <span className="vnetz__ziel">{s.ziel}</span>
              <span className="vnetz__text">{s.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="ex__pointe">{verknuepfung.pointe}</p>
    </div>
  )
}

// The hostile-witnesses panel — Parkhurst + Higgins, with their Beleg cards.
export function Feindzeugen() {
  return (
    <div className="ex ex--wide feind">
      <h3 className="ex__title">Feindzeugen — gegen die eigene Überzeugung</h3>
      <p className="erwart__intro">{feindzeugen.intro}</p>
      <div className="feind__row">
        {feindzeugen.zeugen.map((z) => (
          <article className="feind__card" key={z.name}>
            <span className="feind__name">{z.name}</span>
            <span className="feind__rolle">{z.rolle}</span>
            <blockquote className="feind__zitat">{z.zitat}</blockquote>
            <p className="feind__kontext">{z.kontext}</p>
            {hoheliedBelege[z.belegId] && <BelegCard beleg={hoheliedBelege[z.belegId]} />}
          </article>
        ))}
      </div>
      <p className="ex__pointe">{feindzeugen.pointe}</p>
    </div>
  )
}

// The plural of majesty — Elohim · adonaw · maḥamaddim (kept).
export function PluralHoheit() {
  return (
    <div className="ex ex--wide plural">
      <h3 className="ex__title">Der Plural der Hoheit</h3>
      <p className="erwart__intro">{pluralHoheit.intro}</p>
      <div className="plural__row">
        {pluralHoheit.beispiele.map((b) => (
          <div className={`plural__card${b.hl ? ' plural__card--hl' : ''}`} key={b.t}>
            <span className="plural__he hebrew" dir="rtl" lang="he">
              {b.he}
            </span>
            <span className="plural__t">{b.t}</span>
            <span className="plural__wort">{b.wort}</span>
            <span className="plural__sinn">{b.sinn}</span>
          </div>
        ))}
      </div>
      <p className="ex__pointe">{pluralHoheit.pointe}</p>
    </div>
  )
}
