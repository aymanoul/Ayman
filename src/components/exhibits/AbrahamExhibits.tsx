import {
  stammbaum,
  zwoelfFuersten,
  ismaelEmpfing,
  ismaelEmpfingPointe,
  vavTabelle,
  grosseNationWaage,
  chronologie,
  ismaelReha,
} from '../../data/seals/abraham'

// Exhibits for Siegel I — the blessed line, defined and defended:
//  · the family tree (Abraham → Ishmael → Muhammad ﷺ | Abraham → Isaac → Jesus)
//  · the Vav-question (Gen 17,21: "and" vs "but")
//  · the twelve princes of Ishmael (mirror of Israel's twelve)
//  · the Maimonides trap ("great nation" ≠ number; Ex 32,10 / Ibn Ezra / Benson)
//  · the chronology (Ishmael was the "only son" for 14 years)
//  · the covenant gifts; Ishmael rehabilitated (Gen 16,12)

// A small reusable two-column synopsis table (reuses global .synopse styling).
function SynopseTable({
  headA,
  headB,
  rows,
}: {
  headA: string
  headB: string
  rows: { a: string; b: string }[]
}) {
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

export function Stammbaum() {
  return (
    <div className="ex ex--wide tree">
      <h3 className="ex__title">Ein Vater, zwei Linien</h3>

      <div className="tree__crown">
        <span className="tree__root">
          <span className="tree__root-name">{stammbaum.wurzel.name}</span>
          <span className="tree__root-ar arabic" dir="rtl" lang="ar">
            {stammbaum.wurzel.ar}
          </span>
        </span>
      </div>

      <div className="tree__split">
        <div className="tree__col tree__col--ismael">
          <span className="tree__col-label">{stammbaum.ismael.label}</span>
          {stammbaum.ismael.nodes.map((n, i) => (
            <span
              key={n}
              className={`tree__node${i === stammbaum.ismael.nodes.length - 1 ? ' tree__node--end' : ''}`}
            >
              {n}
            </span>
          ))}
        </div>

        <div className="tree__col">
          <span className="tree__col-label">{stammbaum.isaak.label}</span>
          {stammbaum.isaak.nodes.map((n, i) => (
            <span
              key={n}
              className={`tree__node${i === stammbaum.isaak.nodes.length - 1 ? ' tree__node--end tree__node--isaak' : ''}`}
            >
              {n}
            </span>
          ))}
        </div>
      </div>

      <p className="ex__pointe">{stammbaum.note}</p>
    </div>
  )
}

// The Vav-question: Gen 17,21 "and" vs "but" (reuses .synopse).
export function VavTabelle() {
  return (
    <div className="ex ex--wide vav-card">
      <h3 className="ex__title">Ein Buchstabe: das Vav (ו) in 1. Mose 17,21</h3>
      <p className="erwart__intro">{vavTabelle.intro}</p>
      <SynopseTable
        headA={vavTabelle.spalten[0]}
        headB={vavTabelle.spalten[1]}
        rows={vavTabelle.zeilen.map((z) => ({ a: z.h, b: z.j }))}
      />
      <p className="ex__pointe">{vavTabelle.pointe}</p>
    </div>
  )
}

export function ZwoelfFuersten() {
  return (
    <div className="ex ex--wide zwoelf-card">
      <h3 className="ex__title">
        Die zwölf Fürsten <span className="zwoelf__ref">{zwoelfFuersten.ref}</span>
      </h3>
      <ul className="zwoelf">
        {zwoelfFuersten.fuersten.map((f, i) => (
          <li key={f} className={`zwoelf__item${f === zwoelfFuersten.highlight ? ' zwoelf__item--hl' : ''}`}>
            <span className="zwoelf__num" aria-hidden>
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="zwoelf__name">{f}</span>
            {f === zwoelfFuersten.highlight && <span className="zwoelf__tag">→ die Araber</span>}
          </li>
        ))}
      </ul>
      <p className="ex__pointe">{zwoelfFuersten.pointe}</p>
    </div>
  )
}

// The Maimonides trap: "great nation" is not a number (reuses .synopse).
export function GrosseNationWaage() {
  return (
    <div className="ex ex--wide gnw-card">
      <h3 className="ex__title">Die Maimonides-Falle: „großes Volk" ≠ Zahl</h3>
      <p className="erwart__intro">{grosseNationWaage.intro}</p>
      <p className="gnw__these">
        <span className="gnw__these-lbl">Behauptung</span>
        {grosseNationWaage.these}
      </p>
      <SynopseTable
        headA="Gegenzeuge"
        headB="Was er sagt"
        rows={grosseNationWaage.gegen.map((g) => ({ a: g.q, b: g.t }))}
      />
      <p className="ex__pointe">{grosseNationWaage.pointe}</p>
    </div>
  )
}

// The chronology: Ishmael was the "only son" for 14 years.
export function Chronologie() {
  return (
    <div className="ex ex--wide chrono-card">
      <h3 className="ex__title">Der „einzige Sohn" — eine Frage der Arithmetik</h3>
      <p className="erwart__intro">{chronologie.intro}</p>
      <ul className="chrono">
        {chronologie.zeilen.map((z, i) => (
          <li key={i}>
            <span className="chrono__e">{z.e}</span>
            <span className="chrono__wert">{z.wert}</span>
            <span className="chrono__ref">{z.ref}</span>
          </li>
        ))}
      </ul>
      <p className="ex__pointe">{chronologie.pointe}</p>
    </div>
  )
}

export function Bundesgaben() {
  return (
    <div className="ex ex--wide gaben-card">
      <h3 className="ex__title">Was Ismael empfing</h3>
      <ul className="gaben">
        {ismaelEmpfing.map((g) => (
          <li key={g.gabe}>
            <span className="gaben__check" aria-hidden>
              ✓
            </span>
            <span className="gaben__gabe">{g.gabe}</span>
            <span className="gaben__ref">{g.ref}</span>
          </li>
        ))}
      </ul>
      <p className="ex__pointe">{ismaelEmpfingPointe}</p>
    </div>
  )
}

// Ishmael rehabilitated: Gen 16,12 prejudice vs text (reuses .synopse).
export function IsmaelReha() {
  return (
    <div className="ex ex--wide reha-card">
      <h3 className="ex__title">Die Rehabilitierung Ismaels · 1. Mose 16,12</h3>
      <p className="erwart__intro">{ismaelReha.intro}</p>
      <SynopseTable
        headA="Vorurteil (die Lesart)"
        headB="Der Text"
        rows={ismaelReha.zeilen.map((z) => ({ a: z.neg, b: z.pos }))}
      />
      <p className="ex__pointe">{ismaelReha.pointe}</p>
    </div>
  )
}
