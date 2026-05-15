import { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowRight, Music2, Users, Award } from 'lucide-react';
import { getHomePage, generateMetadataFromSEO, buildAlternates } from '@/lib/strapi';
import FadeIn from '@/components/ui/FadeIn';
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer';
import { FAQJsonLd, HOME_FAQS } from '@/components/seo/JsonLd';
import HeroCarousel from '@/components/home/HeroCarousel';

type Locale = 'es' | 'en' | 'fr' | 'it';

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;

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

export default async function HomePage() {
  const locale = (await getLocale()) as Locale;
  const [pageContent, t] = await Promise.all([
    getHomePage(),
    getTranslations(),
  ]);

  const faqs = HOME_FAQS[locale] || HOME_FAQS.es;
  const faqHeading: Record<Locale, string> = {
    es: 'Preguntas frecuentes sobre booking de artistas cubanos',
    en: 'Frequently asked questions about booking Cuban artists',
    fr: 'Questions fréquentes sur le booking d\'artistes cubains',
    it: 'Domande frequenti sul booking di artisti cubani',
  };

  const carouselLabels: Record<Locale, { prev: string; next: string; slide: string }> = {
    es: { prev: 'Imagen anterior', next: 'Imagen siguiente', slide: 'Ir a la imagen' },
    en: { prev: 'Previous image', next: 'Next image', slide: 'Go to image' },
    fr: { prev: 'Image précédente', next: 'Image suivante', slide: 'Aller à l\'image' },
    it: { prev: 'Immagine precedente', next: 'Immagine successiva', slide: 'Vai all\'immagine' },
  };

  return (
    <div>
      <FAQJsonLd locale={locale} />
      {/* Hero Section */}
      <HeroCarousel images={pageContent.heroImages} labels={carouselLabels[locale]}>
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
              className="inline-flex items-center gap-1.5 md:gap-2 bg-amber-500 text-black px-4 py-2 md:px-8 md:py-4 rounded-md md:rounded-lg font-semibold text-sm md:text-lg hover:bg-amber-400 transition-colors btn-hover relative z-10"
            >
              {pageContent.ctaText[locale]}
              <ArrowRight className="w-3.5 h-3.5 md:w-5 md:h-5" />
            </Link>
          </div>
        </div>
      </HeroCarousel>

      {/* Stats Section */}
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center" staggerDelay={0.1}>
            <StaggerItem>
              <div className="p-3 md:p-6">
                <Award className="w-8 h-8 md:w-12 md:h-12 text-amber-500 mx-auto mb-2 md:mb-4" />
                <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-1 md:mb-2">{pageContent.stats.years}+</div>
                <div className="text-xs md:text-base text-gray-600">{t('about.experience')}</div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="p-3 md:p-6">
                <Users className="w-8 h-8 md:w-12 md:h-12 text-amber-500 mx-auto mb-2 md:mb-4" />
                <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-1 md:mb-2">{pageContent.stats.artists}+</div>
                <div className="text-xs md:text-base text-gray-600">{t('artists.title')}</div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="p-3 md:p-6">
                <Music2 className="w-8 h-8 md:w-12 md:h-12 text-amber-500 mx-auto mb-2 md:mb-4" />
                <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-1 md:mb-2">{pageContent.stats.festivals}+</div>
                <div className="text-xs md:text-base text-gray-600">{t('home.stats.festivals')}</div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="p-3 md:p-6">
                <Award className="w-8 h-8 md:w-12 md:h-12 text-amber-500 mx-auto mb-2 md:mb-4" />
                <div className="text-2xl md:text-4xl font-bold text-gray-900 mb-1 md:mb-2">{pageContent.stats.countries}+</div>
                <div className="text-xs md:text-base text-gray-600">{t('home.stats.countries')}</div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* About Section */}
      <section className="py-10 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <FadeIn direction="left">
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
            <FadeIn direction="right" delay={0.2}>
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 md:p-12 text-center">
                <Music2 className="w-20 h-20 md:w-32 md:h-32 text-gray-800 mx-auto" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

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
                <details className="group rounded-lg border border-gray-200 bg-gray-50 p-4 md:p-6 open:bg-white open:shadow-sm">
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-4 text-base md:text-lg font-semibold text-gray-900">
                    <span>{faq.question}</span>
                    <span className="text-amber-600 text-xl leading-none transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 md:mt-4 text-sm md:text-base text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-20 bg-gray-900 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
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
              className="inline-flex items-center gap-2 bg-amber-500 text-black px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-amber-400 transition-colors btn-hover"
            >
              {t('nav.contact')}
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
