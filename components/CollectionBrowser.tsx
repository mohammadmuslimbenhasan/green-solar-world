'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Category, Product } from '@/data/catalog';
import ProductCard from '@/components/ProductCard';

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'name';

export default function CollectionBrowser({
  products,
  categories,
  collectionName,
}: {
  products: Product[];
  categories: Category[];
  collectionName: string;
}) {
  // Suspense boundary is provided by the parent page.
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') ?? 'all';

  const [category, setCategory] = useState<string>(
    categories.some((c) => c.slug === initialCategory) ? initialCategory : 'all',
  );
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [sort, setSort] = useState<Sort>('featured');

  const filtered = useMemo(() => {
    let list = category === 'all' ? [...products] : products.filter((p) => p.category === category);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.short.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.specs.some((s) => s.toLowerCase().includes(q)),
      );
    }
    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
    }
    return list;
  }, [products, category, query, sort]);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search {collectionName}</span>
          <svg viewBox="0 0 20 20" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="9" cy="9" r="6" />
            <path d="m14 14 4 4" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${collectionName.toLowerCase()}…`}
            className="w-full rounded-xl border border-line bg-paper py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink/35 focus:border-amber"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-ink/60">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-xl border border-line bg-paper px-3 py-2.5 text-sm text-ink focus:border-amber"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name A–Z</option>
          </select>
        </label>
      </div>

      {/* Category chips */}
      <div className="nice-scroll mt-5 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter by category">
        <button
          type="button"
          role="tab"
          aria-selected={category === 'all'}
          onClick={() => setCategory('all')}
          className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
            category === 'all'
              ? 'border-ink bg-ink text-amber'
              : 'border-line bg-white text-ink/65 hover:border-amber hover:text-ink'
          }`}
        >
          All Products
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            role="tab"
            aria-selected={category === c.slug}
            onClick={() => setCategory(c.slug)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
              category === c.slug
                ? 'border-ink bg-ink text-amber'
                : 'border-line bg-white text-ink/65 hover:border-amber hover:text-ink'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Active category description */}
      {category !== 'all' && (
        <p className="mt-4 text-sm text-ink/55">
          {categories.find((c) => c.slug === category)?.description}
        </p>
      )}

      {/* Results */}
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-ink/40" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
      </p>
      {filtered.length > 0 ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-line bg-white p-14 text-center">
          <p className="font-display text-lg font-bold text-ink">No products match your search</p>
          <p className="mt-2 text-sm text-ink/50">
            Try a different keyword, or call us at <a className="font-semibold text-amber-deep" href="tel:+14169512650">+1 416-951-2650</a> — we likely stock it.
          </p>
        </div>
      )}
    </div>
  );
}
