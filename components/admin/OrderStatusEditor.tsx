'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiPatch } from '@/components/admin/ConfirmButton';
import { ORDER_STATUSES, orderStatusLabel, type OrderStatus } from '@/lib/order-status';

/** Status <select> + internal note editor for an order; saves via PATCH. */
export default function OrderStatusEditor({
  orderId,
  status,
  note,
}: {
  orderId: string;
  status: OrderStatus;
  note: string | null;
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [noteValue, setNoteValue] = useState(note ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setBusy(true);
    setError(null);
    setSaved(false);
    const res = await apiPatch(`/api/admin/orders/${orderId}`, { status: value, note: noteValue });
    setBusy(false);
    if (!res.ok) setError(res.error ?? 'Error');
    else {
      setSaved(true);
      router.refresh();
    }
  };

  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <h2 className="font-display text-lg font-bold text-ink">Order Status</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink/50">Status</span>
          <select
            value={value}
            onChange={(e) => setValue(e.target.value as OrderStatus)}
            className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink focus:border-amber"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{orderStatusLabel[s]}</option>
            ))}
          </select>
        </label>
        <div className="flex items-end gap-3 pb-1">
          <button
            type="button"
            onClick={() => void save()}
            disabled={busy}
            className="rounded-xl bg-electric px-5 py-2.5 text-sm font-bold text-ink disabled:opacity-60"
          >
            {busy ? 'Saving…' : 'Save'}
          </button>
          {saved && <span className="text-sm text-emerald-400">Saved.</span>}
          {error && <span className="text-sm text-red-400" role="alert">{error}</span>}
        </div>
      </div>
      <label className="mt-4 block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink/50">
          Internal note (not shown to customer)
        </span>
        <textarea
          rows={3}
          value={noteValue}
          onChange={(e) => setNoteValue(e.target.value)}
          className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink focus:border-amber"
        />
      </label>
    </div>
  );
}
