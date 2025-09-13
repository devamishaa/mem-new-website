import { getPageMetadata } from '@/utils/meta/page-metadata';

/**
 * Usage inside a page file:
 * export const generateMetadata = createMetadataGenerator('landing-l5', '/l5');
 */
export function createMetadataGenerator(pageKey, pagePath = '/') {
  return async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const lang = resolvedParams?.lang || 'en';
    return getPageMetadata(lang, pageKey, pagePath);
  };
}