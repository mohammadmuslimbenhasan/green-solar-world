'use client';

import { useState } from 'react';
import { useCart } from '@/components/cart/CartContext';
import { SITE, type Product } from '@/data/catalog';

export default function AddToCartButton({
  product,
  qty = 1,
  className = '',
  label = 'Add to Cart',
}: {
  product: Product;
  qty?: number;
  className?: string;
  label?: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  // Wholesale counter mode: no online pricing — route to the phone.
  if (SITE.callForPricing) {
    return (
      <a
        href={`tel:${SITE.mobile}`}
        className={`btn-shine inline-flex items-center justify-center gap-2 rounded-xl bg-electric font-semibold text-ink transition-all hover:scale-[1.02] hover:bg-electric-600 ${className}`}
      >
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
          <path d="M3.5 1.5c.4 0 .8.2 1 .6l1.3 2.3c.2.4.1.9-.2 1.2L4.6 6.7a10.4 10.4 0 0 0 4.7 4.7l1.1-1c.3-.3.8-.4 1.2-.2l2.3 1.3c.4.2.6.6.6 1v1.9c0 .7-.6 1.3-1.3 1.2C7 14.6 1.4 9 0.3 2.8c-.1-.7.5-1.3 1.2-1.3h2z" />
        </svg>
        Call Now — {SITE.orderPhoneDisplay}
      </a>
    );
  }

  const handleAdd = () => {
    add(product, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={`btn-shine inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] ${
        added
          ? 'bg-emerald-500 text-white'
          : 'bg-electric text-ink hover:bg-electric-600'
      } ${className}`}
    >
      {added ? (
        <>
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.5 8.5l3.5 3.5 7-8" />
          </svg>
          Added
        </>
      ) : (
        <>
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 2h1.6l.8 8.4a1 1 0 0 0 1 .9h7.4a1 1 0 0 0 1-.8L15 5H4" />
            <circle cx="6.5" cy="13.8" r="1" fill="currentColor" stroke="none" />
            <circle cx="12.5" cy="13.8" r="1" fill="currentColor" stroke="none" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
