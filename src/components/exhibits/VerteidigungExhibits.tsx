import { synopse, zuwd, abrogationsliste, paulusDossier, prov2010 } from '../../data/seals/verteidigung'

// Exhibits for the Verteidigungs-Siegel (SPEC §6.V):
//  · the synopsis Muhammad ﷺ ↔ Gospels (a shield, not a sword)
//  · the zûd analysis (Deut 18,20 — wilful, not "any prophet")
//  · the abrogation list (the Bible itself changes laws)
//  · the Paul dossier (three bad fruits)
//  · the Proverbs 20,10 banner (two measures)

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

export function Synopse() {
  return (
    <div className="ex ex--wide vt-synopse">
      <h3 className="ex__title">Muhammad ﷺ ↔ das Evangelium</h3>
      <p className="erwart__intro">{synopse.intro}</p>
      <SynopseTable
        headA={synopse.spalten[0]}
        headB={synopse.spalten[1]}
        rows={synopse.zeilen.map((z) => ({ a: z.h, b: z.j }))}
      />
      <p className="ex__pointe">{synopse.pointe}</p>
    </div>
  )
}

export function Zuwd() {
  return (
    <div className="ex ex--wide vt-zuwd">
      <h3 className="ex__title">Das Schlüsselwort: zûd (5. Mose 18,20)</h3>
      <p className="erwart__intro">{zuwd.intro}</p>
      <div className="vt-zuwd__word">
        <span className="vt-zuwd__he hebrew" dir="rtl" lang="he">
          {zuwd.wort.heb}
        </span>
        <span className="vt-zuwd__translit">{zuwd.wort.translit}</span>
        <span className="vt-zuwd__wurzel">{zuwd.wort.wurzel} · {zuwd.wort.strong}</span>
        <span className="vt-zuwd__bed">{zuwd.bedeutung}</span>
      </div>
      <ul className="vt-zuwd__list">
        {zuwd.punkte.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
      <p className="ex__pointe">{zuwd.pointe}</p>
    </div>
  )
}

export function Abrogationsliste() {
  return (
    <div className="ex ex--wide vt-abrog">
      <h3 className="ex__title">Aufhebung ist ein biblisches Prinzip</h3>
      <p className="erwart__intro">{abrogationsliste.intro}</p>
      <SynopseTable
        headA={abrogationsliste.spalten[0]}
        headB={abrogationsliste.spalten[1]}
        rows={abrogationsliste.zeilen.map((z) => ({ a: z.a, b: z.b }))}
      />
      <p className="ex__pointe">{abrogationsliste.pointe}</p>
    </div>
  )
}

export function PaulusDossier() {
  return (
    <div className="ex ex--wide vt-paulus">
      <h3 className="ex__title">Das Paulus-Dossier — drei faule Früchte</h3>
      <p className="erwart__intro">{paulusDossier.intro}</p>
      <div className="vt-paulus__row">
        {paulusDossier.fruechte.map((f) => (
          <div className="vt-paulus__card" key={f.n}>
            <span className="vt-paulus__n" aria-hidden>
              {f.n}
            </span>
            <span className="vt-paulus__titel">{f.titel}</span>
            <span className="vt-paulus__body">{f.body}</span>
          </div>
        ))}
      </div>
      <p className="ex__pointe">{paulusDossier.pointe}</p>
    </div>
  )
}

export function ProvBanner() {
  return (
    <div className="ex ex--wide vt-prov">
      <span className="vt-prov__vers">{prov2010.vers}</span>
      <span className="vt-prov__ref">{prov2010.ref}</span>
      <span className="vt-prov__unter">{prov2010.unterzeile}</span>
    </div>
  )
}
