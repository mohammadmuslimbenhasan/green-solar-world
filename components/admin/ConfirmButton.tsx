'use client';

import { useState } from 'react';

/**
 * Button that requires a second click to confirm ("Delete? [Confirm] [Cancel]").
 */
export default function ConfirmButton({
  onConfirm,
  label = 'Delete',
  confirmLabel = 'Confirm',
  className = '',
  message,
}: {
  onConfirm: () => Promise<{ ok: boolean; error?: string }> | { ok: boolean; error?: string };
  label?: string;
  confirmLabel?: string;
  className?: string;
  message?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className={`rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink/70 transition-colors hover:border-red-500/50 hover:text-red-400 ${className}`}
      >
        {label}
      </button>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {message && <span className="text-xs text-ink/50">{message}</span>}
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError(null);
          const res = await onConfirm();
          setBusy(false);
          if (res.ok) setConfirming(false);
          else setError(res.error ?? 'Something went wrong');
        }}
        className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {busy ? '…' : confirmLabel}
      </button>
      <button
        type="button"
        onClick={() => {
          setConfirming(false);
          setError(null);
        }}
        className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-ink/60 hover:text-ink"
      >
        Cancel
      </button>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </span>
  );
}

/** Small helper for route-handler deletes from client components. */
export async function apiDelete(url: string): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(url, { method: 'DELETE' });
  if (res.ok) return { ok: true };
  try {
    const body = await res.json();
    return { ok: false, error: body.error ?? `Error ${res.status}` };
  } catch {
    return { ok: false, error: `Error ${res.status}` };
  }
}

export async function apiPatch(url: string, data: unknown): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (res.ok) return { ok: true };
  try {
    const body = await res.json();
    return { ok: false, error: body.error ?? `Error ${res.status}` };
  } catch {
    return { ok: false, error: `Error ${res.status}` };
  }
}
