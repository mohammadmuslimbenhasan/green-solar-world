// Product page SEO content engine (Phase 2).
// Generates unique, keyword-targeted copy per product from its category template,
// interpolated with the product's own name and specs. Titles/descriptions follow
// the "<Product Name> Canada" / "<type> Mississauga" keyword map.

import type { Product, CategorySlug } from '@/data/catalog';

export interface ProductFAQ {
  q: string;
  a: string;
}

export interface ProductContent {
  /** Primary keyword for this product page */
  keyword: string;
  /** ~100-130 word intro naming the product type + keyword */
  intro: string;
  /** 3–4 application bullets (commercial/residential/industrial) */
  applications: string[];
  /** ~50 word "why buy from GSW" blurb */
  whyGsw: string;
  /** 2–3 product-specific FAQs */
  faqs: ProductFAQ[];
}

const WHY_GSW =
  'Contractors buy the {name} from Green Solar World because we stock it at the counter in Mississauga, quote honest wholesale pricing over the phone, and can usually have material ready for pickup or flat-rate shipping the same day. Every product we sell is backed by our team\u2019s technical expertise — if the spec sheet raises a question, one call answers it.';

interface CategoryTemplate {
  kw: string;
  type: string;
  intro: string;
  applications: string[];
  faqs: ProductFAQ[];
}

