import { notFound } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase-server';
import { AdminHeader } from '@/components/admin/ui';
import HandledToggle from '@/components/admin/HandledToggle';
import { SITE } from '@/data/catalog';

export const dynamic = 'force-dynamic';

export default async function AdminInquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServer();
  if (!supabase) return null;

  const { data: q } = await supabase.from('inquiries').select('*').eq('id', id).single();
  if (!q) notFound();

  return (
    <>
      <AdminHeader
        title={q.subject ?? 'Inquiry'}
        description={new Date(q.created_at).toLocaleString('en-CA', { dateStyle: 'long', timeStyle: 'short' })}
      />
      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl border border-line bg-white p-6">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink/80">{q.message}</p>
        </section>
        <section className="h-fit rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-lg font-bold text-ink">Contact</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <p className="flex justify-between"><dt className="text-ink/50">Name</dt><dd className="text-ink">{q.name}</dd></p>
            <p className="flex justify-between"><dt className="text-ink/50">Email</dt><dd><a className="text-electric hover:underline" href={`mailto:${q.email}`}>{q.email}</a></dd></p>
            {q.phone && <p className="flex justify-between"><dt className="text-ink/50">Phone</dt><dd><a className="text-electric hover:underline" href={`tel:${q.phone}`}>{q.phone}</a></dd></p>}
            <p className="flex justify-between"><dt className="text-ink/50">Account</dt><dd className="text-ink/60">{q.user_id ? 'Registered user' : 'Guest'}</dd></p>
          </dl>
          <div className="mt-5 flex gap-3">
            <HandledToggle id={q.id} handled={q.handled} />
          </div>
          <p className="mt-5 text-xs text-ink/40">
            Reply fast: <a className="text-electric" href={`tel:${SITE.mobile}`}>{SITE.orderPhoneDisplay}</a>
          </p>
        </section>
      </div>
    </>
  );
}
