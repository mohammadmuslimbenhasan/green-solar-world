import type { Metadata } from 'next';
import CartPageClient from '@/components/cart/CartPageClient';

export const metadata: Metadata = {
  title: 'Cart',
  description: 'Review your wholesale order from Green Solar World Inc. Flat $30 shipping Canada-wide.',
};

export default function CartPage() {
  return <CartPageClient />;
}
