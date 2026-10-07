import Link from 'next/link';
import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import Counter from '@/components/Counter';
import ProductCard from '@/components/ProductCard';
import Carousel from '@/components/Carousel';
import ReviewsCarousel from '@/components/Reviews';
import FaqAccordion from '@/components/FaqAccordion';
import JsonLd, { breadcrumbSchema, faqSchema } from '@/components/JsonLd';
import { featuredProducts, getReviews, getCatalog } from '@/lib/data';
import { SITE, categories, products } from '@/data/catalog';
import { gbpAggregate, GBP_URL } from '@/data/reviews';
import { BRAND_LOGOS } from '@/data/image-notes';
import { IMAGE_DIMS } from '@/lib/image-dims';

export const revalidate = 300; // ISR: catalog pages stay static-fast, refresh every 5 minutes

export const metadata: Metadata = {
  title: 'Electrical Supply Store Mississauga | Wholesale LED Lighting Canada',
  description:
    'Green Solar World is an electrical supply store in Mississauga and lighting distributor for Toronto & the GTA. Wholesale LED lighting Canada-wide. Flat $30 shipping — call +1 416-951-2650.',
  alternates: { canonical: '/' },
};

const TRUST = [
  {
    title: 'Flat $30 Shipping',
    text: 'One flat rate anywhere in Canada — or free pickup at our Mississauga counter.',
    icon: <path d="M2 6h9v8H2zM11 9h4l3 3v2h-7zM6 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm9 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />,
  },
  {
    title: 'Wholesale Pricing',
    text: 'True distributor pricing on a full line of electrical and lighting products, with contractor quantity breaks.',
    icon: <path d="M20.6 13.4 12 22 2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8zM7 7h.01" />,
  },
  {
    title: 'Technical Expertise',
    text: 'Our team helps you pick the right product for every job — commercial, residential or industrial.',
    icon: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.7 1 1.5 1 2.5h6c0-1 .2-1.8 1-2.5A6 6 0 0 0 12 3z" />,
  },
  {
    title: 'Contractor-Focused',
    text: 'Counter pickup, phone quotes and stock staged for your rough-in date. Built for the trade.',
    icon: <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" />,
  },
];

const HOME_FAQS = [
  {
    q: 'How much is shipping?',
    a: `Flat $${SITE.shippingFlat} anywhere in Canada, on orders of any size. Prefer to pick up? Your order is free to collect at our Mississauga counter at 4615 Burgoyne St. — just call ahead and we will have it staged.`,
  },
  {
    q: 'Do you offer contractor pricing?',
    a: 'Every price on this site is wholesale. On top of that, registered contractors earn quantity breaks on case and pallet orders. Call +1 416-951-2650 with your material list and we will quote the full job in one pass.',
  },
  {
    q: 'What are your store hours?',
    a: 'Monday to Friday 8 AM to 6 PM, Saturday 8 AM to 2 PM, closed Sunday. Order by phone during counter hours, or send an inquiry any time and we reply the next business morning.',
  },
  {
    q: 'Can I place my order by phone?',
    a: `Yes — phone orders are how most of our contractors buy. Call ${SITE.orderPhoneDisplay} with your list (or this site open in front of you), and we confirm stock, pricing and pickup or shipping while you are on the line.`,
  },
  {
    q: 'Where do you deliver?',
    a: 'We ship Canada-wide at the flat $30 rate, and our own GTA customers — Mississauga, Toronto, Brampton, Vaughan, Oakville and the surrounding area — often choose same-day counter pickup to keep jobs moving.',
  },
];

const INDUSTRIES = [
  {
    title: 'Hospitality',
    text: 'Restaurants, hotels and venues — pendants, dimming and warm-white packages that set the room.',
    image: '/images/extras/resturant.webp',
  },
  {
    title: 'Office & Commercial',
    text: 'Panels, downlights and controls for offices, retail and fit-outs across Toronto and the GTA.',
    image: '/images/hero/office-1.webp',
  },
  {
    title: 'Industrial & Electrical',
    text: 'High bays, striplights and the full rough-in book — wire, devices, conduit and panels.',
    image: '/images/extras/electri.webp',
  },
];

