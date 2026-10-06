import Link from 'next/link';
import { categories, collections, SITE } from '@/data/catalog';
import { getSiteSettings } from '@/lib/data';
import { gbpAggregate, GBP_URL } from '@/data/reviews';

function SocialIcon({ network }: { network: string }) {
  const paths: Record<string, React.ReactNode> = {
    facebook: <path d="M14 8h2.5V4.5H14A4.5 4.5 0 0 0 9.5 9v2H7v3.5h2.5V21H13v-6.5h2.5l.5-3.5h-3V9a1 1 0 0 1 1-1z" />,
    instagram: (
      <>
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.5" fill="currentColor" />
      </>
    ),
    linkedin: <path d="M6.5 8.5V17M6.5 5.5v.01M11 17v-5a2.5 2.5 0 0 1 5 0v5M11 8.5V17" />,
  };
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill={network === 'instagram' ? 'none' : 'currentColor'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[network]}
    </svg>
  );
}

export default async function Footer() {
  const settings = await getSiteSettings();
  const socials = [
    { key: 'social_facebook', label: 'Facebook', href: settings.social_facebook },
    { key: 'social_instagram', label: 'Instagram', href: settings.social_instagram },
    { key: 'social_linkedin', label: 'LinkedIn', href: settings.social_linkedin },
  ].filter((s) => s.href);

  return (
    <footer className="bg-ink text-bone">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo-mark.png" alt="Green Solar World Inc." width={61} height={52} className="h-9 w-auto" />
            <span className="font-display text-lg font-bold">Green Solar World</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-bone/60">
            {SITE.tagline}. Serving commercial, residential and industrial contractors
            from Mississauga across the GTA and Canada-wide.
          </p>
          <a
            href={settings.google_business_url || GBP_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber/40 bg-amber/10 px-4 py-2 text-xs font-semibold text-amber transition-colors hover:border-amber/70"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10 5.52 0 10-4.48 10-10S17.52 2 12 2zm4.64 6.36c.45.45.45 1.17 0 1.62l-5.26 5.26c-.22.22-.5.33-.81.33s-.59-.11-.81-.33l-2.62-2.62c-.45-.45-.45-1.17 0-1.62.45-.45 1.17-.45 1.62 0l1.81 1.8 4.44-4.44c.46-.45 1.18-.45 1.63 0z" />
            </svg>
            {gbpAggregate.rating.toFixed(1)}★ · {gbpAggregate.reviewCount} Google reviews
          </a>
          {socials.length > 0 && (
            <div className="mt-4 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-bone/60 transition-colors hover:border-amber/50 hover:text-amber"
                >
                  <SocialIcon network={s.key.replace('social_', '')} />
                </a>
              ))}
            </div>
          )}
        </div>

        <nav aria-label="Collections">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-bone/40">Collections</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {collections.map((c) => (
              <li key={c.slug}>
                <Link href={`/collections/${c.slug}/`} className="text-bone/70 transition-colors hover:text-amber">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Popular categories">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-bone/40">Popular Categories</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {['led-slim-panel', 'led-wall-pack', 'led-ufo-high-bay', 'wire', 'led-flat-panel', 'panel-board-breakers'].map((slug) => {
              const cat = categories.find((c) => c.slug === slug)!;
              const col = collections.find((c) => c.slug === cat.collection)!;
              return (
                <li key={slug}>
                  <Link
                    href={`/collections/${col.slug}/?category=${slug}`}
                    className="text-bone/70 transition-colors hover:text-amber"
                  >
                    {cat.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-bone/40">Contact</h2>
          <address className="mt-4 space-y-3 text-sm not-italic text-bone/70">
            <p>{SITE.address}</p>
            <p>
              Tel: <a className="hover:text-amber" href={`tel:${SITE.phone}`}>{SITE.phone}</a>
              <br />
              Mob: <a className="hover:text-amber" href={`tel:${SITE.mobile}`}>{SITE.mobile}</a>
              <br />
              Fax: {SITE.fax}
            </p>
            <p>
              <a className="hover:text-amber" href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>
            <p>
              <a className="font-semibold text-amber hover:underline" href={settings.google_business_url || GBP_URL} target="_blank" rel="noreferrer">
                Find us on Google →
              </a>
            </p>
          </address>
          <ul className="mt-4 space-y-1 text-xs text-bone/50">
            {SITE.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span>{h.day}</span>
                <span>{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-bone/40 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name} All rights reserved.</p>
          <p>Wholesale · Distribution · Technical Expertise — Mississauga, Ontario</p>
        </div>
      </div>
    </footer>
  );
}
