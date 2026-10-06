'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/components/cart/CartContext';
import type { CartLine } from '@/components/cart/CartContext';

/** Pushes a snapshot of a past order back into the cart. */
export default function ReorderButton({ items }: { items: CartLine[] }) {
  const { addLine } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const reorder = () => {
    for (const item of items) {
      addLine({
        slug: item.slug,
        sku: item.sku,
        name: item.name,
        price: Number(item.price),
        qty: Number(item.qty) || 1,
      });
    }
    setAdded(true);
    window.setTimeout(() => router.push('/cart/'), 600);
  };

  return (
    <button
      type="button"
      onClick={reorder}
      className={`rounded-xl px-6 py-3 text-sm font-bold transition-all ${
        added ? 'bg-emerald-500 text-white' : 'bg-electric text-ink hover:scale-[1.02]'
      }`}
    >
      {added ? 'Added — opening cart…' : 'Reorder'}
    </button>
  );
}
