'use client';

import type { ReactNode, ElementType } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}

/**
 * Entrance-animation wrapper. The animation is pure CSS (see .reveal in
 * globals.css) so content is never gated on JavaScript — it paints on the
 * first frame, which keeps LCP fast. Delays stagger siblings via a CSS var.
 */
export default function Reveal({ children, className = '', delay = 0, as }: RevealProps) {
  const Tag = (as ?? 'div') as ElementType;
  return (
    <Tag className={`reveal ${className}`} style={{ ['--reveal-delay' as string]: `${delay}ms` }}>
      {children}
    </Tag>
  );
}
