import type { Metadata } from 'next';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { getCatalog } from '@/lib/data';
import { collectionsIndexMeta } from '@/data/collection-content';

export const revalidate = 300; // ISR: catalog pages stay static-fast, refresh every 5 minutes

export const metadata: Metadata = {
  title: collectionsIndexMeta.metaTitle,
  description: collectionsIndexMeta.metaDescription,
  alternates: { canonical: '/collections/' },
};

export default async function CollectionsPage() {
  const { collections, categories, products } = await getCatalog();

  return (
    <>
      <section className="pattern-light border-b border-line">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-deep">Wholesale Catalog</p>
            <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink sm:text-6xl">LED Lighting Collections</h1>
            <p className="mt-5 max-w-2xl text-lg text-ink/60">
              Four full-line collections covering every phase of the job — residential,
              commercial and industrial LED lighting plus the electrical materials that
              tie it all together. Wholesale CAD pricing, flat $30 shipping Canada-wide.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {collections.map((c, i) => {
            const cats = categories.filter((x) => x.collection === c.slug);
            const items = products.filter((x) => x.collection === c.slug);
            return (
              <Reveal key={c.slug} delay={(i % 2) * 100}>
                <Link
                  href={`/collections/${c.slug}/`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-amber/60 hover:shadow-[0_24px_60px_rgba(16,24,40,0.14)]"
                >
                  {c.image && (
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={c.image}
                        alt={`${c.name} — application photo`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/55 to-transparent" aria-hidden="true" />
                      <p className="absolute bottom-3 left-4 font-display text-lg font-bold text-white">{c.name}</p>
                      <span className="absolute right-3 top-3 rounded-full border border-white/30 bg-ink/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                        {items.length} products
                      </span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-8">
                    <p className="mt-1 text-sm font-medium text-amber-deep">{c.tagline}</p>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/55">{c.description}</p>
                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-ink/40">
                      {cats.length} categories
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {cats.slice(0, 6).map((cat) => (
                        <li
                          key={cat.slug}
                          className="rounded-full border border-line bg-paper px-3 py-1 text-[11px] text-ink/60"
                        >
                          {cat.name}
                        </li>
                      ))}
                      {cats.length > 6 && (
                        <li className="rounded-full border border-line px-3 py-1 text-[11px] text-ink/40">
                          +{cats.length - 6} more
                        </li>
                      )}
                    </ul>
                    <span className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-amber-deep">
                      Browse collection
                      <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M2 8h11M9 3l5 5-5 5" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
