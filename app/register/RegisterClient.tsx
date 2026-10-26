'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { SITE } from '@/data/catalog';

function RegisterInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') ?? '/account';

  const [form, setForm] = useState({ fullName: '', company: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);

  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const register = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setNotice({ kind: 'error', text: 'Registration is not configured on this deployment yet.' });
      return;
    }
    if (form.password.length < 6) {
      setNotice({ kind: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.fullName, company_name: form.company },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setBusy(false);
    if (error) {
      setNotice({ kind: 'error', text: error.message });
      return;
    }
    setNotice({
      kind: 'success',
      text: 'Account created — check your email to confirm, then sign in.',
    });
  };

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-3xl font-bold text-ink">Create your account</h1>
      <p className="mt-2 text-sm text-ink/50">
        For contractors buying at wholesale. Already registered?{' '}
        <Link href={`/login/?next=${encodeURIComponent(next)}`} className="font-semibold text-electric hover:underline">
          Sign in
        </Link>
      </p>

      {configured ? (
        <form onSubmit={register} className="mt-8 space-y-4">
          <label className="block text-xs font-medium text-ink/60">
            Full name
            <input required value={form.fullName} onChange={set('fullName')} autoComplete="name"
              className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink focus:border-amber" />
          </label>
          <label className="block text-xs font-medium text-ink/60">
            Company (optional)
            <input value={form.company} onChange={set('company')} autoComplete="organization"
              className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink focus:border-amber" />
          </label>
          <label className="block text-xs font-medium text-ink/60">
            Email
            <input required type="email" value={form.email} onChange={set('email')} autoComplete="email"
              className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink focus:border-amber" />
          </label>
          <label className="block text-xs font-medium text-ink/60">
            Password (min 6 characters)
            <input required type="password" minLength={6} value={form.password} onChange={set('password')} autoComplete="new-password"
              className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink focus:border-amber" />
          </label>
          {notice && (
            <p role={notice.kind === 'error' ? 'alert' : 'status'}
              className={`rounded-xl px-4 py-3 text-sm ${
                notice.kind === 'error' ? 'bg-red-500/10 text-red-300' : 'bg-emerald-500/10 text-emerald-300'
              }`}>
              {notice.text}
            </p>
          )}
          <button type="submit" disabled={busy}
            className="btn-shine w-full rounded-xl bg-electric px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.01] disabled:opacity-60">
            {busy ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
      ) : (
        <p className="mt-8 rounded-xl border border-line bg-white/60 px-4 py-3 text-sm text-ink/55">
          Online registration isn&rsquo;t configured on this deployment yet — you can still place
          orders by phone at <a href={`tel:${SITE.mobile}`} className="text-electric">{SITE.orderPhoneDisplay}</a>.
        </p>
      )}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-white/5" />}>
        <RegisterInner />
      </Suspense>
    </section>
  );
}
