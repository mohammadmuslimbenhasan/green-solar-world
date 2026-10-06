import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Dynamic Supabase-backed site (Phase 2). ISR keeps catalog pages effectively instant.
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;

