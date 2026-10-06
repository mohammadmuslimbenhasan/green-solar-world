import Link from 'next/link';
import { createSupabaseServer } from '@/lib/supabase-server';
import { AdminHeader, Table, Badge } from '@/components/admin/ui';
import HandledToggle from '@/components/admin/HandledToggle';

export const dynamic = 'force-dynamic';

export default async function AdminInquiriesPage() {
  const supabase = await createSupabaseServer();
  if (!supabase) return null;

  const { data: inquiries } = await supabase
    .from('inquiries')
    .select('id, name, email, subject, handled, created_at')
    .order('handled', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(200);

  return (
    <>
      <AdminHeader title="Inquiries" description="Contact form submissions" />
      <Table head={['Date', 'Name', 'Email', 'Subject', 'Status', 'Actions']}>
        {(inquiries ?? []).map((q) => (
          <tr key={q.id}>
            <td className="px-4 py-3 text-ink/60">
              {new Date(q.created_at).toLocaleDateString('en-CA')}
            </td>
            <td className="px-4 py-3">
              <Link href={`/admin/inquiries/${q.id}/`} className="font-medium text-ink hover:text-electric">
                {q.name}
              </Link>
            </td>
            <td className="px-4 py-3 text-ink/60">{q.email}</td>
            <td className="px-4 py-3 text-ink/60">{q.subject ?? '—'}</td>
            <td className="px-4 py-3">
              <Badge tone={q.handled ? 'green' : 'amber'}>{q.handled ? 'Handled' : 'New'}</Badge>
            </td>
            <td className="px-4 py-3"><HandledToggle id={q.id} handled={q.handled} /></td>
          </tr>
        ))}
        {(!inquiries || inquiries.length === 0) && (
          <tr><td colSpan={6} className="px-4 py-10 text-center text-ink/40">No inquiries yet.</td></tr>
        )}
      </Table>
    </>
  );
}
