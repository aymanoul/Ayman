import {
  kriterienMatrix,
  periklytosGrafik,
  textkritik,
  brownListe,
  busfahrer,
  deutBruecke,
  kirchenPanel,
} from '../../data/seals/paraklet'

// Exhibits for Siegel VI — Der Paraklet (SPEC §6.6):
//  · 🔥 the four-criteria matrix (Jesus' words ↔ Muhammad) + the 3 knockouts
//  · the periklytos root graphic (para + kletos → periklytos → Aḥmad)
//  · the text-criticism panel for "holy" (Joh 14,26)
//  · Raymond Brown's list of six scholars
//  · the "bus-driver who operates" illustration (the Paraclete problem)
//  · the Deut-18,18 bridge (Joh 16,13 ↔ Deut 18,18)
//  · the church-precedent panel (Origen's pupils / Mani / Augustine)

function SynopseTable({ headA, headB, rows }: { headA: string; headB: string; rows: { a: string; b: string }[] }) {
  return (
    <div className="synopse">
      <div className="synopse__head" aria-hidden>
        <span>{headA}</span>
        <span>{headB}</span>
      </div>
      {rows.map((r, i) => (
        <div className="synopse__row" key={i}>
          <span className="synopse__a" data-lbl={headA}>
            {r.a}
          </span>
          <span className="synopse__b" data-lbl={headB}>
            {r.b}
          </span>
        </div>
      ))}
    </div>
  )
}

