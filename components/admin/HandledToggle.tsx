'use client';

import { useRouter } from 'next/navigation';
import { apiPatch } from '@/components/admin/ConfirmButton';

export default function HandledToggle({ id, handled }: { id: string; handled: boolean }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await apiPatch(`/api/admin/inquiries/${id}`, { handled: !handled });
        router.refresh();
      }}
      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
        handled
          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:border-emerald-500'
          : 'border-electric/40 bg-electric/10 text-electric hover:bg-electric/20'
      }`}
    >
      {handled ? 'Handled ✓' : 'Mark handled'}
    </button>
  );
}
