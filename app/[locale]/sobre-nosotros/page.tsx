import { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { Award, Users, Globe, Music } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { getAboutPage, generateMetadataFromSEO } from '@/lib/strapi';
import FadeIn from '@/components/ui/FadeIn';
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer';

type Locale = 'es' | 'en' | 'fr';

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
      <div className="bg-gradient-to-r from-black to-gray-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <FadeIn direction="down">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {pageContent.title[locale]}
            </h1>
          </FadeIn>
          <FadeIn direction="down" delay={0.15}>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {pageContent.subtitle[locale]}
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 -mt-12">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-6" staggerDelay={0.1}>
          <StaggerItem>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center card-hover">
              <Award className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <div className="text-4xl font-bold text-gray-900 mb-1">{pageContent.stats.years}+</div>
              <div className="text-gray-600">{t('about.experience')}</div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center card-hover">
              <Users className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <div className="text-4xl font-bold text-gray-900 mb-1">{pageContent.stats.festivals}+</div>
              <div className="text-gray-600">{t('home.stats.festivals')}</div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center card-hover">
              <Globe className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <div className="text-4xl font-bold text-gray-900 mb-1">{pageContent.stats.countries}+</div>
              <div className="text-gray-600">{t('home.stats.countries')}</div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center card-hover">
              <Music className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <div className="text-4xl font-bold text-gray-900 mb-1">{pageContent.stats.artists}+</div>
              <div className="text-gray-600">{t('artists.title')}</div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>

      {/* Mission */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeIn direction="left">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {pageContent.missionTitle[locale]}
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                {pageContent.missionText[locale]}
              </p>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.2}>
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-12">
              <StaggerContainer className="grid grid-cols-2 gap-6" staggerDelay={0.1}>
                <StaggerItem>
                  <div className="bg-white rounded-xl p-6 text-center card-hover">
                    <div className="text-3xl font-bold text-gray-900 mb-2">100%</div>
                    <div className="text-sm text-gray-600">{t('about.professionalism')}</div>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="bg-white rounded-xl p-6 text-center card-hover">
                    <div className="text-3xl font-bold text-gray-900 mb-2">24h</div>
                    <div className="text-sm text-gray-600">{t('about.response')}</div>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="bg-white rounded-xl p-6 text-center card-hover">
                    <div className="text-3xl font-bold text-gray-900 mb-2">{pageContent.stats.years}+</div>
                    <div className="text-sm text-gray-600">{t('about.years')}</div>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="bg-white rounded-xl p-6 text-center card-hover">
                    <div className="text-3xl font-bold text-gray-900 mb-2">Top</div>
                    <div className="text-sm text-gray-600">{t('artists.title')}</div>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Services */}
      <div className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <FadeIn direction="up">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {t('about.services')}
            </h2>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={0.15}>
            {pageContent.services.map((service, index) => (
              <StaggerItem key={index}>
                <div className="bg-gray-50 rounded-xl p-8 card-hover">
                  <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    {index === 0 ? (
                      <Music className="w-6 h-6 text-amber-600" />
                    ) : index === 1 ? (
                      <Users className="w-6 h-6 text-amber-600" />
                    ) : (
                      <Globe className="w-6 h-6 text-amber-600" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title[locale]}
                  </h3>
                  <p className="text-gray-600">
                    {service.text[locale]}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn direction="up">
            <h2 className="text-3xl font-bold mb-4">{t('about.ctaTitle')}</h2>
          </FadeIn>
          <FadeIn direction="up" delay={0.15}>
            <p className="text-xl text-gray-300 mb-8">{t('about.ctaSubtitle')}</p>
          </FadeIn>
          <FadeIn direction="up" delay={0.3}>
            <Link
              href="/contacto"
              className="inline-block bg-amber-500 text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-400 transition-colors btn-hover"
            >
              {t('nav.contact')}
            </Link>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
