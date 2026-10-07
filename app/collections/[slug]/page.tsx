import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Reveal from '@/components/Reveal';
import CollectionBrowser from '@/components/CollectionBrowser';
import FaqAccordion from '@/components/FaqAccordion';
import JsonLd, { breadcrumbSchema, faqSchema } from '@/components/JsonLd';
import {
  getCatalog,
  getCollection,
  categoriesByCollection,
  productsByCollection,
} from '@/lib/data';
import { collectionContent } from '@/data/collection-content';
import type { CollectionSlug } from '@/data/catalog';

export const revalidate = 300; // ISR: catalog pages stay static-fast, refresh every 5 minutes

export async function generateStaticParams() {
  const catalog = await getCatalog();
  return catalog.collections.map((c) => ({ slug: c.slug }));
}

// Admin-added collections render on demand and are cached by ISR.
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const content = collectionContent[slug as CollectionSlug];
  const collection = await getCollection(slug);
  if (!collection) return { title: 'Collection Not Found' };
  return {
    title: content?.metaTitle ?? collection.name,
    description: content?.metaDescription ?? collection.description,
    alternates: { canonical: `/collections/${collection.slug}/` },
    openGraph: { title: `${collection.name} | Green Solar World Inc.`, description: collection.tagline },
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) notFound();

  const [cats, items, catalog] = await Promise.all([
    categoriesByCollection(collection.slug as CollectionSlug),
    productsByCollection(collection.slug as CollectionSlug),
    getCatalog(),
  ]);
  const content = collectionContent[collection.slug as CollectionSlug];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Collections', url: '/collections/' },
            { name: collection.name, url: `/collections/${collection.slug}/` },
          ]),
          ...(content ? [faqSchema(content.faqs)] : []),
        ]}
      />

      {/* Hero band with collection photo */}
      <section className="relative overflow-hidden border-b border-line">
        {collection.image && (
          <>
            <img
              src={collection.image}
              alt={`${collection.name} — application photo`}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-ink/60" aria-hidden="true" />
          </>
        )}
        <div className="relative mx-auto max-w-7xl px-6 py-20">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs text-white/70">
              <li><Link href="/" className="hover:text-amber">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/collections/" className="hover:text-amber">Collections</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-white">{collection.name}</li>
            </ol>
          </nav>
          <Reveal>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {collection.name}
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-amber">{collection.tagline}</p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              {cats.length} categories · {items.length} products · Wholesale CAD pricing
            </p>
          </Reveal>
        </div>
      </section>

      {/* Intro copy */}
      {content && (
        <section className="border-b border-line bg-white">
          <div className="mx-auto max-w-4xl px-6 py-14">
            <Reveal>
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
                {collection.name} — {content.keyword}
              </h2>
              <div className="mt-5 space-y-4 leading-relaxed text-ink/70">
                {content.intro.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 py-12">
        <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-white" />}>
          <CollectionBrowser products={items} categories={cats} collectionName={collection.name} />
        </Suspense>
      </section>

      {/* Buying guide + FAQs */}
      {content && (
        <section className="border-t border-line bg-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-deep">Buying Guide</p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">How to Choose</h2>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-ink/65">
                {content.buyingGuide.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            </Reveal>
            <Reveal delay={120}>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-deep">FAQ</p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
                {collection.name} Questions
              </h2>
              <div className="mt-5">
                <FaqAccordion faqs={content.faqs} dark={false} />
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Cross-link to other collections */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/40">Also in the catalog</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {catalog.collections
              .filter((c) => c.slug !== collection.slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/collections/${c.slug}/`}
                  className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:border-amber hover:text-amber-deep"
                >
                  {c.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
