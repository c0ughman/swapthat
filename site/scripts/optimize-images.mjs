/**
 * Converts raster assets under public/ to WebP (replacing originals).
 * Path-based quality: small icons tighter; hero/brand photos higher.
 */
import sharp from "sharp";
import { readdir, stat, unlink } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

const SKIP = new Set(["favicon.ico", "vercel.svg", "next.svg", "globe.svg", "file.svg", ".DS_Store"]);

function qualityFor(relPath) {
  const lower = relPath.toLowerCase();
  if (lower.includes("icons/")) return 68;
  if (lower.includes("/stickers/")) return 82;
  if (lower.includes("logo") || lower.includes("av-logo")) return 92;
  if (lower.includes("/cartoons/")) return 88;
  if (lower.includes("/thumbnails/")) return 85;
  if (lower.includes("/instagram/")) return 82;
  if (lower.includes("/hero-scatter/")) return 84;
  if (lower.includes("/experience/")) return 88;
  if (lower.includes("/home/")) return 88;
  if (lower.includes("/philosophy/")) return 88;
  if (lower.endsWith("movement.jpg") || lower.includes("andreacoach")) return 88;
  if (lower.includes("360marketing")) return null;
  return 86;
}

async function convertFile(absIn, rel, q) {
  const out = absIn.replace(/\.(png|jpe?g)$/i, ".webp");
  await sharp(absIn).webp({ quality: q, effort: 5, smartSubsample: true }).toFile(out);
  await unlink(absIn);
  console.log(`ok  [q=${q}] ${rel} → ${path.basename(out)}`);
}

async function walk(currentAbs, relFromPublic) {
  const entries = await readdir(currentAbs, { withFileTypes: true });
  for (const e of entries) {
    const name = e.name;
    if (SKIP.has(name)) continue;
    const abs = path.join(currentAbs, name);
    const rel = relFromPublic ? `${relFromPublic}/${name}` : name;

    if (e.isDirectory()) {
      await walk(abs, rel);
      continue;
    }

    if (!/\.(png|jpe?g|jpeg)$/i.test(name)) continue;

    const q = qualityFor(rel);
    if (q === null) continue;

    const st = await stat(abs);
    if (!st.isFile()) continue;

    await convertFile(abs, rel, q);
  }
}

await walk(publicDir, "");
console.log("Done. Update imports to .webp where converted.");
