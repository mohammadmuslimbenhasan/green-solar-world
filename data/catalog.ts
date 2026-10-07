// Green Solar World — full catalog seed data.
// This file is the single source of truth for the static site and mirrors
// supabase/seed.sql. lib/data.ts falls back to this when Supabase is not configured.

export type CollectionSlug =
  | 'residential-lighting'
  | 'commercial-lighting'
  | 'industrial-lighting'
  | 'electrical-materials';

export type CategorySlug =
  // residential
  | 'led-slim-panel'
  | 'led-gimbals'
  | 'led-ceiling-fixture'
  | 'led-motion-sensor-light'
  | 'led-under-cabinet-light'
  | 'led-strip-light'
  | 'led-outdoor-garden-light'
  // commercial
  | 'led-flat-panel'
  | 'led-wall-pack'
  | 'led-flood-light'
  | 'led-retrofit-corn-light'
  | 'led-recessed-down-light'
  | 'led-slim-canopy-light'
  | 'led-outdoor-shoebox-light'
  | 'led-post-top-light'
  | 'led-linear-strip-fixture'
  | 'led-vapor-tight-fixture'
  | 'led-track-light'
  | 'exit-emergency-led-lighting'
  // industrial
  | 'led-ufo-high-bay'
  | 'led-linear-high-bay'
  | 'led-linear-strip-light'
  // electrical materials
  | 'device-box'
  | 'wire'
  | 'device'
  | 'panel-board-breakers'
  | 'disconnect-switch-fuses'
  | 'transformer'
  | 'service-meter-sockets'
  | 'pvc-conduit-fittings'
  | 'emt-conduit-fittings'
  | 'floor-heating-cable-thermostat'
  | 'bathroom-exhaust-fan'
  | 'vapor-barrier'
  | 'emergency-smoke-alarm';

export interface Collection {
  slug: CollectionSlug;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  /** Category-representative photo (verified — see data/image-notes.ts) */
  image: string | null;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  collection: CollectionSlug;
  description: string;
}

export type StockStatus = 'in-stock' | 'low-stock' | 'made-to-order';

export interface Product {
  slug: string;
  sku: string;
  name: string;
  collection: CollectionSlug;
  category: CategorySlug;
  price: number;
  compareAt?: number;
  featured?: boolean;
  short: string;
  description: string;
  specs: string[];
  stock: StockStatus;
  // SEO / long-form content (Phase 2). Optional in the bundled data — computed by
  // data/product-content.ts when absent; Supabase rows may carry admin-edited values.
  meta_title?: string | null;
  meta_description?: string | null;
  long_description?: string | null;
  faqs?: { q: string; a: string }[] | null;
  /** Real product photo (public path), or null → generated SVG art fallback. */
  image?: string | null;
}

export const SITE = {
  name: 'Green Solar World Inc.',
  brand: 'GSW',
  tagline: 'GSW Provides High Quality Electrical Lighting Solutions',
  description:
    'GSW is an electrical and lighting distributor and wholesaler, offering a full line of high quality products along with dependable technical expertise and personalized customer service. With long experience in the trade, our team of experts can guide to choose the appropriate product for any specific type of job, be it commercial, residential or industrial.',
  address: '4615 Burgoyne St., Mississauga ON L4W 1G3 Canada',
  phone: '905-282-9242',
  mobile: '416-951-2650',
  fax: '905-282-9262',
  email: 'greensolarworldinc@gmail.com',
  hours: [
    { day: 'Monday – Friday', time: '8:00 AM – 6:00 PM' },
    { day: 'Saturday', time: '8:00 AM – 2:00 PM' },
    { day: 'Sunday', time: 'Closed' },
  ],
  shippingFlat: 30,
  orderPhoneDisplay: '+1 416-951-2650',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=4615+Burgoyne+St+Mississauga+ON+L4W+1G3',
} as const;

// Collection hero/card photos (verified — data/image-notes.ts).
const COLLECTION_IMAGES: Record<string, string> = {
  'residential-lighting': '/images/extras/2-2.webp',
  'commercial-lighting': '/images/hero/office-1.webp',
  'industrial-lighting': '/images/extras/1-2.webp',
  'electrical-materials': '/images/extras/electri.webp',
};


export const collections: Collection[] = [
  {
    slug: 'residential-lighting',
    name: 'Residential Lighting',
    shortName: 'Residential',
    tagline: 'Warm, efficient LED light for every room of the home.',
    description:
      'Slim panels, gimbals, ceiling fixtures, motion-sensor and under-cabinet lighting — everything a residential contractor needs for new builds and retrofits across the GTA.',
    image: COLLECTION_IMAGES['residential-lighting'],
  },
  {
    slug: 'commercial-lighting',
    name: 'Commercial Lighting',
    shortName: 'Commercial',
    tagline: 'High-output LED fixtures for retail, office and facade projects.',
    description:
      'Flat panels, wall packs, flood lights, shoeboxes, vapor-tight and exit & emergency lighting — DLC-listed commercial LED at true wholesale pricing.',
    image: COLLECTION_IMAGES['commercial-lighting'],
  },
  {
    slug: 'industrial-lighting',
    name: 'Industrial Lighting',
    shortName: 'Industrial',
    tagline: 'Heavy-duty high bay and strip lighting for warehouses and plants.',
    description:
      'UFO and linear high bays with industrial-grade drivers and optics, built for warehouses, manufacturing floors, gymnasiums and cold storage.',
    image: COLLECTION_IMAGES['industrial-lighting'],
  },
  {
    slug: 'electrical-materials',
    name: 'Electrical Materials',
    shortName: 'Electrical',
    tagline: 'The full electrical rough-in and finishing catalog.',
    description:
      'Boxes, wire, devices, panels and breakers, conduit and fittings, heating cable, exhaust fans and life-safety devices — one supplier for the whole job.',
    image: COLLECTION_IMAGES['electrical-materials'],
  },
];

