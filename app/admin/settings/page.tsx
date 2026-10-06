import { createSupabaseServer } from '@/lib/supabase-server';
import { AdminHeader } from '@/components/admin/ui';
import SettingsForm, { SectionsEditor } from '@/components/admin/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const supabase = await createSupabaseServer();
  if (!supabase) return null;

  const [{ data: settings }, { data: sections }] = await Promise.all([
    supabase.from('site_settings').select('key, value'),
    supabase.from('homepage_sections').select('*').order('sort_order'),
  ]);

  const settingsMap: Record<string, string> = {};
  for (const row of settings ?? []) {
    settingsMap[row.key] = typeof row.value === 'string' ? row.value : '';
  }

  return (
    <>
      <AdminHeader title="Settings" description="Site-wide settings and homepage content blocks." />
      <div className="grid gap-10 xl:grid-cols-2">
        <section className="h-fit rounded-2xl border border-line bg-white p-6">
          <h2 className="mb-5 font-display text-lg font-bold text-ink">Site Settings</h2>
          <SettingsForm initial={settingsMap} />
        </section>
        <section>
          <h2 className="mb-4 font-display text-lg font-bold text-ink">Homepage Sections</h2>
          <SectionsEditor sections={(sections ?? []) as never} />
        </section>
      </div>
    </>
  );
}
