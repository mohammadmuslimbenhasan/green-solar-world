import type { Metadata } from 'next';
import { getAdminContext } from '@/lib/admin';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

/** Shared empty state when Supabase env vars are not configured. */
export function DatabaseNotConfigured({ area }: { area: string }) {
  return (
    <div className="grid min-h-[60vh] place-items-center p-8">
      <div className="max-w-md rounded-2xl border border-line bg-white p-10 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-electric/15 text-electric">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
            <ellipse cx="12" cy="5" rx="8" ry="3" />
            <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
          </svg>
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold text-ink">Database not configured</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink/55">
          The {area} needs Supabase. Set{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-electric">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-electric">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>,
          run <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">supabase/schema.sql</code> then{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">supabase/seed.sql</code>, and restart.
        </p>
      </div>
    </div>
  );
}

function Forbidden() {
  return (
    <div className="grid min-h-[60vh] place-items-center p-8">
      <div className="max-w-md rounded-2xl border border-red-500/25 bg-red-500/[0.06] p-10 text-center">
        <p className="font-display text-5xl font-bold text-red-400">403</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-ink">Admin access required</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink/55">
          Your account does not have the admin role. Ask an existing admin to run{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">
            update profiles set role = &apos;admin&apos; where id = &apos;…&apos;;
          </code>{' '}
          in the Supabase SQL editor.
        </p>
        <a href="/" className="mt-6 inline-block rounded-xl bg-electric px-6 py-3 font-display text-sm font-bold text-ink">
          Back to Store
        </a>
      </div>
    </div>
  );
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getAdminContext('/admin');

  if (!ctx.configured) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1">
          <DatabaseNotConfigured area="admin panel" />
        </div>
      </div>
    );
  }
  if (!ctx.isAdmin) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1">
          <Forbidden />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">{children}</div>
      </div>
    </div>
  );
}