export const categories: Category[] = [
  // Residential Lighting
  { slug: 'led-slim-panel', name: '3"/4"/6" LED Slim Panel', collection: 'residential-lighting', description: 'Ultra-thin edge-lit and back-lit LED panels for drywall and drop ceilings.' },
  { slug: 'led-gimbals', name: '3"/4" LED Gimbals', collection: 'residential-lighting', description: 'Adjustable directional gimbal downlights for sloped ceilings and accent lighting.' },
  { slug: 'led-ceiling-fixture', name: 'LED Ceiling Fixture', collection: 'residential-lighting', description: 'Surface-mount and flush-mount ceiling fixtures for hallways, bedrooms and common areas.' },
  { slug: 'led-motion-sensor-light', name: 'LED Motion Sensor Light', collection: 'residential-lighting', description: 'Motion-activated security and convenience lighting for entries, garages and walkways.' },
  { slug: 'led-under-cabinet-light', name: 'LED Under Cabinet Light', collection: 'residential-lighting', description: 'Low-profile under-cabinet and task lighting bars with linkable options.' },
  { slug: 'led-strip-light', name: 'LED Strip Light', collection: 'residential-lighting', description: 'Flexible 12V/24V LED tape and channel systems for cove and accent lighting.' },
  { slug: 'led-outdoor-garden-light', name: 'LED Outdoor Garden Light', collection: 'residential-lighting', description: 'Landscape, pathway and garden lighting rated for Canadian weather.' },
  // Commercial Lighting
  { slug: 'led-flat-panel', name: 'LED Flat Panel', collection: 'commercial-lighting', description: '2x2 and 2x4 edge-lit flat panels for offices, schools and healthcare.' },
  { slug: 'led-wall-pack', name: 'LED Wall Pack', collection: 'commercial-lighting', description: 'Traditional, slim and full-cutoff wall packs for building perimeters.' },
  { slug: 'led-flood-light', name: 'LED Flood Light', collection: 'commercial-lighting', description: 'Area, parking lot and architectural flood lighting with wide optics.' },
  { slug: 'led-retrofit-corn-light', name: 'LED Retrofit Corn Light', collection: 'commercial-lighting', description: 'HID replacement corn lamps for post tops, wall packs and high bays.' },
  { slug: 'led-recessed-down-light', name: 'LED Recessed Down Light', collection: 'commercial-lighting', description: 'Commercial-grade recessed downlights with high CRI and dimming.' },
  { slug: 'led-slim-canopy-light', name: 'LED Slim Canopy Light', collection: 'commercial-lighting', description: 'Low-profile canopy fixtures for gas stations, drive-throughs and parking garages.' },
  { slug: 'led-outdoor-shoebox-light', name: 'LED Outdoor Shoebox Light', collection: 'commercial-lighting', description: 'Parking lot and roadway shoebox fixtures with slip-fit mounting and photocells.' },
  { slug: 'led-post-top-light', name: 'LED Post Top Light', collection: 'commercial-lighting', description: 'Decorative post-top and acorn fixtures for pathways, parks and parking areas.' },
  { slug: 'led-linear-strip-fixture', name: 'LED Linear Strip Fixture', collection: 'commercial-lighting', description: '4ft and 8ft striplights for utility, retail back-room and cove applications.' },
  { slug: 'led-vapor-tight-fixture', name: 'LED Vapor Tight Fixture', collection: 'commercial-lighting', description: 'IP65/IP66 sealed fixtures for parking garages, car washes and cold storage.' },
  { slug: 'led-track-light', name: 'LED Track Light', collection: 'commercial-lighting', description: 'Track heads and systems for retail displays and galleries.' },
  { slug: 'exit-emergency-led-lighting', name: 'Exit & Emergency LED Lighting', collection: 'commercial-lighting', description: 'cULus-listed exit signs, combo units and emergency lighting with battery backup.' },
  // Industrial Lighting
  { slug: 'led-ufo-high-bay', name: 'LED UFO High Bay', collection: 'industrial-lighting', description: 'Round high bays from 100W to 240W for warehouses and gymnasiums.' },
  { slug: 'led-linear-high-bay', name: 'LED Linear High Bay', collection: 'industrial-lighting', description: 'Linear aisle optics for warehouses, retail racking and manufacturing.' },
  { slug: 'led-linear-strip-light', name: 'LED Linear Strip Light', collection: 'industrial-lighting', description: 'Industrial strip fixtures for continuous row mounting in plants and shops.' },
  // Electrical Materials
  { slug: 'device-box', name: 'Device Box', collection: 'electrical-materials', description: 'Steel device boxes, handy boxes and 4" square boxes in deep and shallow styles.' },
  { slug: 'wire', name: 'Wire', collection: 'electrical-materials', description: 'Copper building wire — NMD90, T90, RW90 and low-voltage — in full reels.' },
  { slug: 'device', name: 'Device', collection: 'electrical-materials', description: 'Receptacles, switches, dimmers, GFCI and decorator devices in commercial grade.' },
  { slug: 'panel-board-breakers', name: 'Panel Board & Breakers', collection: 'electrical-materials', description: 'Loadcentres, panelboards and 1/2/3-pole breakers up to 200A.' },
  { slug: 'disconnect-switch-fuses', name: 'Disconnect Switch & Fuses', collection: 'electrical-materials', description: 'Fusible and non-fusible safety switches with Class J and Class R fuses.' },
  { slug: 'transformer', name: 'Transformer', collection: 'electrical-materials', description: 'Dry-type distribution and control transformers, 120/240V to 600V classes.' },
  { slug: 'service-meter-sockets', name: 'Service Meter Sockets', collection: 'electrical-materials', description: 'Overhead and underground meter bases rated for Ontario service standards.' },
  { slug: 'pvc-conduit-fittings', name: 'PVC Conduit & Fittings', collection: 'electrical-materials', description: 'Schedule 40/80 PVC conduit, elbows, couplings and accessories.' },
  { slug: 'emt-conduit-fittings', name: 'EMT Conduit & Fittings', collection: 'electrical-materials', description: 'EMT raceway with compression and set-screw connectors in galvanized and steel.' },
  { slug: 'floor-heating-cable-thermostat', name: 'Floor Heating Cable and Thermostat', collection: 'electrical-materials', description: 'In-floor heating cable kits and programmable thermostats for tile and laminate.' },
  { slug: 'bathroom-exhaust-fan', name: 'Bathroom Exhaust Fan', collection: 'electrical-materials', description: 'Quiet bathroom fans from 50 to 110 CFM with humidity-sensor options.' },
  { slug: 'vapor-barrier', name: 'Vapor Barrier', collection: 'electrical-materials', description: '6-mil poly vapor barrier for interior foundation and crawl-space work.' },
  { slug: 'emergency-smoke-alarm', name: 'Emergency Smoke Alarm', collection: 'electrical-materials', description: 'Hardwired interconnected smoke and CO alarms with battery backup.' },
];

