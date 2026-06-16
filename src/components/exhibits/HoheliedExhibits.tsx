import { wortAnatomie, wurzelThread, pluralHoheit } from '../../data/seals/hohelied'

// Three exhibits for Siegel IV — the word, the root, the majesty plural:
//  · the anatomy of מַחֲמַדִּים (prefix · root Ḥ-M-D · plural -īm), aligned to محمد
//  · the root Ḥ-M-D across the Tanakh (reuses the .namen thread styling)
//  · the plural of majesty (Elohim · adonim · maḥamaddīm)

export function Wortanatomie() {
  return (
    <div className="ex ex--wide anatomie">
      <h3 className="ex__title">Das Wort: מַחֲמַדִּים</h3>

      <div className="anat__head">
        <span className="anat__wort hebrew" dir="rtl" lang="he">
          {wortAnatomie.wort}
        </span>
        <span className="anat__translit">
          {wortAnatomie.translit} · {wortAnatomie.fundstelle}
        </span>
      </div>

      {/* morpheme chips, in Hebrew reading order (right-to-left) */}
      <div className="anat__teile" dir="rtl">
        {wortAnatomie.teile.map((t) => (
          <div className={`anat__teil${t.root ? ' anat__teil--root' : ''}`} key={t.label}>
            <span className="anat__he hebrew" dir="rtl" lang="he">
              {t.he}
            </span>
            <span className="anat__label" dir="ltr">
              {t.label}
            </span>
            <span className="anat__sinn" dir="ltr">
              {t.sinn}
            </span>
          </div>
        ))}
      </div>

      {/* the consonantal skeleton aligned to the name */}
      <div className="anat__bridge">
        <div className="anat__skelett" aria-label="Konsonanten M-Ḥ-M-D">
          {wortAnatomie.skelett.map((c, i) => (
            <span className="anat__sk" key={i}>
              {c}
            </span>
          ))}
        </div>
        <span className="anat__arrow" aria-hidden>
          ≈
        </span>
        <div className="anat__name">
          <span className="anat__name-ar arabic" dir="rtl" lang="ar">
            {wortAnatomie.name.ar}
          </span>
          <span className="anat__name-trans">{wortAnatomie.name.trans}</span>
          <span className="anat__name-sinn">{wortAnatomie.name.sinn}</span>
        </div>
      </div>

      <p className="anat__bedeutung">{wortAnatomie.bedeutung}</p>
      <p className="ex__pointe">{wortAnatomie.pointe}</p>
    </div>
  )
}

export function WurzelThread() {
  return (
    <div className="ex ex--wide namen">
      <h3 className="ex__title">Die Wurzel Ḥ-M-D quer durch die Schrift</h3>

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
        <span className="namen__spuren-h">Dieselbe Wurzel, von den Propheten bis zum Lied</span>
        <ul className="namen__list">
          {wurzelThread.spuren.map((s) => (
            <li className={`namen__spur${s.hl ? ' namen__spur--hl' : ''}`} key={s.stelle}>
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
