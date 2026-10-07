import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import ReviewsCarousel from '@/components/Reviews';
import JsonLd, { breadcrumbSchema } from '@/components/JsonLd';
import { getReviews } from '@/lib/data';
import { SITE } from '@/data/catalog';
import { gbpAggregate, GBP_URL } from '@/data/reviews';

export const metadata: Metadata = {
  title: 'About Green Solar World Inc | Mississauga Electrical Wholesaler',
  description:
    'About Green Solar World Inc: a Mississauga electrical wholesaler and lighting distributor serving commercial, residential and industrial contractors across the GTA since 2019.',
  alternates: { canonical: '/about/' },
};

const VALUES = [
  {
    title: 'Product Knowledge',
    text: 'Lighting and electrical is a technical trade. Our counter staff and sales team answer spec questions on the spot — wattage, colour temperature, DLC listings, code compliance — so your crew never waits.',
  },
  {
    title: 'Personalized Service',
    text: 'Every contractor gets a real person who knows their account, their jobs and their preferences. Quotes are fast, orders are accurate, and problems get solved by phone — not by ticket queue.',
  },
  {
    title: 'Honest Wholesale Pricing',
    text: 'One fair distributor price with contractor quantity breaks. No games, no inflated list prices — just the numbers your estimate needs to win the job.',
  },
  {
    title: 'Dependable Fulfillment',
    text: 'Flat $30 shipping anywhere in Canada and free pickup at our Mississauga counter. Stocked shelves mean your material is ready when your crew is.',
  },
];

const WHY = [
  'Full-line supplier — lighting and electrical materials from one counter',
  'Technical guidance for commercial, residential and industrial jobs',
  'cULus / ETL / DLC certified products with real warranties',
  'Contractor quantity pricing and fast quotes by phone',
  'GTA pickup counter with flat-rate Canada-wide shipping',
  'Serving the trade since 2019 — long relationships, long experience',
];

export default async function AboutPage() {
  const reviews = await getReviews();

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'About', url: '/about/' }])} />

      {/* Hero */}
      <section className="pattern-light border-b border-line">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-deep">Since 2019 · Mississauga, Ontario</p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight text-ink sm:text-6xl">
              About Green Solar World Inc.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-ink/60">
              A wholesale partner built on experience — serving commercial, residential
              and industrial contractors across the GTA since 2019.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink">Our Story</h2>
            <div className="mt-6 space-y-5 leading-relaxed text-ink/70">
              <p>
                Green Solar World Inc. began in 2019 with a simple idea: contractors in the
                Greater Toronto Area deserved a lighting and electrical supplier that
                combined genuine wholesale pricing with the kind of technical know-how you
                can only get from people who have spent years in the trade.
              </p>
              <p>{SITE.description}</p>
              <p>
                From our counter at 4615 Burgoyne Street in Mississauga, we supply
                commercial, residential and industrial contractors across the GTA and
                ship Canada-wide. Whether it is a full warehouse high-bay retrofit, a
                multi-unit residential rough-in, or a single hard-to-find device, our
                team treats every order with the same care — because your schedule is
                our schedule.
              </p>
            </div>
          </Reveal>
          <Reveal delay={140}>
            <div className="space-y-5">
              <div className="rounded-2xl bg-ink p-8 text-bone">
                <p className="font-display text-5xl font-bold text-amber">2019</p>
                <p className="mt-2 text-sm text-bone/60">Serving the GTA electrical trade</p>
              </div>
              <div className="rounded-2xl border border-line bg-paper p-8">
                <p className="font-display text-5xl font-bold text-ink">4</p>
                <p className="mt-2 text-sm text-ink/60">Collections covering lighting and full electrical materials</p>
              </div>
              <div className="rounded-2xl border border-line bg-paper p-8">
                <p className="font-display text-5xl font-bold text-ink">35+</p>
                <p className="mt-2 text-sm text-ink/60">Product categories stocked for every job type</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-line py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-deep">Mission &amp; Values</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">How We Work</h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={(i % 2) * 100}>
                <div className="h-full rounded-2xl border border-line bg-white p-8 transition-all hover:-translate-y-0.5 hover:border-amber/60 hover:shadow-[0_16px_40px_rgba(16,24,40,0.08)]">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-amber/15 text-amber-deep">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                      <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2z" />
                    </svg>
                  </span>
                  <h3 className="mt-4 font-display text-xl font-bold text-ink">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/60">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-deep">Why Contractors Choose GSW</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              The Counter That Knows the Trade.
            </h2>
            <p className="mt-5 leading-relaxed text-ink/60">
              Big-box pricing with a family-run counter&rsquo;s attention. When you call GSW,
              you talk to someone who can read your spec sheet, suggest the right
              alternative when stock is tight, and get material moving the same day.
            </p>
            <Link
              href="/collections/"
              className="btn-shine mt-8 inline-flex items-center gap-2 rounded-xl bg-amber px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.03]"
            >
              Browse the Catalog
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <ul className="space-y-4">
              {WHY.map((w) => (
                <li key={w} className="flex items-start gap-3 rounded-xl border border-line bg-paper px-5 py-4 text-sm text-ink/75">
                  <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0 text-amber-deep" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2.5 8.5l3.5 3.5 7-8" />
                  </svg>
                  {w}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Reviews */}
      <section className="border-t border-line py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-deep">Reviews</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              What Our Customers Say
            </h2>
            <p className="mt-3 text-sm text-ink/50">
              <a href={GBP_URL} target="_blank" rel="noreferrer" className="font-semibold text-amber-deep hover:underline">
                {gbpAggregate.rating.toFixed(1)}-star rating · Based on {gbpAggregate.reviewCount} Google reviews
              </a>
            </p>
          </Reveal>
          <Reveal delay={120} className="mt-10">
            <ReviewsCarousel reviews={reviews} gbpUrl={GBP_URL} aggregate={gbpAggregate} />
          </Reveal>
        </div>
      </section>

      {/* Hours + CTA */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink">Visit Our Counter</h2>
            <address className="mt-5 space-y-2 text-ink/70 not-italic">
              <p className="font-display text-xl font-bold text-ink">{SITE.address}</p>
              <p>Tel: <a className="font-semibold hover:text-amber-deep" href={`tel:${SITE.phone}`}>{SITE.phone}</a> · Mob: <a className="font-semibold hover:text-amber-deep" href={`tel:${SITE.mobile}`}>{SITE.mobile}</a></p>
              <p>Fax: {SITE.fax} · <a className="font-semibold hover:text-amber-deep" href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
            </address>
            <ul className="mt-6 max-w-sm space-y-2 text-sm">
              {SITE.hours.map((h) => (
                <li key={h.day} className="flex justify-between border-b border-line pb-2">
                  <span className="text-ink/60">{h.day}</span>
                  <span className="font-semibold">{h.time}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={140}>
            <div className="rounded-2xl bg-ink p-10 text-center text-bone">
              <h3 className="font-display text-2xl font-bold">
                Place your Order By Calling <span className="text-amber">{SITE.orderPhoneDisplay}</span>
              </h3>
              <p className="mx-auto mt-3 max-w-sm text-sm text-bone/60">
                Flat ${SITE.shippingFlat} shipping across Canada, or free pickup at the counter.
              </p>
              <a
                href={`tel:${SITE.mobile}`}
                className="btn-shine mt-7 inline-block rounded-xl bg-amber px-8 py-4 font-display text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.03]"
              >
                Call to Order
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
