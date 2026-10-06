import type { Product } from '@/data/catalog';
import { ProductArtForProduct } from '@/components/ProductArt';

/**
 * Renders a product's real photo when one is mapped, otherwise the generated
 * SVG artwork. Photos sit on a white padded tile so mixed white/black
 * backgrounds read intentionally.
 */
export default function ProductImage({
  product,
  className = '',
  priority = false,
}: {
  product: Product;
  className?: string;
  priority?: boolean;
}) {
  if (!product.image) {
    return <ProductArtForProduct product={product} className={className} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={product.image}
      alt={`${product.name} — wholesale product photo`}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
    />
  );
}
