import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Reveal from '@/components/Reveal';
import ProductCard from '@/components/ProductCard';
import ProductPurchase from '@/components/ProductPurchase';
import ProductGallery from '@/components/ProductGallery';
import Carousel from '@/components/Carousel';
import FaqAccordion from '@/components/FaqAccordion';
import ReviewsCarousel, { Stars } from '@/components/Reviews';
import JsonLd, {
  breadcrumbSchema,
  productSchema,
  faqSchema,
} from '@/components/JsonLd';
import {
  getCatalog,
  getCollection,
  getCategory,
  getProductContent,
  relatedProducts,
  computedMetaTitle,
  computedMetaDescription,
  getReviews,
} from '@/lib/data';
import { formatPrice, stockLabel, SITE } from '@/data/catalog';
import { gbpAggregate, GBP_URL } from '@/data/reviews';
import { CATEGORY_IMAGE_POOL } from '@/data/image-notes';

export const revalidate = 300; // ISR: catalog pages stay static-fast, refresh every 5 minutes

export async function generateStaticParams() {
  const catalog = await getCatalog();
  return catalog.products.map((p) => ({ slug: p.slug }));
}

// Admin-added products render on demand and are cached by ISR.
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductContent(slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: computedMetaTitle(product),
    description: computedMetaDescription(product),
    alternates: { canonical: `/products/${product.slug}/` },
    openGraph: {
      type: 'website',
      title: computedMetaTitle(product),
      description: computedMetaDescription(product),
      ...(product.image ? { images: [{ url: product.image }] } : {}),
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductContent(slug);
  if (!product) notFound();

  const [collection, category, related, reviews] = await Promise.all([
    getCollection(product.collection),
    getCategory(product.category),
    relatedProducts(product, 8),
    getReviews(),
  ]);
  const discount =
    product.compareAt && product.compareAt > product.price
      ? Math.round((1 - product.price / product.compareAt) * 100)
      : 0;
  const galleryViews = CATEGORY_IMAGE_POOL[product.category as keyof typeof CATEGORY_IMAGE_POOL] ?? [];

  const crumbs = [
    { name: 'Home', url: '/' },
    { name: collection?.name ?? 'Collections', url: `/collections/${product.collection}/` },
    ...(category
      ? [{ name: category.name, url: `/collections/${product.collection}/?category=${product.category}` }]
      : []),
    { name: product.name, url: `/products/${product.slug}/` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          productSchema(product),
          faqSchema(product.content.faqs),
        ]}
      />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-ink/45">
            <li><Link href="/" className="hover:text-amber-deep">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/collections/${product.collection}/`} className="hover:text-amber-deep">
                {collection?.name ?? product.collection}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={`/collections/${product.collection}/?category=${product.category}`}
                className="hover:text-amber-deep"
              >
                {category?.name ?? product.category}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-ink/70">{product.name}</li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Gallery */}
          <Reveal>
            <ProductGallery product={product} views={galleryViews} />
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              {['cULus / ETL certified', 'Wholesale CAD pricing', 'Ships Canada-wide'].map((b) => (
                <p key={b} className="rounded-xl border border-line bg-white px-2 py-3 text-[11px] font-medium text-ink/55">
                  {b}
                </p>
              ))}
            </div>
          </Reveal>

          {/* Sticky purchase card */}
          <Reveal delay={120}>
            <div className="lg:sticky lg:top-28">
              <div className="rounded-2xl border border-line bg-white p-7 shadow-[0_10px_40px_rgba(16,24,40,0.06)]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-deep">
                  {collection?.name ?? product.collection} · {category?.name ?? product.category}
                </p>
                <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-ink">
                  {product.name}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <a href={GBP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5">
                    <Stars rating={gbpAggregate.rating} className="h-3.5 w-3.5" />
                    <span className="text-xs text-ink/50 hover:text-amber-deep">
                      {gbpAggregate.rating.toFixed(1)} · {gbpAggregate.reviewCount} Google reviews
                    </span>
                  </a>
                  <span className="text-xs text-ink/45">
                    SKU {product.sku} ·{' '}
                    <span className={product.stock === 'low-stock' ? 'font-semibold text-amber-deep' : 'font-semibold text-stock'}>
                      {stockLabel[product.stock]}
                    </span>
                  </span>
                </div>

                <div className="mt-5 flex items-end gap-3">
                  <p className="font-display text-4xl font-bold text-ink">
                    {formatPrice(product.price)}
                    <span className="ml-2 text-sm font-medium text-ink/40">CAD</span>
                  </p>
                  {product.compareAt && (
                    <p className="pb-1.5 text-lg text-ink/35 line-through">{formatPrice(product.compareAt)}</p>
                  )}
                  {discount > 0 && (
                    <span className="mb-1.5 rounded-full bg-amber px-2.5 py-1 text-xs font-bold text-ink">
                      Save {discount}%
                    </span>
                  )}
                </div>

                <p className="mt-4 text-sm leading-relaxed text-ink/65">{product.short}</p>

                <div className="mt-6">
                  <ProductPurchase product={product} />
                </div>

                <div className="mt-5 flex flex-col gap-2.5">
                  <a
                    href={`tel:${SITE.mobile}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-ink/15 px-6 py-3 text-sm font-bold text-ink transition-colors hover:border-amber hover:text-amber-deep"
                  >
                    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                      <path d="M3.5 1.5c.4 0 .8.2 1 .6l1.3 2.3c.2.4.1.9-.2 1.2L4.6 6.7a10.4 10.4 0 0 0 4.7 4.7l1.1-1c.3-.3.8-.4 1.2-.2l2.3 1.3c.4.2.6.6.6 1v1.9c0 .7-.6 1.3-1.3 1.2C7 14.6 1.4 9 0.3 2.8c-.1-.7.5-1.3 1.2-1.3h2z" />
                    </svg>
                    Place your Order By Calling {SITE.orderPhoneDisplay}
                  </a>
                  <p className="text-center text-xs text-ink/45">
                    Flat ${SITE.shippingFlat} shipping Canada-wide · Free pickup at {SITE.address}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── Anchor sections: Description / Applications / Specs / FAQs ───── */}
        <div className="mt-16 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <Reveal>
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
                About the {product.name}
              </h2>
              <p className="mt-4 leading-relaxed text-ink/70">{product.content.intro}</p>
            </Reveal>

            <Reveal className="mt-10">
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink">Applications</h2>
              <ul className="mt-4 space-y-3">
                {product.content.applications.map((a) => (
                  <li key={a} className="flex items-start gap-3 text-sm leading-relaxed text-ink/65">
                    <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0 text-amber-deep" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M2.5 8.5l3.5 3.5 7-8" />
                    </svg>
                    {a}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="mt-10">
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
                Why Contractors Buy the {product.name} from GSW
              </h2>
              <p className="mt-4 leading-relaxed text-ink/70">{product.content.whyGsw}</p>
            </Reveal>

            <Reveal className="mt-10">
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
                Frequently Asked Questions
              </h2>
              <div className="mt-5">
                <FaqAccordion faqs={product.content.faqs} dark={false} />
              </div>
            </Reveal>
          </div>

          {/* Specs table */}
          <Reveal delay={100}>
            <div className="lg:sticky lg:top-28">
              <h2 className="font-display text-xl font-bold tracking-tight text-ink">Specifications</h2>
              <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-white">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-line bg-paper">
                      <th scope="row" className="w-2/5 px-5 py-3 text-left font-medium text-ink/50">SKU</th>
                      <td className="px-5 py-3 font-mono text-ink/85">{product.sku}</td>
                    </tr>
                    <tr className="border-b border-line">
                      <th scope="row" className="px-5 py-3 text-left font-medium text-ink/50">Category</th>
                      <td className="px-5 py-3 text-ink/85">{category?.name ?? product.category}</td>
                    </tr>
                    <tr className="border-b border-line bg-paper">
                      <th scope="row" className="px-5 py-3 text-left font-medium text-ink/50">Collection</th>
                      <td className="px-5 py-3 text-ink/85">{collection?.name ?? product.collection}</td>
                    </tr>
                    {product.specs.map((spec, i) => {
                      const [label, ...rest] = spec.split('|');
                      return (
                        <tr key={spec} className={i % 2 === 0 ? 'border-b border-line' : 'border-b border-line bg-paper'}>
                          <th scope="row" className="px-5 py-3 text-left font-medium text-ink/50">{label.trim()}</th>
                          <td className="px-5 py-3 text-ink/85">{rest.length ? rest.join('|').trim() : '—'}</td>
                        </tr>
                      );
                    })}
                    <tr className="bg-paper">
                      <th scope="row" className="px-5 py-3 text-left font-medium text-ink/50">Availability</th>
                      <td className="px-5 py-3 text-ink/85">{stockLabel[product.stock]}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-ink/45">
                Rated{' '}
                <a href={GBP_URL} target="_blank" rel="noreferrer" className="font-semibold text-amber-deep hover:underline">
                  {gbpAggregate.rating.toFixed(1)}★ from {gbpAggregate.reviewCount} Google reviews
                </a>{' '}
                for service and pricing.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Reviews */}
      <section className="border-t border-line bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-deep">What the Trade Says</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Trusted by Contractors Across the GTA
            </h2>
          </Reveal>
          <Reveal delay={120} className="mt-8">
            <ReviewsCarousel reviews={reviews} gbpUrl={GBP_URL} aggregate={gbpAggregate} />
          </Reveal>
        </div>
      </section>

      {/* Related */}
      <section className="border-t border-line py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-deep">Keep Browsing</p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">Related Products</h2>
            </div>
            <Link
              href={`/collections/${product.collection}/?category=${product.category}`}
              className="text-sm font-semibold text-amber-deep hover:underline"
            >
              More {category?.name ?? ''} →
            </Link>
          </Reveal>
          <Reveal delay={120} className="mt-8">
            <Carousel label="Related products">
              {related.map((rp) => (
                <div key={rp.slug} className="w-64 shrink-0 sm:w-72">
                  <ProductCard product={rp} />
                </div>
              ))}
            </Carousel>
          </Reveal>
        </div>
      </section>
    </>
  );
}
