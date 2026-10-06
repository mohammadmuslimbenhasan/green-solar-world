import type { Metadata } from 'next';
import Link from 'next/link';
import { DatabaseNotConfigured } from '@/app/admin/layout';

export const metadata: Metadata = {
  title: 'My Account',
  robots: { index: false, follow: false },
};

const NAV = [
  { href: '/account/', label: 'Overview' },
  { href: '/account/orders/', label: 'Orders' },
  { href: '/account/profile/', label: 'Profile' },
];

// Mirrors the admin layout's empty state (exported above) for the portal.
function PortalNav() {
  return (
    <nav className="mb-8 flex gap-2 overflow-x-auto rounded-2xl border border-line bg-white p-2" aria-label="Account">
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold text-ink/65 transition-colors hover:bg-ink/5 hover:text-ink"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  // When Supabase isn't configured, the middleware can't guard anything — show a clear state.
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return (
    <section className="mx-auto max-w-5xl px-6 py-14">
      {!configured ? (
        <DatabaseNotConfigured area="customer portal" />
      ) : (
        <>
          <h1 className="mb-8 font-display text-4xl font-bold text-ink">My Account</h1>
          <PortalNav />
          {children}
        </>
      )}
    </section>
  );
}
