import { Metadata } from 'next';
import { setRequestLocale, getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { Calendar, ArrowLeft } from 'lucide-react';
import { getBlogPostBySlug, getAllBlogPostSlugs, buildAlternates, generateMetadataFromSEO } from '@/lib/strapi';
import { stripMarkdown } from '@/lib/utils';
import FadeIn from '@/components/ui/FadeIn';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { BreadcrumbJsonLd, BlogPostJsonLd } from '@/components/seo/JsonLd';
import RichText from '@/components/RichText';

type Locale = 'es' | 'en' | 'fr' | 'it';

const COPY: Record<Locale, { breadcrumb: string; back: string; min: string; share: string }> = {
  es: { breadcrumb: 'Blog', back: 'Volver al Blog', min: 'min de lectura', share: 'Compartir' },
  en: { breadcrumb: 'Blog', back: 'Back to Blog', min: 'min read', share: 'Share' },
  fr: { breadcrumb: 'Blog', back: 'Retour au Blog', min: 'min de lecture', share: 'Partager' },
  it: { breadcrumb: 'Blog', back: 'Torna al Blog', min: 'min di lettura', share: 'Condividi' },
};

export async function generateStaticParams() {
  const slugs = await getAllBlogPostSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;

  const post = await getBlogPostBySlug(slug);
  if (!post) {
    return { title: 'Post not found' };
  }

  const titleFallback = post.title[locale] || post.title.es;
  const descFallback = stripMarkdown(post.excerpt[locale] || post.excerpt.es)?.slice(0, 160) || titleFallback;

  return generateMetadataFromSEO(post.seo, locale, {
    title: `${titleFallback} | Cubita Producciones`,
    description: descFallback,
  }, `/blog/${slug}`);
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  setRequestLocale(locale);

  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const c = COPY[locale];
  const baseUrl = 'https://cubitaproducciones.com';
  const localePrefix = locale === 'es' ? '' : `/${locale}`;
  const url = `${baseUrl}${localePrefix}/blog/${slug}`;

  const title = post.title[locale] || post.title.es;
  const excerpt = post.excerpt[locale] || post.excerpt.es;
  const content = post.content[locale] || post.content.es;

  const breadcrumbItems = [
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: c.breadcrumb, url: `${baseUrl}${localePrefix}/blog` },
    { name: title, url },
  ];

  const dateFormatter = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <BlogPostJsonLd
        title={title}
        description={stripMarkdown(excerpt) || title}
        image={post.coverImage}
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
        author={post.author}
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
                  { label: c.breadcrumb, href: '/blog' },
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
                {dateFormatter.format(new Date(post.publishedAt))}
              </span>
              <span className="text-gray-500">{post.author}</span>
            </div>
          </div>
        </header>

        {post.coverImage && (
          <div className="max-w-5xl mx-auto px-4 -mt-6 md:-mt-10 mb-8 md:mb-12">
            <div className="relative h-56 sm:h-72 md:h-96 lg:h-[28rem] rounded-xl md:rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={post.coverImage}
                alt={title}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 1024px, 100vw"
              />
            </div>
          </div>
        )}

        <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
          <RichText content={content} />

          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/blog"
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
