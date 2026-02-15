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
      <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-orange-600 text-white py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <FadeIn direction="up" delay={0}>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                {pageContent.heroTitle[locale]}
              </h1>
            </FadeIn>
            <FadeIn direction="up" delay={0.15}>
              <p className="text-xl md:text-2xl mb-8 text-red-100">
                {pageContent.heroSubtitle[locale]}
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={0.3}>
              <Link
                href="/artistas"
                className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-50 transition-colors btn-hover"
              >
                {pageContent.ctaText[locale]}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </FadeIn>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 opacity-10">
          <Music2 className="w-64 h-64" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center" staggerDelay={0.1}>
            <StaggerItem>
              <div className="p-6">
                <Award className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <div className="text-4xl font-bold text-gray-900 mb-2">{pageContent.stats.years}+</div>
                <div className="text-gray-600">{t('about.experience')}</div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="p-6">
                <Users className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <div className="text-4xl font-bold text-gray-900 mb-2">{pageContent.stats.artists}+</div>
                <div className="text-gray-600">{t('artists.title')}</div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="p-6">
                <Music2 className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <div className="text-4xl font-bold text-gray-900 mb-2">{pageContent.stats.festivals}+</div>
                <div className="text-gray-600">{t('home.stats.festivals')}</div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="p-6">
                <Award className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <div className="text-4xl font-bold text-gray-900 mb-2">{pageContent.stats.countries}+</div>
                <div className="text-gray-600">{t('home.stats.countries')}</div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  {pageContent.aboutTitle[locale]}
                </h2>
                <p className="text-xl text-gray-600 mb-6">
                  {pageContent.aboutText[locale]}
                </p>
                <Link
                  href="/sobre-nosotros"
                  className="inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 link-underline"
                >
                  {t('home.about.learnMore')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </FadeIn>
            <FadeIn direction="right" delay={0.2}>
              <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl p-12 text-center">
                <Music2 className="w-32 h-32 text-red-600 mx-auto" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn direction="up">
            <h2 className="text-4xl font-bold mb-6">
              {t('home.cta.title')}
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={0.15}>
            <p className="text-xl text-gray-300 mb-8">
              {t('home.cta.subtitle')}
            </p>
          </FadeIn>
          <FadeIn direction="up" delay={0.3}>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors btn-hover"
            >
              {t('nav.contact')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
