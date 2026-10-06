import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseServer } from '@/lib/supabase-server';
import { AdminHeader, Badge } from '@/components/admin/ui';
import ProductForm from '@/components/admin/ProductForm';
import ProductDeleteButton from '@/components/admin/ProductDeleteButton';

export const dynamic = 'force-dynamic';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServer();
  if (!supabase) return null;

  const [{ data: product }, { data: categories }, { data: collections }] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('categories').select('slug, name, collection').order('name'),
    supabase.from('collections').select('slug, name').order('name'),
  ]);
  if (!product) notFound();

  return (
    <>
      <AdminHeader
        title={`Edit: ${product.name}`}
        description={
          <span className="flex flex-wrap items-center gap-3">
            <Badge tone="gray">/{product.slug}</Badge>
            <Link href={`/products/${product.slug}/`} className="text-electric hover:underline" target="_blank">
              View public page ↗
            </Link>
            <ProductDeleteButton id={product.id} />
          </span>
        }
      />
      <ProductForm
        categories={categories ?? []}
        collections={collections ?? []}
        initial={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          category: product.category,
          collection: product.collection,
          price: String(product.price),
          compareAt: product.compareAt ? String(product.compareAt) : '',
          stock: product.stock,
          featured: product.featured,
          short: product.short,
          long_description: product.long_description ?? '',
          specs: product.specs ?? [],
          faqs: product.faqs ?? [],
          meta_title: product.meta_title ?? '',
          meta_description: product.meta_description ?? '',
          image_url: product.image_url ?? '',
        }}
      />
    </>
  );
}
