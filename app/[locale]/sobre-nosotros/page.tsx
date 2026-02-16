import { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { Award, Users, Globe, Music } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { getAboutPage, generateMetadataFromSEO } from '@/lib/strapi';
import FadeIn from '@/components/ui/FadeIn';
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer';

type Locale = 'es' | 'en' | 'fr' | 'it';

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const pageContent = await getAboutPage();

  return generateMetadataFromSEO(pageContent.seo, locale, {
    title: 'Sobre Nosotros - Cubita Producciones',
    description: 'Mas de 30 anos de experiencia conectando el talento cubano con escenarios de todo el mundo.',
  });
}

export default async function SobreNosotrosPage() {
  const locale = (await getLocale()) as Locale;
  const [pageContent, t] = await Promise.all([
    getAboutPage(),
    getTranslations(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white py-10 md:py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <FadeIn direction="down">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-6">
              {pageContent.title[locale]}
            </h1>
          </FadeIn>
          <FadeIn direction="down" delay={0.15}>
            <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto">
              {pageContent.subtitle[locale]}
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 -mt-6 md:-mt-12">
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4" staggerDelay={0.1}>
          <StaggerItem>
            <div className="bg-white rounded-lg shadow-lg p-3 md:p-5 text-center card-hover">
              <Award className="w-6 h-6 md:w-10 md:h-10 text-amber-500 mx-auto mb-1 md:mb-2" />
              <div className="text-lg md:text-3xl font-bold text-gray-900">{pageContent.stats.years}+</div>
              <div className="text-[10px] md:text-sm text-gray-600">{t('about.experience')}</div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="bg-white rounded-lg shadow-lg p-3 md:p-5 text-center card-hover">
              <Users className="w-6 h-6 md:w-10 md:h-10 text-amber-500 mx-auto mb-1 md:mb-2" />
              <div className="text-lg md:text-3xl font-bold text-gray-900">{pageContent.stats.festivals}+</div>
              <div className="text-[10px] md:text-sm text-gray-600">{t('home.stats.festivals')}</div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="bg-white rounded-lg shadow-lg p-3 md:p-5 text-center card-hover">
              <Globe className="w-6 h-6 md:w-10 md:h-10 text-amber-500 mx-auto mb-1 md:mb-2" />
              <div className="text-lg md:text-3xl font-bold text-gray-900">{pageContent.stats.countries}+</div>
              <div className="text-[10px] md:text-sm text-gray-600">{t('home.stats.countries')}</div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="bg-white rounded-lg shadow-lg p-3 md:p-5 text-center card-hover">
              <Music className="w-6 h-6 md:w-10 md:h-10 text-amber-500 mx-auto mb-1 md:mb-2" />
              <div className="text-lg md:text-3xl font-bold text-gray-900">{pageContent.stats.artists}+</div>
              <div className="text-[10px] md:text-sm text-gray-600">{t('artists.title')}</div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>

      {/* Mission */}
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <FadeIn direction="left">
            <div>
              <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
                {pageContent.missionTitle[locale]}
              </h2>
              <p className="text-base md:text-xl text-gray-600 mb-4 md:mb-6">
                {pageContent.missionText[locale]}
              </p>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.2}>
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-4 md:p-8">
              <StaggerContainer className="grid grid-cols-2 gap-3 md:gap-4" staggerDelay={0.1}>
                <StaggerItem>
                  <div className="bg-white rounded-xl p-3 md:p-4 text-center card-hover">
                    <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">100%</div>
                    <div className="text-xs md:text-sm text-gray-600">{t('about.professionalism')}</div>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="bg-white rounded-xl p-3 md:p-4 text-center card-hover">
                    <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">24h</div>
                    <div className="text-xs md:text-sm text-gray-600">{t('about.response')}</div>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="bg-white rounded-xl p-3 md:p-4 text-center card-hover">
                    <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{pageContent.stats.years}+</div>
                    <div className="text-xs md:text-sm text-gray-600">{t('about.years')}</div>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="bg-white rounded-xl p-3 md:p-4 text-center card-hover">
                    <div className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Top</div>
                    <div className="text-xs md:text-sm text-gray-600">{t('artists.title')}</div>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Services */}
      <div className="bg-white py-10 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <FadeIn direction="up">
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 text-center mb-8 md:mb-12">
              {t('about.services')}
            </h2>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8" staggerDelay={0.15}>
            {pageContent.services.map((service, index) => (
              <StaggerItem key={index}>
                <div className="bg-gray-50 rounded-xl p-5 md:p-8 card-hover">
                  <div className="bg-amber-100 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                    {index === 0 ? (
                      <Music className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
                    ) : index === 1 ? (
                      <Users className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
                    ) : (
                      <Globe className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
                    )}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
                    {service.title[locale]}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600">
                    {service.text[locale]}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white py-10 md:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn direction="up">
            <h2 className="text-xl md:text-3xl font-bold mb-3 md:mb-4">{t('about.ctaTitle')}</h2>
          </FadeIn>
          <FadeIn direction="up" delay={0.15}>
            <p className="text-base md:text-xl text-gray-300 mb-6 md:mb-8">{t('about.ctaSubtitle')}</p>
          </FadeIn>
          <FadeIn direction="up" delay={0.3}>
            <Link
              href="/contacto"
              className="inline-block bg-amber-500 text-black px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-amber-400 transition-colors btn-hover"
            >
              {t('nav.contact')}
            </Link>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