const T: Record<CategorySlug, CategoryTemplate> = {
  'led-slim-panel': {
    kw: 'residential LED panel lights Mississauga',
    type: 'LED slim panel light',
    intro:
      'The {name} is an ultra-thin LED panel light designed for fast residential installs where a traditional pot light housing will not fit. {spec0}, with selectable colour temperature so the whole home matches from room to room. Because GSW is a lighting distributor serving Mississauga, Toronto and the wider GTA, contractors can pick these panels up at the counter or have them shipped flat-rate anywhere in Canada — at true wholesale pricing.',
    applications: [
      'Residential retrofits and finished-basement ceilings with shallow plenum space',
      'Kitchens, hallways and bedrooms in new multi-unit residential construction',
      'Rental turnovers and flip projects where speed and consistent colour matter',
    ],
    faqs: [
      { q: 'Do these slim panels need a housing?', a: 'No — the driver and junction box are built into the panel, so it mounts directly to drywall with spring clips. They are IC-rated and wet-location approved, which also makes them suitable for showers and soffits.' },
      { q: 'Are the slim panels dimmable?', a: 'Yes, most models dim smoothly to 10% with standard TRIAC wall dimmers. If your project uses 0-10V dimming, call the counter and we will match the right driver.' },
    ],
  },
  'led-gimbals': {
    kw: 'LED gimbal downlights Mississauga',
    type: 'LED gimbal downlight',
    intro:
      'The {name} is an adjustable LED gimbal downlight that lets you aim light exactly where the design calls for it — artwork, feature walls, kitchen islands and sloped ceilings. {spec0} in a compact trim that disappears into the ceiling. GSW stocks 3-inch and 4-inch gimbals at our Mississauga electrical supply store for same-day contractor pickup, with flat $30 shipping across Canada.',
    applications: [
      'Sloped and vaulted ceilings where fixed downlights wash the wrong surface',
      'Accent lighting for artwork, fireplaces and retail merchandising',
      'Kitchens and bathrooms where task areas shift during a renovation',
    ],
    faqs: [
      { q: 'How much can a gimbal tilt?', a: 'Most of our gimbals tilt 30–35 degrees and swivel a full 360 degrees, so one fixture position can serve multiple aiming points without moving the ceiling box.' },
      { q: 'Can I use gimbals in an insulated ceiling?', a: 'Yes. These fixtures are IC-rated for direct contact with insulation, provided the fixture is installed according to the listing.' },
    ],
  },
  'led-ceiling-fixture': {
    kw: 'residential LED ceiling fixtures Mississauga',
    type: 'LED ceiling fixture',
    intro:
      'The {name} is a surface-mount LED ceiling fixture built for dependable, maintenance-free residential light. {spec0}, with a diffuser that spreads light evenly and hides hotspots. Contractors across Mississauga, Brampton and Toronto choose GSW for ceiling fixtures because we keep depth of stock, quote real wholesale pricing, and can stage full floor packages for multi-unit jobs.',
    applications: [
      'Hallways, bedrooms, closets and common areas in homes and condos',
      'Basement apartments and in-law suites meeting OBC light levels',
      'Property management turnovers needing durable, low-cost fixtures',
    ],
    faqs: [
      { q: 'Are these fixtures dimmable?', a: 'Many models are dimmable to 10–20% with standard wall dimmers — check the spec row for "dimmable" on this model, or call us and we will confirm compatibility before you buy.' },
      { q: 'Do you sell matching fixtures for a whole building?', a: 'Yes. We regularly stage identical fixture packages for multi-unit residential jobs. Call +1 416-951-2650 with your counts and we will hold stock under one SKU.' },
    ],
  },
  'led-motion-sensor-light': {
    kw: 'LED motion sensor lights Mississauga',
    type: 'LED motion sensor light',
    intro:
      'The {name} is a motion-activated LED security light that switches on when it matters and stays off when it does not. {spec0} with adjustable sensing so you cover the entry, driveway or yard without nuisance trips. GSW is an electrical wholesaler supplying motion sensor lighting across the GTA with contractor pricing and counter pickup in Mississauga.',
    applications: [
      'Garages, carports and driveways for after-dark safety',
      'Building entries, stairwells and loading areas on commercial sites',
      'Side yards and pathways in residential and multi-residential properties',
    ],
    faqs: [
      { q: 'Can I adjust the sensitivity and timer?', a: 'Yes — the PIR range, dwell time and lux threshold are all field-adjustable, so the light only triggers at night and only when you want it to.' },
      { q: 'Is hardwiring required?', a: 'These are hardwired 120V fixtures. For areas without a nearby box, ask us about solar or plug-in alternatives when you call.' },
    ],
  },
  'led-under-cabinet-light': {
    kw: 'LED under cabinet lighting Mississauga',
    type: 'LED under cabinet light',
    intro:
      'The {name} is a low-profile LED under cabinet light that puts bright, even task light on counters without glare in your eyes. {spec0}, and linkable bars let you run one continuous run under a full kitchen wall. Kitchen renovators and electrical contractors buy under cabinet lighting from GSW because our Mississauga counter stocks linkable kits, drivers and accessories together.',
    applications: [
      'Kitchen task lighting under wall cabinets in renovations and new builds',
      'Workshops, laundry rooms and garage benches',
      'Retail back counters and display cases',
    ],
    faqs: [
      { q: 'Can the bars link together?', a: 'Yes — most of our under cabinet bars link end-to-end with jumper cables, and all bars on one run share a single driver or wall plug.' },
      { q: 'Hardwire or plug-in?', a: 'Both options exist. Plug-in kits are fastest for renovations; hardwire junction-box models are preferred for new construction. We stock both.' },
    ],
  },
  'led-strip-light': {
    kw: 'LED strip lights Mississauga',
    type: 'LED strip light',
    intro:
      'The {name} is a professional-grade LED strip light system for coves, toe-kicks, shelving and accent runs. {spec0} on a flexible tape that cuts to length and sticks in place, with aluminum channel options for a finished architectural look. As a lighting distributor in Mississauga, GSW stocks tape, drivers and channels together so your whole run comes from one supplier.',
    applications: [
      'Cove and tray ceilings in residential and hospitality spaces',
      'Under-cabinet, toe-kick and staircase accent lighting',
      'Backlit mirrors, signage and retail displays',
    ],
    faqs: [
      { q: '12V or 24V — which should I use?', a: 'We recommend 24V for runs longer than about 5 metres to avoid voltage drop and dimming at the far end. Both are in stock; tell us the run length and we will size the driver.' },
      { q: 'Is the strip dimmable?', a: 'Yes, with a compatible dimmable driver. We can supply the matching driver and dimmer so the whole circuit dims smoothly from one switch.' },
    ],
  },
  'led-outdoor-garden-light': {
    kw: 'LED garden lights Mississauga',
    type: 'LED garden light',
    intro:
      'The {name} is a weather-rated LED garden light built to make Ontario landscapes look their best year-round. {spec0} in a durable housing that shrugs off rain, snow and hose spray. Landscape contractors and DIY homeowners alike buy garden lighting from GSW\u2019s Mississauga store for the combination of wholesale pricing and in-stock depth.',
    applications: [
      'Pathways, driveways and front entrances in residential landscapes',
      'Gardens, trees and architectural accents for curb appeal',
      'Parks, condo podiums and commercial walkways',
    ],
    faqs: [
      { q: 'Low voltage or line voltage?', a: 'Most landscape fixtures run on 12V AC/DC from a transformer, which is safer to bury and easier to install. Line-voltage models are available for permanent hardwired installs — call to confirm.' },
      { q: 'Will these survive a Canadian winter?', a: 'Yes — these fixtures are IP65-rated with cold-rated LEDs and drivers, tested well below typical Ontario winter temperatures.' },
    ],
  },
  'led-flat-panel': {
    kw: 'commercial LED flat panel Toronto',
    type: 'LED flat panel',
    intro:
      'The {name} is a commercial-grade LED flat panel for offices, schools, clinics and retail back-of-house spaces. {spec0} with a uniform, glare-free lens that meets modern workplace standards. GSW supplies commercial LED lighting wholesale to Toronto-area contractors, with DLC-listed models that qualify for utility incentives and stock ready for pickup or flat-rate shipping.',
    applications: [
      'Offices, meeting rooms and corridors in commercial fit-outs',
      'Schools, clinics and healthcare facilities needing clean, uniform light',
      'Retail stockrooms and back-of-house areas',
    ],
    faqs: [
      { q: 'Is this panel DLC listed?', a: 'Yes — our commercial panels carry DLC or DLC Premium listing, which qualifies many projects for Hydro One and Toronto Hydro rebate programs. We can provide the DLC ID on request.' },
      { q: '2x2 or 2x4 — which do I need?', a: 'Match the existing grid: most Toronto commercial ceilings are 2x2 or 2x4 T-bar. Retrofit kits are also available if you are converting from parabolic troffers — call us with the fixture count.' },
    ],
  },
  'led-wall-pack': {
    kw: 'LED wall pack lights wholesale Toronto',
    type: 'LED wall pack',
    intro:
      'The {name} is a full-cutoff LED wall pack for building perimeters, loading docks and egress routes. {spec0} with a photocell option so the light manages itself from dusk to dawn. Commercial contractors across Toronto and the GTA buy LED wall packs wholesale from GSW for the mix of DLC-listed product, real stock and counter pickup in Mississauga.',
    applications: [
      'Building perimeters and egress lighting on commercial and industrial sites',
      'Loading docks, driveways and parking structure walls',
      'Apartment and condo common areas meeting OBC exterior light requirements',
    ],
    faqs: [
      { q: 'Does the wall pack include a photocell?', a: 'Most of our wall packs accept a twist-lock photocell and several ship with one included — check the spec table on this model. We always confirm the configuration when you order by phone.' },
      { q: 'Full cutoff — what does that mean?', a: 'A full-cutoff optic directs all light downward, eliminating uplight and meeting dark-sky and light-trespass requirements common in GTA municipalities.' },
    ],
  },
  'led-flood-light': {
    kw: 'LED flood lights wholesale Canada',
    type: 'LED flood light',
    intro:
      'The {name} is a high-output LED flood light engineered for large areas — parking lots, yards, facades and sports surfaces. {spec0} with precision optics that put light on the target, not the neighbours. GSW is a Canadian wholesale LED lighting supplier, so flood lights ship flat-rate across the country and are always available for pickup at our Mississauga counter.',
    applications: [
      'Parking lots, storage yards and construction sites',
      'Building facades, billboards and signage',
      'Sports courts, arenas and riding facilities',
    ],
    faqs: [
      { q: 'How do I choose wattage for a parking lot?', a: 'As a rule of thumb, 100W–150W LED replaces a 400W metal halide shoebox or flood. Tell us the pole height and spacing and we will run a quick layout to confirm foot-candles before you commit.' },
      { q: 'Are these lights dimmable or motion-controllable?', a: 'Most models accept 0-10V dimming and pair with motion sensors or photocells for after-hours energy savings. We stock compatible controls.' },
    ],
  },
  'led-retrofit-corn-light': {
    kw: 'LED corn light retrofit Canada',
    type: 'LED corn light',
    intro:
      'The {name} is an LED corn light that retrofits HID lamps — metal halide and high-pressure sodium — without replacing the fixture. {spec0} on a mogul base that screws straight into the existing socket after a ballast bypass. Contractors retrofitting post tops, wall packs and high bays buy corn lights from GSW at wholesale pricing with same-day GTA pickup.',
    applications: [
      'Retrofitting parking lot post tops and wall packs to LED',
      'Warehouse and gymnasium high bays running HID',
      'Quick payback projects where fixture replacement is not in the budget',
    ],
    faqs: [
      { q: 'Do I remove the ballast?', a: 'Yes — corn lamps operate on line voltage and require a ballast bypass (direct wire). It is a straightforward change our customers do every day; if you are unsure, any licensed electrician can handle it quickly.' },
      { q: 'What HID wattage does this replace?', a: '{spec0} typically replaces a {hidEquiv} HID lamp at roughly half the energy draw and many times the rated life.' },
    ],
  },
  'led-recessed-down-light': {
    kw: 'commercial LED downlights Toronto',
    type: 'LED recessed downlight',
    intro:
      'The {name} is a commercial-grade recessed LED downlight with the colour quality and glare control specifiers ask for. {spec0}, with high CRI that makes finishes and merchandise look right. Toronto-area electrical contractors source commercial downlights from GSW because we stock project quantities and match spec sheets item for item.',
    applications: [
      'Lobbies, corridors and meeting rooms in commercial fit-outs',
      'Retail displays where 90+ CRI matters',
      'Hospitality and healthcare interiors with demanding glare requirements',
    ],
    faqs: [
      { q: 'What does 90+ CRI mean for my project?', a: 'CRI measures colour accuracy. A 90+ CRI downlight renders materials and skin tones faithfully — the standard for retail, galleries and healthcare, and a noticeable upgrade over 80 CRI economy fixtures.' },
      { q: 'Can these dim on my existing controls?', a: 'We stock versions dimmable by TRIAC, ELV and 0-10V. Send us the switch or control schedule and we will match the exact driver variant.' },
    ],
  },
  'led-slim-canopy-light': {
    kw: 'LED canopy lights wholesale Toronto',
    type: 'LED canopy light',
    intro:
      'The {name} is a slim surface-mount LED canopy light for gas stations, drive-throughs, parkades and covered walkways. {spec0} in a low-profile housing that mounts where bulkier HID fixtures cannot. Gas station and retail contractors across the GTA buy canopy lighting wholesale from GSW with stock on the shelf and flat $30 Canada-wide shipping.',
    applications: [
      'Gas station and convenience store canopies',
      'Parking garages and covered parkades',
      'Drive-throughs, car washes and loading canopies',
    ],
    faqs: [
      { q: 'Will this fit my existing canopy cut-out?', a: 'Slim canopy lights are designed to surface-mount or cover legacy HID openings. Send us a photo of the existing opening and dimensions and we will confirm fit before you order.' },
      { q: 'Is the fixture rated for fuel-canopy use?', a: 'These fixtures are UL/cUL listed for wet locations. Class I Division 2 hazardous-location ratings are a separate listing — tell us about the site classification and we will supply the correct model.' },
    ],
  },
  'led-outdoor-shoebox-light': {
    kw: 'LED shoebox parking lot lights Canada',
    type: 'LED shoebox light',
    intro:
      'The {name} is an LED shoebox area light for parking lots, roadways and big-box retail sites. {spec0} with field-selectable optics and an included photocell for dusk-to-dawn operation. Canadian contractors buy shoebox lighting wholesale from GSW — DLC-listed product, 10kV surge protection options, and flat-rate shipping to any job site in the country.',
    applications: [
      'Parking lots for retail, offices, schools and apartment complexes',
      'Roadways, drive aisles and storage yards',
      'Car dealerships and distribution centres',
    ],
    faqs: [
      { q: 'Pole mount or wall mount?', a: 'Shoeboxes typically mount on poles with a slip-fitter (2-3/8 inch tenon) — we stock adapters for wall and trunnion mounting too. Tell us the pole schedule and we will configure the order.' },
      { q: 'What optic do I need?', a: 'Type III throws light forward along roadways and aisles; Type IV is symmetrical for open lots; Type V is a broad square for centred poles. We can help choose from the site plan or photometric.' },
    ],
  },
  'led-post-top-light': {
    kw: 'LED post top lights Canada',
    type: 'LED post top light',
    intro:
      'The {name} is a decorative LED post top light for pathways, parks, parking areas and streetscapes. {spec0} in a housing that upgrades the look of the site while cutting energy versus HID by more than half. Municipal, condo and commercial buyers across Canada source post tops from GSW at wholesale pricing with dependable stock.',
    applications: [
      'Parking lot and pathway lighting for condos and commercial sites',
      'Parks, trails and municipal streetscapes',
      'Campuses, cemeteries and hospitality entrances',
    ],
    faqs: [
      { q: 'What pole does it mount to?', a: 'Most post tops fit a standard 3-inch OD tenon. Adapters are available for larger poles; call with your pole detail and we will match the mounting.' },
      { q: 'Is a photocell included?', a: 'Many models ship photocell-ready with the cell available as an option. We typically supply units with photocells for dusk-to-dawn sites — just ask when ordering.' },
    ],
  },
  'led-linear-strip-fixture': {
    kw: 'LED strip light fixtures wholesale Toronto',
    type: 'LED linear strip fixture',
    intro:
      'The {name} is a commercial LED striplight for utility areas, retail back rooms and continuous-row installations. {spec0} in a slim housing that links end-to-end for clean, continuous runs. GTA contractors buy striplights wholesale from GSW because we stock 4ft and 8ft lengths in quantity and deliver to the job site on schedule.',
    applications: [
      'Retail back rooms, stockrooms and utility corridors',
      'Continuous-row lighting in workshops and maintenance bays',
      'Cove and shelf lighting in commercial fit-outs',
    ],
    faqs: [
      { q: 'Can I link multiple fixtures in a row?', a: 'Yes — striplights link end-to-end with connector whips, and rows can be fed from a single junction. We can plan the feed points with you if you share the room dimensions.' },
      { q: '4ft or 8ft — which is more economical?', a: '8ft fixtures use fewer housings and junction boxes per foot of run, which usually wins on installed cost for long rows. 4ft units are easier to handle and fit in chopped-up spaces.' },
    ],
  },
  'led-vapor-tight-fixture': {
    kw: 'LED vapor tight fixtures Canada',
    type: 'LED vapor tight fixture',
    intro:
      'The {name} is a sealed, gasketed LED vapor tight fixture for parking garages, car washes, tunnels and cold storage. {spec0} behind an impact-resistant lens that keeps out moisture, dust and corrosion. Contractors building parkades and wash bays across Canada buy vapor tight lighting from GSW for the IP65/IP66 rating depth and fast flat-rate shipping.',
    applications: [
      'Parking garages and parkade ceilings',
      'Car washes, tunnels and utility corridors',
      'Food processing, cold storage and wash-down areas',
    ],
    faqs: [
      { q: 'IP65 vs IP66 — what is the difference?', a: 'Both are dust-tight and hose-proof; IP66 adds protection against powerful jets, which matters in wash-down and pressure-wash environments. We stock both — tell us the cleaning regime and we will spec it.' },
      { q: 'Does it handle cold temperatures?', a: 'Yes — LED vapor tights with quality drivers start reliably well below freezing, making them the standard for unheated parkades and cold storage across Canada.' },
    ],
  },
  'led-track-light': {
    kw: 'LED track lighting wholesale Toronto',
    type: 'LED track light',
    intro:
      'The {name} is a precision LED track light for retail displays, galleries and hospitality spaces. {spec0} with the aiming flexibility merchandisers need and the colour quality that makes product pop. Retail fit-out contractors across Toronto buy track lighting wholesale from GSW, with H/J/L adapter compatibility confirmed before you order.',
    applications: [
      'Retail displays, window walls and feature merchandising',
      'Galleries, showrooms and museums',
      'Restaurants, bars and hotel public areas',
    ],
    faqs: [
      { q: 'Which track system does it fit?', a: 'Our track heads are available with H-type, J-type and L-type adapters to match existing track. New installs typically use H-type — we stock track, connectors and heads as a complete system.' },
      { q: 'What beam angle should I choose?', a: 'Narrow 15–24° spots highlight individual products; 36–40° accents cover wall sections; floods wash general areas. Mixed angles on one run give the layered look designers want.' },
    ],
  },
  'exit-emergency-led-lighting': {
    kw: 'exit signs and emergency lights Canada',
    type: 'exit and emergency light',
    intro:
      'The {name} is a cULus-listed exit and emergency lighting unit for code-compliant egress. {spec0} with 90-minute battery backup and universal mounting for walls and ceilings. Electrical contractors across Canada buy life-safety lighting from GSW because every unit we ship carries the certifications inspectors look for — and we stock them in depth.',
    applications: [
      'Egress routes in offices, retail, industrial and multi-residential buildings',
      'Exit door marking per Ontario Fire Code and OBC requirements',
      'Schools, clinics and public assembly spaces',
    ],
    faqs: [
      { q: 'Does this meet Ontario Fire Code?', a: 'Yes — our exit signs and emergency units are cULus listed to CSA 22.2 No. 141 with 90-minute battery backup, meeting Ontario Fire Code and OBC egress requirements. Certificates are available on request.' },
      { q: 'Red or green letters?', a: 'Ontario accepts both, but red is the most common choice locally. Most of our units accept either legend — tell us your preference when ordering.' },
    ],
  },
  'led-ufo-high-bay': {
    kw: 'LED UFO high bay lights Canada',
    type: 'LED UFO high bay',
    intro:
      'The {name} is an industrial LED UFO high bay for warehouses, gymnasiums and manufacturing floors. {spec0} with high-efficiency optics that put light on the floor, not the walls. GSW is a Canadian wholesale supplier of LED high bay lights, stocking 100W–240W UFOs with DLC Premium listings, hook mounts included, and flat $30 shipping to any industrial job site.',
    applications: [
      'Warehouses and distribution centres up to 9-metre mounting heights',
      'Manufacturing floors, workshops and maintenance bays',
      'Gymnasiums, arenas and big-box retail',
    ],
    faqs: [
      { q: 'How many high bays do I need for my warehouse?', a: 'It depends on mounting height, racking layout and required foot-candles. As a guide, 150W UFOs on 4–5 metre centres serve most 6–8 metre warehouses well. Send us the floor plan and we will estimate quantities and spacing for free.' },
      { q: 'UFO or linear high bay — which is better?', a: 'UFOs are compact, quick to hang and ideal for open areas and lower ceilings. Linear high bays with aisle optics win in racked warehouses where light must travel down narrow aisles. Call us with the layout and we will recommend the right optic.' },
    ],
  },
  'led-linear-high-bay': {
    kw: 'linear LED high bay lights Canada',
    type: 'LED linear high bay',
    intro:
      'The {name} is a linear LED high bay with aisle optics engineered for racked warehouses and big-box retail. {spec0} in a slim batten that chains or rods into place and links in continuous rows. Canadian warehouse contractors buy linear high bays wholesale from GSW for the DLC Premium efficiency and aisle-specific photometrics.',
    applications: [
      'Racked warehouses and distribution centres',
      'Big-box retail and wholesale club sales floors',
      'Manufacturing lines and assembly plants',
    ],
    faqs: [
      { q: 'What are aisle optics?', a: 'Aisle optics concentrate the beam into a narrow rectangle that travels down storage aisles, lighting pallet faces evenly instead of wasting lumens on rack tops. They typically deliver 30%+ more usable light per watt in racked spaces.' },
      { q: 'Can I dim these with occupancy sensors?', a: 'Yes — with the 0-10V dimming versions paired with high-bay motion sensors, unoccupied aisles drop to a low level and return to full output on approach. The energy savings usually pay for the sensors within a year.' },
    ],
  },
  'led-linear-strip-light': {
    kw: 'industrial LED strip lights Canada',
    type: 'industrial LED strip light',
    intro:
      'The {name} is an industrial-grade LED strip fixture for plants, shops and utility spaces that need tough, serviceable lighting. {spec0} in a housing that accepts wire guards and links into continuous rows. Maintenance crews and plant electricians across Canada order industrial striplights from GSW at wholesale pricing with parts support after the sale.',
    applications: [
      'Manufacturing plants and process areas',
      'Auto shops, warehouses and service garages',
      'Utility tunnels, mechanical rooms and storage areas',
    ],
    faqs: [
      { q: 'Can I get these with wire guards?', a: 'Yes — most industrial strip fixtures accept optional wire guards for impact protection in shops and plants where forklifts and ladders are moving. Add them to your order by phone.' },
      { q: 'Are replacement drivers and boards available?', a: 'That is the advantage of buying from a real distributor: drivers, boards and lenses for the fixtures we sell are stocked as parts, so a damaged unit is repaired — not landfilled.' },
    ],
  },
  'device-box': {
    kw: 'electrical device boxes Mississauga',
    type: 'electrical device box',
    intro:
      'The {name} is a cULus-listed steel device box for device, fixture and junction mounting in residential and commercial rough-ins. {spec0}, formed from galvanized steel with clean knockouts that punch without tearing. GSW is an electrical materials supplier in Mississauga with device boxes on the shelf by the case — priced for contractors, not retail.',
    applications: [
      'Device and switch rough-ins in residential construction',
      'Commercial metal-stud and drywall partitions',
      'Surface-mounted devices with raised covers',
    ],
    faqs: [
      { q: 'What is the difference between a device box and a handy box?', a: 'Device boxes are gangable 2x4 or 4x4 boxes for flush device mounting; handy boxes are single-gang surface boxes used with raised covers for exposed work. We stock both — tell us the application.' },
      { q: 'Do you sell by the case?', a: 'Yes — all our boxes and covers are case-quantity priced, and mixed-case orders are fine. Call the counter for your contractor pricing tier.' },
    ],
  },
  'wire': {
    kw: 'copper building wire Mississauga',
    type: 'copper building wire',
    intro:
      'The {name} is CSA-certified copper building wire for branch circuits, feeders and service runs. {spec0}, rated for Canadian temperatures and pulling through cold conduit. Electrical contractors across the GTA buy wire from GSW\u2019s Mississauga warehouse because we keep full reels and coils in stock with honest per-metre and per-reel pricing.',
    applications: [
      'Residential branch circuits and service entrances (NMD90)',
      'Commercial feeders and runs in conduit (RW90/T90)',
      'Panel work, HVAC circuits and machine hook-ups',
    ],
    faqs: [
      { q: 'NMD90 vs RW90 — which do I need?', a: 'NMD90 is non-metallic sheathed cable for wood-frame residential work; RW90 is a single conductor for conduit, commercial and industrial runs. Your drawings will call one out — if not, call us and we will confirm the code requirement.' },
      { q: 'Can I return unused wire?', a: 'Full, undamaged reels and coils in original packaging can usually be returned or credited — ask about our current return policy when you order so we can note it on the account.' },
    ],
  },
  'device': {
    kw: 'electrical devices wholesale Mississauga',
    type: 'electrical device',
    intro:
      'The {name} is a commercial-grade electrical device rated for the demands of everyday contractor use — not the big-box residential line. {spec0} with back and side wiring for fast installs. GSW stocks receptacles, switches, GFCI and dimmers at the Mississauga counter in contractor case quantities.',
    applications: [
      'Commercial fit-outs, offices and retail spaces',
      'Multi-residential units and common areas',
      'Spec jobs requiring commercial-grade durability',
    ],
    faqs: [
      { q: 'Commercial grade vs residential grade — does it matter?', a: 'Yes. Commercial-grade devices use thicker contacts and bodies rated for heavier use — they survive ten-tenant condos and retail traffic where residential devices fail early. The price difference is small; the callbacks are not.' },
      { q: 'Do you stock tamper-resistant and GFCI devices?', a: 'Yes — TR receptacles are code-required in most residential locations, and we stock GFCI in 15A and 20A, plus AFCI breakers to match. Everything to pass inspection in one order.' },
    ],
  },
  'panel-board-breakers': {
    kw: 'panel boards and breakers Mississauga',
    type: 'panel board and breaker',
    intro:
      'The {name} is a CSA-certified loadcentre or breaker for service and distribution work. {spec0}, accepted by ESA inspectors across Ontario. Contractors doing service upgrades and commercial distribution buy panels and breakers from GSW for the in-stock selection and the confidence that what we sell passes inspection the first time.',
    applications: [
      'Residential service upgrades and 100A/200A loadcentres',
      'Commercial panelboards and distribution',
      'Breaker replacements and emergency repairs',
    ],
    faqs: [
      { q: 'Do you sell panels with the breakers bundled?', a: 'Yes — we can supply loadcentres pre-loaded with the breaker schedule, which saves the job-site sorting time. Send the panel schedule and we will quote it assembled.' },
      { q: 'Can I mix breaker brands in my panel?', a: 'Generally no — panels accept only their manufacturer\u2019s listed breakers (or approved classified types). Tell us the panel make and we will match breakers that are listed for it.' },
    ],
  },
  'disconnect-switch-fuses': {
    kw: 'disconnect switches and fuses Mississauga',
    type: 'disconnect switch and fuse',
    intro:
      'The {name} is a heavy-duty safety switch or fuse for isolating equipment per code. {spec0} with quick-make/quick-break mechanisms and rain-tight enclosures where the job demands them. HVAC, machine and service contractors across the GTA source disconnects and fuses from GSW with same-day counter availability.',
    applications: [
      'HVAC condenser and air-handler disconnects',
      'Machine and motor isolation in industrial plants',
      'Service equipment requiring fusible protection',
    ],
    faqs: [
      { q: 'Fusible or non-fusible — which do I need?', a: 'Non-fusible switches are local isolators only; fusible switches add overcurrent protection via Class J or R fuses. The equipment nameplate and code determine which — send us the spec and we will match it.' },
      { q: 'Which fuse class fits my switch?', a: 'Most modern disconnects take Class J; older equipment may use Class R or H. The switch label lists acceptable classes — bring the part number or a photo and we will identify the right fuse.' },
    ],
  },
  'transformer': {
    kw: 'electrical transformers Canada',
    type: 'electrical transformer',
    intro:
      'The {name} is a CSA-certified transformer for stepping service voltages down to usable distribution or control power. {spec0} with efficient cores built for continuous duty. Electrical contractors and plant maintenance teams across Canada order transformers from GSW with lead times confirmed up front — made-to-order units are quoted honestly, not optimistically.',
    applications: [
      'Commercial and industrial 600V to 208Y/120V distribution',
      'Machine panels and motor-control circuits',
      'Isolated power for sensitive equipment',
    ],
    faqs: [
      { q: 'How do I size a transformer?', a: 'Sum the connected loads with a diversity factor, check inrush for motor loads, and add 20–25% growth. Send us the load schedule and we will verify the kVA rating and primary/secondary voltages before you order.' },
      { q: 'What is the lead time on made-to-order transformers?', a: 'Stock control transformers ship immediately; larger dry-type units typically run 2–4 weeks. We confirm the exact lead time on your quote so you can schedule the rough-in with confidence.' },
    ],
  },
  'service-meter-sockets': {
    kw: 'service meter sockets Mississauga',
    type: 'service meter socket',
    intro:
      'The {name} is a CSA-certified meter base for overhead or underground service entrances, built to Ontario utility standards. {spec0} with ringless covers, lever bypass options and rain-tight NEMA 3R enclosures. GTA electrical contractors buy meter sockets from GSW because our units match what Toronto Hydro, Alectra and Enova inspectors expect to see.',
    applications: [
      'Residential service replacements and new installations',
      'Overhead and underground utility service entrances',
      'Multi-unit metering assemblies',
    ],
    faqs: [
      { q: 'Overhead or underground — how do I know which socket?', a: 'It depends on the service feed to the building: overhead fed from a mast uses an OH socket; underground fed from a conduit uses a UG socket. Your utility connection agreement specifies it — or call us with the service type.' },
      { q: 'What is a lever bypass and do I need one?', a: 'A lever bypass lets the utility de-energize the load side without pulling the meter. Many utilities now require it on new services — we stock lever-bypass models so you pass inspection the first time.' },
    ],
  },
  'pvc-conduit-fittings': {
    kw: 'PVC conduit and fittings Mississauga',
    type: 'PVC conduit and fitting',
    intro:
      'The {name} is CSA-certified PVC raceway for underground, concrete-encased and corrosive-environment runs. {spec0} — sunlight-resistant conduit and Schedule 40/80 fittings with the bell ends and threading that make underground work go faster. Civil and electrical contractors across Mississauga buy PVC conduit from GSW by the bundle at wholesale pricing.',
    applications: [
      'Underground service laterals and duct runs',
      'Concrete-encased raceway in slabs and parking structures',
      'Corrosive environments like farms, pools and treatment plants',
    ],
    faqs: [
      { q: 'Schedule 40 or Schedule 80 — which do I need?', a: 'Schedule 40 is standard for underground and encased work; Schedule 80 is for exposed locations where physical protection is required, and for stub-ups. Drawings typically call it out — we stock both.' },
      { q: 'Do you stock the fittings to match?', a: 'Yes — couplings, elbows (including factory 90s), adapters, expansion fittings and solvent cement are all on the shelf, so the underground package comes from one order.' },
    ],
  },
  'emt-conduit-fittings': {
    kw: 'EMT conduit and fittings Mississauga',
    type: 'EMT conduit and fitting',
    intro:
      'The {name} is cULus-listed EMT raceway or a matching steel fitting for exposed and concealed commercial work. {spec0} — straight, burr-free conduit that pulls clean, with compression and set-screw connectors that tighten without stripping. Commercial contractors across the GTA order EMT from GSW by the bundle with next-day counter availability.',
    applications: [
      'Commercial exposed runs in retail, office and industrial fit-outs',
      'Concealed raceway in partitions and slabs',
      'Feeder and branch-circuit work where EMT is specified',
    ],
    faqs: [
      { q: 'Compression or set-screw connectors?', a: 'Compression connectors are the default for most commercial work — they seal better and pull better. Set-screw types are acceptable indoors in dry locations where the spec allows. We stock both in every trade size.' },
      { q: 'Do you sell EMT by the bundle?', a: 'Yes — 10-foot lengths come bundled, and bundle pricing beats per-stick pricing significantly. Mixed-size orders are no problem; call for your contractor tier.' },
    ],
  },
  'floor-heating-cable-thermostat': {
    kw: 'floor heating cable and thermostat Mississauga',
    type: 'floor heating cable and thermostat',
    intro:
      'The {name} is a cULus-listed electric floor heating component for warm tile, stone and laminate floors. {spec0} with GFCI protection built in and thermostats that hold the floor exactly where the homeowner wants it. Renovation contractors across the GTA buy floor heating from GSW because we stock kits and matching thermostats together with technical backup on layout.',
    applications: [
      'Bathroom and kitchen floor warming in renovations',
      'Entrances, mudrooms and condo balconies',
      'Commercial spaces needing supplemental floor heat',
    ],
    faqs: [
      { q: 'How much cable do I need for my floor?', a: 'Cable kits are sized by area — measure the open floor minus fixed objects (tub, vanity, toilet) and choose the kit that covers it. Never cut or overlap heating cable; if the area is between kit sizes, choose the smaller and adjust spacing. We will walk you through it by phone.' },
      { q: 'Does floor heating need a dedicated circuit?', a: 'Larger kits do — sizing depends on total wattage. The thermostat and cable ratings are on the spec; send us the layout and load and we will confirm the circuit requirements.' },
    ],
  },
  'bathroom-exhaust-fan': {
    kw: 'bathroom exhaust fans Mississauga',
    type: 'bathroom exhaust fan',
    intro:
      'The {name} is an ENERGY STAR-rated bathroom exhaust fan that clears moisture quietly and reliably. {spec0} — sized for real bathrooms with the duct connections and grilles contractors prefer. Builders and renovators across Mississauga and Toronto buy exhaust fans from GSW at wholesale pricing with volume stock for multi-bathroom jobs.',
    applications: [
      'Bathroom ventilation in new homes and renovations',
      'Condo and rental unit turnovers',
      'Laundry rooms and ensuites needing humidity control',
    ],
    faqs: [
      { q: 'What CFM do I need for my bathroom?', a: 'Rule of thumb: 1 CFM per square foot of bathroom, minimum 50 CFM, and add capacity for high ceilings or jetted tubs. An 80 CFM fan covers most standard bathrooms; large ensuites may want 110 CFM.' },
      { q: 'What does "sones" mean?', a: 'Sones measure perceived loudness — lower is quieter. Under 1.0 sone is nearly inaudible; 3+ sones is clearly noticeable. We stock quiet models because homeowners complain about noise more than any other fan spec.' },
    ],
  },
  'vapor-barrier': {
    kw: 'vapor barrier Mississauga',
    type: 'vapor barrier',
    intro:
      'The {name} is code-compliant polyethylene sheeting for interior foundation walls, crawl spaces and slab undersides — the moisture control layer Ontario building code expects. {spec0}. Foundation and renovation contractors across the GTA pick up vapor barrier from GSW along with their electrical order, one stop, one flat-rate delivery.',
    applications: [
      'Interior basement and foundation wall encapsulation',
      'Crawl-space moisture control',
      'Slab and under-slab moisture protection',
    ],
    faqs: [
      { q: 'How thick should a vapor barrier be?', a: 'Ontario code references 6-mil (0.15 mm) polyethylene minimum for residential applications, with taped seams. We stock 6-mil rolls and the tuck tape to seal them.' },
      { q: 'Vapor barrier or vapour-permeable membrane?', a: 'They solve opposite problems — vapor barriers stop interior moisture reaching cold surfaces; breathable membranes let assemblies dry. For interior basement walls in Ontario, 6-mil poly on the warm side is the standard. Call us if the drawing specifies otherwise.' },
    ],
  },
  'emergency-smoke-alarm': {
    kw: 'smoke alarms Mississauga',
    type: 'smoke alarm',
    intro:
      'The {name} is a cULus-listed hardwired smoke or combination alarm for code-compliant residential protection. {spec0} with battery backup so protection continues through outages. Electrical contractors and builders across the GTA buy smoke alarms from GSW in case quantities, matched to Ontario Fire Code and OBC requirements.',
    applications: [
      'New-home and multi-unit residential installations',
      'Retrofits replacing expired or recalled alarms',
      'Landlord and property-management compliance upgrades',
    ],
    faqs: [
      { q: 'How many smoke alarms does my project need?', a: 'Ontario Fire Code requires one on every storey and outside sleeping areas, plus one in every bedroom for new construction — interconnected so one alarm sounds them all. Send us the floor plans and we will count the exact requirement.' },
      { q: 'Photoelectric or ionization?', a: 'Photoelectric sensors detect smouldering fires faster with fewer nuisance trips from cooking — which is why modern code and most contractors prefer them. Combination CO units add carbon monoxide protection where fuel-burning appliances exist.' },
    ],
  },
};

