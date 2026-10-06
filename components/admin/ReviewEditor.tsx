'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiPatch, apiDelete } from '@/components/admin/ConfirmButton';
import { inputCls, labelCls } from '@/components/admin/ui';

/** Inline review editor (author, rating, text, source, linked product). */
export function ReviewEditor({
  review,
  products,
}: {
  review: {
    id: string;
    author_name: string;
    rating: number;
    text: string;
    source: string;
    product_id: string | null;
  };
  products: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    author_name: review.author_name,
    rating: String(review.rating),
    text: review.text,
    source: review.source,
    product_id: review.product_id ?? '',
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setBusy(true);
    setError(null);
    setSaved(false);
    const res = await apiPatch(`/api/admin/reviews/${review.id}`, {
      author_name: form.author_name,
      rating: Number(form.rating),
      text: form.text,
      source: form.source,
      product_id: form.product_id || null,
    });
    setBusy(false);
    if (!res.ok) setError(res.error ?? 'Error');
    else {
      setSaved(true);
      router.refresh();
    }
  };

  return (
    <div className="mt-4 space-y-3 border-t border-line pt-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <label>
          <span className={labelCls()}>Author</span>
          <input className={inputCls()} value={form.author_name} onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))} />
        </label>
        <label>
          <span className={labelCls()}>Rating</span>
          <select className={inputCls()} value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}>
            {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} ★</option>)}
          </select>
        </label>
        <label>
          <span className={labelCls()}>Source</span>
          <select className={inputCls()} value={form.source} onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}>
            <option value="google">google</option>
            <option value="website">website</option>
          </select>
        </label>
      </div>
      <label className="block">
        <span className={labelCls()}>Text</span>
        <textarea rows={3} className={inputCls()} value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} />
      </label>
      <label className="block">
        <span className={labelCls()}>Linked product (optional)</span>
        <select className={inputCls()} value={form.product_id} onChange={(e) => setForm((f) => ({ ...f, product_id: e.target.value }))}>
          <option value="">— None —</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </label>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => void save()} disabled={busy}
          className="rounded-lg bg-electric px-4 py-2 text-xs font-bold uppercase tracking-wide text-ink disabled:opacity-60">
          {busy ? '…' : 'Save'}
        </button>
        {saved && <span className="text-xs text-emerald-400">Saved.</span>}
        {error && <span className="text-xs text-red-400" role="alert">{error}</span>}
      </div>
    </div>
  );
}

export function ReviewApproveButton({ id, approved }: { id: string; approved: boolean }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await apiPatch(`/api/admin/reviews/${id}`, { is_approved: !approved });
        router.refresh();
      }}
      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
        approved
          ? 'border-line text-ink/60 hover:border-amber-500/50 hover:text-amber-400'
          : 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
      }`}
    >
      {approved ? 'Unapprove' : 'Approve'}
    </button>
  );
}

export function ReviewDeleteButton({ id }: { id: string }) {
  const router = useRouter();
  return (
    <ConfirmInline
      onConfirm={async () => {
        const res = await apiDelete(`/api/admin/reviews/${id}`);
        if (res.ok) router.refresh();
        return res;
      }}
    />
  );
}

function ConfirmInline({ onConfirm }: { onConfirm: () => Promise<{ ok: boolean; error?: string }> }) {
  const [confirming, setConfirming] = useState(false);
  if (!confirming) {
    return (
      <button type="button" onClick={() => setConfirming(true)}
        className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink/60 hover:border-red-500/50 hover:text-red-400">
        Delete
      </button>
    );
  }
  return (
    <span className="inline-flex gap-2">
      <button type="button" onClick={async () => { const r = await onConfirm(); if (r.ok) setConfirming(false); }}
        className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white">
        Confirm
      </button>
      <button type="button" onClick={() => setConfirming(false)}
        className="rounded-lg border border-line px-3 py-1.5 text-xs text-ink/60">
        Cancel
      </button>
    </span>
  );
}
