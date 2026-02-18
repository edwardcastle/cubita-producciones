import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateMetadataFromSEO,
  type SEO,
} from '@/lib/strapi';

// Note: The data fetcher functions use React's cache() and make actual API calls.
// For unit tests, we test the pure functions like generateMetadataFromSEO.
// Integration tests would test the full data flow with mocked fetch.

describe('Strapi Library', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateMetadataFromSEO', () => {
    const mockSEO: SEO = {
      metaTitle: {
        es: 'Título en español',
        en: 'English Title',
        fr: 'Titre en français',
        it: 'Titolo in italiano',
      },
      metaDescription: {
        es: 'Descripción en español',
        en: 'English Description',
        fr: 'Description en français',
        it: 'Descrizione in italiano',
      },
      keywords: 'salsa, reggaeton, cuba, booking',
      ogImage: 'https://example.com/og-image.jpg',
      canonicalUrl: 'https://cubitaproducciones.com/es/artistas',
      noIndex: false,
    };

    const fallback = {
      title: 'Fallback Title',
      description: 'Fallback Description',
    };

    describe('Title and Description', () => {
      it('returns SEO title when available', () => {
        const result = generateMetadataFromSEO(mockSEO, 'es', fallback);

        expect(result.title).toBe('Título en español');
      });

      it('returns SEO description when available', () => {
        const result = generateMetadataFromSEO(mockSEO, 'es', fallback);

        expect(result.description).toBe('Descripción en español');
      });

      it('returns fallback title when SEO is null', () => {
        const result = generateMetadataFromSEO(null, 'es', fallback);

        expect(result.title).toBe('Fallback Title');
      });

      it('returns fallback description when SEO is null', () => {
        const result = generateMetadataFromSEO(null, 'es', fallback);

        expect(result.description).toBe('Fallback Description');
      });

      it('uses correct locale for title', () => {
        const resultEn = generateMetadataFromSEO(mockSEO, 'en', fallback);
        const resultFr = generateMetadataFromSEO(mockSEO, 'fr', fallback);
        const resultIt = generateMetadataFromSEO(mockSEO, 'it', fallback);

        expect(resultEn.title).toBe('English Title');
        expect(resultFr.title).toBe('Titre en français');
        expect(resultIt.title).toBe('Titolo in italiano');
      });
    });

    describe('Keywords', () => {
      it('includes keywords when available', () => {
        const result = generateMetadataFromSEO(mockSEO, 'es', fallback);

        expect(result.keywords).toBe('salsa, reggaeton, cuba, booking');
      });

      it('does not include keywords when null', () => {
        const seoWithoutKeywords = { ...mockSEO, keywords: null };
        const result = generateMetadataFromSEO(seoWithoutKeywords, 'es', fallback);

        expect(result.keywords).toBeUndefined();
      });
    });

    describe('Open Graph', () => {
      it('includes openGraph metadata', () => {
        const result = generateMetadataFromSEO(mockSEO, 'es', fallback);

        expect(result.openGraph).toBeDefined();
        expect(result.openGraph?.title).toBe('Título en español');
        expect(result.openGraph?.description).toBe('Descripción en español');
      });

      it('includes correct Open Graph type', () => {
        const result = generateMetadataFromSEO(mockSEO, 'es', fallback);

        expect(result.openGraph?.type).toBe('website');
      });

      it('includes site name', () => {
        const result = generateMetadataFromSEO(mockSEO, 'es', fallback);

        expect(result.openGraph?.siteName).toBe('Cubita Producciones');
      });

      it('includes locale', () => {
        const result = generateMetadataFromSEO(mockSEO, 'es', fallback);

        expect(result.openGraph?.locale).toBe('es');
      });

      it('includes OG image when available', () => {
        const result = generateMetadataFromSEO(mockSEO, 'es', fallback);

        expect(result.openGraph?.images).toBeDefined();
        expect(result.openGraph?.images?.[0].url).toBe('https://example.com/og-image.jpg');
      });

      it('uses default OG image when not specified', () => {
        const seoWithoutImage = { ...mockSEO, ogImage: null };
        const result = generateMetadataFromSEO(seoWithoutImage, 'es', fallback);

        expect(result.openGraph?.images?.[0].url).toContain('og-image.jpg');
      });

      it('includes correct URL based on locale and path', () => {
        const result = generateMetadataFromSEO(mockSEO, 'es', fallback, '/artistas');

        expect(result.openGraph?.url).toBe('https://cubitaproducciones.com/es/artistas');
      });
    });

    describe('Twitter Cards', () => {
      it('includes Twitter card metadata', () => {
        const result = generateMetadataFromSEO(mockSEO, 'es', fallback);

        expect(result.twitter).toBeDefined();
        expect(result.twitter?.card).toBe('summary_large_image');
      });

      it('includes Twitter title and description', () => {
        const result = generateMetadataFromSEO(mockSEO, 'es', fallback);

        expect(result.twitter?.title).toBe('Título en español');
        expect(result.twitter?.description).toBe('Descripción en español');
      });

      it('includes Twitter image', () => {
        const result = generateMetadataFromSEO(mockSEO, 'es', fallback);

        expect(result.twitter?.images).toBeDefined();
        expect(result.twitter?.images?.[0]).toBe('https://example.com/og-image.jpg');
      });
    });

    describe('Canonical URL and Alternates', () => {
      it('includes canonical URL from SEO', () => {
        const result = generateMetadataFromSEO(mockSEO, 'es', fallback);

        expect(result.alternates?.canonical).toBe('https://cubitaproducciones.com/es/artistas');
      });

      it('generates canonical URL when not in SEO', () => {
        const seoWithoutCanonical = { ...mockSEO, canonicalUrl: null };
        const result = generateMetadataFromSEO(seoWithoutCanonical, 'es', fallback, '/test');

        expect(result.alternates?.canonical).toBe('https://cubitaproducciones.com/es/test');
      });

      it('includes language alternates', () => {
        const result = generateMetadataFromSEO(mockSEO, 'es', fallback, '/artistas');

        expect(result.alternates?.languages).toBeDefined();
        expect(result.alternates?.languages?.es).toBe('https://cubitaproducciones.com/es/artistas');
        expect(result.alternates?.languages?.en).toBe('https://cubitaproducciones.com/en/artistas');
        expect(result.alternates?.languages?.fr).toBe('https://cubitaproducciones.com/fr/artistas');
        expect(result.alternates?.languages?.it).toBe('https://cubitaproducciones.com/it/artistas');
      });
    });

    describe('Robots', () => {
      it('sets index and follow when noIndex is false', () => {
        const result = generateMetadataFromSEO(mockSEO, 'es', fallback);

        expect(result.robots?.index).toBe(true);
        expect(result.robots?.follow).toBe(true);
      });

      it('sets noindex and nofollow when noIndex is true', () => {
        const seoNoIndex = { ...mockSEO, noIndex: true };
        const result = generateMetadataFromSEO(seoNoIndex, 'es', fallback);

        expect(result.robots?.index).toBe(false);
        expect(result.robots?.follow).toBe(false);
      });

      it('includes googleBot settings for indexable pages', () => {
        const result = generateMetadataFromSEO(mockSEO, 'es', fallback);

        expect(result.robots?.googleBot?.index).toBe(true);
        expect(result.robots?.googleBot?.follow).toBe(true);
        expect(result.robots?.googleBot?.['max-image-preview']).toBe('large');
        expect(result.robots?.googleBot?.['max-snippet']).toBe(-1);
      });

      it('includes restrictive googleBot settings for noIndex pages', () => {
        const seoNoIndex = { ...mockSEO, noIndex: true };
        const result = generateMetadataFromSEO(seoNoIndex, 'es', fallback);

        expect(result.robots?.googleBot?.index).toBe(false);
        expect(result.robots?.googleBot?.follow).toBe(false);
        expect(result.robots?.googleBot?.['max-image-preview']).toBe('none');
        expect(result.robots?.googleBot?.['max-snippet']).toBe(0);
      });
    });

    describe('Path Handling', () => {
      it('handles empty path', () => {
        const result = generateMetadataFromSEO(mockSEO, 'es', fallback, '');

        expect(result.openGraph?.url).toBe('https://cubitaproducciones.com/es');
      });

      it('handles path with leading slash', () => {
        const result = generateMetadataFromSEO(mockSEO, 'es', fallback, '/artistas');

        expect(result.openGraph?.url).toBe('https://cubitaproducciones.com/es/artistas');
      });

      it('handles nested paths', () => {
        const result = generateMetadataFromSEO(mockSEO, 'es', fallback, '/artistas/el-chacal');

        expect(result.openGraph?.url).toBe('https://cubitaproducciones.com/es/artistas/el-chacal');
      });
    });

    describe('Edge Cases', () => {
      it('handles SEO with empty strings', () => {
        const emptySEO: SEO = {
          metaTitle: { es: '', en: '', fr: '', it: '' },
          metaDescription: { es: '', en: '', fr: '', it: '' },
          keywords: null,
          ogImage: null,
          canonicalUrl: null,
          noIndex: false,
        };

        const result = generateMetadataFromSEO(emptySEO, 'es', fallback);

        // Empty string is falsy, should fall back
        expect(result.title).toBe('Fallback Title');
        expect(result.description).toBe('Fallback Description');
      });

      it('handles all locales correctly', () => {
        const locales: ('es' | 'en' | 'fr' | 'it')[] = ['es', 'en', 'fr', 'it'];

        locales.forEach((locale) => {
          const result = generateMetadataFromSEO(mockSEO, locale, fallback);
          expect(result.openGraph?.locale).toBe(locale);
        });
      });
    });
  });
});
