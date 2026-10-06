'use client';

import { useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { SITE } from '@/data/catalog';

type Status =
  | { state: 'idle' }
  | { state: 'sending' }
  | { state: 'success'; via: 'supabase' | 'email' }
  | { state: 'error'; message: string };

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<Status>({ state: 'idle' });

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const valid =
    form.name.trim().length > 1 &&
    /.+@.+\..+/.test(form.email) &&
    form.message.trim().length > 5;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) {
      setStatus({ state: 'error', message: 'Please fill in your name, a valid email, and a message.' });
      return;
    }

    if (isSupabaseConfigured()) {
      setStatus({ state: 'sending' });
      try {
        const supabase = getSupabase();
        if (!supabase) throw new Error('Supabase client unavailable');
        const { error } = await supabase.from('inquiries').insert({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          subject: form.subject.trim() || null,
          message: form.message.trim(),
        });
        if (error) throw error;
        setStatus({ state: 'success', via: 'supabase' });
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
        return;
      } catch (err) {
        // fall through to mailto fallback
        console.error('Supabase insert failed, falling back to mailto:', err);
      }
    }

    // mailto fallback (also used when Supabase is not configured)
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.phone ? `Phone: ${form.phone}` : '',
      form.subject ? `Subject: ${form.subject}` : '',
      '',
      form.message,
    ]
      .filter(Boolean)
      .join('\n');
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
      form.subject || `Website inquiry from ${form.name}`,
    )}&body=${encodeURIComponent(body)}`;
    setStatus({ state: 'success', via: 'email' });
  };

  if (status.state === 'success') {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center" role="status">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-500/20 text-emerald-400">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4.5 12.5l5 5 10-11" />
          </svg>
        </span>
        <h3 className="mt-4 font-display text-xl font-bold text-ink">Inquiry {status.via === 'email' ? 'Prepared' : 'Sent'}</h3>
        <p className="mt-2 text-sm text-ink/60">
          {status.via === 'email'
            ? 'Your email app should open with the message ready — press send and we will reply shortly.'
            : 'Thanks for reaching out — our team will get back to you shortly.'}
        </p>
        <button
          type="button"
          onClick={() => setStatus({ state: 'idle' })}
          className="mt-5 text-xs text-ink/50 underline hover:text-electric"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => void submit(e)} className="space-y-4" noValidate={false}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-medium text-ink/60">
          Name *
          <input
            required
            value={form.name}
            onChange={set('name')}
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink focus:border-amber"
            placeholder="Your name"
          />
        </label>
        <label className="block text-xs font-medium text-ink/60">
          Email *
          <input
            required
            type="email"
            value={form.email}
            onChange={set('email')}
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink focus:border-amber"
            placeholder="you@company.ca"
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-medium text-ink/60">
          Phone
          <input
            type="tel"
            value={form.phone}
            onChange={set('phone')}
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink focus:border-amber"
            placeholder="416-000-0000"
          />
        </label>
        <label className="block text-xs font-medium text-ink/60">
          Subject
          <input
            value={form.subject}
            onChange={set('subject')}
            className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink focus:border-amber"
            placeholder="Quote request, stock check…"
          />
        </label>
      </div>
      <label className="block text-xs font-medium text-ink/60">
        Message *
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={set('message')}
          className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink focus:border-amber"
          placeholder="Tell us about your project — products, quantities, timelines…"
        />
      </label>
      {status.state === 'error' && (
        <p className="text-xs text-red-400" role="alert">{status.message}</p>
      )}
      {status.state === 'sending' && <p className="text-xs text-ink/50">Sending…</p>}
      <button
        type="submit"
        disabled={status.state === 'sending'}
        className="btn-shine w-full rounded-xl bg-electric px-8 py-4 font-display text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.01] disabled:opacity-60"
      >
        Send Inquiry
      </button>
      <p className="text-center text-[11px] text-ink/35">
        {isSupabaseConfigured()
          ? 'Sent securely to our team.'
          : 'Opens your email app — or call us directly for the fastest response.'}
      </p>
    </form>
  );
}
