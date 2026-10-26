'use client';

import { useEffect, useState } from 'react';
import { BRAND_LOGOS } from '@/data/image-notes';
import { IMAGE_DIMS } from '@/lib/image-dims';

/** Distributor brand card — full-color logo, name, and a visit-website button. */
function BrandCard({ logo }: { logo: { src: string; name: string; href: string } }) {
  return (
    <a
      href={logo.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${logo.name} website`}
      className="group flex w-52 shrink-0 flex-col items-center gap-3 rounded-2xl border border-line bg-white p-5 text-center shadow-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:border-amber hover:shadow-[0_18px_44px_rgba(16,24,40,0.14)]"
    >
      <img
        src={logo.src}
        alt={`${logo.name} logo`}
        width={IMAGE_DIMS[logo.src]?.[0]}
        height={IMAGE_DIMS[logo.src]?.[1]}
        loading="lazy"
        className="h-14 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
      />
      <span className="font-display text-sm font-bold leading-tight text-ink">{logo.name}</span>
      <span className="mt-auto inline-flex items-center gap-1.5 rounded-full bg-ink/[0.05] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-ink/70 transition-colors duration-300 group-hover:bg-amber group-hover:text-ink">
        Visit Website
        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 10 10 2M4 2h6v6" />
        </svg>
      </span>
    </a>
  );
}

/**
 * Two-row brand marquee. Rendered only after the first paint — the ~340 extra
 * marquee nodes nearly double initial Style&Layout cost on mobile, which
 * delayed LCP. Height is reserved so there's no layout shift when it mounts.
 */
export default function BrandMarquee() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted) {
    return <div className="h-[380px] sm:h-[400px]" aria-hidden="true" />;
  }

  return (
    <div className="space-y-5">
      {/* Row 1 — slides left → right (reverse) */}
      <div className="marquee overflow-hidden">
        <div className="marquee-track-reverse flex w-max items-stretch gap-5 px-4">
          {[...BRAND_LOGOS.slice(0, 7), ...BRAND_LOGOS.slice(0, 7)].map((logo, i) => (
            <BrandCard key={`top-${logo.name}-${i}`} logo={logo} />
          ))}
        </div>
      </div>
      {/* Row 2 — slides right → left */}
      <div className="marquee overflow-hidden">
        <div className="marquee-track flex w-max items-stretch gap-5 px-4">
          {[...BRAND_LOGOS.slice(7), ...BRAND_LOGOS.slice(7)].map((logo, i) => (
            <BrandCard key={`bottom-${logo.name}-${i}`} logo={logo} />
          ))}
        </div>
      </div>
    </div>
  );
}
