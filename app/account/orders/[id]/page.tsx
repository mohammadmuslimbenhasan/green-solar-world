import { notFound } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase-server';
import { Badge, statusTone } from '@/components/admin/ui';
import ReorderButton from '@/components/account/ReorderButton';
import { ORDER_STATUSES, orderStatusLabel, type OrderRow } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export default async function AccountOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServer();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // RLS guarantees user_id = auth.uid(); the eq() is a second belt.
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single();
  if (!order) notFound();

  const o = order as OrderRow;
  const items = Array.isArray(o.items) ? o.items : [];
  const statusIndex = ORDER_STATUSES.indexOf(o.status);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">
            Order · {new Date(o.created_at).toLocaleDateString('en-CA', { dateStyle: 'long' })}
          </h2>
          <p className="mt-1 font-mono text-xs text-ink/45">{o.id}</p>
        </div>
        <Badge tone={statusTone(o.status)}>{orderStatusLabel[o.status] ?? o.status}</Badge>
      </div>

      {/* Status timeline */}
      <ol className="mt-8 flex flex-wrap items-center gap-2" aria-label="Order status timeline">
        {ORDER_STATUSES.map((s, i) => {
          if (s === 'cancelled') return null;
          const done = o.status === 'cancelled' ? false : i <= statusIndex;
          return (
            <li key={s} className="flex items-center gap-2">
              <span
                className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
                  done ? 'border-electric/50 bg-electric/10 text-electric' : 'border-line text-ink/35'
                }`}
              >
                {orderStatusLabel[s]}
              </span>
              {i < ORDER_STATUSES.length - 2 && <span className="text-ink/20" aria-hidden="true">→</span>}
            </li>
          );
        })}
        {o.status === 'cancelled' && (
          <li><span className="rounded-full border border-red-500/50 bg-red-500/10 px-3 py-1.5 text-[11px] font-semibold text-red-400">Cancelled</span></li>
        )}
      </ol>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl border border-line bg-white">
          <h3 className="border-b border-line px-6 py-4 font-display text-lg font-bold text-ink">Items</h3>
          <div className="divide-y divide-line">
            {items.map((item, i) => (
              <div key={i} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-ink">{item.name}</p>
                  <p className="text-xs text-ink/45">SKU {item.sku} · Qty {item.qty} × ${Number(item.price).toFixed(2)}</p>
                </div>
                <p className="font-mono text-sm text-ink/80">${(item.qty * Number(item.price)).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="space-y-1.5 border-t border-line px-6 py-4 text-sm">
            <p className="flex justify-between text-ink/60"><span>Subtotal</span><span className="font-mono">${Number(o.subtotal).toFixed(2)}</span></p>
            <p className="flex justify-between text-ink/60"><span>Shipping</span><span className="font-mono">${Number(o.shipping).toFixed(2)}</span></p>
            <p className="flex justify-between font-display text-lg font-bold text-ink"><span>Total</span><span>${Number(o.total).toFixed(2)} CAD</span></p>
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-line bg-white p-6">
            <h3 className="font-display text-lg font-bold text-ink">Reorder</h3>
            <p className="mt-2 text-sm text-ink/55">
              Add every item from this order back to your cart, then adjust quantities.
            </p>
            <div className="mt-4">
              <ReorderButton items={items} />
            </div>
          </section>
          {(o.notes || o.company) && (
            <section className="rounded-2xl border border-line bg-white p-6">
              <h3 className="font-display text-lg font-bold text-ink">Details</h3>
              {o.company && <p className="mt-2 text-sm text-ink/60">Company: {o.company}</p>}
              {o.notes && <p className="mt-2 text-sm text-ink/60">Notes: {o.notes}</p>}
            </section>
          )}
        </div>
      </div>
    </>
  );
}
