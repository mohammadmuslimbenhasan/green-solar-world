import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';

export const dynamic = 'force-dynamic';

/** PATCH /api/admin/categories/[id] | /api/admin/collections/[id] */
export async function PATCH(request: Request, ctx: { params: Promise<{ kind: string; id: string }> }) {
  const { kind, id } = await ctx.params;
  const { supabase, error } = await requireAdminApi();
  if (error) return error;

  const body = await request.json();
  const { error: dbError } = await supabase!
    .from(kind)
    .update({
      name: body.name,
      slug: body.slug,
      description: body.description ?? null,
    })
    .eq('id', id);

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  revalidatePath('/collections');
  return NextResponse.json({ ok: true });
}

/** DELETE /api/admin/categories/[id] | /api/admin/collections/[id] */
export async function DELETE(_request: Request, ctx: { params: Promise<{ kind: string; id: string }> }) {
  const { kind, id } = await ctx.params;
  const { supabase, error } = await requireAdminApi();
  if (error) return error;

  const { error: dbError } = await supabase!.from(kind).delete().eq('id', id);
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  revalidatePath('/collections');
  return NextResponse.json({ ok: true });
}
