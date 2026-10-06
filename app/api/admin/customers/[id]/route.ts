import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';

export const dynamic = 'force-dynamic';

/** PATCH /api/admin/customers/[id] — promote/demote admin. */
export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const { supabase, error } = await requireAdminApi();
  if (error) return error;

  const body = await request.json();
  if (body.role !== 'admin' && body.role !== 'customer') {
    return NextResponse.json({ error: 'role must be admin or customer' }, { status: 400 });
  }
  const { error: dbError } = await supabase!.from('profiles').update({ role: body.role }).eq('id', id);
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  revalidatePath('/admin/customers');
  return NextResponse.json({ ok: true });
}
