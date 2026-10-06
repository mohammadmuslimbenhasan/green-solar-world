'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV = [
  { href: '/admin/', label: 'Dashboard', icon: <path d="M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z" /> },
  { href: '/admin/products/', label: 'Products', icon: <path d="M12 2 3 7v10l9 5 9-5V7l-9-5zM3 7l9 5 9-5M12 12v10" /> },
  { href: '/admin/categories/', label: 'Categories', icon: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" /> },
  { href: '/admin/collections/', label: 'Collections', icon: <path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5" /> },
  { href: '/admin/orders/', label: 'Orders', icon: <path d="M5 3h14v18l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21V3zM9 8h6M9 12h6" /> },
  { href: '/admin/inquiries/', label: 'Inquiries', icon: <path d="M3 5h18v12H8l-5 4V5z" /> },
  { href: '/admin/reviews/', label: 'Reviews', icon: <path d="M12 3l2.7 5.6 6.3.9-4.5 4.4 1 6.1L12 17l-5.5 3 1-6.1L3 9.5l6.3-.9L12 3z" /> },
  { href: '/admin/customers/', label: 'Customers', icon: <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-4 0-7 2-7 5v2h14v-2c0-3-3-5-7-5zm8-1a3 3 0 1 0-2-5.2M17 13c2.8.5 5 2.2 5 5v2h-3" /> },
  { href: '/admin/settings/', label: 'Settings', icon: <circle cx="12" cy="12" r="3" /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/admin/' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-white px-4 py-3 lg:hidden">
        <span className="font-display text-sm font-bold uppercase tracking-[0.18em] text-electric">
          GSW Admin
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle admin navigation"
          className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink"
        >
          <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M4 5l12 10M16 5L4 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
          </svg>
        </button>
      </div>

      {/* Sidebar / drawer */}
      <aside
        className={`border-r border-line bg-white transition-all lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:shrink-0 ${
          open ? 'block' : 'hidden lg:block'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="hidden items-center gap-3 border-b border-line px-5 py-5 lg:flex">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-electric text-ink">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2z" />
              </svg>
            </span>
            <div className="leading-tight">
              <p className="font-display text-sm font-bold text-ink">GSW Admin</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-ink/40">Back Office</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Admin">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-electric/15 text-electric'
                    : 'text-ink/65 hover:bg-ink/5 hover:text-ink'
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {item.icon}
                </svg>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-line p-3">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-ink/65 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 11 12 3l9 8M5 10v10h5v-6h4v6h5V10" />
              </svg>
              Back to Store
            </Link>
            <Link
              href="/logout"
              className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-ink/65 transition-colors hover:bg-ink/5 hover:text-red-400"
            >
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              Sign Out
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
