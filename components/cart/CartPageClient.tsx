'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartContext';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { SITE } from '@/data/catalog';

type CheckoutState =
  | { step: 'cart' }
  | { step: 'form' }
  | { step: 'submitting' }
  | { step: 'success' }
  | { step: 'fallback'; reason: string };

export default function CartPageClient() {
  const cart = useCart();
  const [state, setState] = useState<CheckoutState>({ step: 'cart' });
  const [form, setForm] = useState({ company: '', name: '', phone: '', email: '', notes: '' });
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Detect a signed-in session so checkout can attach user_id to the order.
  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
  }, []);

  const mailtoHref = useMemo(() => {
    const lines = [
      'Order Request — Green Solar World Inc.',
      '',
      ...cart.lines.map(
        (l, i) => `${i + 1}. ${l.name} (SKU ${l.sku}) — Qty ${l.qty} × $${l.price.toFixed(2)} = $${(l.qty * l.price).toFixed(2)}`,
      ),
      '',
      `Subtotal: $${cart.subtotal.toFixed(2)}`,
      `Shipping (flat): $${cart.shipping.toFixed(2)}`,
      `Total: $${cart.total.toFixed(2)}`,
    ];
    return `mailto:${SITE.email}?subject=${encodeURIComponent('Order Request — Green Solar World Inc.')}&body=${encodeURIComponent(lines.join('\n'))}`;
  }, [cart.lines, cart.subtotal, cart.shipping, cart.total]);

  const valid = form.name.trim() && form.phone.trim();

  const submitOrder = async () => {
    if (!valid) {
      setError('Please provide your name and phone number so we can confirm the order.');
      return;
    }
    setError(null);
    if (!isSupabaseConfigured()) {
      setState({ step: 'fallback', reason: 'Supabase is not configured on this deployment yet.' });
      return;
    }
    setState({ step: 'submitting' });
    try {
      // Browser client carries the auth cookie so RLS can attach the user.
      const supabase = getSupabaseBrowser() ?? getSupabase();
      if (!supabase) throw new Error('Supabase unavailable');
      let userId: string | null = null;
      if (getSupabaseBrowser()) {
        const { data } = await getSupabaseBrowser()!.auth.getUser();
        userId = data.user?.id ?? null;
      }
      const { error: dbError } = await supabase.from('orders').insert({
        user_id: userId,
        company: form.company.trim() || null,
        contact_name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        notes: form.notes.trim() || null,
        items: cart.lines.map((l) => ({
          slug: l.slug,
          sku: l.sku,
          name: l.name,
          qty: l.qty,
          price: l.price,
        })),
        subtotal: cart.subtotal,
        shipping: cart.shipping,
        total: cart.total,
      });
      if (dbError) throw dbError;
      setState({ step: 'success' });
      cart.clear();
    } catch (e) {
      setState({
        step: 'fallback',
        reason: e instanceof Error ? e.message : 'Could not reach the order service.',
      });
    }
  };

  if (state.step === 'success') {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4.5 12.5l5 5 10-11" />
          </svg>
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold text-ink">Order Request Sent</h1>
        <p className="mt-3 text-ink/60">
          Thank you — your order request has been received. Our team will call you shortly at{' '}
          <span className="text-ink">{form.phone}</span> to confirm pricing, stock and delivery.
        </p>
        <p className="mt-2 text-sm text-ink/45">
          Need it now? Call{' '}
          <a href={`tel:${SITE.mobile}`} className="font-semibold text-electric">{SITE.orderPhoneDisplay}</a>
        </p>
        <Link href="/collections/" className="btn-shine mt-8 inline-block rounded-xl bg-electric px-8 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-ink">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (state.step === 'fallback') {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20">
        <div className="rounded-3xl border border-electric/25 bg-electric/[0.06] p-10 text-center">
          <h1 className="font-display text-3xl font-bold text-ink">Place your Order By Calling</h1>
          <a
            href={`tel:${SITE.mobile}`}
            className="mt-4 block font-display text-4xl font-bold text-electric hover:underline"
          >
            {SITE.orderPhoneDisplay}
          </a>
          <p className="mt-5 text-sm text-ink/55">
            {state.reason} Your cart is saved in this browser — read us the items below and
            we&rsquo;ll confirm contractor pricing on the spot.
          </p>
          <div className="mt-6 rounded-2xl border border-line bg-white/60 p-5 text-left text-sm">
            {cart.lines.map((l) => (
              <p key={l.slug} className="flex justify-between gap-4 py-1 text-ink/75">
                <span>{l.qty} × {l.name}</span>
                <span className="font-mono">${(l.qty * l.price).toFixed(2)}</span>
              </p>
            ))}
            <p className="mt-3 flex justify-between border-t border-line pt-3 font-display font-bold text-ink">
              <span>Total (incl. ${SITE.shippingFlat} shipping)</span>
              <span>${cart.total.toFixed(2)}</span>
            </p>
          </div>
          <a
            href={mailtoHref}
            className="mt-6 inline-block rounded-xl border border-line px-8 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:border-electric/50 hover:text-electric"
          >
            Or Email This Order
          </a>
        </div>
        <button
          type="button"
          onClick={() => setState({ step: 'form' })}
          className="mx-auto mt-6 block text-sm text-ink/50 underline hover:text-electric"
        >
          ← Back to cart
        </button>
      </div>
    );
  }

  if (cart.lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-ink">Your Cart is Empty</h1>
        <p className="mt-3 text-ink/55">
          Browse the collections and add products — or place your order by calling{' '}
          <a href={`tel:${SITE.mobile}`} className="text-electric">{SITE.orderPhoneDisplay}</a>.
        </p>
        <Link href="/collections/" className="btn-shine mt-8 inline-block rounded-xl bg-electric px-8 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-ink">
          Shop Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="font-display text-4xl font-bold text-ink">Your Cart</h1>
      <p className="mt-2 text-sm text-ink/50">
        {cart.count} {cart.count === 1 ? 'item' : 'items'} · Review your order, then confirm — we call you back to finalize.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        {/* Lines */}
        <ul className="space-y-4">
          {cart.lines.map((line) => (
            <li key={line.slug} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-white p-4 sm:flex-nowrap">
              <div className="min-w-0 flex-1">
                <Link href={`/products/${line.slug}/`} className="font-display text-[15px] font-semibold text-ink hover:text-electric">
                  {line.name}
                </Link>
                <p className="mt-0.5 text-xs text-ink/45">SKU {line.sku}</p>
                <p className="mt-1 text-sm text-ink/70">${line.price.toFixed(2)} CAD each</p>
              </div>
              <div className="flex items-center rounded-lg border border-line">
                <button
                  type="button"
                  onClick={() => cart.setQty(line.slug, line.qty - 1)}
                  className="grid h-9 w-9 place-items-center text-ink/70 hover:text-electric"
                  aria-label={`Decrease quantity of ${line.name}`}
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-bold" aria-live="polite">{line.qty}</span>
                <button
                  type="button"
                  onClick={() => cart.setQty(line.slug, line.qty + 1)}
                  className="grid h-9 w-9 place-items-center text-ink/70 hover:text-electric"
                  aria-label={`Increase quantity of ${line.name}`}
                >
                  +
                </button>
              </div>
              <p className="w-24 text-right font-display font-bold text-ink">
                ${(line.price * line.qty).toFixed(2)}
              </p>
              <button
                type="button"
                onClick={() => cart.remove(line.slug)}
                className="text-ink/35 transition-colors hover:text-red-400"
                aria-label={`Remove ${line.name} from cart`}
              >
                <svg viewBox="0 0 20 20" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                  <path d="M3 5h14M8 5V3h4v2M5 5l1 12h8l1-12" />
                </svg>
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={cart.clear}
              className="text-xs text-ink/40 underline hover:text-red-400"
            >
              Clear cart
            </button>
          </li>
        </ul>

        {/* Summary / checkout */}
        <aside className="h-fit rounded-2xl border border-line bg-white p-7 lg:sticky lg:top-28">
          {state.step === 'form' || state.step === 'submitting' ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void submitOrder();
              }}
            >
              <h2 className="font-display text-xl font-bold text-ink">Confirm Order Request</h2>
              <p className="mt-1.5 text-xs text-ink/50">
                No payment online — we call to confirm and arrange billing.
              </p>
              <div className="mt-5 space-y-3">
                {(
                  [
                    ['company', 'Company (optional)', 'text'],
                    ['name', 'Contact name *', 'text'],
                    ['phone', 'Phone *', 'tel'],
                    ['email', 'Email (optional)', 'email'],
                  ] as const
                ).map(([key, label, type]) => (
                  <label key={key} className="block text-xs font-medium text-ink/60">
                    {label}
                    <input
                      type={type}
                      value={form[key]}
                      disabled={state.step === 'submitting'}
                      onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink focus:border-amber disabled:opacity-50"
                    />
                  </label>
                ))}
                <label className="block text-xs font-medium text-ink/60">
                  Notes (optional)
                  <textarea
                    value={form.notes}
                    disabled={state.step === 'submitting'}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    rows={3}
                    className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink focus:border-amber disabled:opacity-50"
                  />
                </label>
              </div>
              {error && <p className="mt-3 text-xs text-red-400" role="alert">{error}</p>}
              <button
                type="submit"
                disabled={state.step === 'submitting'}
                className="btn-shine mt-5 w-full rounded-xl bg-electric px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.02] disabled:opacity-60"
              >
                {state.step === 'submitting' ? 'Sending…' : 'Place Order Request'}
              </button>
              <button
                type="button"
                onClick={() => setState({ step: 'cart' })}
                disabled={state.step === 'submitting'}
                className="mt-3 w-full text-center text-xs text-ink/45 underline hover:text-electric"
              >
                ← Back to summary
              </button>
            </form>
          ) : (
            <>
              <h2 className="font-display text-xl font-bold text-ink">Order Summary</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-ink/65">
                  <dt>Subtotal</dt>
                  <dd className="font-mono">${cart.subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between text-ink/65">
                  <dt>Shipping (flat rate)</dt>
                  <dd className="font-mono">${cart.shipping.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-3 font-display text-lg font-bold text-ink">
                  <dt>Total</dt>
                  <dd>${cart.total.toFixed(2)} CAD</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-ink/40">
                Free pickup available at our Mississauga counter — mention it when we call.
              </p>
              {userEmail ? (
                <p className="mt-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-2.5 text-xs text-emerald-300">
                  Signed in as {userEmail} — this order will be saved to your account.
                </p>
              ) : (
                <p className="mt-4 text-center text-xs text-ink/50">
                  Have an account?{' '}
                  <Link href="/login/?next=/cart/" className="font-semibold text-electric hover:underline">
                    Sign in to place your order
                  </Link>
                </p>
              )}
              <button
                type="button"
                onClick={() => setState({ step: 'form' })}
                className="btn-shine mt-5 w-full rounded-xl bg-electric px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:scale-[1.02]"
              >
                Proceed to Order
              </button>
              <div className="mt-5 rounded-xl border border-line bg-white/50 p-4 text-center">
                <p className="text-xs text-ink/50">Wholesale counter:</p>
                <a href={`tel:${SITE.mobile}`} className="font-display text-lg font-bold text-electric hover:underline">
                  {SITE.orderPhoneDisplay}
                </a>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
