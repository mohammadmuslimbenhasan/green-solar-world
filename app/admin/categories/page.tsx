import { createSupabaseServer } from '@/lib/supabase-server';
import { AdminHeader, Table } from '@/components/admin/ui';
import { TaxonomyForm, TaxonomyDeleteButton } from '@/components/admin/TaxonomyForm';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const supabase = await createSupabaseServer();
  if (!supabase) return null;

  const [{ data: categories }, { data: collections }] = await Promise.all([
    supabase.from('categories').select('id, slug, name, description, collection').order('name'),
    supabase.from('collections').select('slug, name').order('name'),
  ]);
  const collectionName = (slug: string) => collections?.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <>
      <AdminHeader title="Categories" description={`${categories?.length ?? 0} categories`} />
      <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
        <Table head={['Name', 'Slug', 'Collection', 'Actions']}>
          {(categories ?? []).map((c) => (
            <tr key={c.id}>
              <td className="px-4 py-3">
                <p className="font-medium text-ink">{c.name}</p>
                <p className="text-xs text-ink/40">{c.description}</p>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-ink/60">{c.slug}</td>
              <td className="px-4 py-3 text-ink/60">{collectionName(c.collection)}</td>
              <td className="px-4 py-3"><TaxonomyDeleteButton kind="categories" id={c.id} /></td>
            </tr>
          ))}
        </Table>
        <section className="h-fit rounded-2xl border border-line bg-white p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-ink">New Category</h2>
          <TaxonomyForm kind="categories" collections={collections ?? []} />
        </section>
      </div>
    </>
  );
}
