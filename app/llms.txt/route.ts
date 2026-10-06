import { SITE, collections, categories } from '@/data/catalog';

export const dynamic = 'force-static';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.greensolarworld.ca';

/** Plain-text llms.txt for AI agents — https://llmstxt.org */
export async function GET() {
  const body = `# ${SITE.name} (GSW)

> ${SITE.tagline}. GSW is an electrical and lighting distributor and wholesaler in Mississauga, Ontario, offering a full line of high quality products with dependable technical expertise and personalized service for commercial, residential and industrial jobs.

## Products

${categories
  .map((c) => `- [${c.name}](${BASE}/collections/${c.collection}/?category=${c.slug}): ${c.description}`)
  .join('\n')}

## Collections

${collections
  .map((c) => `- [${c.name}](${BASE}/collections/${c.slug}/): ${c.tagline}`)
  .join('\n')}

## Ordering

- Orders are placed by phone: ${SITE.orderPhoneDisplay} (${SITE.mobile}) — wholesale phone-order business.
- Flat $${SITE.shippingFlat} shipping anywhere in Canada; free pickup at the Mississauga counter.
- Cart checkout also submits an order request online (sign-in optional).

## Contact

- Address: ${SITE.address}
- Tel: ${SITE.phone} | Mobile: ${SITE.mobile} | Fax: ${SITE.fax}
- Email: ${SITE.email}
- [Contact page](${BASE}/contact/) · [About](${BASE}/about/)

## Hours

- Monday–Friday: 8:00 AM–6:00 PM
- Saturday: 8:00 AM–2:00 PM
- Sunday: Closed
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
