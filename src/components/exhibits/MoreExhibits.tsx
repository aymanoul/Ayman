import { pelachRows, pelachPointe, hmdBridge, konstantinMarks } from '../../data/seals/daniel'

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
