import {MetadataRoute} from 'next';
import {getSitemapData, getAllBlogPostSlugs, buildLocalizedUrl} from '@/lib/content';
import {BOOKING_LANDING_SLUGS, buildBookingLandingUrl, type LandingLocale} from '@/lib/booking-landing';

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

  const [data, blogSlugs] = await Promise.all([getSitemapData(), getAllBlogPostSlugs()]);
  const fallback = new Date();

  const routeConfig = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const, lastModified: data.home ?? fallback },
    { path: '/artistas', priority: 0.9, changeFrequency: 'weekly' as const, lastModified: data.artistsList ?? fallback },
    { path: '/blog', priority: 0.8, changeFrequency: 'weekly' as const, lastModified: fallback },
    { path: '/contacto', priority: 0.8, changeFrequency: 'monthly' as const, lastModified: data.contact ?? fallback },
    { path: '/sobre-nosotros', priority: 0.7, changeFrequency: 'monthly' as const, lastModified: data.about ?? fallback },
  ];

  const staticPages = locales.flatMap((locale) =>
    routeConfig.map((route) => ({
      url: buildLocalizedUrl(locale, route.path),
      lastModified: route.lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: buildAlternates(route.path),
    }))
  );

  const artistPages = locales.flatMap((locale) =>
    data.artists.map(({slug, updatedAt}) => ({
      url: buildLocalizedUrl(locale, `/artistas/${slug}`),
      lastModified: updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: buildAlternates(`/artistas/${slug}`),
    }))
  );

  const bookingLandingAlternates = {
    languages: {
      ...Object.fromEntries(
        (Object.keys(BOOKING_LANDING_SLUGS) as LandingLocale[]).map((l) => [
          l,
          buildBookingLandingUrl(l),
        ])
      ),
      'x-default': buildBookingLandingUrl('es'),
    },
  };

  const bookingLandingPages = (Object.keys(BOOKING_LANDING_SLUGS) as LandingLocale[]).map((l) => ({
    url: buildBookingLandingUrl(l),
    lastModified: fallback,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
    alternates: bookingLandingAlternates,
  }));

  const blogPostPages = locales.flatMap((locale) =>
    blogSlugs.map(({slug, updatedAt}) => ({
      url: buildLocalizedUrl(locale, `/blog/${slug}`),
      lastModified: new Date(updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: buildAlternates(`/blog/${slug}`),
    }))
  );

  return [...staticPages, ...bookingLandingPages, ...artistPages, ...blogPostPages];
}
