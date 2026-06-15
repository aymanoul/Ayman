import karteImg from '../../assets/karte.png'

// The divided Rome — the statue's two iron legs (West & East Rome, split at
// 395), and Arabia (the stone) striking Constantinople in 1453.
export default function MapExhibit() {
  return (
    <figure className="map">
      <img
        className="map__img"
        src={karteImg}
        alt="Schematische Karte: das geteilte Rom — Westrom und Ostrom, getrennt 395 n. Chr.; Arabien (der Stein) trifft Konstantinopel 1453"
        loading="lazy"
      />
      <figcaption className="map__cap">
        Das vierte Reich, geteilt in Ost und West — und der Stein, der das Eisen trifft.
      </figcaption>
    </figure>
  )
}
