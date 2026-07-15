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

export default function BrandLockup({
  fill,
  flipped = false,
  iconClassName = "h-[2.1rem] w-[2.1rem]",
  textClassName = "text-[1.05rem]",
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
  const icon = <BrandIcon fill={fill} className={iconClassName} />;
  const word = (
    <span
      className={`font-brand uppercase leading-none tracking-[0.08em] whitespace-nowrap ${textClassName}`}
      style={{ color: fill, fontWeight: 600 }}
    >
      Muévete con Andrea
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
