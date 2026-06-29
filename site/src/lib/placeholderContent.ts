/**
 * Global toggle for unfinished / placeholder content.
 *
 * Several sections currently ship invented copy or empty image slots because the
 * real assets (testimonials, result screenshots, before/after photos, etc.) don't
 * exist yet. Flip this to `false` to preview a "ship-tomorrow-without-assets"
 * version of the site — every placeholder block gated on this flag disappears,
 * and the surrounding layout closes up gracefully.
 *
 * Set back to `true` once the real content is in (or while editing the
 * placeholders themselves).
 */
export const SHOW_PLACEHOLDER_CONTENT = false;
