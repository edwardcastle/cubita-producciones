import type { StrapiImage, SEO } from './types';

/** Production website base URL */
export const BASE_URL = 'https://cubitaproducciones.com';

/** Supported locales for internationalization */
export const LOCALES = ['es', 'en', 'fr', 'it'] as const;

/** Default locale */
export const DEFAULT_LOCALE = 'es';

/** OpenGraph locale format mapping */
export const OG_LOCALES: Record<string, string> = {
  es: 'es_ES',
  en: 'en_US',
  fr: 'fr_FR',
  it: 'it_IT',
};

/**
 * Constructs full image URL from a static-layer image object.
 * The static layer stores final paths/URLs directly.
 * @internal
 */
function getImageUrl(image: StrapiImage | null): string | null {
  if (!image?.url) return null;
  return image.url; // static layer stores final paths/URLs directly
}

/** Build a locale-aware URL with locale prefix */
export function buildLocalizedUrl(locale: string, path: string = ''): string {
  return `${BASE_URL}/${locale}${path}`;
}

/** Build alternates object for Next.js metadata */
export function buildAlternates(locale: string, path: string = '') {
  return {
    canonical: buildLocalizedUrl(locale, path),
    languages: {
      ...Object.fromEntries(
        LOCALES.map((l) => [l, buildLocalizedUrl(l, path)])
      ),
      'x-default': buildLocalizedUrl(DEFAULT_LOCALE, path),
    },
  };
}

/**
 * Generates Next.js Metadata object from SEO data
 * @param seo - SEO data or null
 * @param locale - Current locale ('es' | 'en' | 'fr' | 'it')
 * @param fallback - Fallback title and description if SEO is null
 * @param path - URL path for canonical and alternate URLs
 * @returns Complete metadata object for Next.js
 */
export function generateMetadataFromSEO(
  seo: SEO | null,
  locale: 'es' | 'en' | 'fr' | 'it',
  fallback: { title: string; description: string; keywords?: string },
  path: string = ''
): {
  title: string;
  description: string;
  keywords?: string;
  openGraph?: {
    title: string;
    description: string;
    url: string;
    type: string;
    siteName: string;
    locale: string;
    images?: Array<{ url: string; width: number; height: number; alt: string }>;
  };
  twitter?: {
    card: string;
    title: string;
    description: string;
    images?: string[];
  };
  robots?: { index: boolean; follow: boolean; googleBot?: { index: boolean; follow: boolean; 'max-image-preview': 'none' | 'standard' | 'large'; 'max-snippet': number } };
  alternates?: { canonical: string; languages: Record<string, string> };
} {
  const title = seo?.metaTitle?.[locale] || fallback.title;
  const description = seo?.metaDescription?.[locale] || fallback.description;
  const pageUrl = buildLocalizedUrl(locale, path);
  const ogImage = seo?.ogImage || `${BASE_URL}/og-image.jpg`;

  const metadata: ReturnType<typeof generateMetadataFromSEO> = {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: 'website',
      siteName: 'Cubita Producciones',
      locale: OG_LOCALES[locale] || 'es_ES',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        ...Object.fromEntries(
          LOCALES.map((l) => [l, buildLocalizedUrl(l, path)])
        ),
        'x-default': buildLocalizedUrl(DEFAULT_LOCALE, path),
      },
    },
  };

  if (seo?.keywords) {
    metadata.keywords = seo.keywords;
  } else if (fallback.keywords) {
    metadata.keywords = fallback.keywords;
  }

  if (seo?.noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
        'max-image-preview': 'none' as const,
        'max-snippet': 0,
      },
    };
  } else {
    metadata.robots = {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large' as const,
        'max-snippet': -1,
      },
    };
  }

  return metadata;
}

/**
 * Maps a multiple-media field into an array of StrapiImage objects.
 * Entries without a usable URL are skipped; non-array input yields [].
 * @param raw - Raw heroImages value
 * @returns Array of StrapiImage with resolved URLs
 */
export function parseHeroImages(raw: unknown): StrapiImage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item): StrapiImage | null => {
      const url = getImageUrl(item as StrapiImage | null);
      if (!url) return null;
      return {
        url,
        alternativeText: (item as StrapiImage).alternativeText,
        width: (item as StrapiImage).width,
        height: (item as StrapiImage).height,
      };
    })
    .filter((img): img is StrapiImage => img !== null);
}

export function parseSEO(seoData: unknown): SEO | null {
  if (!seoData) return null;
  const s = seoData as Record<string, unknown>;

  return {
    metaTitle: {
      es: (s.metaTitleEs as string) || '',
      en: (s.metaTitleEn as string) || '',
      fr: (s.metaTitleFr as string) || '',
      it: (s.metaTitleIt as string) || '',
    },
    metaDescription: {
      es: (s.metaDescriptionEs as string) || '',
      en: (s.metaDescriptionEn as string) || '',
      fr: (s.metaDescriptionFr as string) || '',
      it: (s.metaDescriptionIt as string) || '',
    },
    keywords: (s.keywords as string | null) || null,
    ogImage: getImageUrl(s.ogImage as StrapiImage | null),
    canonicalUrl: (s.canonicalUrl as string | null) || null,
    noIndex: Boolean(s.noIndex),
  };
}
