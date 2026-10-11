import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'HCM-UTE TECH DOC';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function withBasePath(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanBase = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return cleanBase ? `${cleanBase}${cleanPath}` : cleanPath;
}

export const brandConfig = {
  name: 'HCM-UTE TECH DOC',
  schoolName: 'Trường Đại học Công nghệ Kỹ thuật TP.HCM',
  primaryColor: '#0072BC',
  secondaryColor: '#ED1C24',
  logoUrl: withBasePath('/logo-hcm-ute.png'),
};

export const gitConfig = {
  user: 'toantc1024',
  repo: 'hcmute-techdoc',
  branch: 'main',
};

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];
  return { segments, url: getContentUrl(segments, page.locale) };
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];
  return { segments, url: getImageUrl(segments, page.locale) };
}
