/**
 * Bump `CARTOONS_3D_V` whenever files in `public/cartoons/3d/` are replaced in place
 * so the Next.js image optimizer fetches fresh pixels instead of stale cache.
 */
export const CARTOONS_3D_V = "20250422b";

export function cartoon3dPath(filename: string) {
  return `/cartoons/3d/${filename}?v=${CARTOONS_3D_V}`;
}
