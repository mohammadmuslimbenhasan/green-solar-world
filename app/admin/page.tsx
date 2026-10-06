import Link from 'next/link';
import { createSupabaseServer } from '@/lib/supabase-server';
import { AdminHeader, StatCard, Table, Badge, statusTone } from '@/components/admin/ui';
import { orderStatusLabel, type OrderRow } from '@/lib/admin';
import { SITE } from '@/data/catalog';

export const dynamic = 'force-dynamic';

async function count(
  supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServer>>>,
  table: string,
  filters?: { column: string; value: string }[],
): Promise<number> {
  let query = supabase.from(table).select('*', { count: 'exact', head: true });
  for (const f of filters ?? []) query = query.eq(f.column, f.value);
  const { count: c } = await query;
  return c ?? 0;
}

export default async function AdminDashboard() {
  const supabase = await createSupabaseServer();
  if (!supabase) return null;

  const [products, pendingOrders, confirmedOrders, inquiries, reviews, customers] =
    await Promise.all([
      count(supabase, 'products'),
      count(supabase, 'orders', [{ column: 'status', value: 'pending' }]),
      count(supabase, 'orders', [{ column: 'status', value: 'confirmed' }]),
      count(supabase, 'inquiries', [{ column: 'handled', value: 'false' }]),
      count(supabase, 'reviews', [{ column: 'is_approved', value: 'true' }]),
      count(supabase, 'profiles'),
    ]);

  const { data: recentOrders } = await supabase
    .from('orders')
    .select('id, contact_name, phone, status, total, created_at')
    .order('created_at', { ascending: false })
    .limit(6);
  const { data: recentInquiries } = await supabase
    .from('inquiries')
    .select('id, name, subject, handled, created_at')
    .order('created_at', { ascending: false })
    .limit(6);

  return (
    <>
      <AdminHeader
        title="Dashboard"
        description={`${SITE.name} back office`}
        actions={
          <Link
            href="/admin/products/new/"
            className="rounded-xl bg-electric px-5 py-2.5 font-display text-sm font-bold text-ink transition-transform hover:scale-[1.02]"
          >
            + New Product
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Products" value={products} href="/admin/products/" />
        <StatCard label="Pending Orders" value={pendingOrders} href="/admin/orders/" />
        <StatCard label="Confirmed" value={confirmedOrders} href="/admin/orders/" />
        <StatCard label="New Inquiries" value={inquiries} href="/admin/inquiries/" />
        <StatCard label="Live Reviews" value={reviews} href="/admin/reviews/" />
        <StatCard label="Customers" value={customers} href="/admin/customers/" />
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-ink">Recent Orders</h2>
            <Link href="/admin/orders/" className="text-sm font-semibold text-electric hover:underline">
              View all →
            </Link>
          </div>
          <Table head={['Date', 'Customer', 'Phone', 'Status', 'Total']}>
            {(recentOrders ?? []).map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3 text-ink/60">
                  {new Date(o.created_at).toLocaleDateString('en-CA')}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${o.id}/`} className="font-medium text-ink hover:text-electric">
                    {o.contact_name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink/60">{o.phone}</td>
                <td className="px-4 py-3">
                  <Badge tone={statusTone(o.status)}>{orderStatusLabel[o.status as keyof typeof orderStatusLabel] ?? o.status}</Badge>
                </td>
                <td className="px-4 py-3 font-mono text-ink/80">${Number(o.total).toFixed(2)}</td>
              </tr>
            ))}
            {(!recentOrders || recentOrders.length === 0) && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-ink/40">No orders yet.</td></tr>
            )}
          </Table>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-ink">Recent Inquiries</h2>
            <Link href="/admin/inquiries/" className="text-sm font-semibold text-electric hover:underline">
              View all →
            </Link>
          </div>
          <Table head={['Date', 'Name', 'Subject', 'Status']}>
            {(recentInquiries ?? []).map((q) => (
              <tr key={q.id}>
                <td className="px-4 py-3 text-ink/60">
                  {new Date(q.created_at).toLocaleDateString('en-CA')}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/inquiries/${q.id}/`} className="font-medium text-ink hover:text-electric">
                    {q.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink/60">{q.subject ?? '—'}</td>
                <td className="px-4 py-3">
                  <Badge tone={q.handled ? 'green' : 'amber'}>{q.handled ? 'Handled' : 'New'}</Badge>
                </td>
              </tr>
            ))}
            {(!recentInquiries || recentInquiries.length === 0) && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-ink/40">No inquiries yet.</td></tr>
            )}
          </Table>
        </section>
      </div>
    </>
  );
}
