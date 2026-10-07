// Batch-convert public/images/**.jpg|jpeg|png to .webp, resize down to per-dir
// caps, delete originals, and write scripts/image-map.json mapping old site
// paths to { new, width, height }. Run: node scripts/optimize-images.mjs
import { readdirSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMAGES_DIR = path.join(root, 'public', 'images');
const EXCLUDE_BASENAMES = new Set(['logo.jpg', 'logo-mark.png', 'logo-full.png']);
const MIN_BYTES = 8 * 1024; // < 8 KB gains nothing
const QUALITY = 82;

function maxWidthFor(rel) {
  const dir = rel.split(path.sep)[0];
  switch (dir) {
    case 'hero': return 1600;
    case 'products': return 1200;
    case 'brands': return 480;
    case 'extras': return 1200;
    default: return 1200;
  }
}

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const map = {};
let converted = 0, skipped = 0, bytesBefore = 0, bytesAfter = 0;
const skippedList = [];

for (const full of walk(IMAGES_DIR)) {
  const ext = path.extname(full).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) { skipped++; continue; }
  const base = path.basename(full);
  if (EXCLUDE_BASENAMES.has(base)) { skipped++; skippedList.push(base + ' (excluded name)'); continue; }
  const size = statSync(full).size;
  if (size < MIN_BYTES) { skipped++; skippedList.push(base + ' (<8KB)'); continue; }

  const rel = path.relative(IMAGES_DIR, full); // e.g. extras\foo.jpg
  const relPosix = rel.split(path.sep).join('/');
  const outRel = relPosix.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const outFull = path.join(IMAGES_DIR, outRel);
  const maxW = maxWidthFor(rel);

  const img = sharp(full);
  const meta = await img.metadata();
  const targetW = Math.min(meta.width, maxW);
  const buf = await img
    .resize({ width: targetW, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toBuffer();
  const outMeta = await sharp(buf).metadata();

  writeFileSync(outFull, buf);
  unlinkSync(full);

  const oldSitePath = '/images/' + relPosix;
  map[oldSitePath] = {
    new: '/images/' + outRel,
    width: outMeta.width,
    height: outMeta.height,
  };
  converted++;
  bytesBefore += size;
  bytesAfter += buf.length;
  console.log(`${relPosix} -> ${outRel}  ${meta.width}x${meta.height} -> ${outMeta.width}x${outMeta.height}  ${size} -> ${buf.length} B`);
}

writeFileSync(
  path.join(root, 'scripts', 'image-map.json'),
  JSON.stringify(map, null, 2) + '\n',
  'utf8',
);

console.log('\n--- summary ---');
console.log(`converted: ${converted}`);
console.log(`skipped:   ${skipped}`);
console.log(`bytes before: ${bytesBefore} (${(bytesBefore / 1024).toFixed(1)} KiB)`);
console.log(`bytes after:  ${bytesAfter} (${(bytesAfter / 1024).toFixed(1)} KiB)`);
console.log(`saved:        ${bytesBefore - bytesAfter} (${((bytesBefore - bytesAfter) / 1024).toFixed(1)} KiB)`);
console.log('skipped files:', skippedList.join(', ') || '(none)');
