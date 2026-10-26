import type { Metadata } from 'next';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Sign In',
  description:
        'Sign in to your Green Solar World Inc. contractor account to track orders and reorders. New? Create a wholesale account in minutes.',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginClient />;
}
