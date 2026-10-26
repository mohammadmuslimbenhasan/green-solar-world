import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase-server';

/**
 * POST /logout — signs out and redirects home.
 *
 * POST-only on purpose: a GET handler here gets executed by Next.js <Link>
 * prefetching (the sidebar "Sign Out" link is in the viewport of every admin
 * page), which silently signed users out and bounced them to /login.
 */
export async function POST(request: Request) {
  const supabase = await createSupabaseServer();
  if (supabase) await supabase.auth.signOut();
  const origin = new URL(request.url).origin;
  return NextResponse.redirect(`${origin}/`, { status: 303 });
}
