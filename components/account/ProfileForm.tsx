'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { inputCls, labelCls } from '@/components/admin/ui';

export default function ProfileForm({
  initial,
}: {
  initial: { full_name: string; company_name: string; phone: string };
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSaved(false);
    const res = await fetch('/api/account/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: form.full_name.trim(),
        company_name: form.company_name.trim() || null,
        phone: form.phone.trim() || null,
      }),
    });
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
    <form onSubmit={(e) => void submit(e)} className="max-w-lg space-y-4">
      <label className="block">
        <span className={labelCls()}>Full name</span>
        <input className={inputCls()} value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} />
      </label>
      <label className="block">
        <span className={labelCls()}>Company</span>
        <input className={inputCls()} value={form.company_name} onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))} />
      </label>
      <label className="block">
        <span className={labelCls()}>Phone</span>
        <input className={inputCls()} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
      </label>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={busy}
          className="rounded-xl bg-electric px-6 py-3 text-sm font-bold text-ink disabled:opacity-60">
          {busy ? 'Saving…' : 'Save Profile'}
        </button>
        {saved && <span className="text-sm text-emerald-400">Saved.</span>}
        {error && <span className="text-sm text-red-400" role="alert">{error}</span>}
      </div>
    </form>
  );
}
