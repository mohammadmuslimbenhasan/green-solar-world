import Link from 'next/link';
import { createSupabaseServer } from '@/lib/supabase-server';
import { Badge, statusTone, Table } from '@/components/admin/ui';
import { orderStatusLabel } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export default async function AccountOverviewPage() {
  const supabase = await createSupabaseServer();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase.from('profiles').select('full_name, company_name, phone, role').eq('id', user!.id).single(),
    supabase
      .from('orders')
      .select('id, status, total, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  return (
    <>
      {/* Profile summary */}
      <div className="rounded-2xl border border-line bg-white p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-ink">
              {profile?.full_name || user?.email}
            </h2>
            <p className="mt-1 text-sm text-ink/50">
              {user?.email}
              {profile?.company_name ? ` · ${profile.company_name}` : ''}
              {profile?.phone ? ` · ${profile.phone}` : ''}
            </p>
            {profile?.role === 'admin' && <Badge tone="amber">Admin</Badge>}
          </div>
          <Link href="/account/profile/" className="rounded-xl border border-electric/40 px-5 py-2.5 text-sm font-semibold text-electric hover:bg-electric/10">
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { href: '/collections/', label: 'Browse Catalog', text: 'Start a new order' },
          { href: '/cart/', label: 'View Cart', text: 'Review your current cart' },
          { href: '/account/orders/', label: 'Order History', text: 'Track and reorder' },
        ].map((q) => (
          <Link key={q.href} href={q.href} className="rounded-2xl border border-line bg-white p-5 transition-colors hover:border-electric/40">
            <p className="font-display font-bold text-ink">{q.label}</p>
            <p className="mt-1 text-xs text-ink/45">{q.text} →</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <h2 className="mb-4 mt-10 font-display text-xl font-bold text-ink">Recent Orders</h2>
      <Table head={['Date', 'Status', 'Total', '']}>
        {(orders ?? []).map((o) => (
          <tr key={o.id}>
            <td className="px-4 py-3 text-ink/60">
              {new Date(o.created_at).toLocaleDateString('en-CA', { dateStyle: 'medium' })}
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
        ))}
        {(!orders || orders.length === 0) && (
          <tr><td colSpan={4} className="px-4 py-8 text-center text-ink/40">No orders yet — your order requests will appear here.</td></tr>
        )}
      </Table>
    </>
  );
}
