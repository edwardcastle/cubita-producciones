import {MetadataRoute} from 'next';
import {artists} from '@/lib/data/artists';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cubitaproducciones.com';
  
  const routes = ['', '/artistas', '/sobre-nosotros', '/contacto'];
  const locales = ['es', 'en', 'fr'];
  
  const staticPages = locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  );

  const artistPages = locales.flatMap((locale) =>
    artists.map((artist) => ({
      url: `${baseUrl}/${locale}/artistas/${artist.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  return [...staticPages, ...artistPages];
}
