import { Watermark } from "./Logo";

/**
 * Foto oder neutraler Platzhalter (Stone-Fläche mit dezenter Kalligrafie).
 * Solange `src` fehlt, steht sichtbar "TODO: echtes Foto" im Bild. Keine Stock- oder KI-Bilder.
 */
export function Photo({
  src,
  alt = "",
  todo,
  className = "",
  chip = true,
  chipText,
}: {
  src?: string;
  alt?: string;
  todo: string; // Beschreibung, was hier hin soll
  className?: string;
  chip?: boolean;
  chipText?: string;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={`h-full w-full object-cover ${className}`} loading="lazy" />;
  }
  return (
    <div className={`relative h-full w-full overflow-hidden bg-stone ${className}`} role="img" aria-label={`Platzhalter: ${todo}`}>
      <Watermark tone="navy" opacity={0.06} className="left-1/2 top-1/2 w-[70%] max-w-[28rem] -translate-x-1/2 -translate-y-1/2" />
      {chip ? (
        <span className="absolute bottom-3 left-3 rounded-sm bg-white/90 px-3 py-1.5 text-[0.7rem] font-semibold leading-tight text-gold-ink">
          {chipText ?? `TODO: echtes Foto – ${todo}`}
        </span>
      ) : null}
    </div>
  );
}
