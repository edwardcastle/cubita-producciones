import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { getArtists, getArtistsPage, getSiteSettings, generateMetadataFromSEO, buildAlternates } from '@/lib/content';
import { stripMarkdown, artistImageAlt } from '@/lib/utils';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Music, Calendar, Users } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer';
import { ArtistsListJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

type Locale = 'es' | 'en' | 'fr' | 'it';

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;

  const fallbacks: Record<Locale, { title: string; description: string }> = {
    es: { title: 'Catálogo de Artistas Cubanos para Booking en Europa | Cubita Producciones', description: 'Catálogo de artistas cubanos disponibles para booking. Contratar artistas de salsa y reguetón para festivales y eventos en Europa: Jacob Forever, Manolín, El Micha, Charly & Johayron.' },
    en: { title: 'Cuban Artists Roster — Available to Book in Europe | Cubita Producciones', description: 'Browse Cuban artists available for booking. Book salsa and reggaeton artists for festivals and events in Europe: Jacob Forever, Manolín, El Micha, Charly & Johayron.' },
    fr: { title: 'Catalogue d\'Artistes Cubains pour Booking en Europe | Cubita Producciones', description: 'Catalogue d\'artistes cubains disponibles pour booking. Réservez des artistes de salsa et reggaeton pour festivals et événements en Europe: Jacob Forever, Manolín, El Micha, Charly & Johayron.' },
    it: { title: 'Catalogo di Artisti Cubani per Booking in Europa | Cubita Producciones', description: 'Catalogo di artisti cubani disponibili per booking. Prenota artisti di salsa e reggaeton per festival ed eventi in Europa: Jacob Forever, Manolín, El Micha, Charly & Johayron.' },
  };

  try {
    const pageContent = await getArtistsPage();
    return generateMetadataFromSEO(pageContent.seo, locale, fallbacks[locale], '/artistas');
  } catch {
    return { ...fallbacks[locale], alternates: buildAlternates(locale, '/artistas') };
  }
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

  // Keyword-rich H1 (the short pageContent.title stays in the breadcrumb + JSON-LD).
  const h1Heading: Record<Locale, string> = {
    es: 'Artistas Cubanos Disponibles para Booking en Europa',
    en: 'Cuban Artists Available for Booking in Europe',
    fr: 'Artistes Cubains Disponibles pour Booking en Europe',
    it: 'Artisti Cubani Disponibili per Booking in Europa',
  };

  const baseUrl = 'https://cubitaproducciones.com';
  const breadcrumbSchemaItems = [
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: pageContent.title[locale], url: `${baseUrl}/${locale}/artistas` },
  ];

  return (
    <>
    <ArtistsListJsonLd artists={artists} locale={locale} />
    <BreadcrumbJsonLd items={breadcrumbSchemaItems} />
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-black to-gray-800 text-white py-10 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-3">
            <Breadcrumbs variant="dark" items={[
              { label: 'Home', href: '/' },
              { label: pageContent.title[locale] },
            ]} />
          </div>
          <FadeIn direction="down" eager>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">
              {h1Heading[locale]}
            </h1>
          </FadeIn>
          <FadeIn direction="down" delay={0.15}>
            <p className="text-base md:text-xl text-gray-300">{pageContent.subtitle[locale]}</p>
          </FadeIn>
        </div>
      </header>

      {/* Artists Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-16">
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6" staggerDelay={0.1} eager>
          {artists.map((artist, index) => (
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
                      alt={artistImageAlt(locale, artist.name, artist.genre === 'salsa' ? pageContent.salsaLabel[locale] : pageContent.reggaetonLabel[locale])}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
                      priority={index < 3}
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
                  <h2 className="text-base md:text-xl font-bold text-gray-900 mb-0.5 md:mb-1 truncate">{artist.name}</h2>

                  <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-3 line-clamp-1 md:line-clamp-2">{stripMarkdown(artist.bio[locale])}</p>

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
    </>
  );
}
