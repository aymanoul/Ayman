// Fotos der Moschee. Weitere Fotos hier eintragen und im Code über <Photo {...photos.name} /> einsetzen.
// Es werden nur echte Fotos der Gemeinde verwendet, keine Stock- oder KI-Bilder.
export const photos = {
  gebetsraum: {
    src: "/images/gebetsraum-1280.webp",
    srcSet: "/images/gebetsraum-640.webp 640w, /images/gebetsraum-960.webp 960w, /images/gebetsraum-1280.webp 1280w, /images/gebetsraum-1920.webp 1920w",
    width: 1920,
    height: 1081,
    alt: "Gebetsraum der Masjid As-Sunnah: eine helle Gebetsnische mit blauem Gebetsteppich davor, links ein Tisch mit Mikrofon, rechts ein Aufsteller zum Projekt Neubau.",
  },
} as const;
