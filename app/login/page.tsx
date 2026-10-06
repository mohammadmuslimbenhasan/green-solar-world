'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { SITE } from '@/data/catalog';

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') ?? '/account';

  const [mode, setMode] = useState<'password' | 'magic'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'error' | 'success'; text: string } | null>(null);

  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

  const signInWithPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setNotice({ kind: 'error', text: 'Sign-in is not configured on this deployment yet.' });
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setNotice({ kind: 'error', text: error.message });
      return;
    }
    router.push(next);
    router.refresh();
  };

  const signInWithMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setNotice({ kind: 'error', text: 'Sign-in is not configured on this deployment yet.' });
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    setBusy(false);
    if (error) {
      setNotice({ kind: 'error', text: error.message });
      return;
    }
    setNotice({ kind: 'success', text: 'Check your inbox — we sent you a sign-in link.' });
  };

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-6xl overflow-hidden rounded-3xl border border-line lg:grid-cols-2">
      {/* Brand panel */}
      <div className="pattern-light hidden flex-col justify-between bg-white p-12 lg:flex">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-electric text-ink">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
              <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2z" />
            </svg>
          </span>
          <span className="font-display text-lg font-bold text-ink">Green Solar World</span>
        </Link>
        <div>
          <h2 className="font-display text-3xl font-bold leading-tight text-ink">
            Contractor accounts,
            <span className="block text-electric">coming into focus.</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink/55">
            Sign in to track order requests, save your cart between visits, and speed up
            reorders. Wholesale pricing stays the same — flat ${SITE.shippingFlat} shipping, free Mississauga pickup.
          </p>
        </div>
        <p className="text-xs text-ink/35">4615 Burgoyne St., Mississauga ON · {SITE.phone}</p>
      </div>

      {/* Form panel */}
      <div className="bg-white p-8 sm:p-12">
        <h1 className="font-display text-2xl font-bold text-ink">Sign in</h1>
        <p className="mt-2 text-sm text-ink/50">
          New here?{' '}
          <Link href={`/register/?next=${encodeURIComponent(next)}`} className="font-semibold text-electric hover:underline">
            Create a contractor account
          </Link>
        </p>

        <div className="mt-7 grid grid-cols-2 gap-2 rounded-xl border border-line bg-paper p-1" role="tablist" aria-label="Sign-in method">
          {(['password', 'magic'] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => { setMode(m); setNotice(null); }}
              className={`rounded-lg py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                mode === m ? 'bg-electric text-ink' : 'text-ink/60 hover:text-ink'
              }`}
            >
              {m === 'password' ? 'Password' : 'Email Link'}
            </button>
          ))}
        </div>

        {configured ? (
          <form onSubmit={mode === 'password' ? signInWithPassword : signInWithMagicLink} className="mt-6 space-y-4">
            <label className="block text-xs font-medium text-ink/60">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink focus:border-amber"
                placeholder="you@company.ca"
              />
            </label>
            {mode === 'password' && (
              <label className="block text-xs font-medium text-ink/60">
                Password
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink focus:border-amber"
                  placeholder="••••••••"
                />
              </label>
            )}
            {notice && (
              <p
                role={notice.kind === 'error' ? 'alert' : 'status'}
                className={`rounded-xl px-4 py-3 text-sm ${
                  notice.kind === 'error' ? 'bg-red-500/10 text-red-300' : 'bg-emerald-500/10 text-emerald-300'
                }`}
              >
                {notice.text}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="btn-shine w-full rounded-xl bg-electric px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.01] disabled:opacity-60"
            >
              {busy ? 'Please wait…' : mode === 'password' ? 'Sign In' : 'Send Sign-in Link'}
            </button>
          </form>
        ) : (
          <p className="mt-6 rounded-xl border border-line bg-white/60 px-4 py-3 text-sm text-ink/55">
            Online sign-in isn&rsquo;t configured on this deployment yet — you can still place
            orders by phone at <a href={`tel:${SITE.mobile}`} className="text-electric">{SITE.orderPhoneDisplay}</a>.
          </p>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <Suspense fallback={<div className="h-[70vh] animate-pulse rounded-3xl bg-white/5" />}>
        <LoginInner />
      </Suspense>
    </section>
  );
}
