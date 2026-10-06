'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { SITE } from '@/data/catalog';
import type { Product } from '@/data/catalog';

export interface CartLine {
  slug: string;
  sku: string;
  name: string;
  price: number;
  qty: number;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  add: (product: Product, qty?: number) => void;
  addLine: (line: CartLine) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  lastAddedAt: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'gsw-cart-v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [lastAddedAt, setLastAddedAt] = useState(0);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) setLines(parsed.filter((l) => l && l.slug && l.qty > 0));
      }
    } catch {
      // corrupted storage — start empty
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage full or blocked — cart still works in-memory
    }
  }, [lines, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
    const shipping = lines.length > 0 ? SITE.shippingFlat : 0;
    return {
      lines,
      count: lines.reduce((sum, l) => sum + l.qty, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
      add: (product, qty = 1) => {
        setLines((prev) => {
          const existing = prev.find((l) => l.slug === product.slug);
          if (existing) {
            return prev.map((l) =>
              l.slug === product.slug ? { ...l, qty: l.qty + qty } : l,
            );
          }
          return [
            ...prev,
            {
              slug: product.slug,
              sku: product.sku,
              name: product.name,
              price: product.price,
              qty,
            },
          ];
        });
        setLastAddedAt(Date.now());
      },
      /** Merge an arbitrary line (e.g. reorder from order history) into the cart. */
      addLine: (line) => {
        if (!line || !line.slug || line.qty <= 0) return;
        setLines((prev) => {
          const existing = prev.find((l) => l.slug === line.slug);
          if (existing) {
            return prev.map((l) => (l.slug === line.slug ? { ...l, qty: l.qty + line.qty } : l));
          }
          return [...prev, line];
        });
        setLastAddedAt(Date.now());
      },
      setQty: (slug, qty) => {
        setLines((prev) =>
          qty <= 0
            ? prev.filter((l) => l.slug !== slug)
            : prev.map((l) => (l.slug === slug ? { ...l, qty } : l)),
        );
      },
      remove: (slug) => setLines((prev) => prev.filter((l) => l.slug !== slug)),
      clear: () => setLines([]),
      lastAddedAt,
    };
  }, [lines, lastAddedAt]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
