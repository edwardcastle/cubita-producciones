import {MetadataRoute} from 'next';
import {getAllArtistSlugs, buildLocalizedUrl} from '@/lib/strapi';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const routeConfig = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/artistas', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/contacto', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/sobre-nosotros', priority: 0.7, changeFrequency: 'monthly' as const },
  ];

  // Use a stable date — update this when content actually changes
  const lastModified = new Date('2026-05-09');

  // Static pages: one entry per locale with proper alternates
  const staticPages = locales.flatMap((locale) =>
    routeConfig.map((route) => ({
      url: buildLocalizedUrl(locale, route.path),
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: buildAlternates(route.path),
    }))
  );

  // Fetch artist slugs from CMS
  const artistSlugs = await getAllArtistSlugs();

  const artistPages = locales.flatMap((locale) =>
    artistSlugs.map((slug) => ({
      url: buildLocalizedUrl(locale, `/artistas/${slug}`),
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: buildAlternates(`/artistas/${slug}`),
    }))
  );

  return [...staticPages, ...artistPages];
}
