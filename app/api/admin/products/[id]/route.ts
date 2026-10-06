import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

/** PATCH /api/admin/products/[id] — update. */
export async function PATCH(request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const { supabase, error } = await requireAdminApi();
  if (error) return error;

  const body = await request.json();
  const { data, error: dbError } = await supabase!
    .from('products')
    .update({
      name: body.name,
      slug: body.slug,
      sku: body.sku,
      category: body.category,
      collection: body.collection ?? body.category,
      price: Number(body.price) || 0,
      compareAt: body.compareAt ?? null,
      stock: body.stock ?? 'in-stock',
      featured: Boolean(body.featured),
      short: body.short ?? '',
      description: body.short ?? '',
      specs: body.specs ?? [],
      faqs: body.faqs ?? [],
      meta_title: body.meta_title || null,
      meta_description: body.meta_description || null,
      long_description: body.long_description || null,
      image_url: body.image_url || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('slug')
    .single();

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  revalidatePath('/');
  revalidatePath('/collections');
  revalidatePath(`/products/${data.slug}/`);
  return NextResponse.json({ ok: true });
}

/** DELETE /api/admin/products/[id] */
export async function DELETE(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const { supabase, error } = await requireAdminApi();
  if (error) return error;

  const { error: dbError } = await supabase!.from('products').delete().eq('id', id);
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  revalidatePath('/');
  revalidatePath('/collections');
  return NextResponse.json({ ok: true });
}
