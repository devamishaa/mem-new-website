import { getMetaContent } from '@/utils/meta/meta-content';
import { ROUTING_CONFIG } from '@/configs/routing-config';
import { buildCdnSrc } from '@/utils/cdn/url';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://memorae.ai';

// probably should move this to utils/routing.js at some point
function getLocalizedPath(lang, path = '/') {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (lang === 'en') return cleanPath;
  return `/${lang}${cleanPath}`.replace(/\/{2,}/g, '/');
}

function getLanguageAlternates(path = '/') {
  const supported = ROUTING_CONFIG?.supportedLangs || ['en', 'es'];
  const alternates = {};
  
  supported.forEach(lang => {
    alternates[lang] = getLocalizedPath(lang, path);
  });
  alternates['x-default'] = getLocalizedPath('en', path);
  
  return alternates;
}

// TODO: this could be smarter about detecting CDN vs external URLs
function getImageUrl(keyOrUrl) {
  if (!keyOrUrl) return undefined;
  // quick check if it's already a full URL
  if (keyOrUrl.startsWith('http')) return keyOrUrl;
  return buildCdnSrc({ key: keyOrUrl });
}

// basic title formatting - might need to expand this later
function formatTitle(meta, title) {
  // if title already has separators, use as-is
  if (title.includes(' | ') || title.includes(' · ')) {
    return title;
  }
  
  // otherwise check if we have a template
  if (meta.titleTemplate) {
    return { default: title, template: meta.titleTemplate };
  }
  
  return title;
}

function processBasicMetadata(meta, lang, path) {
  const title = meta.title || 'Memorae';
  const description = meta.description || '';
  const canonicalPath = getLocalizedPath(lang, path);
  const canonical = new URL(canonicalPath, SITE_URL);
  
  return { title, description, canonical, lang };
}

function buildOpenGraphMetadata(meta, basicData) {
  const { title, description, canonical } = basicData;
  const ogImage = getImageUrl(meta.ogImage || 'og/default');
  
  return {
    type: 'website',
    siteName: 'Memorae',
    title: meta.ogTitle || title,
    description: meta.ogDescription || description,
    url: canonical,
    locale: meta.locale || (basicData.lang === 'es' ? 'es_ES' : 'en_US'),
    images: ogImage ? [{ 
      url: ogImage, 
      width: 1200, 
      height: 630, 
      alt: title 
    }] : undefined,
  };
}

function buildTwitterMetadata(meta, title, description) {
  const twitterImage = getImageUrl(meta.twitterImage || meta.ogImage || 'og/default');
  
  return {
    card: meta.twitterCard || 'summary_large_image',
    site: '@memorae_ai',
    creator: '@memorae_ai', // TODO: make this configurable
    title: meta.twitterTitle || title,
    description: meta.twitterDescription || description,
    images: twitterImage ? [twitterImage] : undefined,
  };
}

function buildRobotsMetadata(meta) {
  return meta.robots || {
    index: true, 
    follow: true,
    googleBot: { 
      index: true, 
      follow: true, 
      'max-image-preview': 'large', 
      'max-video-preview': -1, 
      'max-snippet': -1 
    },
  };
}

function buildIconsMetadata() {
  return {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico', // TODO: add proper apple touch icons
  };
}

export async function getPageMetadata(lang = 'en', page = 'home', path = '/') {
  const meta = await getMetaContent(lang, page);
  const basicData = processBasicMetadata(meta, lang, path);
  const { title, description, canonical } = basicData;

  return {
    metadataBase: new URL(SITE_URL),
    title: formatTitle(meta, title),
    description,
    keywords: meta.keywords || '',
    
    alternates: {
      canonical,
      languages: getLanguageAlternates(path),
    },

    openGraph: buildOpenGraphMetadata(meta, basicData),
    twitter: buildTwitterMetadata(meta, title, description),
    robots: buildRobotsMetadata(meta),
    icons: buildIconsMetadata(),
  };
}