const categoryMap = new Map(categories.map((c) => [c.slug, c]));

// Real product photos harvested from the original gsworld.ca (all visually
// verified — audit trail in data/image-notes.ts). Slugs not listed stay null
// and render the generated SVG artwork.
const PRODUCT_IMAGES: Record<string, string> = {
  'led-slim-panel-4in-9w': '/images/extras/8-inch-slim.webp',
  'led-slim-panel-6in-12w': '/images/extras/3pro.webp',
  'led-gimbal-3in-8w': '/images/extras/h2.jpg',
  'led-gimbal-4in-10w': '/images/extras/h5.webp',
  'led-a19-bulb-shahab-series': '/images/products/shahab.webp',
  'led-ceiling-fixture-14in-24w': '/images/extras/4pro.webp',
  'jc-10w-a': '/images/products/jc-10w-a.webp',
  'led-under-cabinet-24in-14w': '/images/extras/puck-lights.jpg',
  'led-strip-light-16ft-24v': '/images/extras/strip-1.webp',
  'led-strip-channel-kit': '/images/extras/strip-1.webp',
  'led-garden-path-light-5w': '/images/extras/2-1.webp',
  'led-panel-light-2x4-40w': '/images/products/test.jpg',
  'led-flat-panel-2x2-36w': '/images/extras/l2.jpg',
  'traditional-led-wallpack-100w-120w': '/images/products/100w-120w-traditional-led-wallpack.webp',
  'led-slim-wallpack-40w': '/images/extras/wall-pack.webp',
  'asymmetric-flood-lights': '/images/products/asymmetric-flood-lights.webp',
  'led-flood-parking-lot-street-light': '/images/products/led-flood-parking-lot-street-light.webp',
  'led-mini-flood-50w': '/images/extras/lsixth.webp',
  'led-corn-light-60w-e39': '/images/extras/c2.webp',
  'led-corn-light-100w-e39': '/images/products/jc-10w-a.webp',
  'led-commercial-downlight-30w': '/images/extras/4-inch-mounting-plate.jpg',
  'led-shoebox-150w': '/images/extras/led-parking-lot-lights-led-shoe-box-lamp.webp',
  'led-shoebox-240w': '/images/extras/led-parking-lot-lights-led-shoe-box-lamp-2.webp',
  'led-post-top-60w': '/images/products/led-flood-parking-lot-street-light.webp',
  'led-strip-fixture-4ft-40w': '/images/extras/wkiaivjqmycfsa2taaemtkibiwe630.webp',
  'led-strip-fixture-8ft-80w': '/images/extras/wkiaivjqw9atsnquaahw9r9fqti541.webp',
  'led-ufo-highbay-150w': '/images/extras/screenshot_2-1.webp',
  'led-ufo-highbay-240w': '/images/extras/screenshot_2-1.webp',
  'led-linear-highbay-160w': '/images/extras/untitled-1.webp',
  'led-linear-highbay-220w': '/images/extras/1.webp',
  'industrial-strip-4ft-40w': '/images/extras/wkiaivjqmycfsa2taaemtkibiwe630.webp',
  'industrial-strip-8ft-75w': '/images/extras/wkiaivjqw9atsnquaahw9r9fqti541.webp',
  'nmd90-14-2-copper': '/images/extras/electri.webp',
  'rw90-12-1-stranded': '/images/extras/electri.webp',
  'receptacle-15a-decorator': '/images/hero/office-2.webp',
  'switch-15a-3way': '/images/extras/electri.webp',
};


const usedSkus = new Set<string>();

function skuFor(slug: string): string {
  const dedashed = slug.replace(/-/g, '').toUpperCase();
  // First 10 chars can collide for similar slugs (e.g. two sizes of the same
  // product) — extend until the SKU is unique.
  let base = dedashed.slice(0, 10);
  let i = 12;
  while (usedSkus.has(`GSW-${base}`) && i <= dedashed.length + 2) {
    base = dedashed.slice(0, i);
    i += 2;
  }
  let sku = `GSW-${base}`;
  let n = 2;
  while (usedSkus.has(sku)) sku = `GSW-${base}${n++}`;
  usedSkus.add(sku);
  return sku;
}

