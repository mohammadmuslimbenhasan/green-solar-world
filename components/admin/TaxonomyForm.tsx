'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { inputCls, labelCls } from '@/components/admin/ui';
import ConfirmButton, { apiDelete } from '@/components/admin/ConfirmButton';

const slugify = (s: string) =>
  s.toLowerCase().replace(/["'’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

interface Row {
  id: string;
  slug: string;
  name: string;
  description: string | null;
}

/** Create/edit form for a category or collection row. */
export function TaxonomyForm({
  kind,
  initial,
  collections,
}: {
  kind: 'categories' | 'collections';
  initial?: Row;
  /** only for categories: which collections exist */
  collections?: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    slug: initial?.slug ?? '',
    description: initial?.description ?? '',
    collection: '',
  });
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch(
      isEdit ? `/api/admin/${kind}/${initial!.id}` : `/api/admin/${kind}`,
      {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          description: form.description || null,
          ...(kind === 'categories' ? { collection: form.collection || undefined } : {}),
        }),
      },
    );
    setBusy(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? `Error ${res.status}`);
      return;
    }
    setSaved(true);
    router.refresh();
  };

  return (
    <form onSubmit={(e) => void submit(e)} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label>
          <span className={labelCls()}>Name *</span>
          <input
            required
            className={inputCls()}
            value={form.name}
            onChange={(e) => {
              setForm((f) => ({ ...f, name: e.target.value }));
              if (!slugTouched) setForm((f) => ({ ...f, slug: slugify(e.target.value) }));
            }}
          />
        </label>
        <label>
          <span className={labelCls()}>Slug *</span>
          <input
            required
            className={inputCls()}
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              setForm((f) => ({ ...f, slug: slugify(e.target.value) }));
            }}
          />
        </label>
      </div>
      {kind === 'categories' && collections && (
        <label className="block">
          <span className={labelCls()}>Collection *</span>
          <select
            className={inputCls()}
            value={form.collection}
            onChange={(e) => setForm((f) => ({ ...f, collection: e.target.value }))}
          >
            <option value="">Select…</option>
            {collections.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </label>
      )}
      <label className="block">
        <span className={labelCls()}>Description</span>
        <textarea rows={2} className={inputCls()} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
      </label>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-electric px-4 py-2 text-xs font-bold uppercase tracking-wide text-ink disabled:opacity-60"
        >
          {busy ? '…' : isEdit ? 'Save' : 'Create'}
        </button>
        {saved && <span className="text-xs text-emerald-400">Saved.</span>}
        {error && <span className="text-xs text-red-400" role="alert">{error}</span>}
      </div>
    </form>
  );
}

export function TaxonomyDeleteButton({ kind, id }: { kind: string; id: string }) {
  const router = useRouter();
  return (
    <ConfirmButton
      message="Delete?"
      confirmLabel="Delete"
      onConfirm={async () => {
        const res = await apiDelete(`/api/admin/${kind}/${id}`);
        if (res.ok) router.refresh();
        return res;
      }}
    />
  );
}
