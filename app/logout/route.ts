import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase-server';

/** POST /logout — signs out and redirects home. */
export async function POST(request: Request) {
  const supabase = await createSupabaseServer();
  if (supabase) await supabase.auth.signOut();
  const origin = new URL(request.url).origin;
  return NextResponse.redirect(`${origin}/`, { status: 303 });
}

/** GET /logout — same, for plain links. */
export async function GET(request: Request) {
  return POST(request);
}
