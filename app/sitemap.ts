import type { MetadataRoute } from 'next';
import { collections, products } from '@/data/catalog';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.greensolarworld.ca';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/about/`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/collections/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/contact/`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/cart/`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    ...collections.map((c) => ({
      url: `${baseUrl}/collections/${c.slug}/`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${baseUrl}/products/${p.slug}/`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
