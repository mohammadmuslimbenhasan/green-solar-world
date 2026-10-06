import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';

export const dynamic = 'force-dynamic';

/** PATCH /api/admin/orders/[id] — status + internal note. */
export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const { supabase, error } = await requireAdminApi();
  if (error) return error;

  const body = await request.json();
  const { error: dbError } = await supabase!
    .from('orders')
    .update({ status: body.status, note: body.note ?? null })
    .eq('id', id);

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  revalidatePath('/admin/orders');
  return NextResponse.json({ ok: true });
}
