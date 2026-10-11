import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'HCM-UTE TechDoc';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

export const brandConfig = {
  name: 'HCM-UTE TechDoc',
  schoolName: 'Trường Đại học Công nghệ Kỹ thuật TP.HCM',
  primaryColor: '#0072BC',
  secondaryColor: '#ED1C24',
  logoUrl: '/logo-hcm-ute.png',
};

export const gitConfig = {
  user: 'hoavm73',
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
