import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { requireUserApi } from '@/lib/admin';

export const dynamic = 'force-dynamic';

/** PATCH /api/account/profile — upsert own profile row. */
export async function PATCH(request: Request) {
  const { supabase, user, error } = await requireUserApi();
  if (error) return error;

  const body = await request.json();
  const { error: dbError } = await supabase!.from('profiles').upsert({
    id: user!.id,
    full_name: body.full_name ?? null,
    company_name: body.company_name ?? null,
    phone: body.phone ?? null,
  });

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  revalidatePath('/account');
  return NextResponse.json({ ok: true });
}
