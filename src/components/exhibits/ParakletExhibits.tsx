import { zweiWoerter, merkmale, abfolge } from '../../data/seals/paraklet'

// Three exhibits for Siegel VI — name, description, timing:
//  · the two Greek words paráklētos ≈ períklytos = Aḥmad (reuses .baca bridge)
//  · the traits of the Paraclete — Spirit or coming messenger?
//  · the sequence: the Spirit was already present vs. the Paraclete comes after

export function ZweiWoerter() {
  return (
    <div className="ex ex--wide baca">
      <h3 className="ex__title">παράκλητος ≈ περικλυτός</h3>
      <p className="erwart__intro">{zweiWoerter.intro}</p>

      <div className="baca__pair">
        <div className="baca__card">
          <span className="baca__titel">{zweiWoerter.links.titel}</span>
          <span className="baca__wort" lang="el">
            {zweiWoerter.links.wort}
          </span>
          <span className="baca__trans">{zweiWoerter.links.trans}</span>
          <span className="baca__sinn">{zweiWoerter.links.sinn}</span>
        </div>

        <div className="baca__bridge" aria-hidden>
          <span className="baca__eq">≈</span>
        </div>

        <div className="baca__card baca__card--ar">
          <span className="baca__titel">{zweiWoerter.rechts.titel}</span>
          <span className="baca__wort" lang="el">
            {zweiWoerter.rechts.wort}
          </span>
          <span className="baca__trans">{zweiWoerter.rechts.trans}</span>
          <span className="baca__sinn">
            {zweiWoerter.rechts.sinn} ={' '}
            <span className="arabic" dir="rtl" lang="ar">
              أحمد
            </span>
          </span>
        </div>
      </div>

      <ul className="baca__parallelen">
        {zweiWoerter.parallelen.map((p) => (
          <li key={p.merkmal}>
            <span className="baca__merkmal">{p.merkmal}</span>
            <span className="baca__text">{p.text}</span>
          </li>
        ))}
      </ul>

      <p className="ex__pointe">{zweiWoerter.pointe}</p>
    </div>
  )
}

export function Merkmale() {
  return (
    <div className="ex ex--wide merkmale">
      <h3 className="ex__title">Geist oder Gesandter?</h3>
      <p className="erwart__intro">{merkmale.intro}</p>

      <ul className="merkmale__list">
        {merkmale.zeilen.map((z) => (
          <li className="merkmal" key={z.merkmal}>
            <span className="merkmal__kopf">
              <span className="merkmal__h">{z.merkmal}</span>
              <span className="merkmal__ref">{z.ref}</span>
            </span>
            <span className="merkmal__sinn">{z.sinn}</span>
          </li>
        ))}
      </ul>

      <p className="merkmale__caveat">
        <span className="merkmale__caveat-tag" aria-hidden>
          ⚠
        </span>
        {merkmale.caveat}
      </p>
      <p className="ex__pointe">{merkmale.pointe}</p>
    </div>
  )
}

export function Abfolge() {
  return (
    <div className="ex ex--wide abfolge">
      <h3 className="ex__title">Die Abfolge</h3>
      <p className="erwart__intro">{abfolge.intro}</p>

      <div className="abfolge__geist">
        <span className="abfolge__label">{abfolge.geist.label}</span>
        <div className="abfolge__track">
          {abfolge.geist.nodes.map((n, i) => (
            <div className="abfolge__node" key={n.ref}>
              <span className="abfolge__dot" aria-hidden>
                {i + 1}
              </span>
              <span className="abfolge__e">{n.e}</span>
              <span className="abfolge__ref">{n.ref}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="abfolge__aber" aria-hidden>
        <span>aber</span>
      </div>

      <div className="abfolge__paraklet">
        <span className="abfolge__label abfolge__label--hl">{abfolge.paraklet.label}</span>
        <p className="abfolge__quote">{abfolge.paraklet.text}</p>
        <span className="abfolge__ref">{abfolge.paraklet.ref}</span>
      </div>

      <p className="ex__pointe">{abfolge.pointe}</p>
    </div>
  )
}
