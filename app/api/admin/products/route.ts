import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';

export const dynamic = 'force-dynamic';

/** POST /api/admin/products — create a product. */
export async function POST(request: Request) {
  const { supabase, error } = await requireAdminApi();
  if (error) return error;

  const body = await request.json();
  if (!body.name || !body.slug || !body.sku || !body.category) {
    return NextResponse.json({ error: 'name, slug, sku and category are required' }, { status: 400 });
  }

  const { data, error: dbError } = await supabase!
    .from('products')
    .insert({
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
    })
    .select('id')
    .single();

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

  revalidatePath('/collections');
  revalidatePath('/');
  return NextResponse.json({ ok: true, id: data.id });
}
