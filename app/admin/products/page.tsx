import Link from 'next/link';
import { createSupabaseServer } from '@/lib/supabase-server';
import { AdminHeader, Table, Badge } from '@/components/admin/ui';
import ProductDeleteButton from '@/components/admin/ProductDeleteButton';

export const dynamic = 'force-dynamic';

const stockTone = (s: string) => (s === 'in-stock' ? 'green' : s === 'low-stock' ? 'amber' : 'gray');

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; collection?: string; category?: string }>;
}) {
  const supabase = await createSupabaseServer();
  if (!supabase) return null;

  const { q, collection, category } = await searchParams;

  let query = supabase
    .from('products')
    .select('id, name, slug, sku, price, stock, featured, collection, category')
    .order('name');
  if (q) query = query.or(`name.ilike.%${q}%,sku.ilike.%${q}%`);
  if (collection) query = query.eq('collection', collection);
  if (category) query = query.eq('category', category);
  const { data: products } = await query.limit(200);

  const { data: collections } = await supabase.from('collections').select('slug, name').order('name');
  const { data: categories } = await supabase.from('categories').select('slug, name, collection').order('name');

  return (
    <>
      <AdminHeader
        title="Products"
        description={`${products?.length ?? 0} shown`}
        actions={
          <Link href="/admin/products/new/" className="rounded-xl bg-electric px-5 py-2.5 font-display text-sm font-bold text-ink">
            + New Product
          </Link>
        }
      />

      {/* Filters */}
      <form method="GET" className="mb-6 flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-white p-4">
        <label className="min-w-48 flex-1">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink/50">Search</span>
          <input name="q" defaultValue={q} placeholder="Name or SKU…" className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink" />
        </label>
        <label>
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink/50">Collection</span>
          <select name="collection" defaultValue={collection ?? ''} className="rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink">
            <option value="">All</option>
            {(collections ?? []).map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </label>
        <label>
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink/50">Category</span>
          <select name="category" defaultValue={category ?? ''} className="rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink">
            <option value="">All</option>
            {(categories ?? []).map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </label>
        <button type="submit" className="rounded-xl border border-electric/40 px-5 py-2.5 text-sm font-semibold text-electric hover:bg-electric/10">
          Filter
        </button>
        <Link href="/admin/products/" className="text-sm text-ink/45 underline hover:text-ink">Reset</Link>
      </form>

      <Table head={['Name', 'SKU', 'Price', 'Stock', 'Flags', 'Actions']}>
        {(products ?? []).map((p) => (
          <tr key={p.id}>
            <td className="px-4 py-3">
              <Link href={`/admin/products/${p.id}/`} className="font-medium text-ink hover:text-electric">
                {p.name}
              </Link>
              <p className="text-xs text-ink/40">/{p.slug}</p>
            </td>
            <td className="px-4 py-3 font-mono text-xs text-ink/60">{p.sku}</td>
            <td className="px-4 py-3 font-mono text-ink/80">${Number(p.price).toFixed(2)}</td>
            <td className="px-4 py-3"><Badge tone={stockTone(p.stock)}>{p.stock.replace('-', ' ')}</Badge></td>
            <td className="px-4 py-3">{p.featured ? <Badge tone="amber">Featured</Badge> : null}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <Link href={`/admin/products/${p.id}/`} className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink/70 hover:border-electric/50 hover:text-electric">
                  Edit
                </Link>
                <ProductDeleteButton id={p.id} />
              </div>
            </td>
          </tr>
        ))}
        {(!products || products.length === 0) && (
          <tr><td colSpan={6} className="px-4 py-10 text-center text-ink/40">No products match.</td></tr>
        )}
      </Table>
    </>
  );
}
