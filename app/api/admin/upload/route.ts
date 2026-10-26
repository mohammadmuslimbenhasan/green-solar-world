import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin';

export const runtime = 'nodejs';

const ALLOWED: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'image/x-icon': 'ico',
  'image/vnd.microsoft.icon': 'ico',
};

const MAX_BYTES = 2 * 1024 * 1024;

/**
 * POST /api/admin/upload — admin-only upload to the public `site-assets`
 * Supabase Storage bucket. Body: multipart/form-data with `file` and `kind`
 * ("logo" | "favicon" | general). Returns { url } of the uploaded asset.
 */
export async function POST(request: Request) {
  const { supabase, error } = await requireAdminApi();
  if (error) return error;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
  }

  const file = form.get('file');
  const kind = String(form.get('kind') ?? 'asset').replace(/[^a-z0-9-]/gi, '').toLowerCase() || 'asset';
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file field' }, { status: 400 });
  }

  const ext = ALLOWED[file.type];
  if (!ext) {
    return NextResponse.json({ error: `Unsupported type ${file.type}. Use PNG, JPG, WebP, GIF, SVG or ICO.` }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File too large (max 2 MB)' }, { status: 413 });
  }

  const path = `branding/${kind}-${Date.now()}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  const { error: upErr } = await supabase!.storage.from('site-assets').upload(path, buf, {
    contentType: file.type,
    cacheControl: '3600',
    upsert: false,
  });
  if (upErr) {
    return NextResponse.json({ error: `Upload failed: ${upErr.message}` }, { status: 502 });
  }

  const { data } = supabase!.storage.from('site-assets').getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
