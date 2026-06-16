import { tahrifSpektrum, nameThread, spielregeln, ibnAmrJesaja } from '../../data/seals/fundament'

// Three foundation exhibits — no photo, just structured argument:
//  · the taḥrīf spectrum (where the honest position actually sits)
//  · the Ḥ-M-D name thread (the root the later seals follow)
//  · the rules of fair reading

export function TahrifSpektrum() {
  return (
    <div className="ex ex--wide spektrum">
      <h3 className="ex__title">Das Taḥrīf-Spektrum</h3>
      <p className="spektrum__lead">{tahrifSpektrum.lead}</p>

      <div className="spektrum__bar">
        <span className="spektrum__track" aria-hidden />
        <span className="spektrum__marker" style={{ left: `${tahrifSpektrum.marker}%` }}>
          <span className="spektrum__dot" aria-hidden />
          <span className="spektrum__flag">{tahrifSpektrum.these}</span>
        </span>
        <div className="spektrum__poles">
          <span>{tahrifSpektrum.links}</span>
          <span>{tahrifSpektrum.rechts}</span>
        </div>
      </div>

      <p className="ex__pointe">{tahrifSpektrum.pointe}</p>
    </div>
  )
}

export function NameThread() {
  return (
    <div className="ex ex--wide namen">
      <h3 className="ex__title">Der Name: Ḥ · M · D</h3>

      <div className="namen__pair">
        <div className="namen__card">
          <span className="namen__ar arabic" dir="rtl" lang="ar">
            {nameThread.namen[0].ar}
          </span>
          <span className="namen__trans">{nameThread.namen[0].trans}</span>
          <span className="namen__glanz">{nameThread.namen[0].glanz}</span>
          <span className="namen__ref">{nameThread.namen[0].ref}</span>
        </div>

        <div className="namen__bridge" aria-hidden>
          <span className="namen__root">{nameThread.root}</span>
          <span className="namen__bedeutung">{nameThread.bedeutung}</span>
        </div>

        <div className="namen__card">
          <span className="namen__ar arabic" dir="rtl" lang="ar">
            {nameThread.namen[1].ar}
          </span>
          <span className="namen__trans">{nameThread.namen[1].trans}</span>
          <span className="namen__glanz">{nameThread.namen[1].glanz}</span>
          <span className="namen__ref">{nameThread.namen[1].ref}</span>
        </div>
      </div>

      <div className="namen__spuren">
        <span className="namen__spuren-h">Dieselbe Wurzel, quer durch die Schrift</span>
        <ul className="namen__list">
          {nameThread.spuren.map((s) => (
            <li className="namen__spur" key={s.stelle}>
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

      <p className="ex__pointe">{nameThread.note}</p>
    </div>
  )
}

export function Spielregeln() {
  return (
    <div className="ex ex--wide regeln-card">
      <h3 className="ex__title">Die Spielregeln</h3>
      <ul className="regeln">
        {spielregeln.map((r, i) => (
          <li key={r.regel}>
            <span className="regeln__n" aria-hidden>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="regeln__body">
              <span className="regeln__r">{r.regel}</span>
              <span className="regeln__t">{r.text}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// The Torah-description (Bukhari 2125) set against Isaiah 42, row by row.
export function IbnAmrJesaja() {
  return (
    <div className="ex ex--wide synopse-card">
      <h3 className="ex__title">Die Beschreibung — Hadith ↔ Jesaja 42</h3>
      <p className="erwart__intro">{ibnAmrJesaja.intro}</p>
      <div className="synopse">
        <div className="synopse__head" aria-hidden>
          <span>{ibnAmrJesaja.spalten[0]}</span>
          <span>{ibnAmrJesaja.spalten[1]}</span>
        </div>
        {ibnAmrJesaja.zeilen.map((z, i) => (
          <div className="synopse__row" key={i}>
            <span className="synopse__a" data-lbl="Hadith">
              {z.h}
            </span>
            <span className="synopse__b" data-lbl="Jesaja 42">
              {z.j}
            </span>
          </div>
        ))}
      </div>
      <p className="ex__pointe">{ibnAmrJesaja.pointe}</p>
    </div>
  )
}
