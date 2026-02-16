import {MetadataRoute} from 'next';
import {getAllArtistSlugs} from '@/lib/strapi';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://cubitaproducciones.com';

  const routes = ['', '/artistas', '/sobre-nosotros', '/contacto'];
  const locales = ['es', 'en', 'fr', 'it'];

  // Static pages with alternates for each language
  const staticPages = locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}${route}`])
        ),
      },
    }))
  );

  // Fetch artist slugs from CMS
  const artistSlugs = await getAllArtistSlugs();

  const artistPages = locales.flatMap((locale) =>
    artistSlugs.map((slug) => ({
      url: `${baseUrl}/${locale}/artistas/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}/artistas/${slug}`])
        ),
      },
    }))
  );

  return [...staticPages, ...artistPages];
}
