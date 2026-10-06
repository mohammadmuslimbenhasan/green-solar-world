import Link from 'next/link';
import { createSupabaseServer } from '@/lib/supabase-server';
import { AdminHeader, Table, Badge, statusTone } from '@/components/admin/ui';
import { orderStatusLabel } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const supabase = await createSupabaseServer();
  if (!supabase) return null;

  const { status } = await searchParams;
  let query = supabase
    .from('orders')
    .select('id, contact_name, phone, status, total, created_at')
    .order('created_at', { ascending: false })
    .limit(200);
  if (status) query = query.eq('status', status);

  const { data: orders } = await query;

  return (
    <>
      <AdminHeader title="Orders" description={`${orders?.length ?? 0} shown`} />
      <div className="mb-6 flex flex-wrap gap-2">
        {['', 'pending', 'confirmed', 'ready_for_pickup', 'shipped', 'completed', 'cancelled'].map((s) => (
          <Link
            key={s}
            href={s ? `/admin/orders/?status=${s}` : '/admin/orders/'}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold ${
              (status ?? '') === s
                ? 'border-electric bg-electric text-ink'
                : 'border-line text-ink/60 hover:border-electric/40 hover:text-ink'
            }`}
          >
            {s ? orderStatusLabel[s as keyof typeof orderStatusLabel] : 'All'}
          </Link>
        ))}
      </div>
      <Table head={['Date', 'Customer', 'Phone', 'Status', 'Total', '']}>
        {(orders ?? []).map((o) => (
          <tr key={o.id}>
            <td className="px-4 py-3 text-ink/60">
              {new Date(o.created_at).toLocaleString('en-CA', { dateStyle: 'medium', timeStyle: 'short' })}
            </td>
            <td className="px-4 py-3 font-medium text-ink">{o.contact_name}</td>
            <td className="px-4 py-3 text-ink/60">{o.phone}</td>
            <td className="px-4 py-3">
              <Badge tone={statusTone(o.status)}>{orderStatusLabel[o.status as keyof typeof orderStatusLabel] ?? o.status}</Badge>
            </td>
            <td className="px-4 py-3 font-mono text-ink/80">${Number(o.total).toFixed(2)}</td>
            <td className="px-4 py-3">
              <Link href={`/admin/orders/${o.id}/`} className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink/70 hover:border-electric/50 hover:text-electric">
                View
              </Link>
            </td>
          </tr>
        ))}
        {(!orders || orders.length === 0) && (
          <tr><td colSpan={6} className="px-4 py-10 text-center text-ink/40">No orders in this view.</td></tr>
        )}
      </Table>
    </>
  );
}
