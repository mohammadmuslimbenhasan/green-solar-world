'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiPatch } from '@/components/admin/ConfirmButton';
import { inputCls, labelCls } from '@/components/admin/ui';

const HELPERS: Record<string, string> = {
  social_facebook: 'Full Facebook page URL, e.g. https://facebook.com/yourpage — leave empty to hide the icon.',
  social_instagram: 'Full Instagram profile URL — leave empty to hide the icon.',
  social_linkedin: 'Full LinkedIn company page URL — leave empty to hide the icon.',
  google_business_url: 'Your Google Business Profile link (reviews, directions). Shown as "Find us on Google".',
};

const LABELS: Record<string, string> = {
  social_facebook: 'Facebook URL',
  social_instagram: 'Instagram URL',
  social_linkedin: 'LinkedIn URL',
  google_business_url: 'Google Business Profile URL',
};

export default function SettingsForm({ initial }: { initial: Record<string, string> }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setBusy(true);
    setError(null);
    setSaved(false);
    const res = await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values }),
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
    <div className="space-y-5">
      {Object.keys(LABELS).map((key) => (
        <label key={key} className="block">
          <span className={labelCls()}>{LABELS[key]}</span>
          <input
            className={inputCls()}
            placeholder="https://…"
            value={values[key] ?? ''}
            onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
          />
          <span className="mt-1 block text-xs text-ink/40">{HELPERS[key]}</span>
        </label>
      ))}
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => void save()} disabled={busy}
          className="rounded-xl bg-electric px-6 py-3 text-sm font-bold text-ink disabled:opacity-60">
          {busy ? 'Saving…' : 'Save Settings'}
        </button>
        {saved && <span className="text-sm text-emerald-400">Saved.</span>}
        {error && <span className="text-sm text-red-400" role="alert">{error}</span>}
      </div>
    </div>
  );
}

interface Section {
  id: string;
  section_key: string;
  title: string;
  subtitle: string | null;
  body: { text?: string } | null;
  is_active: boolean;
  sort_order: number;
}

/** Homepage section editor: title/subtitle/body, active toggle, sort order. */
export function SectionsEditor({ sections }: { sections: Section[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(sections);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const update = (id: string, patch: Partial<Section>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const save = async (row: Section) => {
    setBusyId(row.id);
    setSavedId(null);
    const res = await apiPatch(`/api/admin/sections/${row.id}`, {
      title: row.title,
      subtitle: row.subtitle,
      body: { text: row.body?.text ?? '' },
      is_active: row.is_active,
      sort_order: Number(row.sort_order),
    });
    setBusyId(null);
    if (res.ok) {
      setSavedId(row.id);
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <div key={row.id} className="rounded-2xl border border-line bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-xs text-ink/45">{row.section_key}</p>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-ink/60">
                <input
                  type="checkbox"
                  checked={row.is_active}
                  onChange={(e) => update(row.id, { is_active: e.target.checked })}
                  className="h-4 w-4 accent-[#f5b301]"
                />
                Active
              </label>
              <label className="flex items-center gap-2 text-xs text-ink/60">
                Order
                <input
                  type="number"
                  value={row.sort_order}
                  onChange={(e) => update(row.id, { sort_order: Number(e.target.value) })}
                  className="w-16 rounded-lg border border-line bg-paper px-2 py-1.5 text-sm text-ink"
                />
              </label>
            </div>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input
              className={inputCls()}
              value={row.title}
              onChange={(e) => update(row.id, { title: e.target.value })}
              placeholder="Title"
            />
            <input
              className={inputCls()}
              value={row.subtitle ?? ''}
              onChange={(e) => update(row.id, { subtitle: e.target.value })}
              placeholder="Subtitle"
            />
          </div>
          <textarea
            rows={2}
            className={`${inputCls()} mt-3`}
            value={row.body?.text ?? ''}
            onChange={(e) => update(row.id, { body: { text: e.target.value } })}
            placeholder="Body text"
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => void save(row)}
              disabled={busyId === row.id}
              className="rounded-lg bg-electric px-4 py-2 text-xs font-bold uppercase tracking-wide text-ink disabled:opacity-60"
            >
              {busyId === row.id ? '…' : 'Save'}
            </button>
            {savedId === row.id && <span className="text-xs text-emerald-400">Saved.</span>}
          </div>
        </div>
      ))}
      {rows.length === 0 && (
        <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-ink/40">
          No homepage sections — run seed.sql to create the defaults.
        </p>
      )}
    </div>
  );
}
