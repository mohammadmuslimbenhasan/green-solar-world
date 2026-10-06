'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Lightweight top loading bar for App Router.
 * There's no router events API in the App Router, so we watch pathname changes:
 * on change, flash the bar to ~70%, then complete on the next paint.
 */
export default function PageProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setVisible(true);
    setProgress(30);
    const t1 = window.setTimeout(() => setProgress(72), 60);
    const t2 = window.setTimeout(() => {
      setProgress(100);
      const t3 = window.setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 280);
      return () => window.clearTimeout(t3);
    }, 220);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [pathname]);

  if (!visible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[100] h-[3px] w-full pointer-events-none"
    >
      <div
        className="h-full bg-electric shadow-[0_0_12px_rgba(245,179,1,0.8)] transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%`, opacity: visible ? 1 : 0, transitionProperty: 'width, opacity' }}
      />
    </div>
  );
}
