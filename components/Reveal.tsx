'use client';

import type { ReactNode, ElementType } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
  /** Skip the entrance animation — content paints on the first frame. Use for above-the-fold content (LCP). */
  instant?: boolean;
}

/**
 * Entrance-animation wrapper. The animation is pure CSS (see .reveal in
 * globals.css) so content is never gated on JavaScript. Delays stagger
 * siblings via a CSS var. `instant` disables the animation entirely.
 */
export default function Reveal({ children, className = '', delay = 0, as, instant = false }: RevealProps) {
  const Tag = (as ?? 'div') as ElementType;
  if (instant) return <Tag className={className}>{children}</Tag>;
  return (
    <Tag className={`reveal ${className}`} style={{ ['--reveal-delay' as string]: `${delay}ms` }}>
      {children}
    </Tag>
  );
}