function p(
  slug: string,
  name: string,
  category: CategorySlug,
  price: number,
  compareAt: number | undefined,
  short: string,
  specs: string[],
  featured = false,
  stock: StockStatus = 'in-stock',
): Product {
  const cat = categoryMap.get(category)!;
  return {
    slug,
    sku: skuFor(slug),
    name,
    collection: cat.collection,
    category,
    price,
    compareAt,
    featured,
    short,
    description: short,
    specs,
    stock,
    image: PRODUCT_IMAGES[slug] ?? null,
  };
}

export const products: Product[] = [
  // ─── RESIDENTIAL LIGHTING ────────────────────────────────────────────────
  // 3"/4"/6" LED Slim Panel
  p('led-slim-panel-4in-9w', '4" LED Slim Panel 9W – Dimmable', 'led-slim-panel', 14.5, 18, 'Ultra-thin recessed wafer panel with integrated junction box and smooth dimming to 10%.', ['9W | 720 lm', '3000K / 4000K / 5000K selectable', '120V, dimmable to 10%', 'cULus certified | 5-year warranty']),
  p('led-slim-panel-6in-12w', '6" LED Slim Panel 12W – 5CCT', 'led-slim-panel', 18.75, 24, '6-inch edge-lit slim panel with five selectable colour temperatures, ideal for whole-home retrofits.', ['12W | 960 lm', '2700K–5000K selectable CCT', '120V, IC-rated, wet-location approved', '50,000 hr life | cULus listed']),
  // 3"/4" LED Gimbals
  p('led-gimbal-3in-8w', '3" LED Gimbal 8W – Adjustable', 'led-gimbals', 16.25, undefined, 'Compact 3-inch gimbal with 35° tilt for accent and sloped-ceiling applications.', ['8W | 640 lm', '3000K/4000K/5000K selectable', '35° tilt, 360° swivel', 'cETLus listed | 5-year warranty']),
  p('led-gimbal-4in-10w', '4" LED Gimbal 10W – Deep Baffle', 'led-gimbals', 19.5, undefined, 'Deep-baffle 4-inch gimbal downlight delivering low-glare directional light for feature walls.', ['10W | 800 lm', '3500K, 90+ CRI', '120V, TRIAC dimmable', 'cULus certified | IC-rated']),
  // LED Ceiling Fixture
  p('led-a19-bulb-shahab-series', 'LED A19 Bulb 10W – Shahab Series', 'led-ceiling-fixture', 100, undefined, 'High-output omnidirectional A19 lamp for ceiling fixtures and general residential lighting.', ['10W | 1100 lm (100W equiv.)', '3000K warm white', '120V, non-dimmable', 'E26 base | cULus | 25,000 hr'], true),
  p('led-ceiling-fixture-14in-24w', '14" LED Ceiling Fixture 24W – Flush Mount', 'led-ceiling-fixture', 32, 39, 'Low-profile round flush-mount fixture with frosted acrylic diffuser for hallways and bedrooms.', ['24W | 1800 lm', '3000K/4000K/5000K selectable', '120V, dimmable', 'cETLus | 5-year warranty']),
  // LED Motion Sensor Light
  p('led-motion-sensor-security-30w', 'LED Motion Sensor Security Light 30W', 'led-motion-sensor-light', 42, 55, 'Dual-head adjustable flood with 180° PIR motion detection for garages, entries and yards.', ['30W | 3000 lm', '5000K daylight', '180° PIR, adjustable heads', 'IP65 | cULus certified']),
  p('led-motion-bulkhead-15w', 'LED Motion Sensor Bulkhead 15W', 'led-motion-sensor-light', 36, undefined, 'Oval bulkhead with integrated photocell and motion sensor for covered entries and stairwells.', ['15W | 1200 lm', '4000K neutral white', '120-347V, photocell + PIR', 'cULus | IP54 rated']),
  // LED Under Cabinet Light
  p('jc-10w-a', 'JC-10W-A Under Cabinet Light Bar', 'led-under-cabinet-light', 300, undefined, 'Linkable low-profile under-cabinet light bar with touch dimming and diffuser lens, JC-series.', ['10W per bar | 700 lm', '3000K warm white', 'Linkable up to 6 bars, touch dimmer', 'cETLus | 3-year warranty'], true),
  p('led-under-cabinet-24in-14w', '24" LED Under Cabinet Light 14W', 'led-under-cabinet-light', 24.5, 30, '24-inch linkable under-cabinet bar with hi-low-off switch for kitchens and workspaces.', ['14W | 1000 lm', '2700K/3000K/4000K options', 'Hardwire or plug-in, linkable', 'cULus certified']),
  // LED Strip Light
  p('led-strip-light-16ft-24v', 'LED Strip Light 16.4ft – 24V 5050', 'led-strip-light', 22.75, undefined, 'High-density 24V flexible LED tape with 3M backing for cove, toe-kick and accent runs.', ['14.4W/m, 60 LED/m', '3000K/4000K/6000K options', '24V, cuttable every 4"', 'cULus listed tape | IP20/IP65']),
  p('led-strip-channel-kit', 'LED Strip + Aluminum Channel Kit 6.6ft', 'led-strip-light', 34, 42, 'Complete channel kit with diffuser, end caps and mounting clips for a finished linear look.', ['Includes 24V tape + driver', '3000K/4000K/5000K', 'Frosted PC diffuser, deep profile', 'cETLus components']),
  // LED Outdoor Garden Light
  p('led-garden-path-light-5w', 'LED Garden Path Light 5W', 'led-outdoor-garden-light', 18.5, undefined, 'Low-voltage die-cast aluminum path light with seeded-glass shade for walkways and beds.', ['5W | 350 lm', '2700K warm white', '12V AC/DC, tool-free install', 'IP65 | cULus landscape listed']),
  p('led-garden-spotlight-9w', 'LED Garden Spotlight 9W – Spike Base', 'led-outdoor-garden-light', 21, 26, 'Adjustable 9W spotlight with ground spike for trees, facades and landscape accents.', ['9W | 600 lm', '3000K/4000K options', '12V/120V versions available', 'IP66 | 5-year warranty']),

  // ─── COMMERCIAL LIGHTING ─────────────────────────────────────────────────
  // LED Flat Panel
  p('led-panel-light-2x4-40w', 'LED Panel Light 2x4 – 40W', 'led-flat-panel', 850, undefined, 'Premium 2x4 edge-lit flat panel with 0-10V dimming driver, DLC Premium listed.', ['40W | 4400 lm', '3500K/4000K/5000K', '0-10V dimmable, 120-277V', 'DLC Premium | cULus | 5-yr'], true),
  p('led-flat-panel-2x2-36w', 'LED Flat Panel 2x2 – 36W Back-Lit', 'led-flat-panel', 62, 78, 'Back-lit 2x2 troffer-style panel with uniform light and tool-less driver access.', ['36W | 3960 lm', '4000K, 80+ CRI', '0-10V dimmable, 120-347V', 'DLC listed | cULus certified']),
  // LED Wall Pack
  p('traditional-led-wallpack-100w-120w', '100W/120W Traditional LED Wallpack', 'led-wall-pack', 450, 500, 'Traditional-style full cutoff wallpack with selectable 100W/120W output and built-in photocell.', ['Selectable 100W/120W | 14,400–17,200 lm', '5000K, Type III optics', '120-277V, photocell included', 'cULus | DLC Premium | 5-yr'], true, 'low-stock'),
  p('led-slim-wallpack-40w', 'LED Slim Wall Pack 40W', 'led-wall-pack', 88, 110, 'Architectural slim-profile wall pack for perimeters, loading docks and building facades.', ['40W | 5200 lm', '5000K, full cutoff', '120-277V, photocell optional', 'cULus | DLC listed | IP65']),
  // LED Flood Light
  p('asymmetric-flood-lights', 'Asymmetric Flood Lights', 'led-flood-light', 1000, undefined, 'Stadium-grade asymmetric floodlight with precise beam control for arenas, facades and yards.', ['High-output modular LED engine', 'Asymmetric / street-beam optics', '120-480V, 1-10V + DALI options', 'IP66 | cULus | 5-year warranty'], true),
  p('led-flood-parking-lot-street-light', 'LED Flood/Parking Lot/Street Light', 'led-flood-light', 700, undefined, 'Versatile high-mast flood fixture with shoebox, flood and street beam options in one housing.', ['Up to 300W | 39,000 lm', '3000K/4000K/5000K/5700K', '120-277V, photocell & motion ready', 'DLC | cULus | IP66'], true),
  p('led-mini-flood-50w', 'LED Mini Flood Light 50W', 'led-flood-light', 54, 68, 'Compact knuckle-mounted flood for signage, landscaping and small building facades.', ['50W | 6500 lm', '5000K, adjustable knuckle', '120-277V, optional photocell', 'cULus certified | IP66']),
  // LED Retrofit Corn Light
  p('led-corn-light-60w-e39', 'LED Corn Light 60W – E39 Mogul', 'led-retrofit-corn-light', 38, 48, 'Direct HID replacement corn lamp for post tops and wall packs — bypass the ballast and go LED.', ['60W | 8100 lm (250W HID equiv.)', '5000K, 360° beam', '100-277V, ballast bypass', 'cULus | 5-year warranty']),
  p('led-corn-light-100w-e39', 'LED Corn Light 100W – E39 Mogul', 'led-retrofit-corn-light', 52, 65, '100W corn lamp replacing 400W metal halide in high bays, shoeboxes and wall packs.', ['100W | 13,500 lm', '5000K, 360° distribution', '100-277V, EX39 base', 'DLC listed | cULus | 50,000 hr']),
  // LED Recessed Down Light
  p('led-commercial-downlight-30w', 'LED Commercial Downlight 30W', 'led-recessed-down-light', 74, 92, '8-inch commercial recessed downlight with high CRI for lobbies, retail and healthcare.', ['30W | 3300 lm', '3500K/4000K, 90+ CRI', '0-10V dimmable, 120-347V', 'cULus | IC-rated | 5-yr']),
  p('led-architectural-downlight-15w', 'LED Architectural Downlight 15W', 'led-recessed-down-light', 58, undefined, 'Reflector-style architectural downlight with glare control for offices and corridors.', ['15W | 1500 lm', '3000K/3500K/4000K', 'TRIAC/ELV/0-10V dimming', 'cULus certified | Wet-location']),  // LED Slim Canopy Light
  p('led-slim-canopy-70w', 'LED Slim Canopy Light 70W', 'led-slim-canopy-light', 96, 120, 'Low-profile surface-mount canopy for gas stations, drive-throughs and parkades.', ['70W | 9100 lm', '5000K, wide distribution', '120-277V, 0-10V dimmable', 'DLC listed | cULus | IP65']),
  p('led-canopy-recessed-45w', 'LED Recessed Canopy Light 45W', 'led-slim-canopy-light', 84, undefined, 'Recessed canopy fixture that drops into existing HID canopies for a clean LED retrofit.', ['45W | 5850 lm', '5000K daylight', '120-277V, direct mount', 'cULus | DLC | 5-year warranty']),
  // LED Outdoor Shoebox Light
  p('led-shoebox-150w', 'LED Shoebox Light 150W', 'led-outdoor-shoebox-light', 128, 160, 'Parking lot shoebox with slip-fitter mount, photocell and Type III/IV/V optics.', ['150W | 19,500 lm', '5000K, field-selectable optics', '120-277V, photocell included', 'DLC Premium | cULus | IP66']),
  p('led-shoebox-240w', 'LED Shoebox Light 240W', 'led-outdoor-shoebox-light', 172, undefined, 'High-wattage area light for large lots, roadways and storage yards.', ['240W | 31,200 lm', '4000K/5000K', '120-480V, NEMA photocell', 'DLC listed | 10kV surge protection']),
  // LED Post Top Light
  p('led-post-top-60w', 'LED Post Top Light 60W', 'led-post-top-light', 92, 115, 'Decorative acorn post-top for parking lots, pathways and municipal streetscapes.', ['60W | 7800 lm', '3000K/4000K/5000K', '120-277V, photocell optional', 'DLC listed | cULus | IP65']),
  p('led-post-top-100w', 'LED Post Top Light 100W – Modern', 'led-post-top-light', 118, undefined, 'Modern-style post-top with 360° distribution replacing up to 250W HID.', ['100W | 13,000 lm', '4000K/5000K', '120-277V, slip-fitter or direct', 'cULus certified | 5-yr warranty']),
  // LED Linear Strip Fixture
  p('led-strip-fixture-4ft-40w', 'LED Linear Strip Fixture 4ft – 40W', 'led-linear-strip-fixture', 46, 58, '4-foot LED striplight for utility areas, retail back rooms and continuous rows.', ['40W | 5200 lm', '4000K/5000K', '120-277V, 0-10V dimmable', 'DLC listed | cULus']),
  p('led-strip-fixture-8ft-80w', 'LED Linear Strip Fixture 8ft – 80W', 'led-linear-strip-fixture', 82, 99, '8-foot wraparound striplight with prismatic lens for warehouses and workshops.', ['80W | 10,400 lm', '5000K daylight', '120-277V, linkable rows', 'cULus certified | 5-yr warranty']),
  // LED Vapor Tight Fixture
  p('led-vapor-tight-4ft-40w', 'LED Vapor Tight Fixture 4ft – 40W', 'led-vapor-tight-fixture', 68, 85, 'IP65 sealed 4ft fixture with gasketed lens for garages, car washes and cold storage.', ['40W | 5200 lm', '4000K/5000K', '120-277V, wet-location listed', 'IP65 | cULus | corrosion resistant']),
  p('led-vapor-tight-8ft-80w', 'LED Vapor Tight Fixture 8ft – 80W', 'led-vapor-tight-fixture', 118, undefined, '8-foot high-output sealed fixture for parkades, tunnels and food-processing plants.', ['80W | 10,400 lm', '5000K daylight', '120-347V, IK08 impact rated', 'IP66 | cULus | DLC listed']),
  // LED Track Light
  p('led-track-head-20w', 'LED Track Head 20W', 'led-track-light', 32, 40, 'Compact H-type track head with 90+ CRI for retail merchandising and galleries.', ['20W | 2000 lm', '2700K–5000K selectable', '120V, H/J/L adapters available', 'cULus certified | 5-yr warranty']),
  p('led-track-system-4ft', '4ft LED Track System Kit – 3 Heads', 'led-track-light', 96, 119, 'Complete 4ft track kit with three dimmable heads and all mounting hardware.', ['3 x 15W heads | 4500 lm total', '3000K/4000K', '120V, TRIAC dimmable', 'cETLus listed | 5-year warranty']),
  // Exit & Emergency LED Lighting
  p('led-exit-sign-red', 'LED Exit Sign – Red Letters', 'exit-emergency-led-lighting', 24.5, 30, 'cULus-listed LED exit sign with red lettering, battery backup and universal mounting.', ['LED, 90-min battery backup', 'Red letters, single/double face', '120/347V universal voltage', 'cULus listed | 5-year warranty']),
  p('led-emergency-combo-unit', 'LED Exit & Emergency Combo Unit', 'exit-emergency-led-lighting', 44, 55, 'Combination exit sign with two adjustable emergency heads for code-compliant egress.', ['Exit sign + 2 x 2W heads', '90-min Ni-Cad backup', 'Universal mounting, red/green legends', 'cULus | meets CSA 22.2']),

  // ─── INDUSTRIAL LIGHTING ─────────────────────────────────────────────────
  // LED UFO High Bay
  p('led-ufo-highbay-150w', 'LED UFO High Bay 150W', 'led-ufo-high-bay', 108, 135, 'Round UFO high bay with glass lens and IP65 rating for warehouses up to 25 ft mounting.', ['150W | 19,500 lm', '5000K, 90° beam', '120-277V, 0-10V dimmable', 'DLC Premium | cULus | IP65']),
  p('led-ufo-highbay-240w', 'LED UFO High Bay 240W – High Output', 'led-ufo-high-bay', 156, undefined, '240W industrial UFO for high-rack warehouses, gymnasiums and manufacturing bays.', ['240W | 31,200 lm', '5000K daylight', '120-277V, hook mount included', 'cULus | 10kV surge | 5-yr']),
  // LED Linear High Bay
  p('led-linear-highbay-160w', 'LED Linear High Bay 160W', 'led-linear-high-bay', 118, 148, 'Aisle-optics linear high bay for distribution centres and big-box retail racking.', ['160W | 20,800 lm', '5000K, aisle optics', '120-277V, 0-10V dimming', 'DLC Premium | cULus | 5-yr']),
  p('led-linear-highbay-220w', 'LED Linear High Bay 220W', 'led-linear-high-bay', 148, undefined, 'High-output linear high bay with lensed reflector for production floors and gymnasiums.', ['220W | 28,600 lm', '4000K/5000K', '120-347V, chain mount', 'cULus certified | IP65']),
  // LED Linear Strip Light (industrial)
  p('industrial-strip-4ft-40w', 'Industrial LED Strip Fixture 4ft – 40W', 'led-linear-strip-light', 39, 49, 'Rugged industrial striplight with wire guard option for plants, shops and maintenance bays.', ['40W | 5200 lm', '5000K daylight', '120-277V, row mounting', 'cULus | optional wire guard']),
  p('industrial-strip-8ft-75w', 'Industrial LED Strip Fixture 8ft – 75W', 'led-linear-strip-light', 72, undefined, '8-foot industrial strip for continuous rows in manufacturing and storage facilities.', ['75W | 9750 lm', '4000K/5000K', '120-277V, surface or suspended', 'cULus certified | 5-yr warranty']),

  // ─── ELECTRICAL MATERIALS ────────────────────────────────────────────────
  // Device Box
  p('device-box-2x4-deep', '2"x4" Steel Device Box – Deep', 'device-box', 3.2, undefined, 'Deep 2x4 galvanized device box with knockouts for device and fixture mounting.', ['2-1/8" deep, 1/2" & 3/4" KOs', 'Galvanized steel', 'cULus listed, CSA certified', 'Qty pricing per 25-pack']),
  p('device-box-handy', 'Handy Box 4"x2-1/8" – Raised Cover', 'device-box', 4.1, 5.25, 'Handy box with raised device cover for surface-mounted receptacles and switches.', ['1-7/16" deep', '1/2" knockouts, drawn construction', 'cULus listed | CSA approved', 'Includes raised cover']),
  // Wire
  p('nmd90-14-2-copper', 'NMD90 14/2 Copper Building Wire – 150m', 'wire', 92, 108, '14/2 NMD90 non-metallic sheathed cable for residential branch circuits.', ['14 AWG, 2 conductor + bond', '300V, rated -25°C to 90°C', 'CSA certified | FT4 rated', '150 m coil']),
  p('rw90-12-1-stranded', 'RW90 12 AWG Stranded – 300m', 'wire', 128, undefined, 'RW90 cross-linked polyethylene single conductor for commercial and industrial runs.', ['12 AWG stranded, bare or tinned', '600V, 90°C wet/dry', 'CSA certified | FT4', '300 m reel']),
  // Device
  p('receptacle-15a-decorator', 'Decorator Receptacle 15A – Commercial Grade', 'device', 5.6, 7.25, 'Commercial-grade 15A 125V tamper-resistant decorator receptacle with screw terminals.', ['15A / 125V, TR compliant', 'Back & side wired', 'cULus listed, CSA certified', '10-year warranty, white/ivory']),
  p('switch-15a-3way', '3-Way Switch 15A – Commercial Grade', 'device', 4.8, undefined, 'Commercial-spec 15A 3-way toggle switch rated for 100,000 operations.', ['15A / 120-277V AC', 'Back & side wired', 'cULus listed | CSA approved', 'White, brown, grey available']),
  // Panel Board & Breakers
  p('loadcentre-100a-20-space', 'Loadcentre 100A – 20/40 Space', 'panel-board-breakers', 96, 118, 'Main-breaker loadcentre with 20 spaces / 40 circuits, 100A, indoor enclosure.', ['100A main breaker', '20 spaces / 40 circuits, 1-ph 3-wire', 'CSA certified | ESA accepted', 'Indoor NEMA 1 enclosure']),
  p('breaker-2pole-40a', '2-Pole Breaker 40A – Bolt-on', 'panel-board-breakers', 28, 35, '2-pole 40A thermal-magnetic bolt-on breaker for commercial panelboards.', ['40A, 2-pole, 120/240V', '10 kAIC interrupt rating', 'cULus listed | CSA certified', 'Fits major panelboard types']),
  // Disconnect Switch & Fuses
  p('safety-switch-60a-nonfusible', 'Safety Switch 60A – Non-Fusible', 'disconnect-switch-fuses', 74, 92, 'Heavy-duty non-fusible safety switch in NEMA 3R enclosure for outdoor service.', ['60A, 600V max, 3-pole', 'NEMA 3R rain-tight enclosure', 'cULus listed | CSA certified', 'Quick-make/quick-break mechanism']),
  p('fuse-class-j-30a', 'Class J Fuse 30A – Time Delay', 'disconnect-switch-fuses', 14.5, undefined, 'Time-delay Class J dual-element fuse for motor and transformer protection.', ['30A, 600V AC, Class J', 'Time-delay, 200kA IR', 'cULus listed | CSA certified', '10-pack contractor pricing']),
  // Transformer
  p('transformer-45kva-600-208', 'Dry-Type Transformer 45 kVA – 600V to 208Y/120V', 'transformer', 1450, 1690, 'Three-phase dry-type distribution transformer, 45 kVA, 600V delta primary.', ['45 kVA, 3-phase', '600V Δ primary / 208Y/120V secondary', 'CSA certified | DOE 2016 efficient', 'Aluminum windings, 150°C rise'], false, 'made-to-order'),
  p('control-transformer-500va', 'Control Transformer 500VA – 240/480 to 120V', 'transformer', 86, undefined, 'Industrial control transformer for machine panels and motor-control circuits.', ['500 VA, 1-phase', '240x480V primary / 120V secondary', 'cULus listed | CSA certified', 'Foot or DIN-rail mountable']),
  // Service Meter Sockets
  p('meter-socket-200a-overhead', 'Meter Socket 200A – Overhead', 'service-meter-sockets', 68, 84, '200A overhead single-position meter socket with ringless cover, Ontario spec.', ['200A, 1-phase, 3-wire', 'Overhead feed, ringless type', 'CSA certified | ESA accepted', 'U-guard and hub included']),
  p('meter-socket-100a-underground', 'Meter Socket 100A – Underground', 'service-meter-sockets', 58, undefined, '100A underground meter base with lever bypass for residential service entrances.', ['100A, lever bypass', 'Underground feed, single position', 'CSA certified | ESA accepted', 'NEMA 3R enclosure']),
  // PVC Conduit & Fittings
  p('pvc-conduit-sch40-2in-10ft', 'PVC Conduit Schedule 40 – 2" x 10ft', 'pvc-conduit-fittings', 12.8, 15.5, 'Schedule 40 PVC conduit for underground and concrete-encased runs.', ['2" trade size, 10 ft length', 'Schedule 40, grey PVC', 'CSA certified | cULus re-listed', 'Sunlight resistant']),
  p('pvc-coupling-2in-sch80', 'PVC Coupling 2" – Schedule 80', 'pvc-conduit-fittings', 2.4, undefined, 'Schedule 80 PVC threaded coupling for rigid underground installations.', ['2" trade size', 'Schedule 80, threaded', 'cULus listed | CSA certified', 'Qty pricing per 50-pack']),
  // EMT Conduit & Fittings
  p('emt-conduit-1in-10ft', 'EMT Conduit 1" x 10ft', 'emt-conduit-fittings', 14.2, 17, 'Electro-galvanized EMT raceway for exposed and concealed commercial runs.', ['1" trade size, 10 ft length', 'Hot-dip galvanized steel', 'cULus listed | CSA certified', 'Bundle pricing available']),
  p('emt-connector-compression-1in', 'EMT Compression Connector 1"', 'emt-conduit-fittings', 1.9, 2.5, 'Steel compression-type EMT connector with insulated throat for fast, secure pulls.', ['1" trade size, compression type', 'Zinc-plated steel, insulated throat', 'cULus listed | CSA certified', 'Qty pricing per 100-pack']),
  // Floor Heating Cable and Thermostat
  p('floor-heating-cable-40sqft', 'Floor Heating Cable Kit – 40 sq ft', 'floor-heating-cable-thermostat', 210, 260, 'Electric in-floor heating cable kit covering ~40 sq ft of tile or stone floor.', ['Covers approx. 40 sq ft', '120V, 3.7 W/ft', 'cULus listed | GFCI protected', 'Includes strapping & manual']),
  p('programmable-floor-thermostat', 'Programmable Floor Heating Thermostat', 'floor-heating-cable-thermostat', 68, undefined, 'Touch-screen programmable thermostat with floor sensor for heating cable systems.', ['120/240V, 15A switching', '7-day programmable, floor/air sensor', 'cULus listed | CSA certified', 'Works with GSW cable kits']),
  // Bathroom Exhaust Fan
  p('bath-fan-80cfm-quiet', 'Bathroom Exhaust Fan 80 CFM – Quiet', 'bathroom-exhaust-fan', 58, 72, '0.8-sones quiet bathroom fan for mid-size bathrooms, energy-star rated.', ['80 CFM | 0.8 sones', 'ENERGY STAR qualified', 'cULus listed | CSA certified', 'Ceiling mount, 4" duct']),
  p('bath-fan-humidity-110cfm', 'Bathroom Fan 110 CFM with Humidity Sensor', 'bathroom-exhaust-fan', 88, undefined, 'High-capacity humidity-sensing exhaust fan that runs automatically when moisture rises.', ['110 CFM | 1.2 sones', 'Built-in humidity sensor', 'ENERGY STAR | cULus listed', '6" duct, motion-sensor option']),
  // Vapor Barrier
  p('vapor-barrier-6mil-8x100', 'Vapor Barrier 6-mil – 8ft x 100ft', 'vapor-barrier', 42, 52, '6-mil polyethylene vapor barrier for interior foundation walls and crawl spaces.', ['6 mil thickness', '8 ft x 100 ft roll (800 sq ft)', 'ASTM E1745 Class A compliant', 'Puncture & tear resistant']),
  p('vapor-barrier-tuck-tape', 'Vapor Barrier Tuck Tape 60mm x 55m', 'vapor-barrier', 8.5, undefined, 'Red sheathing tape for sealing vapor barrier overlaps and penetrations.', ['60 mm x 55 m roll', 'Aggressive acrylic adhesive', '-18°C to +82°C rated', 'Case of 24 available']),
  // Emergency Smoke Alarm
  p('smoke-alarm-hardwired-interconnected', 'Hardwired Interconnected Smoke Alarm', 'emergency-smoke-alarm', 32, 39, '120V hardwired photoelectric smoke alarm with 9V battery backup and interconnect.', ['Photoelectric sensing chamber', '120V hardwired + battery backup', 'Interconnect up to 18 devices', 'cULus listed | CSA 6.76 compliant']),
  p('smoke-co-combo-alarm', 'Smoke & CO Combo Alarm – Hardwired', 'emergency-smoke-alarm', 48, 58, 'Combination smoke and carbon monoxide alarm with voice alerts and battery backup.', ['Smoke + electrochemical CO sensor', 'Voice warning & location feature', '120V hardwired, interconnectable', 'cULus | CSA 6.76 / 6.19']),
];

export const featuredProducts = products.filter((p) => p.featured);

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function categoriesByCollection(slug: CollectionSlug): Category[] {
  return categories.filter((c) => c.collection === slug);
}

export function productsByCollection(slug: CollectionSlug): Product[] {
  return products.filter((p) => p.collection === slug);
}

export function productsByCategory(slug: CategorySlug): Product[] {
  return products.filter((p) => p.category === slug);
}

export function relatedProducts(product: Product, count = 4): Product[] {
  const same = products.filter((x) => x.category === product.category && x.slug !== product.slug);
  const rest = products.filter((x) => x.category !== product.category && x.slug !== product.slug);
  return [...same, ...rest].slice(0, count);
}

export function formatPrice(n: number): string {
  return `$${n.toFixed(2)}`;
}

export const stockLabel: Record<StockStatus, string> = {
  'in-stock': 'In Stock',
  'low-stock': 'Low Stock',
  'made-to-order': 'Made to Order',
};
