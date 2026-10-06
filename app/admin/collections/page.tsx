import { createSupabaseServer } from '@/lib/supabase-server';
import { AdminHeader, Table } from '@/components/admin/ui';
import { TaxonomyForm, TaxonomyDeleteButton } from '@/components/admin/TaxonomyForm';

export const dynamic = 'force-dynamic';

export default async function AdminCollectionsPage() {
  const supabase = await createSupabaseServer();
  if (!supabase) return null;

  const { data: collections } = await supabase
    .from('collections')
    .select('id, slug, name, description')
    .order('name');

  return (
    <>
      <AdminHeader title="Collections" description={`${collections?.length ?? 0} collections`} />
      <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
        <Table head={['Name', 'Slug', 'Description', 'Actions']}>
          {(collections ?? []).map((c) => (
            <tr key={c.id}>
              <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
              <td className="px-4 py-3 font-mono text-xs text-ink/60">{c.slug}</td>
              <td className="px-4 py-3 text-xs text-ink/50">{c.description}</td>
              <td className="px-4 py-3"><TaxonomyDeleteButton kind="collections" id={c.id} /></td>
            </tr>
          ))}
        </Table>
        <section className="h-fit rounded-2xl border border-line bg-white p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-ink">New Collection</h2>
          <TaxonomyForm kind="collections" />
        </section>
      </div>
    </>
  );
}
