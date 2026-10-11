import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

let basePath = process.env.BASE_PATH || '';
if (basePath === '/') basePath = '';
if (basePath && !basePath.startsWith('/')) basePath = `/${basePath}`;
if (basePath && basePath.endsWith('/')) basePath = basePath.slice(0, -1);

const isVercel = process.env.VERCEL === '1';

/** @type {import('next').NextConfig} */
const config = {
  // Use native Next.js on Vercel, or static export for standalone/GitHub Pages
  ...(isVercel ? {} : { output: 'export' }),
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default withMDX(config);
