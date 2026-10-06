import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';

export const dynamic = 'force-dynamic';

/** PATCH /api/admin/inquiries/[id] — mark handled/unhandled. */
export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const { supabase, error } = await requireAdminApi();
  if (error) return error;

  const body = await request.json();
  const { error: dbError } = await supabase!
    .from('inquiries')
    .update({ handled: Boolean(body.handled) })
    .eq('id', id);

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  revalidatePath('/admin/inquiries');
  return NextResponse.json({ ok: true });
}
