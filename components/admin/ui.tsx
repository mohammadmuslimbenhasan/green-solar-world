import type { ReactNode } from 'react';

export function AdminHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-ink/50">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  href,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  href?: string;
}) {
  const inner = (
    <div className="rounded-2xl border border-line bg-white p-6 transition-colors hover:border-electric/40">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink/45">{label}</p>
      <p className="mt-3 font-display text-3xl font-bold text-ink">{value}</p>
      {hint && <p className="mt-1.5 text-xs text-electric/80">{hint}</p>}
    </div>
  );
  return href ? <a href={href}>{inner}</a> : inner;
}

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-line bg-white text-left">
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-ink/45">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}

export function Badge({ tone, children }: { tone: 'amber' | 'green' | 'red' | 'gray' | 'blue'; children: ReactNode }) {
  const tones: Record<string, string> = {
    amber: 'border-electric/40 bg-electric/10 text-electric',
    green: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
    red: 'border-red-500/40 bg-red-500/10 text-red-400',
    gray: 'border-line bg-white/5 text-ink/55',
    blue: 'border-sky-500/40 bg-sky-500/10 text-sky-400',
  };
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function statusTone(status: string): 'amber' | 'green' | 'red' | 'gray' | 'blue' {
  switch (status) {
    case 'pending':
      return 'amber';
    case 'confirmed':
      return 'blue';
    case 'ready_for_pickup':
      return 'blue';
    case 'shipped':
      return 'green';
    case 'completed':
      return 'green';
    case 'cancelled':
      return 'red';
    default:
      return 'gray';
  }
}

export function inputCls() {
  return 'w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-amber disabled:opacity-50';
}

export function labelCls() {
  return 'mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink/50';
}
