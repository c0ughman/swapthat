type FiveStarsProps = {
  className?: string;
  /**
   * `section` — 22px gold row, full width, for labels like “Filosofía” / “Más que fitness”.
   * `card` — compact, for review cards (matches contacto/marketing).
   */
  variant?: "section" | "card";
};

/**
 * Star row used under section eyebrows and on testimonial cards.
 */
export function FiveStars({ className = "", variant = "card" }: FiveStarsProps) {
  if (variant === "section") {
    return (
      <div
        className={`mb-2 flex w-full items-center justify-start gap-0.5 p-0 m-0 ${className}`.trim()}
        aria-hidden
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            width="22"
            height="22"
            viewBox="0 0 24 24"
            className="shrink-0"
            fill="#FBBF24"
            aria-hidden
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-0.5 ${className}`.trim()}
      aria-label="5 de 5 estrellas"
      role="img"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="h-4 w-4 shrink-0 text-amber-400"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}
