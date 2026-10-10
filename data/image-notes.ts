// Image audit notes (Phase 4) — every mapping decision below was made after
// visually inspecting the file with ReadMediaFile. Do not map blind.
//
// ─── VERIFIED PRODUCT PHOTOS (clean product shots) ──────────────────────────
// products/test.jpg                     square surface-mount LED panel (white bg)
// products/shahab.jpg                   round slim LED panel w/ spring clips (== extras/8-inch-slim.jpg)
// products/jc-10w-a.png                 LED corn lamp, mogul base (== extras/c2.png)
// products/100w-120w-traditional-led-wallpack.jpg   traditional full-cutoff wallpack
// products/asymmetric-flood-lights.jpg  stadium asymmetric flood light, black bg (== extras/lsixth.jpg)
// products/led-flood-parking-lot-street-light.jpg   modular shoebox/street light, white bg
// extras/8-inch-slim.jpg                round slim panel (dup of shahab)
// extras/3pro.png|3pro-2.png            round surface-mount disk light, gray trim
// extras/4pro.png                       4 round chrome-trim flush mounts, lineup
// extras/5pro.png|5pro-2.png            exploded slim-panel trim kit (ring/backplate/diffuser)
// extras/l2.jpg                         2x2 LED flat panel w/ cULus badge + driver
// extras/wall-pack.jpg                  wallpack (dup of products/100w-120w…)
// extras/lsixth.jpg                     asymmetric flood (dup)
// extras/c2.png                         corn lamp (dup of jc-10w-a.png)
// extras/bulb7.jpg                      GU10/MR16 LED bulb with dimension diagram
// extras/h2.jpg                         new-construction pot-light housing (bar hangers + J-box)
// extras/h5.jpg                         recessed can housing close-up
// extras/4-inch-mounting-plate.jpg      galvanized mounting plate / plaster frame
// extras/led-step-light-1.jpg           black rectangular LED step light, glowing slot
// extras/untitled-1.jpg                 LINEAR LED high bay (black, eye-hook mount)
// extras/1.jpg                          pair of suspended linear LED pendants (black/white)
// extras/2.jpg                          round flush-mount fixture in a room
// extras/4.jpg                          linear surface/pendant LED in wardrobe hallway
// extras/wkiaivjqmycfsa2taaemtkibiwe630.jpg   T5 integrated LED battens (pair, white bg)
// extras/wkiaivjqw9atsnquaahw9r9fqti541.jpg   T8 LED tubes (pair, white bg)
// extras/strip-1.png                    LED strip collage (5000K/2700K/RGB), black bg
// extras/led-parking-lot-lights-led-shoe-box-lamp.jpg|-2.jpg   shoebox area light (identical pair)
// extras/screenshot_2-1.png             UFO high bay product shot (200W GKL-4 / 150W GKL-3)
// extras/puck-lights.jpg                kitchen interior w/ under-cabinet lighting (lifestyle)
// extras/electri.jpg                    wiring devices collage (receptacles/switches/plugs) + copper wire
//
// ─── VERIFIED LIFESTYLE / INTERIOR ──────────────────────────────────────────
// extras/photo-1497366754035…jpeg == hero/office-1.jpg   modern office glass corridor
// extras/photo-1530545233050…jpeg == hero/office-2.jpg   white USB decor receptacle w/ phone (a DEVICE photo)
// extras/resturant.png                  restaurant interior w/ amber drum pendants
// extras/1-2.jpg                        factory/warehouse interior w/ high-bay rows
// extras/2-1.jpg                        garden path lights at dusk (lifestyle)
// extras/2-2.jpg                        kitchen w/ pendant lights
// extras/3-2.jpg                        living room w/ RGB cove strip lighting
// extras/3-3.jpg                        modern kitchen w/ under-cabinet LED strip
//
// ─── VERIFIED BRAND LOGOS ───────────────────────────────────────────────────
// brands/etlin.png ETLIN-DANIELS · brands/texcan.png TEXCAN · brands/vista.png VISTA
// brands/nsi.png NSI INDUSTRIES · brands/nesco.png NESCO · brands/banvil.png BANVIL 2000
// brands/fnl.png EVERBRIGHT · brands/brand-1.png PAULIN · brands/brand-2.png VOLT6 (black bg)
// extras/liteline_logo_horizontal.gif LITELINE · extras/logo-temp.png RENO LED
// extras/logo_en.png ETL certification mark (white) · extras/logo-1.png == brand-1 (Paulin)
// extras/logo-2.png == brand-2 (VOLT6) · extras/logo-fnl.png == fnl (Everbright)
// extras/screenshot-2019-07-19…png      Southwire Tools & Equipment logo (black bg)
//
// ─── INSPECTED AND REJECTED (not honest product photos) ─────────────────────
// extras/label.jpg                      certification badge banner (NOM/UL/TÜV/CB)
// extras/screenshot_3-1.png, screenshot_4.png   DLC/UL/LM79 certification badges
// extras/4-inch-par-20-line-voltage-ic.png      Jenco spec SHEET
// extras/acrylic-white-lens-step-light-photocell-mini.png   Jenco spec SHEET
// extras/flush-mount.png, flush-mount-ceiling-light-brochure…png   brochure/catalog sheets
// extras/wkiaivjjixpkthfwaabrpywb_je576.png     T5 dimension line-drawing
// extras/wkiaivjqowbbwj1vaaogkclnjng531.jpg     T5 annotated marketing callouts (busy)
// extras/wkiaivjril6szn7paaynspzi7ig444.jpg     T8 application ad collage (busy)
// extras/wkiaivjrinasj-ppaapefrwc_n4406.jpg     T8 annotated callouts (busy)
// extras/wkiaivjrisamsnl_aan0m82brpw778.jpg     T8 wiring diagram
// extras/wkiaivju86vw_gahaalbzp_8yck611.jpg     photometric distribution charts
// extras/wkiaivjuzsv4blkpaaivgogo4o4784.jpg     photometric polar chart
// extras/3.jpg                          exact dup of products/test.jpg
// hero/office-2.jpg                     dup of extras/photo-1530545233050…

