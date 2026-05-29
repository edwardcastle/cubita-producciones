import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { ArrowRight, Calendar } from 'lucide-react';
import { getBlogPosts, buildAlternates } from '@/lib/strapi';
import FadeIn from '@/components/ui/FadeIn';
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

type Locale = 'es' | 'en' | 'fr' | 'it';

const COPY: Record<Locale, { title: string; subtitle: string; readMore: string; breadcrumb: string; empty: string; min: string }> = {
  es: {
    title: 'Blog | Booking de Artistas en Europa',
    subtitle: 'Guías, consejos y novedades sobre booking de artistas cubanos para festivales y eventos en Europa.',
    readMore: 'Leer más',
    breadcrumb: 'Blog',
    empty: 'Próximamente publicaremos nuevos artículos. Vuelve pronto.',
    min: 'min',
  },
  en: {
    title: 'Blog | Booking Artists in Europe',
    subtitle: 'Guides, tips and news on booking Cuban artists for festivals and events in Europe.',
    readMore: 'Read more',
    breadcrumb: 'Blog',
    empty: 'New articles coming soon. Check back later.',
    min: 'min',
  },
  fr: {
    title: 'Blog | Booking d\'Artistes en Europe',
    subtitle: 'Guides, conseils et actualités sur le booking d\'artistes cubains pour festivals et événements en Europe.',
    readMore: 'Lire plus',
    breadcrumb: 'Blog',
    empty: 'De nouveaux articles arrivent bientôt. Revenez bientôt.',
    min: 'min',
  },
  it: {
    title: 'Blog | Booking di Artisti in Europa',
    subtitle: 'Guide, consigli e novità sul booking di artisti cubani per festival ed eventi in Europa.',
    readMore: 'Leggi di più',
    breadcrumb: 'Blog',
    empty: 'Nuovi articoli in arrivo. Torna presto.',
    min: 'min',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const c = COPY[locale];
  return {
    title: c.title,
    description: c.subtitle,
    alternates: buildAlternates(locale, '/blog'),
    openGraph: {
      title: c.title,
      description: c.subtitle,
      type: 'website',
    },
  };
}

export default async function BlogIndex({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const posts = await getBlogPosts();
  const c = COPY[locale];
  const baseUrl = 'https://cubitaproducciones.com';
  const localePrefix = locale === 'es' ? '' : `/${locale}`;

  const breadcrumbItems = [
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: c.breadcrumb, url: `${baseUrl}${localePrefix}/blog` },
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
            {posts.length === 0 ? (
              <p className="text-center text-gray-600 text-base md:text-lg">{c.empty}</p>
            ) : (
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" staggerDelay={0.08}>
                {posts.map((post) => (
                  <StaggerItem key={post.id}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow h-full"
                    >
                      {post.coverImage && (
                        <div className="relative h-48 md:h-56 w-full overflow-hidden">
                          <Image
                            src={post.coverImage}
                            alt={post.title[locale]}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          />
                        </div>
                      )}
                      <div className="p-5 md:p-6">
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {dateFormatter.format(new Date(post.publishedAt))}
                          </span>
                        </div>
                        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors">
                          {post.title[locale]}
                        </h2>
                        <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt[locale]}
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