// HID equivalence used in the corn-light FAQ template.
const HID_EQUIV: Partial<Record<string, string>> = {
  'led-corn-light-60w-e39': '250W',
  'led-corn-light-100w-e39': '400W',
};

const GENERIC: CategoryTemplate = {
  kw: 'wholesale electrical supplies Canada',
  type: 'electrical product',
  intro:
    'The {name} is a quality electrical product stocked by Green Solar World for contractors across the GTA and Canada. {spec0}. Buy it at true wholesale pricing with flat $30 Canada-wide shipping or free pickup at our Mississauga counter — and call the counter any time for technical guidance on your project.',
  applications: [
    'Commercial construction and fit-out projects',
    'Residential new construction and renovation',
    'Industrial maintenance and plant work',
  ],
  faqs: [
    { q: 'Is this item in stock?', a: 'Stock moves quickly at the counter. Call +1 416-951-2650 and we will confirm live availability and reserve stock for your job.' },
    { q: 'Do you offer contractor pricing?', a: 'Yes — all pricing on this site is wholesale, with additional quantity breaks for contractor accounts. Phone orders get the fastest quote.' },
  ],
};

function fill(template: string, p: Product): string {
  return template
    .replaceAll('{name}', p.name)
    .replaceAll('{spec0}', p.specs[0] ?? '')
    .replaceAll('{hidEquiv}', HID_EQUIV[p.slug] ?? '400W');
}

