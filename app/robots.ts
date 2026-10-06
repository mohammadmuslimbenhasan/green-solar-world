import type { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.greensolarworld.ca';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Auth/account pages are excluded; /llms.txt (machine-readable site index) is allowed.
      disallow: ['/cart/', '/account/', '/admin/', '/login/', '/register/', '/logout/', '/auth/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