import type { CategorySlug } from '@/data/catalog';

/** Extra "views" for the product-page gallery: same-category photos, all verified above. */
export const CATEGORY_IMAGE_POOL: Partial<Record<CategorySlug, string[]>> = {
  'led-slim-panel': [
    '/images/products/shahab.webp',
    '/images/extras/3pro-2.webp',
    '/images/extras/5pro.webp',
  ],
  'led-gimbals': ['/images/extras/h5.webp', '/images/extras/4-inch-mounting-plate.jpg'],
  'led-ceiling-fixture': ['/images/extras/2.webp'],
  'led-under-cabinet-light': ['/images/extras/3-3.webp'],
  'led-strip-light': ['/images/extras/3-2.webp'],
  'led-outdoor-garden-light': ['/images/extras/led-step-light-1.webp'],
  'led-flat-panel': ['/images/products/test.jpg'],
  'led-wall-pack': ['/images/products/100w-120w-traditional-led-wallpack.webp'],
  'led-flood-light': [
    '/images/extras/lsixth.webp',
    '/images/products/led-flood-parking-lot-street-light.webp',
  ],
  'led-retrofit-corn-light': ['/images/products/jc-10w-a.webp', '/images/extras/bulb7.jpg'],
  'led-recessed-down-light': ['/images/extras/h2.jpg'],
  'led-outdoor-shoebox-light': [
    '/images/extras/led-parking-lot-lights-led-shoe-box-lamp-2.webp',
    '/images/products/led-flood-parking-lot-street-light.webp',
  ],
  'led-post-top-light': ['/images/extras/led-parking-lot-lights-led-shoe-box-lamp.webp'],
  'led-linear-strip-fixture': [
    '/images/extras/wkiaivjqw9atsnquaahw9r9fqti541.webp',
    '/images/extras/1.webp',
    '/images/extras/4.jpg',
  ],
  'led-ufo-high-bay': [],
  'led-linear-high-bay': ['/images/extras/1.webp'],
  'led-linear-strip-light': ['/images/extras/wkiaivjqmycfsa2taaemtkibiwe630.webp'],
  'device-box': ['/images/extras/4-inch-mounting-plate.jpg'],
  wire: ['/images/extras/electri.webp'],
  device: ['/images/hero/office-2.webp', '/images/extras/electri.webp'],
};

/**
 * Manufacturer brands Green Solar World Inc. distributes — rendered as a
 * linked logo marquee on the homepage. Logos are the brands' own favicons /
 * supplied marks; each links to the manufacturer's official site.
 */
export const BRAND_LOGOS: { src: string; name: string; href: string }[] = [
  { src: '/images/brands/dals.webp', name: 'Dals Lighting', href: 'https://dals.com' },
  { src: '/images/extras/logo-temp.webp', name: 'Reno Lighting', href: 'https://www.ca.renolighting.com/' },
  { src: '/images/brands/hi-bright.webp', name: 'Hi-Bright', href: 'https://hi-bright.ca/' },
  { src: '/images/brands/etlin.webp', name: 'Etlin Daniels', href: 'https://etlin-daniels.com/' },
  { src: '/images/brands/in-lite.webp', name: 'in-lite', href: 'https://in-lite.com/en-CA' },
  { src: '/images/brands/ortech.webp', name: 'Ortech Industries', href: 'https://ortechindustries.ca/' },
  { src: '/images/brands/canolight.webp', name: 'Canolight', href: 'https://www.canolight.ca/' },
  { src: '/images/brands/votatec.webp', name: 'Votatec', href: 'https://votatec.ca/' },
  { src: '/images/brands/danfoss.webp', name: 'Danfoss', href: 'https://www.danfoss.com/' },
  { src: '/images/brands/aifittings.webp', name: 'A.I. Fittings', href: 'https://www.aifittings.com/' },
  { src: '/images/brands/nesco.png', name: 'Nesco Canada', href: 'https://www.nescocanada.com/' },
  { src: '/images/brands/rack-a-tiers.webp', name: 'Rack-A-Tiers', href: 'https://rack-a-tiers.ca/' },
  { src: '/images/brands/dawnray.webp', name: 'DawnRay', href: 'https://dawnray.space/' },
  { src: '/images/brands/greenlite.webp', name: 'Greenlite', href: 'https://www.greenlite.com/' },
];
