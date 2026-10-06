'use client';

import { useState } from 'react';
import { ProductArtForProduct } from '@/components/ProductArt';
import type { Product } from '@/data/catalog';

/**
 * Product-page gallery: main view + thumbnail "views" from other verified
 * photos mapped to the same category. Falls back to the SVG artwork when the
 * product has no photo.
 */
export default function ProductGallery({
  product,
  views,
}: {
  product: Product;
  views: string[];
}) {
  const all = product.image ? [product.image, ...views.filter((v) => v !== product.image)] : [];
  const [active, setActive] = useState(0);

  if (all.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <ProductArtForProduct product={product} className="aspect-square w-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={all[active]}
          alt={`${product.name} — photo ${active + 1}`}
          className="aspect-square w-full object-contain"
        />
      </div>
      {all.length > 1 && (
        <div className="mt-3 flex gap-2" role="tablist" aria-label="Product photo views">
          {all.map((src, i) => (
            <button
              key={src + i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`View photo ${i + 1}`}
              onClick={() => setActive(i)}
              className={`overflow-hidden rounded-lg border bg-white transition-all ${
                i === active ? 'border-amber ring-2 ring-amber/40' : 'border-line hover:border-amber/60'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-14 w-14 object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
