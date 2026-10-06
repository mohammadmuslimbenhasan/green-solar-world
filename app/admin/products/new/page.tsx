import { createSupabaseServer } from '@/lib/supabase-server';
import { AdminHeader } from '@/components/admin/ui';
import ProductForm from '@/components/admin/ProductForm';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  const supabase = await createSupabaseServer();
  if (!supabase) return null;

  const { data: categories } = await supabase.from('categories').select('slug, name, collection').order('name');
  const { data: collections } = await supabase.from('collections').select('slug, name').order('name');

  return (
    <>
      <AdminHeader title="New Product" description="Creates a live catalog entry (public pages revalidate within 5 minutes)." />
      <ProductForm
        categories={categories ?? []}
        collections={collections ?? []}
        initial={{
          specs: [],
          faqs: [],
          sku: `GSW-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        }}
      />
    </>
  );
}
