import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowRight, Calendar } from 'lucide-react';
import { getNews, buildAlternates } from '@/lib/content';
import FadeIn from '@/components/ui/FadeIn';
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

type Locale = 'es' | 'en' | 'fr' | 'it';

const COPY: Record<Locale, { title: string; subtitle: string; readMore: string; breadcrumb: string; empty: string }> = {
  es: {
    title: 'Noticias | Artistas Cubanos en Europa',
    subtitle: 'Últimas noticias, giras confirmadas y novedades de los artistas cubanos que representamos en Europa.',
    readMore: 'Leer más',
    breadcrumb: 'Noticias',
    empty: 'Pronto publicaremos novedades. Vuelve pronto.',
  },
  en: {
    title: 'News | Cuban Artists in Europe',
    subtitle: 'Latest news, confirmed tours and announcements from the Cuban artists we represent across Europe.',
    readMore: 'Read more',
    breadcrumb: 'News',
    empty: 'News coming soon. Check back later.',
  },
  fr: {
    title: 'Actualités | Artistes Cubains en Europe',
    subtitle: 'Dernières actualités, tournées confirmées et nouveautés des artistes cubains que nous représentons en Europe.',
    readMore: 'Lire plus',
    breadcrumb: 'Actualités',
    empty: 'Actualités à venir. Revenez bientôt.',
  },
  it: {
    title: 'Notizie | Artisti Cubani in Europa',
    subtitle: 'Ultime notizie, tour confermati e novità degli artisti cubani che rappresentiamo in Europa.',
    readMore: 'Leggi di più',
    breadcrumb: 'Notizie',
    empty: 'Notizie in arrivo. Torna presto.',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = COPY[locale];
  const ogLocale = { es: 'es_ES', en: 'en_US', fr: 'fr_FR', it: 'it_IT' }[locale];
  return {
    title: c.title,
    description: c.subtitle,
    alternates: {
      ...buildAlternates(locale, '/noticias'),
      types: {
        'application/rss+xml': [
          { url: `https://cubitaproducciones.com/${locale}/noticias/feed.xml`, title: c.title },
        ],
      },
    },
    openGraph: {
      title: c.title,
      description: c.subtitle,
      url: `https://cubitaproducciones.com/${locale}/noticias`,
      type: 'website',
      siteName: 'Cubita Producciones',
      locale: ogLocale,
      images: [
        { url: 'https://cubitaproducciones.com/og-image.jpg', width: 1200, height: 630, alt: c.title },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: c.title,
      description: c.subtitle,
      images: ['https://cubitaproducciones.com/og-image.jpg'],
    },
  };
}

export default async function NewsIndex({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const items = await getNews();
  const c = COPY[locale];
  const baseUrl = 'https://cubitaproducciones.com';
  const localePrefix = locale === 'es' ? '' : `/${locale}`;

  const breadcrumbItems = [
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: c.breadcrumb, url: `${baseUrl}${localePrefix}/noticias` },
  ];

  const dateFormatter = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <div className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white py-12 md:py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-4">
              <Breadcrumbs
                variant="dark"
                items={[
                  { label: 'Home', href: '/' },
                  { label: c.breadcrumb },
                ]}
              />
            </div>
            <FadeIn direction="down">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">{c.title}</h1>
            </FadeIn>
            <FadeIn direction="down" delay={0.15}>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl">{c.subtitle}</p>
            </FadeIn>
          </div>
        </section>

        <section className="py-12 md:py-20 px-4">
          <div className="max-w-6xl mx-auto">
            {items.length === 0 ? (
              <p className="text-center text-gray-600 text-base md:text-lg">{c.empty}</p>
            ) : (
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" staggerDelay={0.08}>
                {items.map((item) => (
                  <StaggerItem key={item.id}>
                    <Link
                      href={`/noticias/${item.slug}`}
                      className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow h-full"
                    >
                      <div className="p-5 md:p-6">
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {dateFormatter.format(new Date(item.publishedAt))}
                          </span>
                        </div>
                        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors">
                          {item.title[locale]}
                        </h2>
                        <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-3">
                          {item.excerpt[locale]}
                        </p>
                        <span className="inline-flex items-center gap-1 text-amber-700 font-semibold text-sm group-hover:gap-2 transition-all">
                          {c.readMore}
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
