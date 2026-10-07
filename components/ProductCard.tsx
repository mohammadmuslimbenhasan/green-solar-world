import Link from 'next/link';
import type { Product } from '@/data/catalog';
import { formatPrice, stockLabel } from '@/data/catalog';
import ProductImage from '@/components/ProductImage';
import AddToCartButton from '@/components/AddToCartButton';

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const discount =
    product.compareAt && product.compareAt > product.price
      ? Math.round((1 - product.price / product.compareAt) * 100)
      : 0;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:border-amber/60 hover:shadow-[0_20px_50px_rgba(16,24,40,0.12)]">
      <Link
        href={`/products/${product.slug}/`}
        className="relative block overflow-hidden bg-white"
      >
        <ProductImage
          product={product}
          priority={priority}
          className="aspect-square w-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-amber px-2.5 py-1 text-[11px] font-bold text-ink">
            -{discount}%
          </span>
        )}
        {product.featured && (
          <span className="absolute right-3 top-3 rounded-full border border-line bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-ink/70 backdrop-blur">
            Featured
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 border-t border-line p-4">
        <p className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${product.stock === 'in-stock' ? 'text-stock' : 'text-amber-deep'}`}>
          {stockLabel[product.stock]}
        </p>
        <h3 className="font-display text-[15px] font-semibold leading-snug text-ink">
          <Link href={`/products/${product.slug}/`} className="transition-colors hover:text-amber-deep">
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-[13px] leading-relaxed text-ink/60">{product.short}</p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div>
            <p className="font-display text-lg font-bold text-ink">
              {formatPrice(product.price)}
              <span className="ml-1 text-[11px] font-medium text-ink/40">CAD</span>
            </p>
            {product.compareAt && (
              <p className="text-xs text-ink/35 line-through">{formatPrice(product.compareAt)}</p>
            )}
          </div>
          <AddToCartButton product={product} className="px-3.5 py-2 text-xs" />
        </div>
      </div>
    </article>
  );
}
