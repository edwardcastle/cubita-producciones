import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { getArtists, getArtistsPage, getSiteSettings, generateMetadataFromSEO } from '@/lib/strapi';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Music, Calendar, Users } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer';

type Locale = 'es' | 'en' | 'fr' | 'it';

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const pageContent = await getArtistsPage();

  return generateMetadataFromSEO(pageContent.seo, locale, {
    title: 'Artistas - Cubita Producciones',
    description: 'Descubre los mejores artistas cubanos de salsa y regueton disponibles para booking en Europa.',
  });
}

export default async function ArtistasPage() {
  const locale = (await getLocale()) as Locale;
  const [artists, pageContent, siteSettings] = await Promise.all([
    getArtists(),
    getArtistsPage(),
    getSiteSettings(),
  ]);

  const personasText: Record<Locale, string> = {
    es: 'personas',
    en: 'people',
    fr: 'personnes',
    it: 'persone',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white py-10 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <FadeIn direction="down">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">
              {pageContent.title[locale]}
            </h1>
          </FadeIn>
          <FadeIn direction="down" delay={0.15}>
            <p className="text-base md:text-xl text-gray-300">{pageContent.subtitle[locale]}</p>
          </FadeIn>
        </div>
      </div>

      {/* Artists Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-16">
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6" staggerDelay={0.1}>
          {artists.map((artist) => (
            <StaggerItem key={artist.id}>
              <Link
                href={`/artistas/${artist.slug}`}
                className="block bg-white rounded-lg md:rounded-xl shadow-lg overflow-hidden card-hover"
              >
                {/* Artist Image */}
                <div className="relative aspect-[4/5] md:aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 img-zoom">
                  {artist.image ? (
                    <Image
                      src={artist.image}
                      alt={artist.name}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Music className="w-12 h-12 md:w-24 md:h-24 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-black px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full text-[10px] md:text-xs font-semibold text-white">
                    {artist.genre === 'salsa'
                      ? pageContent.salsaLabel[locale]
                      : pageContent.reggaetonLabel[locale]}
                  </div>
                </div>

                {/* Artist Info */}
                <div className="p-2 md:p-4">
                  <h3 className="text-sm md:text-xl font-bold text-gray-900 mb-0.5 md:mb-1 truncate">{artist.name}</h3>

                  <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-3 line-clamp-1 md:line-clamp-2">{artist.bio[locale]}</p>

                  <div className="hidden md:flex flex-wrap gap-3 mb-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span>{artist.availability}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-amber-600" />
                      <span>
                        {artist.travelParty} {personasText[locale]}
                      </span>
                    </div>
                  </div>

                  <span className="block w-full text-center bg-black text-white py-1.5 md:py-2.5 rounded-md md:rounded-lg text-xs md:text-sm font-semibold group-hover:bg-gray-800 transition-colors">
                    {pageContent.viewDetailsButton[locale]}
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-10 md:py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn direction="up">
            <h2 className="text-xl md:text-3xl font-bold mb-3 md:mb-4">{pageContent.ctaTitle[locale]}</h2>
          </FadeIn>
          <FadeIn direction="up" delay={0.15}>
            <p className="text-base md:text-xl text-gray-300 mb-6 md:mb-8">{pageContent.ctaSubtitle[locale]}</p>
          </FadeIn>
          <FadeIn direction="up" delay={0.3}>
            <Link
              href="/contacto"
              className="inline-block bg-amber-500 text-black px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-amber-400 transition-colors btn-hover"
            >
              {siteSettings.nav.contact[locale]}
            </Link>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
