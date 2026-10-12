import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

let basePath = process.env.BASE_PATH || '';
if (basePath === '/') basePath = '';
if (basePath && !basePath.startsWith('/')) basePath = `/${basePath}`;
if (basePath && basePath.endsWith('/')) basePath = basePath.slice(0, -1);

const isVercel = process.env.VERCEL === '1';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'self';",
  },
];

/** @type {import('next').NextConfig} */
const config = {
  // Use native Next.js on Vercel, or static export for standalone/GitHub Pages
  output: 'export',
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  trailingSlash: true,
  ...((isVercel || process.env.NODE_ENV === 'development') ? {
    async headers() {
      return [
        {
          source: '/:path*',
          headers: securityHeaders,
        },
      ];
    },
  } : {}),
};

export default withMDX(config);
