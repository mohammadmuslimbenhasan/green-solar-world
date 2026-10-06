import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';

export const dynamic = 'force-dynamic';

/** POST /api/admin/reviews — create a review. */
export async function POST(request: Request) {
  const { supabase, error } = await requireAdminApi();
  if (error) return error;

  const body = await request.json();
  if (!body.author_name || !body.text) {
    return NextResponse.json({ error: 'author_name and text are required' }, { status: 400 });
  }
  const { error: dbError } = await supabase!.from('reviews').insert({
    author_name: body.author_name,
    rating: Number(body.rating) || 5,
    text: body.text,
    source: body.source ?? 'google',
    is_approved: body.is_approved ?? true,
    product_id: body.product_id ?? null,
  });
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  revalidatePath('/');
  return NextResponse.json({ ok: true });
}
