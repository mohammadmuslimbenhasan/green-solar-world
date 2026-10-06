import Link from 'next/link';
import { SITE } from '@/data/catalog';

export default function NotFound() {
  return (
    <section className="pattern-light">
      <div className="mx-auto max-w-2xl px-6 py-28 text-center">
        <p className="font-display text-8xl font-bold text-electric">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold text-ink">This page is off the grid.</h1>
        <p className="mt-4 text-ink/55">
          The product or page you&rsquo;re looking for has moved or never existed. Try the
          collections, or call the counter — we can find anything.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-shine rounded-xl bg-electric px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-ink">
            Back to Home
          </Link>
          <Link href="/collections/" className="rounded-xl border border-line px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:border-electric/50 hover:text-electric">
            Browse Collections
          </Link>
        </div>
        <p className="mt-8 text-sm text-ink/45">
          Counter line: <a href={`tel:${SITE.phone}`} className="text-electric">{SITE.phone}</a>
        </p>
      </div>
    </section>
  );
}
