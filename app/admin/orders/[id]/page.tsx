import { notFound } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase-server';
import { AdminHeader, Badge, statusTone } from '@/components/admin/ui';
import OrderStatusEditor from '@/components/admin/OrderStatusEditor';
import { orderStatusLabel, type OrderRow } from '@/lib/admin';
import { SITE } from '@/data/catalog';

export const dynamic = 'force-dynamic';

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServer();
  if (!supabase) return null;

  const { data: order } = await supabase.from('orders').select('*').eq('id', id).single();
  if (!order) notFound();
  const o = order as OrderRow;
  const items = Array.isArray(o.items) ? o.items : [];

  return (
    <>
      <AdminHeader
        title={`Order · ${o.contact_name}`}
        description={
          <span className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs text-ink/50">{o.id}</span>
            <Badge tone={statusTone(o.status)}>{orderStatusLabel[o.status] ?? o.status}</Badge>
            <span>{new Date(o.created_at).toLocaleString('en-CA', { dateStyle: 'long', timeStyle: 'short' })}</span>
          </span>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-8">
          {/* Line items */}
          <section className="rounded-2xl border border-line bg-white">
            <h2 className="border-b border-line px-6 py-4 font-display text-lg font-bold text-ink">Line Items</h2>
            <div className="divide-y divide-line">
              {items.map((item, i) => (
                <div key={i} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-ink">{item.name}</p>
                    <p className="text-xs text-ink/45">
                      SKU {item.sku} · Qty {item.qty} × ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                  <p className="font-mono text-sm text-ink/80">${(item.qty * Number(item.price)).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="space-y-1.5 border-t border-line px-6 py-4 text-sm">
              <p className="flex justify-between text-ink/60"><span>Subtotal</span><span className="font-mono">${Number(o.subtotal).toFixed(2)}</span></p>
              <p className="flex justify-between text-ink/60"><span>Shipping (flat)</span><span className="font-mono">${Number(o.shipping).toFixed(2)}</span></p>
              <p className="flex justify-between font-display text-lg font-bold text-ink"><span>Total</span><span>${Number(o.total).toFixed(2)} CAD</span></p>
            </div>
          </section>

          {/* Customer notes */}
          {(o.notes || o.note) && (
            <section className="rounded-2xl border border-line bg-white p-6">
              <h2 className="font-display text-lg font-bold text-ink">Notes</h2>
              {o.notes && <p className="mt-3 text-sm text-ink/70">Customer: {o.notes}</p>}
              {o.note && <p className="mt-2 text-sm text-electric/80">Internal: {o.note}</p>}
            </section>
          )}
        </div>

        <div className="space-y-8">
          {/* Customer */}
          <section className="rounded-2xl border border-line bg-white p-6">
            <h2 className="font-display text-lg font-bold text-ink">Customer</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <p className="flex justify-between"><dt className="text-ink/50">Name</dt><dd className="text-ink">{o.contact_name}</dd></p>
              {o.company && <p className="flex justify-between"><dt className="text-ink/50">Company</dt><dd className="text-ink">{o.company}</dd></p>}
              <p className="flex justify-between"><dt className="text-ink/50">Phone</dt><dd><a className="text-electric hover:underline" href={`tel:${o.phone}`}>{o.phone}</a></dd></p>
              {o.email && <p className="flex justify-between"><dt className="text-ink/50">Email</dt><dd className="text-ink">{o.email}</dd></p>}
              <p className="flex justify-between"><dt className="text-ink/50">Account</dt><dd className="text-ink/60">{o.user_id ? 'Registered customer' : 'Guest / phone'}</dd></p>
            </dl>
            <p className="mt-4 text-xs text-ink/40">
              Confirm by phone: <a className="text-electric" href={`tel:${SITE.mobile}`}>{SITE.orderPhoneDisplay}</a>
            </p>
          </section>

          <OrderStatusEditor orderId={o.id} status={o.status} note={o.note} />
        </div>
      </div>
    </>
  );
}
