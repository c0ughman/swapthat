/**
 * Brand lockup — sun icon + "Muévete con Andrea" wordmark.
 *
 * The icon is a single alpha PNG tinted via CSS mask + background-color, so any
 * palette color works from one asset. Explicit width (not just aspect-ratio) —
 * mobile Safari collapses a masked span to 0px when width is derived from height.
 */

const MASK_STYLE = {
  WebkitMaskImage: "url(/logo-muevete.png)",
  maskImage: "url(/logo-muevete.png)",
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
} as const;

/** Icon is 1564×1600 — very nearly square, so a 1:1 box is safe. */
export function BrandIcon({
  fill,
  className = "",
}: {
  /** Any CSS color — pass a palette var like `var(--amarillo)`. */
  fill: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`block shrink-0 aspect-square ${className}`}
      style={{ backgroundColor: fill, ...MASK_STYLE }}
    />
  );
}

/**
 * Stacked lockup — three lines, centred: the sun icon, then "Muévete con",
 * then "Andrea". Everything is sized in `em` off the wordmark, so passing a
 * different `textClassName` scales the whole mark proportionally.
 * Used where a single line would be too wide (footer, philosophy orbits).
 */
export function BrandLockupStacked({
  fill,
  className = "",
  textClassName = "text-[2rem] md:text-[2.5rem]",
}: {
  fill: string;
  className?: string;
  textClassName?: string;
}) {
  return (
    <div
      className={`font-brand flex flex-col items-center leading-[1.05] tracking-[0.02em] ${textClassName} ${className}`}
      style={{ color: fill }}
    >
      {/* Icon leads on its own line, sized a touch above the cap-height so it
          anchors the mark rather than reading as punctuation. */}
      <BrandIcon fill={fill} className="mb-[0.18em] h-[1.15em] w-[1.15em]" />
      <p>
        Muévete con
        <br />
        Andrea
      </p>
    </div>
  );
}

export default function BrandLockup({
  fill,
  flipped = false,
  /** `em`-based so the icon always matches the wordmark's height exactly. */
  iconClassName = "h-[1em] w-[1em]",
  textClassName = "text-[1.4375rem]",
  className = "",
}: {
  /** Any CSS color — tints the icon and the wordmark together. */
  fill: string;
  /** Footer variant: wordmark first, icon trailing (reads as a period). */
  flipped?: boolean;
  iconClassName?: string;
  textClassName?: string;
  className?: string;
}) {
  const word = (
    <span
      className={`font-brand leading-none tracking-[0.04em] whitespace-nowrap ${textClassName}`}
      style={{ color: fill }}
    >
      Muévete con Andrea
    </span>
  );
  // Icon sits inside a wrapper carrying the wordmark's font-size, so `1em`
  // resolves against the text — keeping both exactly the same height.
  const icon = (
    <span className={`inline-flex ${textClassName}`}>
      <BrandIcon fill={fill} className={iconClassName} />
    </span>
  );

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {flipped ? (
        <>
          {word}
          {icon}
        </>
      ) : (
        <>
          {icon}
          {word}
        </>
      )}
    </span>
  );
}
