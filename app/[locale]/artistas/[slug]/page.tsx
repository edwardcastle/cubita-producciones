import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { getArtistBySlug, getAllArtistSlugs, getArtistsPage, generateMetadataFromSEO } from '@/lib/strapi';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { Music, Calendar, Users, Mail, Instagram, Youtube, ArrowLeft } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer';

type Locale = 'es' | 'en' | 'fr' | 'it';

export async function generateStaticParams() {
  const slugs = await getAllArtistSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const artist = await getArtistBySlug(slug);

  if (!artist) {
    return {
      title: 'Artista no encontrado - Cubita Producciones',
    };
  }

  return generateMetadataFromSEO(artist.seo, locale, {
    title: `${artist.name} - Cubita Producciones`,
    description: artist.bio[locale]?.slice(0, 160) || `Booking de ${artist.name}, artista cubano de ${artist.genre}.`,
  });
}

export default async function ArtistaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = (await getLocale()) as Locale;
  const [artist, pageContent] = await Promise.all([
    getArtistBySlug(slug),
    getArtistsPage(),
  ]);

  if (!artist) {
    notFound();
  }

  const texts: Record<Locale, {
    backToArtists: string;
    contact: string;
    biography: string;
    details: string;
    availability: string;
    availableFor: string;
    travelTeam: string;
    travelTeamDesc: string;
    genre: string;
    cta: string;
    ctaText: string;
    ctaButton: string;
  }> = {
    es: {
      backToArtists: 'Volver a Artistas',
      contact: 'Solicitar Booking',
      biography: 'Biografia',
      details: 'Informacion de Booking',
      availability: 'Disponibilidad Europa 2025',
      availableFor: 'Disponible para festivales y eventos',
      travelTeam: 'Equipo de Viaje',
      travelTeamDesc: 'personas',
      genre: 'Genero Musical',
      cta: 'Interesado en',
      ctaText: 'Contactanos para recibir el EPK completo, rider tecnico y presupuesto personalizado',
      ctaButton: 'Solicitar Informacion',
    },
    en: {
      backToArtists: 'Back to Artists',
      contact: 'Request Booking',
      biography: 'Biography',
      details: 'Booking Information',
      availability: 'Europe Availability 2025',
      availableFor: 'Available for festivals and events',
      travelTeam: 'Travel Party',
      travelTeamDesc: 'people',
      genre: 'Music Genre',
      cta: 'Interested in',
      ctaText: 'Contact us to receive the complete EPK, technical rider and personalized quote',
      ctaButton: 'Request Information',
    },
    fr: {
      backToArtists: 'Retour aux Artistes',
      contact: 'Demander Reservation',
      biography: 'Biographie',
      details: 'Informations de Reservation',
      availability: 'Disponibilite Europe 2025',
      availableFor: 'Disponible pour festivals et evenements',
      travelTeam: 'Equipe de Voyage',
      travelTeamDesc: 'personnes',
      genre: 'Genre Musical',
      cta: 'Interesse par',
      ctaText: 'Contactez-nous pour recevoir l\'EPK complet, le rider technique et un devis personnalise',
      ctaButton: 'Demander des Informations',
    },
    it: {
      backToArtists: 'Torna agli Artisti',
      contact: 'Richiedi Prenotazione',
      biography: 'Biografia',
      details: 'Informazioni di Prenotazione',
      availability: 'Disponibilita Europa 2025',
      availableFor: 'Disponibile per festival ed eventi',
      travelTeam: 'Team di Viaggio',
      travelTeamDesc: 'persone',
      genre: 'Genere Musicale',
      cta: 'Interessato a',
      ctaText: 'Contattaci per ricevere l\'EPK completo, il rider tecnico e un preventivo personalizzato',
      ctaButton: 'Richiedi Informazioni',
    },
  };

  const t = texts[locale];
  const genreLabel = artist.genre === 'salsa' ? pageContent.salsaLabel[locale] : pageContent.reggaetonLabel[locale];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          {artist.image && (
            <Image
              src={artist.image}
              alt={artist.name}
              fill
              className="object-cover opacity-30"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-4 md:py-8">
          {/* Back Link */}
          <FadeIn direction="down">
            <Link
              href="/artistas"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-4 md:mb-8 text-sm md:text-base"
            >
              <ArrowLeft className="w-3 h-3 md:w-4 md:h-4" />
              {t.backToArtists}
            </Link>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center py-4 md:py-8">
            {/* Artist Info */}
            <div>
              <FadeIn direction="left" delay={0.1}>
                <div className="inline-block bg-black px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-6">
                  {genreLabel}
                </div>
              </FadeIn>
              <FadeIn direction="left" delay={0.2}>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-3 md:mb-6">{artist.name}</h1>
              </FadeIn>

              {/* Quick Stats */}
              <FadeIn direction="left" delay={0.3}>
                <div className="flex flex-wrap gap-3 md:gap-6 mb-4 md:mb-8 text-gray-300 text-sm md:text-base">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
                    <span>{artist.availability}</span>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <Users className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
                    <span>{artist.travelParty} {t.travelTeamDesc}</span>
                  </div>
                </div>
              </FadeIn>

              {/* Action Buttons */}
              <FadeIn direction="left" delay={0.4}>
                <div className="flex flex-wrap gap-2 md:gap-4">
                  <Link
                    href="/contacto"
                    className="inline-flex items-center gap-2 bg-amber-500 text-black px-4 py-2 md:px-8 md:py-4 rounded-lg font-semibold text-sm md:text-lg hover:bg-amber-400 transition-colors btn-hover"
                  >
                    <Mail className="w-4 h-4 md:w-5 md:h-5" />
                    {t.contact}
                  </Link>
                  {artist.instagram && (
                    <a
                      href={artist.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 md:gap-2 bg-white/10 backdrop-blur text-white px-3 py-2 md:px-6 md:py-4 rounded-lg font-semibold text-sm md:text-base hover:bg-white/20 transition-colors"
                    >
                      <Instagram className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="hidden sm:inline">Instagram</span>
                    </a>
                  )}
                  {artist.youtube && (
                    <a
                      href={artist.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 md:gap-2 bg-white/10 backdrop-blur text-white px-3 py-2 md:px-6 md:py-4 rounded-lg font-semibold text-sm md:text-base hover:bg-white/20 transition-colors"
                    >
                      <Youtube className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="hidden sm:inline">YouTube</span>
                    </a>
                  )}
                </div>
              </FadeIn>
            </div>

            {/* Artist Image */}
            <FadeIn direction="right" delay={0.3}>
              <div className="relative h-[280px] sm:h-[350px] md:h-[500px] rounded-xl md:rounded-2xl overflow-hidden shadow-2xl img-zoom">
                {artist.image ? (
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                    <Music className="w-16 h-16 md:w-32 md:h-32 text-white/30" />
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12">
          {/* Biography */}
          <div className="lg:col-span-2">
            <FadeIn direction="up">
              <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-6">{t.biography}</h2>
              <div className="prose prose-sm md:prose-lg max-w-none text-gray-600">
                {artist.bio[locale]?.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-3 md:mb-4 text-sm md:text-base">{paragraph}</p>
                )) || (
                  <p className="text-sm md:text-base">{artist.bio[locale]}</p>
                )}
              </div>
            </FadeIn>
          </div>

          {/* Booking Info Sidebar */}
          <StaggerContainer className="space-y-4 md:space-y-6" staggerDelay={0.15}>
            <StaggerItem>
              <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 card-hover">
                <h3 className="text-base md:text-xl font-bold text-gray-900 mb-4 md:mb-6">{t.details}</h3>

                <div className="space-y-4 md:space-y-6">
                  {/* Availability */}
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="bg-gray-100 p-2 md:p-3 rounded-lg shrink-0">
                      <Calendar className="w-4 h-4 md:w-6 md:h-6 text-gray-800" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">{t.availability}</h4>
                      <p className="text-gray-800 font-medium text-xs md:text-base">{artist.availability}</p>
                      <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">{t.availableFor}</p>
                    </div>
                  </div>

                  {/* Travel Party */}
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="bg-gray-100 p-2 md:p-3 rounded-lg shrink-0">
                      <Users className="w-4 h-4 md:w-6 md:h-6 text-gray-800" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">{t.travelTeam}</h4>
                      <p className="text-gray-600 text-xs md:text-base">{artist.travelParty} {t.travelTeamDesc}</p>
                    </div>
                  </div>

                  {/* Genre */}
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="bg-gray-100 p-2 md:p-3 rounded-lg shrink-0">
                      <Music className="w-4 h-4 md:w-6 md:h-6 text-gray-800" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">{t.genre}</h4>
                      <p className="text-gray-600 text-xs md:text-base">{genreLabel}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Button */}
                <Link
                  href="/contacto"
                  className="mt-4 md:mt-6 w-full inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-2.5 md:px-6 md:py-4 rounded-lg font-semibold text-sm md:text-base hover:bg-gray-800 transition-colors btn-hover"
                >
                  <Mail className="w-4 h-4 md:w-5 md:h-5" />
                  {t.contact}
                </Link>
              </div>
            </StaggerItem>

            {/* Social Links Card */}
            {(artist.instagram || artist.youtube) && (
              <StaggerItem>
                <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 card-hover">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">Social Media</h3>
                  <div className="space-y-2 md:space-y-3">
                    {artist.instagram && (
                      <a
                        href={artist.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 md:gap-3 text-gray-600 hover:text-gray-800 transition-colors text-sm md:text-base"
                      >
                        <Instagram className="w-4 h-4 md:w-5 md:h-5" />
                        <span>Instagram</span>
                      </a>
                    )}
                    {artist.youtube && (
                      <a
                        href={artist.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 md:gap-3 text-gray-600 hover:text-gray-800 transition-colors text-sm md:text-base"
                      >
                        <Youtube className="w-4 h-4 md:w-5 md:h-5" />
                        <span>YouTube</span>
                      </a>
                    )}
                  </div>
                </div>
              </StaggerItem>
            )}
          </StaggerContainer>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white py-10 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn direction="up">
            <h2 className="text-xl md:text-4xl font-bold mb-2 md:mb-4">
              {t.cta} {artist.name}?
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={0.15}>
            <p className="text-sm md:text-xl text-gray-300 mb-4 md:mb-8 max-w-2xl mx-auto">{t.ctaText}</p>
          </FadeIn>
          <FadeIn direction="up" delay={0.3}>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 bg-amber-500 text-black px-6 py-3 md:px-10 md:py-5 rounded-lg font-semibold text-sm md:text-lg hover:bg-amber-400 transition-colors shadow-lg btn-hover"
            >
              <Mail className="w-4 h-4 md:w-5 md:h-5" />
              {t.ctaButton}
            </Link>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
