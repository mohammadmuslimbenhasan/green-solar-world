'use client';

import { useState } from 'react';

/** Accessible accordion for FAQ sections (homepage + collections + products). */
export default function FaqAccordion({
  faqs,
  dark = true,
}: {
  faqs: { q: string; a: string }[];
  dark?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className={`divide-y rounded-2xl border ${
      dark ? 'divide-white/10 border-white/10 bg-ink-700/40' : 'divide-ink/10 border-ink/10 bg-white'
    }`}>
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className={`font-display text-[15px] font-semibold ${dark ? 'text-bone' : 'text-ink'}`}>
                {f.q}
              </span>
              <svg
                viewBox="0 0 16 16"
                className={`h-4 w-4 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${dark ? 'text-electric' : 'text-ink'}`}
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"
              >
                <path d="M3 6l5 5 5-5" />
              </svg>
            </button>
            <div
              id={`faq-panel-${i}`}
              role="region"
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className={`px-6 pb-5 text-sm leading-relaxed ${dark ? 'text-bone/60' : 'text-ink/65'}`}>
                  {f.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
