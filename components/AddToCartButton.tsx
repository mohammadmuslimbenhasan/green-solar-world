'use client';

import { useState } from 'react';
import { useCart } from '@/components/cart/CartContext';
import type { Product } from '@/data/catalog';

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
