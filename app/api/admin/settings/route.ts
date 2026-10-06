import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';

export const dynamic = 'force-dynamic';

/** PATCH /api/admin/settings — upsert site_settings key/value pairs. */
export async function PATCH(request: Request) {
  const { supabase, error } = await requireAdminApi();
  if (error) return error;

  const body = await request.json();
  const values = body.values as Record<string, string>;
  if (!values || typeof values !== 'object') {
    return NextResponse.json({ error: 'values object required' }, { status: 400 });
  }

  const rows = Object.entries(values).map(([key, value]) => ({ key, value }));
  const { error: dbError } = await supabase!.from('site_settings').upsert(rows, { onConflict: 'key' });

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  revalidatePath('/');
  return NextResponse.json({ ok: true });
}
