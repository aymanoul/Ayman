import {
  pelachRows,
  pelachPointe,
  hmdBridge,
  konstantinMarks,
  fuenfReiche,
  vierTiere,
  vierTierePointe,
  steinBedingungen,
  steinPointe,
  formalFunktional,
  formalFunktionalPointe,
  formalFunktionalQuellen,
  ecksteinSynopse,
  zweiDimensionen,
} from '../../data/seals/daniel'

// Three supporting exhibits for the Daniel seal: the pelach table (serve, not
// worship), the Ḥ-M-D root bridge (ḥamudot → Muhammad), and Constantine as the
// little horn.

export function PelachTable() {
  return (
    <article className="ex">
      <h3 className="ex__title">„pelach" — dienen, nicht anbeten</h3>
      <table className="pelach">
        <tbody>
          {pelachRows.map((r) => (
            <tr key={r.stelle}>
              <th scope="row">{r.stelle}</th>
              <td>{r.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="ex__pointe">{pelachPointe}</p>
    </article>
  )
}

export function HmdBridge() {
  return (
    <article className="ex">
      <h3 className="ex__title">Die Wurzel Ḥ-M-D</h3>
      <div className="hmd">
        <div className="hmd__side">
          <span className="hmd__script hebrew" dir="rtl" lang="he">
            {hmdBridge.hebrew}
          </span>
          <span className="hmd__trans">{hmdBridge.hebrewTrans}</span>
          <span className="hmd__ref">{hmdBridge.hebrewRef}</span>
        </div>
        <div className="hmd__bridge" aria-hidden>
          <span className="hmd__root">{hmdBridge.root}</span>
          <span className="hmd__arrow">→</span>
        </div>
        <div className="hmd__side">
          <span className="hmd__script quran-script" dir="rtl" lang="ar">
            {hmdBridge.arabic}
          </span>
          <span className="hmd__trans">{hmdBridge.arabicTrans}</span>
          <span className="hmd__ref">{hmdBridge.arabicRef}</span>
        </div>
      </div>
      <p className="ex__pointe">{hmdBridge.note}</p>
    </article>
  )
}

export function KonstantinCard() {
  return (
    <article className="ex ex--wide">
      <h3 className="ex__title">Das kleine Horn = Konstantin</h3>
      <ul className="konst">
        {konstantinMarks.map((k) => (
          <li key={k.mark}>
            <span className="konst__mark">{k.mark}</span>
            <span className="konst__beleg">{k.beleg}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

// The five-kingdoms table (statue ↔ kingdom ↔ Daniel-internal proof).
export function FuenfReiche() {
  return (
    <div className="ex ex--wide dn-reiche">
      <h3 className="ex__title">Die fünf Reiche — Daniel liefert die Belege selbst</h3>
      <div className="dn-reiche__grid">
        <div className="dn-reiche__head" aria-hidden>
          <span>Statue-Teil</span>
          <span>Reich</span>
          <span>Beleg</span>
        </div>
        {fuenfReiche.map((r) => (
          <div className={`dn-reiche__row${r.stein ? ' is-stein' : ''}`} key={r.teil}>
            <span className="dn-reiche__teil" data-lbl="Teil">
              {r.teil}
            </span>
            <span className="dn-reiche__reich" data-lbl="Reich">
              {r.reich}
            </span>
            <span className="dn-reiche__beleg" data-lbl="Beleg">
              {r.beleg} <em>({r.belegRef})</em>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// The four beasts of Daniel 7 = the same four kingdoms.
export function VierTiere() {
  return (
    <div className="ex ex--wide dn-tiere">
      <h3 className="ex__title">Daniel 7 — dieselben vier Reiche als Tiere</h3>
      <ul className="dn-tiere__list">
        {vierTiere.map((t) => (
          <li key={t.tier}>
            <span className="dn-tiere__tier">{t.tier}</span>
            <span className="dn-tiere__reich">{t.reich}</span>
            <span className="dn-tiere__detail">{t.detail}</span>
          </li>
        ))}
      </ul>
      <p className="ex__pointe">{vierTierePointe}</p>
    </div>
  )
}

// The four conditions for the stone.
export function SteinBedingungen() {
  return (
    <div className="ex ex--wide dn-stein">
      <h3 className="ex__title">Die vier Bedingungen des Steins (Daniel 2,44-45)</h3>
      <div className="dn-stein__grid">
        {steinBedingungen.map((b) => (
          <div className="dn-stein__card" key={b.n}>
            <span className="dn-stein__n" aria-hidden>
              {b.n}
            </span>
            <span className="dn-stein__h">{b.text}</span>
            <span className="dn-stein__t">{b.detail}</span>
          </div>
        ))}
      </div>
      <p className="ex__pointe">{steinPointe}</p>
    </div>
  )
}

// Formal vs functional division of empires.
export function FormalFunktional() {
  return (
    <div className="ex ex--wide dn-formal">
      <h3 className="ex__title">Formal, nicht funktional geteilt</h3>
      <div className="dn-formal__grid">
        <div className="dn-formal__head" aria-hidden>
          <span>Reich</span>
          <span>Mitregenten (funktional)</span>
          <span>Daniel zählt</span>
        </div>
        {formalFunktional.map((r) => (
          <div className="dn-formal__row" key={r.reich}>
            <span className="dn-formal__reich" data-lbl="Reich">
              {r.reich}
            </span>
            <span className="dn-formal__mit" data-lbl="Mitregenten">
              {r.mitregenten}
            </span>
            <span className="dn-formal__gez" data-lbl="Daniel zählt">
              {r.gezaehlt}
            </span>
          </div>
        ))}
      </div>
      <p className="ex__pointe">
        {formalFunktionalPointe} <span className="dn-formal__q">{formalFunktionalQuellen.join(' · ')}</span>
      </p>
    </div>
  )
}

// The corner-stone synopsis (Mt 21 ↔ Bukhari 3535).
export function EcksteinSynopse() {
  return (
    <div className="ex ex--wide dn-eck">
      <h3 className="ex__title">Der Eckstein / der Ziegel</h3>
      <div className="dn-eck__pair">
        <div className="dn-eck__col">
          <span className="dn-eck__label">{ecksteinSynopse.links.label}</span>
          <ul>
            {ecksteinSynopse.links.rows.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
        <div className="dn-eck__col dn-eck__col--ar">
          <span className="dn-eck__label">{ecksteinSynopse.rechts.label}</span>
          <ul>
            {ecksteinSynopse.rechts.rows.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="ex__pointe">{ecksteinSynopse.note}</p>
    </div>
  )
}

// The two dimensions of the kingdom (physical + spiritual).
export function ZweiDimensionen() {
  return (
    <div className="ex ex--wide dn-zwei">
      <h3 className="ex__title">Das Reich Gottes — zwei Dimensionen</h3>
      <p className="erwart__intro">{zweiDimensionen.intro}</p>
      <div className="dn-zwei__pair">
        <div className="dn-zwei__card">
          <span className="dn-zwei__h">{zweiDimensionen.physisch.h}</span>
          <span className="dn-zwei__t">{zweiDimensionen.physisch.text}</span>
        </div>
        <div className="dn-zwei__card dn-zwei__card--g">
          <span className="dn-zwei__h">{zweiDimensionen.geistlich.h}</span>
          <span className="dn-zwei__t">{zweiDimensionen.geistlich.text}</span>
        </div>
      </div>
      <p className="ex__pointe">{zweiDimensionen.pointe}</p>
    </div>
  )
}
