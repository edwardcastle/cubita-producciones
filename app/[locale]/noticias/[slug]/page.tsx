import { Metadata } from 'next';
import { setRequestLocale, getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Calendar, ArrowLeft } from 'lucide-react';
import { getNewsBySlug, getAllNewsSlugs, getNews, generateMetadataFromSEO } from '@/lib/content';
import { stripMarkdown } from '@/lib/utils';
import FadeIn from '@/components/ui/FadeIn';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { BreadcrumbJsonLd, NewsArticleJsonLd } from '@/components/seo/JsonLd';
import RichText from '@/components/RichText';

type Locale = 'es' | 'en' | 'fr' | 'it';

const COPY: Record<Locale, { breadcrumb: string; back: string; related: string; requestBooking: string }> = {
  es: { breadcrumb: 'Noticias', back: 'Volver a Noticias', related: 'Más noticias', requestBooking: 'Solicitar booking' },
  en: { breadcrumb: 'News', back: 'Back to News', related: 'More news', requestBooking: 'Request booking' },
  fr: { breadcrumb: 'Actualités', back: 'Retour aux Actualités', related: 'Plus d\'actualités', requestBooking: 'Demander un booking' },
  it: { breadcrumb: 'Notizie', back: 'Torna alle Notizie', related: 'Altre notizie', requestBooking: 'Richiedi un booking' },
};

export async function generateStaticParams() {
  const slugs = await getAllNewsSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;

  const item = await getNewsBySlug(slug);
  if (!item) {
    return { title: 'News not found' };
  }

  const titleFallback = item.title[locale] || item.title.es;
  const descFallback = stripMarkdown(item.excerpt[locale] || item.excerpt.es)?.slice(0, 160) || titleFallback;

  return generateMetadataFromSEO(item.seo, locale, {
    title: `${titleFallback} | Cubita Producciones`,
    description: descFallback,
  }, `/noticias/${slug}`, {
    publishedTime: item.publishedAt,
    modifiedTime: item.updatedAt,
    authors: [item.author],
  });
}

export default async function NewsItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  setRequestLocale(locale);

  const item = await getNewsBySlug(slug);
  if (!item) notFound();

  const related = (await getNews()).filter((n) => n.slug !== slug).slice(0, 3);

  const c = COPY[locale];
  const baseUrl = 'https://cubitaproducciones.com';
  const localePrefix = locale === 'es' ? '' : `/${locale}`;
  const url = `${baseUrl}${localePrefix}/noticias/${slug}`;

  const title = item.title[locale] || item.title.es;
  const excerpt = item.excerpt[locale] || item.excerpt.es;
  const content = item.content[locale] || item.content.es;

  const breadcrumbItems = [
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: c.breadcrumb, url: `${baseUrl}${localePrefix}/noticias` },
    { name: title, url },
  ];

  const dateFormatter = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <NewsArticleJsonLd
        title={title}
        description={stripMarkdown(excerpt) || title}
        image={item.coverImage}
        publishedAt={item.publishedAt}
        updatedAt={item.updatedAt}
        author={item.author}
        url={url}
        locale={locale}
      />
      <article className="min-h-screen bg-white">
        <header className="bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white py-10 md:py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-4">
              <Breadcrumbs
                variant="dark"
                items={[
                  { label: 'Home', href: '/' },
                  { label: c.breadcrumb, href: '/noticias' },
                  { label: title },
                ]}
              />
            </div>
            <FadeIn direction="down">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">{title}</h1>
            </FadeIn>
            <FadeIn direction="down" delay={0.15}>
              <p className="text-base md:text-lg text-gray-300 mb-4 md:mb-6">{excerpt}</p>
            </FadeIn>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {dateFormatter.format(new Date(item.publishedAt))}
              </span>
              <span className="text-gray-500">{item.author}</span>
            </div>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
          <RichText content={content} />

          {/* Booking CTA on the page the reader actually landed on. */}
          <div className="mt-10">
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-400 transition-colors"
            >
              {c.requestBooking}
            </Link>
          </div>

          {/* More news — keeps readers and crawlers moving through the feed. */}
          {related.length > 0 && (
            <section className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{c.related}</h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={`/noticias/${n.slug}`}
                      className="block h-full rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                      <span className="font-semibold text-gray-900 hover:text-amber-700 transition-colors">
                        {n.title[locale] || n.title.es}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/noticias"
              className="inline-flex items-center gap-2 text-amber-700 font-semibold hover:text-amber-900"
            >
              <ArrowLeft className="w-4 h-4" />
              {c.back}
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
