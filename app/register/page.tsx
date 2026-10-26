import type { Metadata } from 'next';
import RegisterClient from './RegisterClient';

export const metadata: Metadata = {
  title: 'Create Account',
  description:
        'Register a Green Solar World Inc. contractor account for order tracking, saved carts and wholesale pricing. Free Mississauga pickup, flat $30 Canada-wide shipping.',
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return <RegisterClient />;
}
