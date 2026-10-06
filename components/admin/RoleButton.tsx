'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiPatch } from '@/components/admin/ConfirmButton';

/** Promote/demote admin with an inline two-step confirm. */
export function RoleButton({ id, role, name }: { id: string; role: string; name: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const next = role === 'admin' ? 'customer' : 'admin';

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
          role === 'admin'
            ? 'border-red-500/40 text-red-400 hover:bg-red-500/10'
            : 'border-electric/40 text-electric hover:bg-electric/10'
        }`}
      >
        {role === 'admin' ? 'Demote' : 'Make admin'}
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-xs text-ink/50">
        {next === 'admin' ? `Give ${name} full admin access?` : `Remove admin from ${name}?`}
      </span>
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          const res = await apiPatch(`/api/admin/customers/${id}`, { role: next });
          setBusy(false);
          setConfirming(false);
          if (res.ok) router.refresh();
        }}
        className={`rounded-lg px-3 py-1.5 text-xs font-bold text-white disabled:opacity-60 ${
          next === 'admin' ? 'bg-electric text-ink' : 'bg-red-500'
        }`}
      >
        {busy ? '…' : 'Confirm'}
      </button>
      <button type="button" onClick={() => setConfirming(false)}
        className="rounded-lg border border-line px-3 py-1.5 text-xs text-ink/60">
        Cancel
      </button>
    </span>
  );
}
