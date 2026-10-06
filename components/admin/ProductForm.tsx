'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { inputCls, labelCls } from '@/components/admin/ui';

interface CategoryOpt { slug: string; name: string; collection: string }
interface CollectionOpt { slug: string; name: string }

export interface ProductFormValue {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  collection: string;
  price: string;
  compareAt: string;
  stock: string;
  featured: boolean;
  short: string;
  long_description: string;
  specs: string[];
  faqs: { q: string; a: string }[];
  meta_title: string;
  meta_description: string;
  image_url: string;
}

const slugify = (s: string) =>
  s.toLowerCase().replace(/["'’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function CharCount({ value, max }: { value: string; max: number }) {
  const over = value.length > max;
  return (
    <span className={`text-[11px] tabular-nums ${over ? 'text-red-400' : 'text-ink/35'}`}>
      {value.length}/{max}
    </span>
  );
}

export default function ProductForm({
  initial,
  categories,
  collections,
}: {
  initial?: Partial<ProductFormValue>;
  categories: CategoryOpt[];
  collections: CollectionOpt[];
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState<ProductFormValue>({
    name: initial?.name ?? '',
    slug: initial?.slug ?? '',
    sku: initial?.sku ?? '',
    category: initial?.category ?? categories[0]?.slug ?? '',
    collection: initial?.collection ?? collections[0]?.slug ?? '',
    price: initial?.price ?? '',
    compareAt: initial?.compareAt ?? '',
    stock: initial?.stock ?? 'in-stock',
    featured: initial?.featured ?? false,
    short: initial?.short ?? '',
    long_description: initial?.long_description ?? '',
    specs: initial?.specs ?? [],
    faqs: initial?.faqs ?? [],
    meta_title: initial?.meta_title ?? '',
    meta_description: initial?.meta_description ?? '',
    image_url: initial?.image_url ?? '',
  });
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Collection follows the chosen category (derived), but stays editable.
  const derivedCollection = useMemo(
    () => categories.find((c) => c.slug === form.category)?.collection ?? form.collection,
    [categories, form.category, form.collection],
  );

  const set = <K extends keyof ProductFormValue>(key: K, value: ProductFormValue[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSaved(false);
    const payload = {
      ...form,
      collection: derivedCollection,
      price: Number(form.price),
      compareAt: form.compareAt ? Number(form.compareAt) : null,
      specs: form.specs.filter((s) => s.trim()),
      faqs: form.faqs.filter((f) => f.q.trim() && f.a.trim()),
    };
    const res = await fetch(isEdit ? `/api/admin/products/${initial!.id}` : '/api/admin/products', {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setBusy(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? `Error ${res.status}`);
      return;
    }
    setSaved(true);
    router.refresh();
    if (!isEdit) router.push('/admin/products/');
  };

  return (
    <form onSubmit={(e) => void submit(e)} className="space-y-8">
      {/* Core */}
      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="mb-5 font-display text-lg font-bold text-ink">Core</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className={labelCls()}>Name *</span>
            <input
              required
              className={inputCls()}
              value={form.name}
              onChange={(e) => {
                set('name', e.target.value);
                if (!slugTouched) set('slug', slugify(e.target.value));
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
                set('slug', slugify(e.target.value));
              }}
            />
          </label>
          <label>
            <span className={labelCls()}>SKU *</span>
            <input required className={inputCls()} value={form.sku} onChange={(e) => set('sku', e.target.value)} />
          </label>
          <label>
            <span className={labelCls()}>Category *</span>
            <select className={inputCls()} value={form.category} onChange={(e) => set('category', e.target.value)}>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </label>
          <label>
            <span className={labelCls()}>Collection (derived from category)</span>
            <select
              className={inputCls()}
              value={derivedCollection}
              onChange={(e) => set('collection', e.target.value)}
            >
              {collections.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </label>
          <label>
            <span className={labelCls()}>Price (CAD) *</span>
            <input required type="number" step="0.01" min="0" className={inputCls()} value={form.price} onChange={(e) => set('price', e.target.value)} />
          </label>
          <label>
            <span className={labelCls()}>Compare-at price</span>
            <input type="number" step="0.01" min="0" className={inputCls()} value={form.compareAt} onChange={(e) => set('compareAt', e.target.value)} />
          </label>
          <label>
            <span className={labelCls()}>Stock status</span>
            <select className={inputCls()} value={form.stock} onChange={(e) => set('stock', e.target.value)}>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="made-to-order">Made to Order</option>
            </select>
          </label>
          <label className="flex items-end gap-3 pb-2">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set('featured', e.target.checked)}
              className="h-4 w-4 accent-[#f5b301]"
            />
            <span className="text-sm text-ink/75">Featured product (homepage)</span>
          </label>
        </div>
      </section>

      {/* Descriptions */}
      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="mb-5 font-display text-lg font-bold text-ink">Descriptions</h2>
        <div className="space-y-4">
          <label className="block">
            <span className={labelCls()}>Short description (card + meta fallback) *</span>
            <textarea required rows={2} className={inputCls()} value={form.short} onChange={(e) => set('short', e.target.value)} />
          </label>
          <label className="block">
            <span className={labelCls()}>Long description (product page intro — leave blank to auto-generate)</span>
            <textarea rows={6} className={inputCls()} value={form.long_description} onChange={(e) => set('long_description', e.target.value)} />
          </label>
        </div>
      </section>

      {/* Specs */}
      <section className="rounded-2xl border border-line bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink">Spec Bullets</h2>
          <button
            type="button"
            onClick={() => set('specs', [...form.specs, ''])}
            className="rounded-lg border border-electric/40 px-3 py-1.5 text-xs font-semibold text-electric hover:bg-electric/10"
          >
            + Add bullet
          </button>
        </div>
        <div className="space-y-2">
          {form.specs.map((spec, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={inputCls()}
                value={spec}
                placeholder="e.g. 150W | 19,500 lm | 5000K"
                onChange={(e) => set('specs', form.specs.map((s, j) => (j === i ? e.target.value : s)))}
              />
              <button
                type="button"
                aria-label="Remove spec"
                onClick={() => set('specs', form.specs.filter((_, j) => j !== i))}
                className="shrink-0 rounded-lg border border-line px-3 text-ink/50 hover:border-red-500/50 hover:text-red-400"
              >
                ×
              </button>
            </div>
          ))}
          {form.specs.length === 0 && (
            <p className="text-sm text-ink/35">No specs yet — add wattage, lumens, voltage, colour temp, certifications.</p>
          )}
        </div>
      </section>

      {/* FAQs */}
      <section className="rounded-2xl border border-line bg-white p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink">FAQs</h2>
          <button
            type="button"
            onClick={() => set('faqs', [...form.faqs, { q: '', a: '' }])}
            className="rounded-lg border border-electric/40 px-3 py-1.5 text-xs font-semibold text-electric hover:bg-electric/10"
          >
            + Add FAQ
          </button>
        </div>
        <div className="space-y-4">
          {form.faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-line bg-paper p-4">
              <div className="flex gap-2">
                <input
                  className={inputCls()}
                  value={faq.q}
                  placeholder="Question"
                  onChange={(e) => set('faqs', form.faqs.map((f, j) => (j === i ? { ...f, q: e.target.value } : f)))}
                />
                <button
                  type="button"
                  aria-label="Remove FAQ"
                  onClick={() => set('faqs', form.faqs.filter((_, j) => j !== i))}
                  className="shrink-0 rounded-lg border border-line px-3 text-ink/50 hover:border-red-500/50 hover:text-red-400"
                >
                  ×
                </button>
              </div>
              <textarea
                rows={2}
                className={`${inputCls()} mt-2`}
                value={faq.a}
                placeholder="Answer"
                onChange={(e) => set('faqs', form.faqs.map((f, j) => (j === i ? { ...f, a: e.target.value } : f)))}
              />
            </div>
          ))}
          {form.faqs.length === 0 && <p className="text-sm text-ink/35">No custom FAQs — template defaults will be used.</p>}
        </div>
      </section>

      {/* SEO */}
      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="mb-5 font-display text-lg font-bold text-ink">SEO</h2>
        <div className="space-y-4">
          <label className="block">
            <span className={labelCls()}>
              Meta title (leave blank to auto-generate) <CharCount value={form.meta_title} max={60} />
            </span>
            <input className={inputCls()} value={form.meta_title} onChange={(e) => set('meta_title', e.target.value)} />
          </label>
          <label className="block">
            <span className={labelCls()}>
              Meta description <CharCount value={form.meta_description} max={160} />
            </span>
            <textarea rows={2} className={inputCls()} value={form.meta_description} onChange={(e) => set('meta_description', e.target.value)} />
          </label>
        </div>
      </section>

      {/* Image */}
      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="mb-5 font-display text-lg font-bold text-ink">Image</h2>
        <label className="block">
          <span className={labelCls()}>Image URL (optional — generated SVG art is used when empty)</span>
          <input
            className={inputCls()}
            placeholder="https://…"
            value={form.image_url}
            onChange={(e) => set('image_url', e.target.value)}
          />
        </label>
      </section>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={busy}
          className="btn-shine rounded-xl bg-electric px-8 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.02] disabled:opacity-60"
        >
          {busy ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products/')}
          className="rounded-xl border border-line px-6 py-3.5 text-sm font-semibold text-ink/70 hover:text-ink"
        >
          Cancel
        </button>
        {saved && <span className="text-sm text-emerald-400">Saved.</span>}
        {error && <span className="text-sm text-red-400" role="alert">{error}</span>}
      </div>
    </form>
  );
}
