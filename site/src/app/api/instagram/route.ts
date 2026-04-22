import { NextResponse } from "next/server";
import { InstagramScraper } from "@aduptive/instagram-scraper";

/** Revalidate cached response every hour */
export const revalidate = 3600;

const INSTAGRAM_USERNAME = "andreavpty";

/** Fetch via official Graph API when token is present */
async function fetchViaGraphAPI(token: string) {
  const res = await fetch(
    `https://graph.instagram.com/me/media?fields=id,media_url,media_type,permalink&limit=12&access_token=${token}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) return null;

  const data = (await res.json()) as {
    data?: { id: string; media_url: string; media_type: string; permalink: string }[];
  };

  const media = data.data ?? [];
  const images: { url: string; permalink: string }[] = [];

  for (const m of media) {
    if (images.length >= 4) break;
    if (m.media_type === "IMAGE") {
      images.push({ url: m.media_url, permalink: m.permalink });
    } else if (m.media_type === "CAROUSEL_ALBUM") {
      const carouselRes = await fetch(
        `https://graph.instagram.com/${m.id}/children?fields=media_url,media_type&access_token=${token}`,
        { next: { revalidate: 3600 } }
      );
      if (carouselRes.ok) {
        const carousel = (await carouselRes.json()) as {
          data?: { media_url: string; media_type: string }[];
        };
        const firstImg = carousel.data?.find((c) => c.media_type === "IMAGE");
        if (firstImg) {
          images.push({ url: firstImg.media_url, permalink: m.permalink });
        }
      }
    }
  }

  return images.length >= 4 ? images : null;
}

/** Fetch via scraper (no token required) for public profiles */
async function fetchViaScraper() {
  const scraper = new InstagramScraper({
    maxRetries: 2,
    minDelay: 1500,
    maxDelay: 3000,
    timeout: 15000,
  });

  const result = await scraper.getPosts(INSTAGRAM_USERNAME, 12);

  if (!result.success || !result.posts) return null;

  const images: { url: string; permalink: string }[] = [];

  for (const post of result.posts) {
    if (images.length >= 4) break;
    if (post.is_video) continue;

    const url = post.display_url ?? post.media_items?.[0]?.url;
    if (url) {
      images.push({
        url,
        permalink: `https://www.instagram.com/p/${post.shortcode}/`,
      });
    }
  }

  return images.length >= 4 ? images : null;
}

/** Fetch latest image posts — tries Graph API first if token set, else scraper */
export async function GET() {
  try {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    let images: { url: string; permalink: string }[] | null = null;

    if (token) {
      images = await fetchViaGraphAPI(token);
    }

    if (!images || images.length < 4) {
      images = await fetchViaScraper();
    }

    return NextResponse.json({
      images: images && images.length >= 4 ? images.slice(0, 4) : [],
    });
  } catch (e) {
    console.error("[Instagram API]", e);
    return NextResponse.json(
      { error: "Failed to fetch Instagram" },
      { status: 500 }
    );
  }
}
