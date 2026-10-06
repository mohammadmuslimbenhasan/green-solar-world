// Harvest #2: enumerate ALL products + media via WP REST API, download everything.
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const BASE = 'http://gsworld.ca';
const OUT = path.resolve(process.cwd(), 'public/images');

async function j(url) {
  const r = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
}
async function dl(url, dest) {
  const file = path.join(OUT, dest);
  await mkdir(path.dirname(file), { recursive: true });
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(40000) });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const buf = Buffer.from(await r.arrayBuffer());
    if (buf.length < 400) throw new Error('too small');
    await writeFile(file, buf);
    return true;
  } catch (e) {
    console.log(`FAIL ${dest}: ${e.message}`);
    return false;
  }
}
const clean = s => s.replace(/[^\w.-]+/g, '-').toLowerCase();

const media = await j(`${BASE}/wp-json/wp/v2/media?per_page=100`);
const mediaById = new Map(media.map(m => [m.id, m.source_url]));
console.log(`${media.length} media items`);

let products = [];
try { products = await j(`${BASE}/wp-json/wp/v2/product?per_page=100`); } catch (e) { console.log('product endpoint:', e.message); }
console.log(`${products.length} products via API`);

const manifest = { products: {}, extras: [] };

for (const p of products) {
  const img = mediaById.get(p.featured_media);
  const title = (p.title?.rendered || p.slug).replace(/<[^>]+>/g, '');
  if (!img) { console.log(`${p.slug}: no featured image`); continue; }
  const ext = path.extname(img).split('?')[0] || '.jpg';
  const dest = `products/${clean(p.slug)}${ext}`;
  if (await dl(img, dest)) {
    manifest.products[p.slug] = { image: dest, title };
    console.log(`product ${p.slug} -> ${dest}`);
  }
}

// download every other image (skip pdf + placeholder) into extras/
const SKIP = /placeholder|\.pdf$/i;
for (const m of media) {
  if (SKIP.test(m.source_url)) continue;
  const ext = path.extname(m.source_url).split('?')[0] || '.jpg';
  const dest = `extras/${clean(m.slug)}${ext}`;
  if (Object.values(manifest.products).some(v => v.image === `products/${clean(m.slug)}${ext}`)) continue;
  if (await dl(m.source_url, dest)) manifest.extras.push({ slug: m.slug, file: dest });
}
console.log(`${manifest.extras.length} extra images`);

await writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('manifest written');
