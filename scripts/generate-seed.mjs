// Generates supabase/seed.sql from data/catalog.ts so the SQL seed always
// matches the bundled static-site data. Run: npx tsx scripts/generate-seed.mjs
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { collections, categories, products, SITE } from '../data/catalog';
import { productMetaTitle, productMetaDescription, productContent } from '../data/product-content';
import { reviews, gbpAggregate, GBP_URL } from '../data/reviews';
import { defaultSiteSettings } from '../data/site-settings';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const esc = (s) => String(s).replace(/'/g, "''");

const lines = [];
lines.push('-- Green Solar World Inc. — catalog seed (Phase 2)');
lines.push('-- Generated from data/*.ts — do not hand-edit.');
lines.push('-- Run schema.sql FIRST, then this file.');
lines.push('');
lines.push('truncate public.reviews, public.products, public.categories, public.collections, public.site_settings, public.homepage_sections restart identity cascade;');
lines.push('');

for (const c of collections) {
  lines.push(
    `insert into public.collections (slug, name, "shortName", tagline, description) values ('${c.slug}', '${esc(c.name)}', '${esc(c.shortName)}', '${esc(c.tagline)}', '${esc(c.description)}');`,
  );
}
lines.push('');
for (const c of categories) {
  lines.push(
    `insert into public.categories (slug, name, collection, description) values ('${c.slug}', '${esc(c.name)}', '${c.collection}', '${esc(c.description)}');`,
  );
}
lines.push('');
for (const p of products) {
  const specs = JSON.stringify(p.specs).replace(/'/g, "''");
  const content = productContent(p);
  const faqs = JSON.stringify(content.faqs).replace(/'/g, "''");
  const metaTitle = productMetaTitle(p).replace(/'/g, "''");
  const metaDesc = productMetaDescription(p).replace(/'/g, "''");
  const image = p.image ? `'${p.image.replace(/'/g, "''")}'` : 'null';
  lines.push(
    `insert into public.products (slug, sku, name, collection, category, price, "compareAt", featured, short, description, specs, stock, meta_title, meta_description, long_description, faqs, image_url) values ('${p.slug}', '${p.sku}', '${esc(p.name)}', '${p.collection}', '${p.category}', ${p.price}, ${p.compareAt ?? 'null'}, ${p.featured ?? false}, '${esc(p.short)}', '${esc(p.description)}', '${specs}'::jsonb, '${p.stock}', '${metaTitle}', '${metaDesc}', '${esc(content.intro)}', '${faqs}'::jsonb, ${image});`,
  );
}

// Reviews — real Google reviews (see data/reviews.ts note).
lines.push('');
lines.push(`-- Reviews (real Google reviews — keep synced with the GBP via the admin panel)`);
for (const r of reviews) {
  lines.push(
    `insert into public.reviews (author_name, rating, text, source, is_approved) values ('${esc(r.authorName)}', ${r.rating}, '${esc(r.text)}', '${r.source}', true);`,
  );
}

// Site settings defaults
lines.push('');
lines.push('-- Site settings defaults (admin edits via panel / SQL)');
for (const [key, value] of Object.entries(defaultSiteSettings)) {
  lines.push(`insert into public.site_settings (key, value) values ('${key}', '${JSON.stringify(value)}'::jsonb);`);
}

// Homepage sections (editable via admin → settings)
lines.push('');
lines.push('-- Homepage sections (editable via /admin/settings)');
lines.push(`insert into public.homepage_sections (section_key, title, subtitle, body, is_active, sort_order) values ('announcement', 'Counter Announcement', 'Shown in the header strip on the homepage', '{"text": "Mon\u2013Fri 8am\u20136pm \u00b7 Sat 8am\u20132pm \u00b7 Flat $30 shipping Canada-wide"}', true, 1);`);
lines.push(`insert into public.homepage_sections (section_key, title, subtitle, body, is_active, sort_order) values ('about_teaser', 'About Teaser', 'Short paragraph above the footer CTA on the homepage', '{"text": "GSW is an electrical and lighting distributor and wholesaler, offering a full line of high quality products along with dependable technical expertise and personalized customer service."}', true, 2);`);

lines.push('');
lines.push('-- GBP aggregate (reference): ' + gbpAggregate.rating + ' stars from ' + gbpAggregate.reviewCount + ' Google reviews');
lines.push('-- GBP listing: ' + GBP_URL);
lines.push('');
lines.push(`-- Site: ${SITE.name} | ${SITE.tagline}`);

writeFileSync(join(root, 'supabase', 'seed.sql'), lines.join('\n') + '\n', 'utf8');
console.log(`seed.sql written: ${collections.length} collections, ${categories.length} categories, ${products.length} products, ${reviews.length} reviews`);
