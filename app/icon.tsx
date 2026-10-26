import { readFile } from 'fs/promises';
import path from 'path';
import { getSiteSettings } from '@/lib/data';

export const runtime = 'nodejs';
export const revalidate = 300;

const CONTENT_TYPES: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  ico: 'image/x-icon',
};

/**
 * Dynamic favicon: serves the admin-uploaded `site_favicon_url` from Supabase
 * Storage when set, otherwise the built-in logo mark. Replaces app/icon.png.
 */
export default async function Icon() {
  const { site_favicon_url } = await getSiteSettings();
  if (site_favicon_url) {
    try {
      const r = await fetch(site_favicon_url, { next: { revalidate: 300 } });
      if (r.ok) {
        const ext = (site_favicon_url.split('.').pop() ?? 'png').toLowerCase();
        return new Response(r.body, {
          headers: { 'Content-Type': CONTENT_TYPES[ext] ?? 'image/png', 'Cache-Control': 'public, max-age=300' },
        });
      }
    } catch {
      // fall through to default
    }
  }
  const buf = await readFile(path.join(process.cwd(), 'public', 'images', 'logo-mark.png'));
  return new Response(new Uint8Array(buf), {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=300' },
  });
}