export function KriterienMatrix() {
  return (
    <div className="ex ex--wide pk-matrix">
      <h3 className="ex__title">Die Vier-Kriterien-Matrix</h3>
      <p className="erwart__intro">{kriterienMatrix.intro}</p>
      <SynopseTable
        headA={kriterienMatrix.spalten[0]}
        headB={kriterienMatrix.spalten[1]}
        rows={kriterienMatrix.zeilen.map((z) => ({ a: `${z.wort} (${z.ref})`, b: z.erfuellung }))}
      />
      <div className="pk-ko">
        <span className="pk-ko__strike">{kriterienMatrix.durchgestrichen}</span>
        <ul className="pk-ko__list">
          {kriterienMatrix.knockouts.map((k, i) => (
            <li key={i}>
              <span className="pk-ko__h">{k.h}</span>
              <span className="pk-ko__t">{k.t}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="ex__pointe">{kriterienMatrix.pointe}</p>
    </div>
  )
}

export function PeriklytosGrafik() {
  return (
    <div className="ex ex--wide pk-flow-card">
      <h3 className="ex__title">παράκλητος → περικλυτός → أحمد</h3>
      <p className="erwart__intro">{periklytosGrafik.intro}</p>
      <div className="pk-flow">
        <div className="pk-flow__step">
          <span className="pk-flow__gr">{periklytosGrafik.start.wort}</span>
          <span className="pk-flow__trans">{periklytosGrafik.start.trans}</span>
          <span className="pk-flow__sinn">{periklytosGrafik.start.sinn}</span>
        </div>
        <span className="pk-flow__arrow" aria-hidden>→</span>
        <div className="pk-flow__teile">
          {periklytosGrafik.teile.map((t) => (
            <div className="pk-flow__teil" key={t.trans}>
              <span className="pk-flow__gr pk-flow__gr--sm">{t.gr}</span>
              <span className="pk-flow__sinn">{t.trans} — {t.sinn}</span>
            </div>
          ))}
        </div>
        <span className="pk-flow__arrow" aria-hidden>→</span>
        <div className="pk-flow__step pk-flow__step--hl">
          <span className="pk-flow__gr">{periklytosGrafik.ziel.gr}</span>
          <span className="pk-flow__trans">{periklytosGrafik.ziel.trans}</span>
          <span className="pk-flow__sinn">{periklytosGrafik.ziel.sinn}</span>
        </div>
        <span className="pk-flow__arrow" aria-hidden>≈</span>
        <div className="pk-flow__step pk-flow__step--ar">
          <span className="pk-flow__gr arabic" dir="rtl" lang="ar">{periklytosGrafik.arabisch.ar}</span>
          <span className="pk-flow__trans">{periklytosGrafik.arabisch.trans}</span>
          <span className="pk-flow__sinn">{periklytosGrafik.arabisch.sinn}</span>
        </div>
      </div>
      <ul className="pk-verweise">
        {periklytosGrafik.verweise.map((v) => (
          <li key={v.ziel}>
            <span className="pk-verweise__ziel">{v.ziel}</span> {v.text}
          </li>
        ))}
      </ul>
      <p className="ex__pointe">{periklytosGrafik.pointe}</p>
    </div>
  )
}

export function Textkritik() {
  return (
    <div className="ex ex--wide pk-textkritik">
      <span className="marble-tag">✦ Ergänzender Befund</span>
      <h3 className="ex__title">Textkritik: „heilig" in Johannes 14,26</h3>
      <p className="erwart__intro">{textkritik.intro}</p>
      <div className="pk-var">
        {textkritik.varianten.map((v, i) => (
          <div className={`pk-var__card${v.hl ? ' pk-var__card--hl' : ''}`} key={i}>
            <span className="pk-var__typ">{v.typ}</span>
            <span className="pk-var__lesart">{v.lesart}</span>
            <span className="pk-var__note">{v.note}</span>
          </div>
        ))}
      </div>
      <ul className="pk-zeugen">
        {textkritik.zeugen.map((z) => (
          <li key={z.name}>
            <span className="pk-zeugen__name">{z.name}</span>
            <span className="pk-zeugen__sinn">{z.sinn}</span>
          </li>
        ))}
      </ul>
      <p className="ex__pointe">{textkritik.pointe}</p>
    </div>
  )
}

export function BrownListe() {
  return (
    <div className="ex ex--wide pk-brown">
      <h3 className="ex__title">Raymond Browns Liste</h3>
      <p className="erwart__intro">{brownListe.intro}</p>
      <ul className="pk-namen">
        {brownListe.gelehrte.map((g) => (
          <li key={g.name}>
            <span className="pk-namen__name">{g.name}</span>
            <span className="pk-namen__sinn">{g.sinn}</span>
          </li>
        ))}
      </ul>
      <p className="ex__pointe">{brownListe.pointe}</p>
    </div>
  )
}

export function Busfahrer() {
  return (
    <div className="ex ex--wide pk-bus">
      <h3 className="ex__title">{busfahrer.titel}</h3>
      <div className="pk-bus__pair">
        <div className="pk-bus__card">
          <span className="pk-bus__rolle">{busfahrer.links.rolle}</span>
          <span className="pk-bus__wort">{busfahrer.links.wort}</span>
          <span className="pk-bus__sinn">{busfahrer.links.sinn}</span>
        </div>
        <span className="pk-bus__x" aria-hidden>≠</span>
        <div className="pk-bus__card pk-bus__card--fn">
          <span className="pk-bus__rolle">{busfahrer.rechts.rolle}</span>
          <span className="pk-bus__wort">{busfahrer.rechts.wort}</span>
          <span className="pk-bus__sinn">{busfahrer.rechts.sinn}</span>
        </div>
      </div>
      <p className="pk-bus__erkl">{busfahrer.erklaerung}</p>
      <p className="ex__pointe">{busfahrer.pointe}</p>
    </div>
  )
}

export function DeutBruecke() {
  return (
    <div className="ex ex--wide pk-bruecke">
      <h3 className="ex__title">Der Paraklet = der Prophet wie Mose</h3>
      <p className="erwart__intro">{deutBruecke.intro}</p>
      <SynopseTable
        headA={deutBruecke.spalten[0]}
        headB={deutBruecke.spalten[1]}
        rows={deutBruecke.zeilen.map((z) => ({ a: z.a, b: z.b }))}
      />
      <p className="ex__pointe">{deutBruecke.pointe}</p>
    </div>
  )
}

export function KirchenPanel() {
  return (
    <div className="ex ex--wide pk-kirche">
      <h3 className="ex__title">Die Kirche selbst: Paraklet = Mensch</h3>
      <p className="erwart__intro">{kirchenPanel.intro}</p>
      <ul className="pk-kirche__list">
        {kirchenPanel.faelle.map((f) => (
          <li key={f.wer}>
            <span className="pk-kirche__wer">{f.wer}</span>
            <span className="pk-kirche__anspruch">{f.anspruch}</span>
            <span className="pk-kirche__note">{f.note}</span>
          </li>
        ))}
      </ul>
      <p className="ex__pointe">{kirchenPanel.pointe}</p>
    </div>
  )
}
