/**
 * Re-encode custom marketing / page icons (public/icons/*.webp) for smaller files.
 * Icons are shown at modest CSS sizes — cap longest edge and use stronger WebP compression.
 */
import sharp from "sharp";
import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(__dirname, "..", "public", "icons");

const MAX_LONG_SIDE_LARGE = 520;
const MAX_LONG_SIDE_SIMPLE = 360;
const QUALITY = 68;
const EFFORT = 6;

async function recompress(filename) {
  const abs = path.join(iconsDir, filename);
  const input = await readFile(abs);
  const before = input.length;
  const meta = await sharp(input).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  const isSimple = filename.startsWith("simple-");
  const maxSide = isSimple ? MAX_LONG_SIDE_SIMPLE : MAX_LONG_SIDE_LARGE;

  let pipeline = sharp(input);
  if (w > maxSide || h > maxSide) {
    pipeline = pipeline.resize({
      width: w >= h ? maxSide : undefined,
      height: h > w ? maxSide : undefined,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  const outBuf = await pipeline
    .webp({ quality: QUALITY, effort: EFFORT, smartSubsample: true, alphaQuality: 85 })
    .toBuffer();

  await writeFile(abs, outBuf);
  console.log(
    `${filename}: ${(before / 1024).toFixed(1)}KB → ${(outBuf.length / 1024).toFixed(1)}KB (src ${meta.width}×${meta.height})`
  );
  return { before, after: outBuf.length };
}

const files = (await readdir(iconsDir)).filter((f) => f.endsWith(".webp")).sort();
if (files.length === 0) {
  console.error("No .webp files in public/icons");
  process.exit(1);
}

let totalBefore = 0;
let totalAfter = 0;
for (const f of files) {
  const r = await recompress(f);
  totalBefore += r.before;
  totalAfter += r.after;
}

console.log(
  `\nicons/: ${(totalBefore / 1024).toFixed(1)}KB → ${(totalAfter / 1024).toFixed(1)}KB (${((1 - totalAfter / totalBefore) * 100).toFixed(1)}% smaller)`
);
