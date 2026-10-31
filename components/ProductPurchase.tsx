'use client';

import { useState } from 'react';
import { SITE, type Product } from '@/data/catalog';
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

  // Wholesale counter mode: no online pricing — call for a quote.
  if (SITE.callForPricing) {
    return (
      <div>
        <p className="font-display text-xl font-bold text-ink">Call for Pricing</p>
        <p className="mt-1 text-sm text-ink/55">
          Wholesale pricing on {product.name} and every item in our catalog — one call locks in your price.
        </p>
        <a
          href={`tel:${SITE.mobile}`}
          className="btn-shine mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-electric px-8 py-4 font-display text-sm font-bold uppercase tracking-wide text-ink transition-all hover:scale-[1.02] sm:w-auto sm:px-12"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M3.5 1.5c.4 0 .8.2 1 .6l1.3 2.3c.2.4.1.9-.2 1.2L4.6 6.7a10.4 10.4 0 0 0 4.7 4.7l1.1-1c.3-.3.8-.4 1.2-.2l2.3 1.3c.4.2.6.6.6 1v1.9c0 .7-.6 1.3-1.3 1.2C7 14.6 1.4 9 0.3 2.8c-.1-.7.5-1.3 1.2-1.3h2z" />
          </svg>
          Call Now — {SITE.orderPhoneDisplay}
        </a>
        <p className="mt-3 text-xs text-ink/45">
          Mon–Fri 8–6, Sat 8–2 · Free pickup in Mississauga · Flat $30 shipping Canada-wide
        </p>
      </div>
    );
  }

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