export function productContent(p: Product): ProductContent {
  const t = (T as Record<string, CategoryTemplate>)[p.category] ?? GENERIC;
  const whyGsw = WHY_GSW.replaceAll('{name}', p.name);
  const faqs = t.faqs.map((f) => ({
    q: fill(f.q, p),
    a: fill(f.a, p),
  }));
  return {
    keyword: t.kw,
    intro: fill(t.intro, p),
    applications: t.applications,
    whyGsw,
    faqs,
  };
}

export function productMetaTitle(p: Product): string {
  // Front-load "<Product Name> Canada", keep final title ≤ 60 chars after the
  // "%s | Green Solar World Inc." layout template (25-char suffix) is applied.
  const SUFFIX = ' | Green Solar World Inc.';
  for (const candidate of [`${p.name} Canada`, p.name]) {
    if (candidate.length + SUFFIX.length <= 60) return candidate;
  }
  const max = 60 - SUFFIX.length;
  return `${p.name.slice(0, max - 1).trimEnd()}…`;
}

export function productMetaDescription(p: Product): string {
  // 150–160 chars with CTA where possible.
  const lead = `Buy the ${p.name} wholesale in Canada. ${p.specs[0] ?? ''} — cULus/DLC certified, flat $30 shipping.`;
  if (lead.length <= 160) return lead;
  return `${lead.slice(0, 157).trimEnd()}…`;
}
