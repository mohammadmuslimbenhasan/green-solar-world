import Link from 'next/link';
import { createSupabaseServer } from '@/lib/supabase-server';
import { Badge, statusTone, Table } from '@/components/admin/ui';
import { orderStatusLabel } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export default async function AccountOrdersPage() {
  const supabase = await createSupabaseServer();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from('orders')
    .select('id, status, total, created_at, items')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false });

  return (
    <>
      <h2 className="mb-4 font-display text-xl font-bold text-ink">Order History</h2>
      <Table head={['Date', 'Items', 'Status', 'Total', '']}>
        {(orders ?? []).map((o) => {
          const items = Array.isArray(o.items) ? o.items : [];
          return (
            <tr key={o.id}>
              <td className="px-4 py-3 text-ink/60">
                {new Date(o.created_at).toLocaleDateString('en-CA', { dateStyle: 'medium' })}
              </td>
              <td className="px-4 py-3 text-ink/60">
                {items.reduce((n: number, i: { qty: number }) => n + Number(i.qty), 0)} items
              </td>
              <td className="px-4 py-3">
                <Badge tone={statusTone(o.status)}>{orderStatusLabel[o.status as keyof typeof orderStatusLabel] ?? o.status}</Badge>
              </td>
              <td className="px-4 py-3 font-mono text-ink/80">${Number(o.total).toFixed(2)}</td>
              <td className="px-4 py-3">
                <Link href={`/account/orders/${o.id}/`} className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink/70 hover:border-electric/50 hover:text-electric">
                  View
                </Link>
              </td>
            </tr>
          );
        })}
        {(!orders || orders.length === 0) && (
          <tr><td colSpan={5} className="px-4 py-10 text-center text-ink/40">
            No orders on this account yet. Orders placed by phone without an account won&rsquo;t appear here.
          </td></tr>
        )}
      </Table>
    </>
  );
}
