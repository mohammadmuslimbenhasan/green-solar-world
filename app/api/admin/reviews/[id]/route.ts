import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';

export const dynamic = 'force-dynamic';

/** PATCH /api/admin/reviews/[id] — edit or approve/unapprove. */
export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const { supabase, error } = await requireAdminApi();
  if (error) return error;

  const body = await request.json();
  const update: Record<string, unknown> = {};
  for (const key of ['author_name', 'rating', 'text', 'source', 'is_approved', 'product_id'] as const) {
    if (key in body) update[key] = body[key];
  }
  const { error: dbError } = await supabase!.from('reviews').update(update).eq('id', id);
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  revalidatePath('/');
  revalidatePath('/admin/reviews');
  return NextResponse.json({ ok: true });
}

/** DELETE /api/admin/reviews/[id] */
export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const { supabase, error } = await requireAdminApi();
  if (error) return error;

  const { error: dbError } = await supabase!.from('reviews').delete().eq('id', id);
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  revalidatePath('/');
  return NextResponse.json({ ok: true });
}
