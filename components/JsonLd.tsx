import { SITE } from '@/data/catalog';
import { gbpAggregate, GBP_URL, reviews } from '@/data/reviews';
import type { Product } from '@/data/catalog';
import type { ProductContent } from '@/data/product-content';

/** Renders JSON-LD structured data into the page HTML. */
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.greensolarworld.ca';

/** Organization + LocalBusiness — injected on every page via the root layout. */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${BASE}/#organization`,
    name: SITE.name,
    legalName: 'Green Solar World Inc.',
    alternateName: 'GSW',
    url: `${BASE}/`,
    description: SITE.description,
    email: SITE.email,
    telephone: `+1-${SITE.phone}`,
    priceRange: '$$',
    sameAs: [GBP_URL],
    areaServed: [
      { '@type': 'City', name: 'Mississauga' },
      { '@type': 'City', name: 'Toronto' },
      { '@type': 'Country', name: 'Canada' },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '4615 Burgoyne St.',
      addressLocality: 'Mississauga',
      addressRegion: 'ON',
      postalCode: 'L4W 1G3',
      addressCountry: 'CA',
    },
    hasMap: SITE.mapsUrl,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '08:00', closes: '14:00' },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: gbpAggregate.rating,
      reviewCount: gbpAggregate.reviewCount,
      url: GBP_URL,
    },
  };
}

/** WebSite + SearchAction — injected on every page via the root layout. */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE}/#website`,
    name: SITE.name,
    url: `${BASE}/`,
    publisher: { '@id': `${BASE}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE}/collections/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export interface Crumb {
  name: string;
  url: string;
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${BASE}${c.url}`,
    })),
  };
}

const availability: Record<string, string> = {
  'in-stock': 'https://schema.org/InStock',
  'low-stock': 'https://schema.org/LimitedAvailability',
  'made-to-order': 'https://schema.org/MadeToOrder',
};

export function productSchema(p: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    sku: p.sku,
    brand: { '@type': 'Brand', name: 'GSW' },
    category: p.category,
    description: p.short,
    url: `${BASE}/products/${p.slug}/`,
    ...(p.image ? { image: `${BASE}${p.image}` } : {}),
    offers: {
      '@type': 'Offer',
      price: p.price.toFixed(2),
      priceCurrency: 'CAD',
      availability: availability[p.stock] ?? 'https://schema.org/InStock',
      url: `${BASE}/products/${p.slug}/`,
      itemCondition: 'https://schema.org/NewCondition',
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: SITE.shippingFlat, currency: 'CAD' },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'CA' },
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: gbpAggregate.rating,
      reviewCount: gbpAggregate.reviewCount,
    },
    review: reviews.slice(0, 3).map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.authorName },
      reviewRating: { '@type': 'Rating', ratingValue: r.rating },
      reviewBody: r.text,
    })),
  };
}

export function faqSchema(faqs: ProductContent['faqs']) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
