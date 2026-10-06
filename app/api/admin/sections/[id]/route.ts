import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';

export const dynamic = 'force-dynamic';

/** PATCH /api/admin/sections/[id] — update a homepage section. */
export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const { supabase, error } = await requireAdminApi();
  if (error) return error;

  const body = await request.json();
  const { error: dbError } = await supabase!
    .from('homepage_sections')
    .update({
      title: body.title,
      subtitle: body.subtitle ?? null,
      body: body.body ?? {},
      is_active: Boolean(body.is_active),
      sort_order: Number(body.sort_order) || 0,
    })
    .eq('id', id);

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  revalidatePath('/');
  return NextResponse.json({ ok: true });
}
