import type { Metadata } from 'next';
import Reveal from '@/components/Reveal';
import ContactForm from '@/components/ContactForm';
import JsonLd, { breadcrumbSchema } from '@/components/JsonLd';
import { SITE } from '@/data/catalog';
import { gbpAggregate, GBP_URL } from '@/data/reviews';

export const metadata: Metadata = {
  title: 'Contact Electrical Supplier Mississauga | Green Solar World Inc.',
  description:
    'Contact Green Solar World Inc — your electrical supplier in Mississauga. 4615 Burgoyne St. Tel 905-282-9242, mobile 416-951-2650. Wholesale lighting & electrical inquiries welcome.',
  alternates: { canonical: '/contact/' },
};

const CARDS = [
  {
    title: 'Address',
    lines: [SITE.address],
    href: GBP_URL,
    hrefLabel: 'Find us on Google',
    icon: <path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" />,
  },
  {
    title: 'Phone & Fax',
    lines: [`Tel: ${SITE.phone}`, `Mob: ${SITE.mobile}`, `Fax: ${SITE.fax}`],
    href: `tel:${SITE.mobile}`,
    hrefLabel: 'Call the counter',
    icon: <path d="M4 3h4l1.5 4.5L7 9.5a12 12 0 0 0 7.5 7.5l2-2.5L21 16v4a2 2 0 0 1-2 2A16 16 0 0 1 2 5a2 2 0 0 1 2-2z" />,
  },
  {
    title: 'Email',
    lines: [SITE.email],
    href: `mailto:${SITE.email}`,
    hrefLabel: 'Send an email',
    icon: <path d="M3 5h18v14H3zM3 6l9 7 9-7" />,
  },
  {
    title: 'Hours',
    lines: SITE.hours.map((h) => `${h.day}: ${h.time}`),
    href: undefined,
    hrefLabel: undefined,
    icon: <circle cx="12" cy="12" r="9" />,
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Contact', url: '/contact/' }])} />

      <section className="pattern-light border-b border-line">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-deep">Get in Touch</p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink sm:text-6xl">Contact GSW</h1>
            <p className="mt-5 max-w-2xl text-lg text-ink/60">
              Stock checks, quotes, technical specs or bulk orders — reach the counter by
              phone for the fastest answer, or send us a message below.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Info cards */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <Reveal>
          <a
            href={GBP_URL}
            target="_blank"
            rel="noreferrer"
            className="mb-8 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-amber/50 bg-amber/10 px-6 py-4 text-center transition-colors hover:border-amber"
          >
            <span className="font-display text-2xl font-bold text-amber-deep">{gbpAggregate.rating.toFixed(1)}★</span>
            <span className="text-sm text-ink/70">
              Based on {gbpAggregate.reviewCount} Google reviews — Find us on Google
            </span>
          </a>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-amber/60 hover:shadow-[0_16px_40px_rgba(16,24,40,0.08)]">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber/15 text-amber-deep">
                  <svg viewBox="0 0 24 24" className="h-5.5 w-5.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {c.icon}
                  </svg>
                </span>
                <h2 className="mt-4 font-display text-lg font-bold text-ink">{c.title}</h2>
                <div className="mt-2 space-y-1 text-sm text-ink/60">
                  {c.lines.map((l) => <p key={l}>{l}</p>)}
                </div>
                {c.href && (
                  <a
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="mt-auto pt-4 text-sm font-semibold text-amber-deep hover:underline"
                  >
                    {c.hrefLabel} →
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink">Send an Inquiry</h2>
            <p className="mt-4 leading-relaxed text-ink/60">
              Tell us about your project — the products you need, quantities and timelines.
              A member of our team will reply with pricing and availability, usually the
              same business day.
            </p>
            <div className="mt-8 rounded-2xl border border-amber/40 bg-amber/10 p-6">
              <h3 className="font-display text-base font-bold text-ink">Need it faster?</h3>
              <p className="mt-2 text-sm text-ink/65">
                Place your Order By Calling{' '}
                <a href={`tel:${SITE.mobile}`} className="font-semibold text-amber-deep hover:underline">
                  {SITE.orderPhoneDisplay}
                </a>
              </p>
              <p className="mt-3 text-xs text-ink/50">
                {SITE.hours[0].day}: {SITE.hours[0].time} · {SITE.hours[1].day}: {SITE.hours[1].time}
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-2xl border border-line bg-paper p-7">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
