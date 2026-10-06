'use client';

import { useState } from 'react';
import type { Product } from '@/data/catalog';
import { useCart } from '@/components/cart/CartContext';

export default function ProductPurchase({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add(product, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center rounded-xl border border-line">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid h-12 w-11 place-items-center text-lg text-ink/70 transition-colors hover:text-electric"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-12 text-center font-display text-lg font-bold" aria-live="polite">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="grid h-12 w-11 place-items-center text-lg text-ink/70 transition-colors hover:text-electric"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className={`btn-shine flex-1 rounded-xl px-8 py-3.5 font-display text-sm font-bold uppercase tracking-wide transition-all hover:scale-[1.02] sm:flex-none sm:px-12 ${
            added ? 'bg-emerald-500 text-white' : 'bg-electric text-ink hover:bg-electric-600'
          }`}
        >
          {added ? 'Added to Cart' : `Add ${qty} to Cart`}
        </button>
      </div>
      <p className="mt-3 text-xs text-ink/45">
        Contractor quantity pricing available — call for bulk quotes.
      </p>
    </div>
  );
}
