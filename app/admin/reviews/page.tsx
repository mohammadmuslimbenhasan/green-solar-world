import { createSupabaseServer } from '@/lib/supabase-server';
import { AdminHeader, Badge } from '@/components/admin/ui';
import { ReviewEditor, ReviewApproveButton, ReviewDeleteButton } from '@/components/admin/ReviewEditor';
import { Stars } from '@/components/Reviews';

export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  const supabase = await createSupabaseServer();
  if (!supabase) return null;

  const [{ data: reviews }, { data: products }] = await Promise.all([
    supabase.from('reviews').select('id, author_name, rating, text, source, is_approved, product_id').order('created_at', { ascending: false }),
    supabase.from('products').select('id, name').order('name'),
  ]);

  return (
    <>
      <AdminHeader
        title="Reviews"
        description="Sync these with your Google Business Profile — approve to publish, edit text/rating, or link a review to a product."
      />
      <div className="space-y-5">
        {(reviews ?? []).map((r) => (
          <article key={r.id} className="rounded-2xl border border-line bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Stars rating={r.rating} />
                <span className="font-display font-bold text-ink">{r.author_name}</span>
                <span className="text-xs text-ink/45">via {r.source}</span>
                {r.product_id && (
                  <span className="text-xs text-electric/80">
                    → {products?.find((p) => p.id === r.product_id)?.name ?? 'linked product'}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={r.is_approved ? 'green' : 'gray'}>{r.is_approved ? 'Approved' : 'Hidden'}</Badge>
                <ReviewApproveButton id={r.id} approved={r.is_approved} />
                <ReviewDeleteButton id={r.id} />
              </div>
            </div>
            <blockquote className="mt-3 text-sm leading-relaxed text-ink/70">&ldquo;{r.text}&rdquo;</blockquote>
            <details className="mt-2">
              <summary className="cursor-pointer text-xs font-semibold text-electric hover:underline">Edit review</summary>
              <ReviewEditor review={r} products={products ?? []} />
            </details>
          </article>
        ))}
        {(!reviews || reviews.length === 0) && (
          <p className="rounded-2xl border border-dashed border-line p-10 text-center text-ink/40">
            No reviews yet — they appear here after seed.sql runs.
          </p>
        )}
      </div>
    </>
  );
}
