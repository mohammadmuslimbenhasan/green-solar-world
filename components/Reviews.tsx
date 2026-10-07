'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Review } from '@/data/reviews';

export function Stars({ rating, className = 'h-4 w-4' }: { rating: number; className?: string }) {
  return (
    <span role="img" aria-label={`${rating} out of 5 stars`} className="inline-flex items-center gap-0.5 text-amber-deep">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`${className} ${i < Math.round(rating) ? 'fill-current' : 'fill-ink/15'}`}
          aria-hidden="true"
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9 4.7 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

/** Auto-advancing review carousel with manual controls. */
export default function ReviewsCarousel({
  reviews,
  gbpUrl,
  aggregate,
}: {
  reviews: Review[];
  gbpUrl: string;
  aggregate: { rating: number; reviewCount: number };
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + reviews.length) % reviews.length),
    [reviews.length],
  );

  useEffect(() => {
    if (paused) return;
    timer.current = window.setInterval(() => go(1), 5000);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [paused, go]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {reviews.map((r, i) => (
            <figure
              key={i}
              className="w-full shrink-0 px-1"
              aria-hidden={i !== index}
            >
              <blockquote className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-8 text-center shadow-[0_10px_40px_rgba(16,24,40,0.06)]">
                <Stars rating={r.rating} className="h-5 w-5" />
                <p className="mt-4 text-lg leading-relaxed text-ink/80">&ldquo;{r.text}&rdquo;</p>
                <figcaption className="mt-5 text-sm">
                  <span className="font-display font-bold text-ink">{r.authorName}</span>
                  <span className="ml-2 text-ink/60">
                    via {r.source === 'google' ? 'Google' : r.source}
                  </span>
                </figcaption>
              </blockquote>
            </figure>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous review"
          className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink/60 transition-colors hover:border-amber hover:text-ink"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 3L5 8l5 5" />
          </svg>
        </button>
        <div className="flex gap-2" role="tablist" aria-label="Review selector">
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Review ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-6 bg-amber' : 'w-2 bg-ink/15 hover:bg-ink/30'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next review"
          className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink/60 transition-colors hover:border-amber hover:text-ink"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 3l5 5-5 5" />
          </svg>
        </button>
      </div>

      <p className="mt-5 text-center text-xs text-ink/60">
        <a href={gbpUrl} target="_blank" rel="noreferrer" className="font-semibold text-amber-deep hover:underline">
          {aggregate.rating.toFixed(1)}-star rating · Based on {aggregate.reviewCount} Google reviews
        </a>
      </p>
    </div>
  );
}
