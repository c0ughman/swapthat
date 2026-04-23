import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required by @netlify/plugin-nextjs: verification expects .next/standalone to exist.
  output: "standalone",
  async redirects() {
    return [{ source: "/teams", destination: "/", permanent: true }];
  },
  images: {
    /**
     * Next 16+ requires `localPatterns` for all local `next/image` src. One catch‑all for `public/`
     * (logos, icons, `/cartoons/3d/*` + `?v=` cache-bust, etc.); omit `search` so queries are allowed.
     */
    localPatterns: [{ pathname: "/**" }],
    formats: ["image/avif", "image/webp"],
    /** Tuned for icons (small display) → hero assets; used via `quality` on `<Image />` */
    qualities: [75, 78, 80, 85, 88, 90, 92, 95],
    /** Cache optimised images for 1 year on the CDN / Netlify edge. Default is 60 s which
     *  forces a revalidation on every request. 31 536 000 = 365 days. */
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: "https", hostname: "**.cdninstagram.com", pathname: "/**" },
      { protocol: "https", hostname: "**.fbcdn.net", pathname: "/**" },
    ],
  },
};

export default nextConfig;
