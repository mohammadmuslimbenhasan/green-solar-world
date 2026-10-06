// Collection-level SEO copy (Phase 2) — 250–400 word intros + buying-guide FAQs,
// keyword-targeted per the phase-2 keyword map.

import type { CollectionSlug } from '@/data/catalog';

export interface CollectionContent {
  keyword: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];
  buyingGuide: string[];
  faqs: { q: string; a: string }[];
}

export const collectionContent: Record<CollectionSlug, CollectionContent> = {
  'residential-lighting': {
    keyword: 'residential LED lighting Mississauga',
    metaTitle: 'Residential LED Lighting Mississauga | Wholesale Panels & Fixtures',
    metaDescription:
      'Wholesale residential LED lighting in Mississauga: slim panels, gimbals, ceiling fixtures, motion sensors and strip lights. Contractor pricing, flat $30 Canada shipping.',
    intro: [
      'Green Solar World is a lighting distributor supplying residential LED lighting to contractors across Mississauga, Toronto and the GTA. Our residential collection covers the full house: 3-inch, 4-inch and 6-inch slim panels for general light, adjustable gimbals for sloped ceilings and accents, flush-mount ceiling fixtures for hallways and bedrooms, motion-sensor security lights, under-cabinet task lighting, flexible strip systems and weather-rated garden lighting.',
      'Every fixture in this collection is chosen for what matters on residential jobs — IC ratings for insulated ceilings, wet-location approval for bathrooms and soffits, high CRI for kitchens, and selectable colour temperature so a whole floor or building matches. Because we are a wholesaler, not a retailer, you buy at distributor pricing with contractor quantity breaks, and most of the collection is on the shelf at our Mississauga counter for same-day pickup.',
    ],
    buyingGuide: [
      'Choose slim panels for whole-home retrofits — they need no housing and install in minutes per room. Pick 3000K for living spaces and 4000K–5000K for kitchens, baths and work areas. For accent walls and sloped ceilings, gimbals give you aiming flexibility a fixed panel cannot. Layer in under-cabinet bars and strip systems for task and accent light, and finish entries and yards with motion-sensor fixtures for security.',
      'Not sure which trim size or colour temperature the drawings call for? Call +1 416-951-2650 — we read residential specs all day and will match the schedule item for item.',
    ],
    faqs: [
      { q: 'What colour temperature is best for homes?', a: '3000K warm white is the GTA standard for living areas and bedrooms; 4000K suits kitchens and bathrooms; 5000K is common for garages and laundry rooms. Many of our fixtures are selectable, so you can dial it in on site.' },
      { q: 'Do your residential fixtures meet Ontario code?', a: 'Yes — our panels and downlights carry cULus listings with IC and wet-location ratings where required, satisfying OBC requirements for insulated ceilings, bathrooms and soffits.' },
      { q: 'Can I get project pricing for a multi-unit building?', a: 'Absolutely — send the fixture schedule and quantities and we will quote the whole package at contractor tier pricing, with stock held until your rough-in date.' },
    ],
  },
  'commercial-lighting': {
    keyword: 'commercial LED lighting wholesale Toronto',
    metaTitle: 'Commercial LED Lighting Wholesale Toronto | Panels, Wall Packs',
    metaDescription:
      'Commercial LED lighting wholesale for Toronto contractors: flat panels, wall packs, flood lights, shoeboxes, canopy, vapor-tight, exit & emergency. DLC listed, flat $30 shipping.',
    intro: [
      'GSW supplies commercial LED lighting wholesale to contractors across Toronto and the GTA — the fixtures that build an entire commercial lighting package from one supplier. Flat panels and downlights for interiors, wall packs and flood lights for the envelope, shoebox area lights for the lot, canopy fixtures for drive-throughs and parkades, vapor-tight for garages and wash-down areas, track systems for retail, and cULus-listed exit & emergency units for life safety.',
      'Most of our commercial line carries DLC or DLC Premium listing, which keeps your projects eligible for Ontario utility incentive programs, and cULus/ETL certification so inspections pass the first time. We stock project depth — not shelf samples — so a 200-fixture office fit-out or a full retail rollout ships complete, with flat $30 delivery anywhere in Canada or same-day counter pickup in Mississauga.',
    ],
    buyingGuide: [
      'Build the package from the outside in: shoeboxes and wall packs for the site, canopy and vapor-tight for structures, flat panels for interiors, and exit & emergency for egress. Match colour temperature across the project — 4000K is the Toronto commercial default — and spec photocells on all dusk-to-dawn fixtures. For retail interiors, mix track beam angles to layer accent over ambient.',
      'Send us the fixture schedule or a marked-up drawing and we will return a complete quote with DLC IDs, lead times and alternates for any long-stock items.',
    ],
    faqs: [
      { q: 'Are your commercial fixtures DLC listed?', a: 'The majority of our commercial line is DLC or DLC Premium listed, qualifying projects for utility rebates. We provide DLC IDs with every quote so your rebate paperwork is ready.' },
      { q: 'Do you handle full commercial lighting packages?', a: 'Yes — packages are our specialty. One purchase order covers panels, wall packs, area lights, emergency units and controls, shipped together to the job site.' },
      { q: 'What lead time should I plan for a fit-out?', a: 'Stocked fixtures are same-day or next-day. Made-to-order items run 1–4 weeks. We confirm every lead time on the quote so your schedule holds.' },
    ],
  },
  'industrial-lighting': {
    keyword: 'industrial LED high bay lights Canada',
    metaTitle: 'Industrial LED High Bay Lights Canada | Wholesale UFO & Linear',
    metaDescription:
      'Industrial LED high bay lights Canada: wholesale UFO and linear high bays, 100W–240W, DLC Premium, aisle optics. Mississauga counter pickup, flat $30 shipping Canada-wide.',
    intro: [
      'When the ceiling is high and the hours are long, industrial LED high bay lights are the answer — and GSW stocks them wholesale across Canada. Our industrial collection centres on two workhorse families: round UFO high bays from 100W to 240W for open warehouses, gymnasiums and manufacturing floors, and linear high bays with aisle optics for racked distribution centres where light has to travel down narrow lanes between pallets.',
      'Every high bay we sell ships with industrial-grade drivers, hook or chain mounting included, 0-10V dimming, and the certifications Canadian inspectors expect: cULus safety listing and DLC Premium efficiency. From our Mississauga warehouse we ship flat-rate to industrial job sites in every province — and local GTA crews can have units in the truck the same morning.',
    ],
    buyingGuide: [
      'Mounting height drives wattage: 100W–150W UFOs for 4–6 metre ceilings, 200W–240W for 7–9 metres and high-rack areas. Choose UFOs for open floors and linear aisle-optic fixtures where racking runs deep. Add high-bay motion sensors on 0-10V dimmable models — unoccupied aisles drop to low level and the energy savings typically pay for the sensors within a year.',
      'Send us the floor plan with racking layout and ceiling height and we will estimate fixture counts, spacing and a bill of materials at wholesale pricing.',
    ],
    faqs: [
      { q: 'How many high bays does my warehouse need?', a: 'It depends on mounting height, racking and target foot-candles. As a guide, 150W UFOs at 4–5 metre centres cover most 6–8 metre open warehouses. Share your floor plan and we will run a layout estimate for free.' },
      { q: 'UFO or linear high bay?', a: 'UFOs are compact, quick to hang and ideal for open areas. Linear high bays with aisle optics outperform them in racked warehouses, putting light on pallet faces instead of rack tops. We stock both and will recommend per layout.' },
      { q: 'Do high bays qualify for energy rebates?', a: 'Our DLC Premium models qualify for most Canadian utility incentive programs. Ask for DLC IDs with your quote and we will include the documentation.' },
    ],
  },
  'electrical-materials': {
    keyword: 'electrical materials supplier Mississauga',
    metaTitle: 'Electrical Materials Supplier Mississauga | Wire, Devices, Panels',
    metaDescription:
      'Electrical materials supplier in Mississauga: copper wire, devices, boxes, panels & breakers, conduit, transformers, smoke alarms. Wholesale pricing, flat $30 Canada shipping.',
    intro: [
      'Behind every lighting package is a rough-in, and GSW is the electrical materials supplier Mississauga contractors call for both. This collection is the full book: copper building wire in NMD90, T90 and RW90; steel device boxes and handy boxes; commercial-grade receptacles, switches, GFCI and dimmers; loadcentres, panelboards and breakers; safety switches and Class J fuses; dry-type and control transformers; meter sockets to Ontario utility standards; PVC and EMT conduit with every fitting; plus floor heating cable, exhaust fans, vapor barrier and interconnected smoke alarms.',
      'Everything is CSA or cULus certified, stocked in contractor case and reel quantities, and priced at the wholesale tier — because we serve the trade, not the weekend DIY market. Pick up at our 4615 Burgoyne St. counter or take flat $30 shipping to any job site in Canada.',
    ],
    buyingGuide: [
      'Build your rough-in list by system: service (meter socket, loadcentre, breakers), branch (wire, boxes, devices), raceway (PVC underground or EMT exposed), and finishing (cover plates, fans, alarms). Buying the package from one counter means one pickup, one invoice and no missing fittings on rough-in day. We bundle EMT conduit with compression connectors, and PVC with elbows, couplings and cement — ask for the complete underground or fit-out package.',
      'Not sure what the drawings call for? Bring the spec sheet to the counter or read it to us over the phone — identifying the right wire, breaker or fuse class is a two-minute conversation.',
    ],
    faqs: [
      { q: 'Do you sell wire by the reel and by the metre?', a: 'We sell full reels and coils at reel pricing, and standard lengths off the counter for small jobs. Contractor accounts get tiered pricing on full reels.' },
      { q: 'Are your panels and breakers ESA-compliant?', a: 'Yes — every loadcentre, breaker, meter socket and safety switch we sell is CSA certified and accepted by ESA inspectors across Ontario.' },
      { q: 'Can I get the whole rough-in package quoted at once?', a: 'That is the fastest way to buy from us. Send or read us the material list and we quote the complete package — usually while you are still on the phone.' },
    ],
  },
};

// Collections index page copy
export const collectionsIndexMeta = {
  metaTitle: 'LED Lighting Collections | Residential, Commercial & Industrial',
  metaDescription:
    'Browse GSW LED lighting collections: residential, commercial, industrial and electrical materials. Wholesale pricing for contractors, flat $30 shipping across Canada.',
};
