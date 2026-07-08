// Eigens gezeichnete, respektvoll-schlichte Kaaba-Ikonografie — kein
// Fremdbild, zwei Größen für die Kompass-Plakette und die Richtungs-Karte.

export function KaabaBadge() {
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden>
      <rect x="7" y="12" width="26" height="22" rx="1.5" fill="#1b1b1f" />
      <rect x="7" y="17" width="26" height="5.5" fill="#c2a055" />
      <rect x="17" y="24" width="6" height="10" rx="0.5" fill="#2a2a30" />
      <path d="M7 12 13 6h14l6 6Z" fill="#111114" />
    </svg>
  )
}

export function KaabaIllustration() {
  return (
    <svg width="96" height="76" viewBox="0 0 120 96" aria-hidden>
      <ellipse cx="60" cy="86" rx="46" ry="7" fill="rgba(28,78,126,0.08)" />
      {/* umlaufende Säulenreihe */}
      {Array.from({ length: 11 }).map((_, i) => (
        <rect key={i} x={10 + i * 9.4} y="58" width="5" height="20" rx="1" fill="#e7ddc4" />
      ))}
      <rect x="6" y="52" width="108" height="8" rx="2" fill="#d8cba3" />
      {/* Kaaba-Kubus */}
      <rect x="34" y="16" width="52" height="46" rx="2" fill="#1b1b1f" />
      <rect x="34" y="27" width="52" height="10" fill="#c2a055" />
      <rect x="55" y="42" width="10" height="20" rx="1" fill="#2a2a30" />
      <path d="M34 16 44 6h32l10 10Z" fill="#111114" />
      {/* Mond-Akzent oben rechts */}
      <path
        d="M100 18a9 9 0 1 0 8 13 7 7 0 0 1-8-13Z"
        fill="rgba(194,160,85,0.55)"
      />
    </svg>
  )
}
