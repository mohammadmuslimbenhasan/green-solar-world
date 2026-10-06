'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/components/cart/CartContext';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { collections, SITE } from '@/data/catalog';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/collections/', label: 'Collections' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];

export default function Header() {
  const { count, lastAddedAt } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [accountHref, setAccountHref] = useState('/login');

  useEffect(() => setOpen(false), [pathname]);

  // Route the account icon by role: admins land on the dashboard, customers on their portal.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = getSupabaseBrowser();
      if (!supabase) return;
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelled) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (!cancelled) setAccountHref(profile?.role === 'admin' ? '/admin' : '/account');
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    if (lastAddedAt === 0) return;
    setBump(true);
    const t = window.setTimeout(() => setBump(false), 400);
    return () => window.clearTimeout(t);
  }, [lastAddedAt]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href.replace(/\/$/, ''));

  return (
    <header
      className={`sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-xl transition-shadow ${
        scrolled ? 'shadow-[0_1px_0_rgba(16,24,40,0.06),0_8px_24px_rgba(16,24,40,0.06)]' : ''
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link href="/" className="group flex items-center" aria-label="Green Solar World — home">
          <span className="overflow-hidden rounded-xl bg-white shadow-[0_2px_10px_rgba(16,24,40,0.08)] ring-1 ring-line transition-transform group-hover:scale-105">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo.jpg"
              alt="Green Solar World Inc."
              width={170}
              height={95}
              className="h-10 w-auto"
            />
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-ink/[0.05] text-ink'
                  : 'text-ink/65 hover:bg-ink/[0.04] hover:text-ink'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-medium text-ink/65 transition-colors hover:bg-ink/[0.04] hover:text-ink"
              aria-haspopup="true"
            >
              Shop
              <svg viewBox="0 0 12 12" className="h-3 w-3 transition-transform group-hover:rotate-180" fill="none" aria-hidden="true">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <div className="invisible absolute right-0 top-full w-72 translate-y-1 rounded-2xl border border-line bg-white p-2 opacity-0 shadow-[0_20px_50px_rgba(16,24,40,0.14)] transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              {collections.map((c) => (
                <Link
                  key={c.slug}
                  href={`/collections/${c.slug}/`}
                  className="block rounded-xl px-3.5 py-2.5 transition-colors hover:bg-paper"
                >
                  <span className="block text-sm font-semibold text-ink group-hover:text-amber-deep">{c.name}</span>
                  <span className="mt-0.5 block text-xs leading-snug text-ink/50">{c.tagline}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href={`tel:${SITE.mobile}`}
            className="btn-shine hidden items-center gap-2 rounded-full bg-amber px-4 py-2 text-sm font-bold text-ink shadow-[0_2px_10px_rgba(255,196,0,0.4)] transition-transform hover:scale-[1.03] md:inline-flex"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
              <path d="M3.5 1.5c.4 0 .8.2 1 .6l1.3 2.3c.2.4.1.9-.2 1.2L4.6 6.7a10.4 10.4 0 0 0 4.7 4.7l1.1-1c.3-.3.8-.4 1.2-.2l2.3 1.3c.4.2.6.6.6 1v1.9c0 .7-.6 1.3-1.3 1.2C7 14.6 1.4 9 0.3 2.8c-.1-.7.5-1.3 1.2-1.3h2z" />
            </svg>
            {SITE.orderPhoneDisplay}
          </a>

          <Link
            href={accountHref}
            className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-ink transition-colors hover:border-amber hover:text-amber-deep"
            aria-label={accountHref === '/login' ? 'Sign in' : 'My account'}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="12" cy="8" r="3.6" />
              <path d="M4.5 20c1.4-3.2 4.2-5 7.5-5s6.1 1.8 7.5 5" strokeLinecap="round" />
            </svg>
          </Link>

          <Link
            href="/cart/"
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-ink transition-colors hover:border-amber hover:text-amber-deep"
            aria-label={`Cart, ${count} items`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.2L21 8H6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="10" cy="20.5" r="1.3" fill="currentColor" stroke="none" />
              <circle cx="17.5" cy="20.5" r="1.3" fill="currentColor" stroke="none" />
            </svg>
            {count > 0 && (
              <span
                className={`absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-amber px-1 text-[11px] font-bold text-ink shadow ${bump ? 'badge-pop' : ''}`}
              >
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-ink lg:hidden"
            aria-expanded={open}
            aria-label="Toggle navigation menu"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M4 5l12 10M16 5L4 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
            </svg>
          </button>
        </div>
      </div>

      {/* mobile slide-down menu */}
      <div
        className={`overflow-hidden border-t border-line transition-[max-height] duration-300 ease-out lg:hidden ${
          open ? 'max-h-[480px]' : 'max-h-0 border-t-0'
        }`}
      >
        <nav className="space-y-1 bg-white px-4 py-4" aria-label="Mobile">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                isActive(item.href) ? 'bg-paper text-ink' : 'text-ink/75'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <p className="px-3 pt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-ink/40">
            Collections
          </p>
          <Link
            href={accountHref}
            className="mt-2 flex items-center gap-2 rounded-lg bg-paper px-3 py-2.5 text-sm font-semibold text-ink"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="12" cy="8" r="3.6" />
              <path d="M4.5 20c1.4-3.2 4.2-5 7.5-5s6.1 1.8 7.5 5" strokeLinecap="round" />
            </svg>
            {accountHref === '/login' ? 'Sign In / Register' : accountHref === '/admin' ? 'Admin Dashboard' : 'My Account'}
          </Link>
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}/`}
              className="block rounded-lg px-3 py-2 text-sm text-ink/70"
            >
              {c.name}
            </Link>
          ))}
          <a
            href={`tel:${SITE.mobile}`}
            className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-amber px-4 py-3 text-sm font-bold text-ink"
          >
            Place your Order By Calling {SITE.orderPhoneDisplay}
          </a>
        </nav>
      </div>
    </header>
  );
}
