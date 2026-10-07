import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/cart/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageProgress from '@/components/PageProgress';
import JsonLd, { organizationSchema, websiteSchema } from '@/components/JsonLd';
import { SITE } from '@/data/catalog';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' });

// Canonical domain — update NEXT_PUBLIC_SITE_URL in production (README).
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.greensolarworld.ca';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${SITE.name} | Electrical Supply Store Mississauga`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    'electrical supply store Mississauga',
    'lighting distributor Toronto',
    'wholesale LED lighting Canada',
    'electrical wholesaler GTA',
  ],
  alternates: { types: { 'text/plain': '/llms.txt' } },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: baseUrl,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@greensolarworld',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      {/* Pre-paint: reveal above-the-fold .reveal content without waiting for hydration (LCP). */}
      <Script id="reveal-paint" strategy="beforeInteractive">{`
        (function () {
          function reveal() {
            var h = window.innerHeight;
            document.querySelectorAll('.reveal:not(.is-visible)').forEach(function (el) {
              var r = el.getBoundingClientRect();
              if (r.top < h && r.bottom > 0) el.classList.add('is-visible');
            });
          }
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', reveal);
          } else {
            reveal();
          }
        })();
      `}</Script>
      {/* suppressHydrationWarning: browser extensions (e.g. cz-shortcut-listen) inject body attributes pre-hydration */}
      <body className="min-h-screen bg-paper font-body text-ink" suppressHydrationWarning>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <CartProvider>
          <div className="bg-ink px-4 py-1.5 text-center text-xs font-medium text-amber">
            Flat ${SITE.shippingFlat} shipping Canada-wide · Mon–Fri 8–6, Sat 8–2 · Free pickup in Mississauga
          </div>
          <PageProgress />
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
