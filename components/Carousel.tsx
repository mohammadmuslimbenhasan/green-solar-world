'use client';

import { useRef } from 'react';
import type { ReactNode } from 'react';

/** Horizontal scroll-snap row with arrow controls (also scrollable by trackpad). */
export default function Carousel({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 640), behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div
        ref={ref}
        className="snap-row -mx-4 flex gap-5 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6"
        role="region"
        aria-label={label}
      >
        {children}
      </div>
      <div className="mt-4 flex justify-center gap-2 sm:justify-end">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="Scroll back"
          className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink/60 transition-colors hover:border-amber hover:text-ink"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 3L5 8l5 5" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="Scroll forward"
          className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink/60 transition-colors hover:border-amber hover:text-ink"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 3l5 5-5 5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
