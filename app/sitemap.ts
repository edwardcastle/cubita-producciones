import {MetadataRoute} from 'next';
import {getAllArtistSlugs, buildLocalizedUrl} from '@/lib/strapi';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ['', '/artistas', '/sobre-nosotros', '/contacto'];
  const locales = ['es', 'en', 'fr', 'it'];

  function buildAlternates(path: string) {
    return {
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [l, buildLocalizedUrl(l, path)])
        ),
        'x-default': buildLocalizedUrl('es', path),
      },
    };
  }

  // Static pages with alternates for each language
  const staticPages = locales.flatMap((locale) =>
    routes.map((route) => ({
      url: buildLocalizedUrl(locale, route),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
      alternates: buildAlternates(route),
    }))
  );

  // Fetch artist slugs from CMS
  const artistSlugs = await getAllArtistSlugs();

  const artistPages = locales.flatMap((locale) =>
    artistSlugs.map((slug) => ({
      url: buildLocalizedUrl(locale, `/artistas/${slug}`),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: buildAlternates(`/artistas/${slug}`),
    }))
  );

  return [...staticPages, ...artistPages];
}
