import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowRight, Music2, Users, Award } from 'lucide-react';
import { getHomePage, getReviews, getArtists, getBlogPosts, generateMetadataFromSEO, buildAlternates } from '@/lib/content';
import { BOOKING_LANDING_SLUGS, type LandingLocale } from '@/lib/booking-landing';
import FadeIn from '@/components/ui/FadeIn';
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer';
import { FAQJsonLd, HOME_FAQS, AggregateRatingJsonLd } from '@/components/seo/JsonLd';
import Hero3D from '@/components/home/Hero3D';
import ReviewsSection from '@/components/ReviewsSection';
import AnimatedDisclosure from '@/components/ui/AnimatedDisclosure';
import Grain from '@/components/atmosphere/Grain';
import StatCounter from '@/components/home/StatCounter';
import ArtistMarquee from '@/components/home/ArtistMarquee';

type Locale = 'es' | 'en' | 'fr' | 'it';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const fallbacks: Record<Locale, { title: string; description: string }> = {
    es: { title: 'Cubita Producciones | Booking de Artistas Cubanos para Eventos en Europa', description: 'Agencia de booking de artistas cubanos de salsa y reguetón para festivales y eventos en Europa. Contratar Jacob Forever, Manolín, El Micha y más artistas.' },
    en: { title: 'Cubita Producciones | Booking Cuban Artists for Events in Europe', description: 'Booking agency for Cuban salsa and reggaeton artists for festivals and events in Europe. Book Jacob Forever, Manolín, El Micha and more artists.' },
    fr: { title: 'Cubita Producciones | Booking Artistes Cubains pour Événements en Europe', description: 'Agence de booking d\'artistes cubains de salsa et reggaeton pour festivals et événements en Europe. Réservez Jacob Forever, Manolín, El Micha et plus.' },
    it: { title: 'Cubita Producciones | Booking Artisti Cubani per Eventi in Europa', description: 'Agenzia di booking di artisti cubani di salsa e reggaeton per festival ed eventi in Europa. Prenota Jacob Forever, Manolín, El Micha e altri artisti.' },
  };

  try {
    const pageContent = await getHomePage();
    return generateMetadataFromSEO(pageContent.seo, locale, fallbacks[locale], '');
  } catch {
    return { ...fallbacks[locale], alternates: buildAlternates(locale, '') };
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [pageContent, t, reviews, artists, blogPosts] = await Promise.all([
    getHomePage(),
    getTranslations(),
    getReviews(),
    getArtists(),
    getBlogPosts(),
  ]);

  // Keyword-rich, localized alt for the hero photos — the mobile carousel's first photo
  // is the crawlable LCP image (desktop renders them as WebGL textures).
  const heroAlt: Record<Locale, (name: string) => string> = {
    es: (n) => `${n} — artista cubano disponible para booking en festivales y eventos en Europa`,
    en: (n) => `${n} — Cuban artist available for booking at festivals and events in Europe`,
    fr: (n) => `${n} — artiste cubain disponible pour booking en festivals et événements en Europe`,
    it: (n) => `${n} — artista cubano disponibile per booking in festival ed eventi in Europa`,
  };
  const heroPhotos = artists
    .filter((a) => a.image)
    .map((a) => ({ id: a.id, url: a.image!, alt: heroAlt[locale](a.name), name: a.name, slug: a.slug }));
  const photosForHero =
    heroPhotos.length > 0
      ? heroPhotos
      : pageContent.heroImages.map((img, i) => ({ id: `hero-${i}`, url: img.url, alt: 'Cubita Producciones', name: '' }));

  const faqs = HOME_FAQS[locale] || HOME_FAQS.es;
  const faqHeading: Record<Locale, string> = {
    es: 'Preguntas frecuentes sobre booking de artistas cubanos',
    en: 'Frequently asked questions about booking Cuban artists',
    fr: 'Questions fréquentes sur le booking d\'artistes cubains',
    it: 'Domande frequenti sul booking di artisti cubani',
  };

  // Latest posts + booking-hub link: contextual internal links from the strongest page.
  const latestPosts = [...blogPosts]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3);
  const bookingHubSlug = BOOKING_LANDING_SLUGS[locale as LandingLocale] ?? BOOKING_LANDING_SLUGS.es;
  const blogHeading: Record<Locale, string> = {
    es: 'Últimos artículos del blog', en: 'Latest from the blog', fr: 'Derniers articles du blog', it: 'Ultimi articoli dal blog',
  };
  const seeAll: Record<Locale, string> = { es: 'Ver todos', en: 'See all', fr: 'Tout voir', it: 'Vedi tutti' };
  const bookingHubCta: Record<Locale, string> = {
    es: 'Cómo contratar artistas cubanos en Europa',
    en: 'How to book Cuban artists in Europe',
    fr: 'Comment réserver des artistes cubains en Europe',
    it: 'Come prenotare artisti cubani in Europa',
  };

  return (
    <div>
      <Grain />
      <FAQJsonLd locale={locale} />
      <AggregateRatingJsonLd
        reviews={reviews}
        itemReviewedName="Cubita Producciones"
        itemReviewedUrl="https://cubitaproducciones.com"
      />
      {/* Hero Section */}
      <Hero3D photos={photosForHero}>
        {/* Same max-w-7xl mx-auto container as the navbar — the inner
            max-w-3xl block sits at its left edge so the title and CTA
            line up horizontally with the logo. */}
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-3xl mt-16 md:mt-0">
            <p
              className="hidden md:block text-amber-400 text-sm md:text-base font-semibold tracking-widest uppercase mb-3 md:mb-4 [paint-order:stroke_fill] [-webkit-text-stroke:0.75px_black] [text-shadow:_0_1px_3px_rgba(0,0,0,0.9)]"
            >
              Cubita Producciones
            </p>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 [paint-order:stroke_fill] [-webkit-text-stroke:1.5px_black] [text-shadow:_0_2px_8px_rgba(0,0,0,0.95)]"
            >
              {pageContent.heroTitle[locale]}
            </h1>
            <p
              className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-gray-100 [paint-order:stroke_fill] [-webkit-text-stroke:1px_black] [text-shadow:_0_2px_6px_rgba(0,0,0,0.95)]"
            >
              {pageContent.heroSubtitle[locale]}
            </p>
            <Link
              href="/artistas"
              className="pointer-events-auto inline-flex items-center gap-1.5 md:gap-2 bg-amber-500 text-black px-4 py-2 md:px-8 md:py-4 rounded-md md:rounded-lg font-semibold text-sm md:text-lg hover:bg-amber-400 transition-colors btn-hover relative z-10"
            >
              {pageContent.ctaText[locale]}
              <ArrowRight className="w-3.5 h-3.5 md:w-5 md:h-5" />
            </Link>
          </div>
        </div>
      </Hero3D>

      {/* Stats Section */}
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center" staggerDelay={0.1}>
            <StaggerItem>
              <div className="p-3 md:p-6 group">
                <Award className="w-8 h-8 md:w-12 md:h-12 text-amber-500 mx-auto mb-2 md:mb-4 transition-transform duration-200 ease-out group-hover:rotate-[4deg] motion-reduce:transition-none motion-reduce:group-hover:rotate-0" />
                <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-1 md:mb-2">
                  <StatCounter value={pageContent.stats.years} />
                </div>
                <div className="text-xs md:text-base text-gray-600">{t('about.experience')}</div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="p-3 md:p-6 group">
                <Users className="w-8 h-8 md:w-12 md:h-12 text-amber-500 mx-auto mb-2 md:mb-4 transition-transform duration-200 ease-out group-hover:rotate-[4deg] motion-reduce:transition-none motion-reduce:group-hover:rotate-0" />
                <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-1 md:mb-2">
                  <StatCounter value={pageContent.stats.artists} />
                </div>
                <div className="text-xs md:text-base text-gray-600">{t('artists.title')}</div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="p-3 md:p-6 group">
                <Music2 className="w-8 h-8 md:w-12 md:h-12 text-amber-500 mx-auto mb-2 md:mb-4 transition-transform duration-200 ease-out group-hover:rotate-[4deg] motion-reduce:transition-none motion-reduce:group-hover:rotate-0" />
                <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-1 md:mb-2">
                  <StatCounter value={pageContent.stats.festivals} />
                </div>
                <div className="text-xs md:text-base text-gray-600">{t('home.stats.festivals')}</div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="p-3 md:p-6 group">
                <Award className="w-8 h-8 md:w-12 md:h-12 text-amber-500 mx-auto mb-2 md:mb-4 transition-transform duration-200 ease-out group-hover:rotate-[4deg] motion-reduce:transition-none motion-reduce:group-hover:rotate-0" />
                <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-1 md:mb-2">
                  <StatCounter value={pageContent.stats.countries} />
                </div>
                <div className="text-xs md:text-base text-gray-600">{t('home.stats.countries')}</div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* About Section */}
      <section className="relative overflow-hidden py-10 md:py-20 px-4">
        <ArtistMarquee />
        <div className="max-w-3xl mx-auto relative">
          <FadeIn direction="up">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6">
                {pageContent.aboutTitle[locale]}
              </h2>
              <p className="text-base md:text-xl text-gray-600 mb-4 md:mb-6">
                {pageContent.aboutText[locale]}
              </p>
              <Link
                href="/sobre-nosotros"
                className="inline-flex items-center gap-2 text-amber-800 font-semibold hover:text-amber-900 link-underline"
              >
                {t('home.about.learnMore')}
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Latest from the blog + booking-hub link */}
      {latestPosts.length > 0 && (
        <section className="py-10 md:py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <FadeIn direction="up">
              <div className="flex items-end justify-between gap-4 mb-6 md:mb-10">
                <h2 className="text-2xl md:text-4xl font-bold text-gray-900">{blogHeading[locale]}</h2>
                <Link href="/blog" className="text-amber-700 font-semibold hover:text-amber-900 whitespace-nowrap link-underline">
                  {seeAll[locale]}
                </Link>
              </div>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6" staggerDelay={0.08}>
              {latestPosts.map((p) => (
                <StaggerItem key={p.id}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="block h-full rounded-xl border border-gray-200 bg-white p-5 md:p-6 hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 hover:text-amber-700 transition-colors">
                      {p.title[locale] || p.title.es}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3">{p.excerpt[locale] || p.excerpt.es}</p>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
            <div className="mt-8 text-center">
              <a
                href={`/${locale}/${bookingHubSlug}`}
                className="inline-flex items-center gap-2 text-amber-800 font-semibold hover:text-amber-900 link-underline"
              >
                {bookingHubCta[locale]}
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-10 md:py-20 bg-white px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn direction="up">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-10 text-center">
              {faqHeading[locale]}
            </h2>
          </FadeIn>
          <div className="space-y-4 md:space-y-6">
            {faqs.map((faq, i) => (
              <FadeIn key={i} direction="up" delay={i * 0.05}>
                <AnimatedDisclosure title={faq.question} body={faq.answer} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section — renders only if there are reviews */}
      <ReviewsSection reviews={reviews} locale={locale} />

      {/* CTA Section */}
      <section className="cubita-cta-bg py-10 md:py-20 bg-gray-900 text-white px-4">
        <div className="max-w-4xl mx-auto text-center relative">
          <FadeIn direction="up">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">
              {t('home.cta.title')}
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={0.15}>
            <p className="text-base md:text-xl text-gray-300 mb-6 md:mb-8">
              {t('home.cta.subtitle')}
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.3}>
            <Link
              href="/contacto"
              className="cubita-cta inline-flex items-center gap-2 bg-amber-500 text-black px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-amber-400 transition-colors btn-hover relative overflow-hidden"
            >
              <span className="relative z-[1] inline-flex items-center gap-2">
                {t('nav.contact')}
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </span>
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