export default async function HomePage() {
  const [featured, reviews, catalog] = await Promise.all([
    featuredProducts(),
    getReviews(),
    getCatalog(),
  ]);

  return (
    <>
      <JsonLd data={[breadcrumbSchema([{ name: 'Home', url: '/' }]), faqSchema(HOME_FAQS)]} />

      {/* ── 3) HERO ──────────────────────────────────────────────────────── */}
      <section className="pattern-light border-b border-line">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="text-center lg:text-left">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-deep">
                <span className="pulse-dot h-2 w-2 rounded-full bg-amber" />
                Electrical &amp; Lighting Distributor — Mississauga, ON
              </p>
            </Reveal>
            <Reveal delay={90}>
              <h1 className="mt-6 font-display text-[2.6rem] font-bold leading-[1.04] tracking-[-0.02em] text-ink sm:text-6xl lg:text-[4.2rem]">
                Mississauga&rsquo;s Wholesale Electrical
                <span className="relative whitespace-nowrap"> &amp; Lighting
                  <svg viewBox="0 0 320 12" className="absolute -bottom-1 left-0 w-full text-amber" fill="none" aria-hidden="true">
                    <path d="M3 9c60-6 200-6 314-3" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                </span> Supplier.
              </h1>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/65 lg:mx-0 mx-auto">
                {SITE.tagline}. From our Mississauga counter we supply contractors with
                wholesale LED lighting across Canada and electrical materials across the GTA —
                with dependable technical expertise and personalized service.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <Link
                  href="/collections/"
                  className="btn-shine inline-flex items-center gap-2 rounded-xl bg-amber px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-ink shadow-[0_4px_18px_rgba(255,196,0,0.45)] transition-transform hover:scale-[1.03]"
                >
                  Shop Collections
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 8h11M9 3l5 5-5 5" />
                  </svg>
                </Link>
                <a
                  href={`tel:${SITE.mobile}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-ink/15 bg-white px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:border-amber hover:text-amber-deep"
                >
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d="M3.5 1.5c.4 0 .8.2 1 .6l1.3 2.3c.2.4.1.9-.2 1.2L4.6 6.7a10.4 10.4 0 0 0 4.7 4.7l1.1-1c.3-.3.8-.4 1.2-.2l2.3 1.3c.4.2.6.6.6 1v1.9c0 .7-.6 1.3-1.3 1.2C7 14.6 1.4 9 0.3 2.8c-.1-.7.5-1.3 1.2-1.3h2z" />
                  </svg>
                  Call {SITE.mobile}
                </a>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <a
                href={GBP_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-line bg-white py-2 pl-3 pr-4 text-sm shadow-sm transition-colors hover:border-amber"
              >
                <span className="flex text-amber-deep" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} viewBox="0 0 20 20" className="h-4 w-4 fill-current"><path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9 4.7 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" /></svg>
                  ))}
                </span>
                <span className="font-semibold text-ink">{gbpAggregate.rating.toFixed(1)}</span>
                <span className="text-ink/55">· Based on {gbpAggregate.reviewCount} Google reviews</span>
              </a>
            </Reveal>

            {/* Stats — figures are estimates for marketing purposes */}
            <Reveal delay={380}>
              <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-8 sm:gap-6">
                {[
                  { value: 10, suffix: '+', label: 'Years in Business' },
                  { value: 500, suffix: '+', label: 'Products in Catalog' },
                  { value: 1000, suffix: '+', label: 'Contractor Clients' },
                ].map((s) => (
                  <div key={s.label}>
                    <dd className="font-display text-3xl font-bold text-ink sm:text-4xl">
                      <Counter to={s.value} suffix={s.suffix} />
                    </dd>
                    <dt className="mt-1 block text-xs uppercase tracking-[0.14em] text-ink/60">
                      {s.label}
                    </dt>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* Photo collage — stacked and centered on mobile, side-by-side on desktop */}
          <Reveal delay={200} className="relative mt-6 block lg:mt-0">
            <div className="relative mx-auto max-w-md pb-8 pl-2 sm:pl-0 lg:max-w-none lg:pb-8">
              <img
                src="/images/hero/office-1.webp"
                alt="Modern office interior lit by commercial LED fixtures"
                width={816}
                height={901}
                fetchPriority="high"
                className="aspect-[4/5] w-3/4 rounded-2xl border border-line object-cover shadow-[0_30px_70px_rgba(16,24,40,0.18)]"
              />
              <img
                src="/images/extras/resturant.webp"
                alt="Restaurant dining room with pendant lighting"
                width={368}
                height={406}
                className="absolute -bottom-2 right-0 aspect-square w-1/2 rounded-2xl border-4 border-amber object-cover shadow-[0_24px_60px_rgba(16,24,40,0.22)] sm:-bottom-8"
              />
              <figure className="absolute -left-1 -top-4 w-52 rounded-2xl border border-line bg-white p-4 shadow-[0_20px_50px_rgba(16,24,40,0.14)] sm:-left-4 sm:-top-6 sm:w-64">
                <div className="flex text-amber-deep" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current"><path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9 4.7 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" /></svg>
                  ))}
                </div>
                <blockquote className="mt-2 text-[13px] leading-snug text-ink/75">
                  &ldquo;Amazing service, great product also great price, highly recommended&rdquo;
                </blockquote>
                <figcaption className="mt-2 text-xs font-semibold text-ink/60">— Moe R., Google review</figcaption>
              </figure>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 4) BRANDS MARQUEE ────────────────────────────────────────────── */}
      <section className="border-b border-line bg-white py-10" aria-label="Brands we carry">
        <p className="mb-6 text-center text-xs font-bold uppercase tracking-[0.24em] text-ink/60">
          Brands we carry
        </p>
        <div className="marquee overflow-hidden">
          <div className="marquee-track flex w-max items-center gap-8 px-5 sm:gap-14 sm:px-7">
            {[...BRAND_LOGOS, ...BRAND_LOGOS].map((logo, i) => (
              <img
                key={`${logo.name}-${i}`}
                src={logo.src}
                alt={`${logo.name} logo`}
                width={IMAGE_DIMS[logo.src]?.[0]}
                height={IMAGE_DIMS[logo.src]?.[1]}
                loading="lazy"
                className="h-8 w-auto max-w-36 object-contain opacity-50 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 5) TRUST STRIP ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map((t, i) => (
            <Reveal key={t.title} delay={i * 80}>
              <div className="flex h-full flex-col items-center gap-4 rounded-2xl border border-line bg-white p-6 text-center transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(16,24,40,0.08)] sm:flex-row sm:items-start sm:text-left">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-amber/15 text-amber-deep">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {t.icon}
                  </svg>
                </span>
                <div>
                  <h2 className="font-display text-base font-bold text-ink">{t.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-ink/55">{t.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── 6) FEATURED PRODUCTS ─────────────────────────────────────────── */}
      <section className="border-t border-line bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-deep">Contractor Favourites</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">Featured Products</h2>
            </div>
            <Link href="/collections/" className="text-sm font-semibold text-amber-deep hover:underline">
              Browse full catalog →
            </Link>
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <Carousel label="Featured products">
              {featured.map((p) => (
                <div key={p.slug} className="w-72 shrink-0 sm:w-80">
                  <ProductCard product={p} priority />
                </div>
              ))}
            </Carousel>
          </Reveal>
        </div>
      </section>

      {/* ── 7) COLLECTIONS ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <Reveal className="mx-auto max-w-3xl text-center sm:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-deep">View Categories by Collections</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Wholesale LED Lighting &amp; Electrical Materials, Four Ways.
          </h2>
          <p className="mt-4 leading-relaxed text-ink/60">
            As a lighting distributor serving Toronto and the GTA, we group our catalog the
            way contractors estimate jobs: <Link href="/collections/residential-lighting/" className="font-medium text-amber-deep hover:underline">residential LED lighting</Link> for homes
            and multi-unit builds, <Link href="/collections/commercial-lighting/" className="font-medium text-amber-deep hover:underline">commercial LED lighting</Link> for offices, retail and
            exterior packages, <Link href="/collections/industrial-lighting/" className="font-medium text-amber-deep hover:underline">industrial high bays</Link> for warehouses and plants, and the{' '}
            <Link href="/collections/electrical-materials/" className="font-medium text-amber-deep hover:underline">electrical materials</Link> — wire, devices, conduit, panels — that tie every
            job together. Every product ships Canada-wide at our flat $30 rate.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {[
            { slug: 'residential-lighting', copy: 'Slim panels, gimbals, ceiling fixtures, motion sensors and strip lighting for homes, condos and rental turnovers across Mississauga and Toronto.' },
            { slug: 'commercial-lighting', copy: 'Flat panels, wall packs, shoeboxes, canopy, vapor-tight and exit & emergency lighting — DLC-listed for Toronto commercial fit-outs.' },
            { slug: 'industrial-lighting', copy: 'UFO and linear high bays with aisle optics for warehouses, plants and gymnasiums from coast to coast.' },
            { slug: 'electrical-materials', copy: 'Wire, devices, boxes, panels & breakers, conduit and code-required life-safety products at contractor case pricing.' },
          ].map((c, i) => {
            const collection = catalog.collections.find((x) => x.slug === c.slug)!;
            const count = categories.filter((x) => x.collection === c.slug).length;
            const items = products.filter((x) => x.collection === c.slug).length;
            return (
              <Reveal key={c.slug} delay={(i % 2) * 100}>
                <Link
                  href={`/collections/${c.slug}/`}
                  className="group relative block overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(16,24,40,0.14)]"
                >
                  {collection.image && (
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={collection.image}
                        alt={`${collection.name} — application photo`}
                        width={IMAGE_DIMS[collection.image]?.[0]}
                        height={IMAGE_DIMS[collection.image]?.[1]}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" aria-hidden="true" />
                      <p className="absolute bottom-3 left-4 font-display text-lg font-bold text-white">
                        {collection.name}
                      </p>
                    </div>
                  )}
                  <div className="p-7">
                    <p className="text-sm leading-relaxed text-ink/55">{c.copy}</p>
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-amber-deep">
                      {count} categories · {items} products →
                    </p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── 8) INDUSTRIES / APPLICATIONS ─────────────────────────────────── */}
      <section className="border-t border-line bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="mx-auto max-w-2xl text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-deep">Applications</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Spec&rsquo;d for Your Industry.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {INDUSTRIES.map((ind, i) => (
              <Reveal key={ind.title} delay={i * 100}>
                <div className="group overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(16,24,40,0.14)]">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={ind.image}
                      alt={`${ind.title} lighting application`}
                      width={IMAGE_DIMS[ind.image]?.[0]}
                      height={IMAGE_DIMS[ind.image]?.[1]}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-ink">{ind.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/55">{ind.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9) REVIEWS ───────────────────────────────────────────────────── */}
      <section className="border-t border-line py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-deep">Rated by the Trade</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {gbpAggregate.rating.toFixed(1)} Stars on Google
            </h2>
            <p className="mt-3 text-sm text-ink/50">
              Based on {gbpAggregate.reviewCount} Google reviews from contractors and homeowners.
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <ReviewsCarousel reviews={reviews} gbpUrl={GBP_URL} aggregate={gbpAggregate} />
          </Reveal>
        </div>
      </section>

      {/* ── 10) ABOUT TEASER + STATS ─────────────────────────────────────── */}
      <section className="border-t border-line bg-white py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <Reveal className="text-center lg:text-left">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-deep">About GSW</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Dependable expertise. Personalized service.
            </h2>
            <p className="mt-5 leading-relaxed text-ink/65">{SITE.description}</p>
            <p className="mt-4 leading-relaxed text-ink/65">
              Our counter at 4615 Burgoyne Street sits minutes from the 401, 403 and 427 — the
              reason contractors from <strong className="font-semibold text-ink">Mississauga, Toronto, Brampton and the wider GTA</strong>{' '}
              treat GSW as their local electrical wholesaler, with flat $30 shipping reaching
              every province beyond.
            </p>
            <Link
              href="/about/"
              className="btn-shine mt-8 inline-flex items-center gap-2 rounded-xl bg-ink px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-amber transition-transform hover:scale-[1.03]"
            >
              Our Story
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 8h11M9 3l5 5-5 5" />
              </svg>
            </Link>
          </Reveal>
          <Reveal delay={140}>
            <div className="grid gap-5 sm:grid-cols-2">
              <img
                src="/images/hero/office-1.webp"
                alt="Commercial office fitted with GSW lighting"
                width={816}
                height={901}
                loading="lazy"
                className="h-64 w-full rounded-2xl border border-line object-cover"
              />
              <div className="flex flex-col justify-between rounded-2xl border border-line bg-paper p-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">Counter Hours</h3>
                  <ul className="mt-3 space-y-2 text-sm">
                    {SITE.hours.map((h) => (
                      <li key={h.day} className="flex justify-between gap-4 border-b border-line pb-2 last:border-0 last:pb-0">
                        <span className="text-ink/60">{h.day}</span>
                        <span className="font-display font-semibold text-ink">{h.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-4 font-display text-lg font-bold">
                  <a href={`tel:${SITE.phone}`} className="text-ink hover:text-amber-deep">{SITE.phone}</a>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 11) FAQ ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <Reveal className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-deep">Good to Know</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </Reveal>
        <Reveal delay={120} className="mt-10">
          <FaqAccordion faqs={HOME_FAQS} dark={false} />
        </Reveal>
      </section>

      {/* ── 12) AMBER CTA BAND (the single contrasting dark-on-amber band) ── */}
      <section className="bg-amber">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-16 text-center">
          <Reveal>
            <h2 className="mx-auto max-w-3xl font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Place your order by calling{' '}
              <a href={`tel:${SITE.mobile}`} className="underline decoration-ink/30 underline-offset-8 hover:decoration-ink">
                {SITE.orderPhoneDisplay}
              </a>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="max-w-xl text-ink/70">
              Wholesale is personal. Talk to a real expert, lock in contractor pricing,
              and arrange flat-rate shipping or free Mississauga pickup.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`tel:${SITE.mobile}`}
                className="btn-shine rounded-xl bg-ink px-8 py-4 font-display text-sm font-bold uppercase tracking-wide text-amber transition-transform hover:scale-[1.03]"
              >
                Call {SITE.orderPhoneDisplay}
              </a>
              <Link
                href="/contact/"
                className="rounded-xl border-2 border-ink/25 px-8 py-4 font-display text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:border-ink"
              >
                Send an Inquiry
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
