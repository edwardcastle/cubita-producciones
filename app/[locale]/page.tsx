import { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowRight, Music2, Users, Award } from 'lucide-react';
import { getHomePage, generateMetadataFromSEO } from '@/lib/strapi';
import FadeIn from '@/components/ui/FadeIn';
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer';

type Locale = 'es' | 'en' | 'fr';

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const pageContent = await getHomePage();

  return generateMetadataFromSEO(pageContent.seo, locale, {
    title: 'Cubita Producciones - Booking de Artistas Cubanos',
    description: 'Agencia de booking de artistas cubanos de salsa y regueton para festivales y eventos en Europa.',
  });
}

export default async function HomePage() {
  const locale = (await getLocale()) as Locale;
  const [pageContent, t] = await Promise.all([
    getHomePage(),
    getTranslations(),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white py-12 md:py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <FadeIn direction="up" delay={0}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
                {pageContent.heroTitle[locale]}
              </h1>
            </FadeIn>
            <FadeIn direction="up" delay={0.15}>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-gray-300">
                {pageContent.heroSubtitle[locale]}
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={0.3}>
              <Link
                href="/artistas"
                className="inline-flex items-center gap-2 bg-amber-500 text-black px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-amber-400 transition-colors btn-hover relative z-10"
              >
                {pageContent.ctaText[locale]}
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
            </FadeIn>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 opacity-10 hidden md:block">
          <Music2 className="w-64 h-64" />
        </div>
      </section>

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
                  className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:text-amber-700 link-underline"
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
