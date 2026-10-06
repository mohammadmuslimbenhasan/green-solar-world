import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';

export const dynamic = 'force-dynamic';

/** POST /api/admin/categories | /api/admin/collections */
export async function POST(request: Request, ctx: { params: Promise<{ kind: string }> }) {
  const { kind } = await ctx.params;
  if (kind !== 'categories' && kind !== 'collections') {
    return NextResponse.json({ error: 'Unknown kind' }, { status: 404 });
  }
  const { supabase, error } = await requireAdminApi();
  if (error) return error;

  const body = await request.json();
  if (!body.name || !body.slug) {
    return NextResponse.json({ error: 'name and slug are required' }, { status: 400 });
  }

  const { data, error: dbError } = await supabase!
    .from(kind)
    .insert({
      name: body.name,
      slug: body.slug,
      description: body.description ?? null,
      ...(kind === 'categories' ? { collection: body.collection } : {}),
    })
    .select('id')
    .single();

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  revalidatePath('/collections');
  return NextResponse.json({ ok: true, id: data.id });
}
