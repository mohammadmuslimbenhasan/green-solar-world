import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase-server';
import { ORDER_STATUSES, orderStatusLabel, type OrderStatus } from '@/lib/order-status';

export { ORDER_STATUSES, orderStatusLabel, type OrderStatus };

// ─── Shared row types (DB shape) ────────────────────────────────────────────

export interface OrderRow {
  id: string;
  user_id: string | null;
  company: string | null;
  contact_name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  items: { slug: string; sku: string; name: string; qty: number; price: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  note: string | null;
  created_at: string;
}

export interface InquiryRow {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  handled: boolean;
  created_at: string;
}

export interface ReviewRow {
  id: string;
  author_name: string;
  rating: number;
  text: string;
  source: string;
  is_approved: boolean;
  product_id: string | null;
  created_at: string;
}

export interface ProfileRow {
  id: string;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  role: 'admin' | 'customer';
  created_at: string;
  email?: string; // joined from auth.users when available
}

export interface ProductRow {
  id: string;
  slug: string;
  sku: string;
  name: string;
  collection: string;
  category: string;
  price: number;
  compareAt: number | null;
  featured: boolean;
  short: string;
  description: string;
  specs: string[];
  stock: string;
  meta_title: string | null;
  meta_description: string | null;
  long_description: string | null;
  faqs: { q: string; a: string }[] | null;
  image_url?: string | null;
}

// ─── Page-level guard (server components) ───────────────────────────────────

type AdminContext =
  | { configured: false }
  | { configured: true; isAdmin: false; user: { id: string; email?: string } }
  | {
      configured: true;
      isAdmin: true;
      user: { id: string; email?: string };
      supabase: NonNullable<Awaited<ReturnType<typeof createSupabaseServer>>>;
    };

/**
 * Server-side admin guard for /admin pages.
 * - Supabase not configured → { configured: false } (render the empty state)
 * - Not signed in → redirect to /login?next=/admin
 * - Signed in, not admin → { configured: true, isAdmin: false } (render 403)
 */
export async function getAdminContext(nextPath = '/admin'): Promise<AdminContext> {
  const supabase = await createSupabaseServer();
  if (!supabase) return { configured: false };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { configured: true, isAdmin: false, user: { id: user.id, email: user.email } };
  }
  return { configured: true, isAdmin: true, user: { id: user.id, email: user.email }, supabase };
}

// ─── API-level guard (route handlers — never trust the client) ──────────────

export async function requireAdminApi() {
  const supabase = await createSupabaseServer();
  if (!supabase) {
    return {
      supabase: null,
      user: null,
      error: NextResponse.json({ error: 'Database not configured' }, { status: 503 }),
    };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { supabase, user: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') {
    return { supabase, user, error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return { supabase, user, error: null };
}

/** Requires any signed-in user (customer portal API). */
export async function requireUserApi() {
  const supabase = await createSupabaseServer();
  if (!supabase) {
    return {
      supabase: null,
      user: null,
      error: NextResponse.json({ error: 'Database not configured' }, { status: 503 }),
    };
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { supabase, user: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { supabase, user, error: null };
}
