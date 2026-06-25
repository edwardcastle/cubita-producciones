import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { getArtistBySlug, getAllArtistSlugs, getArtistsPage, generateMetadataFromSEO } from '@/lib/content';
import { stripMarkdown, artistImageAlt } from '@/lib/utils';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { Music, Calendar, Users, Mail, Instagram, Youtube, Play } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer';
import { ArtistJsonLd, BreadcrumbJsonLd, ArtistEventsJsonLd, VideoObjectJsonLd } from '@/components/seo/JsonLd';
import { ARTIST_EVENTS } from '@/lib/artist-events';
import { BOOKING_LANDING_SLUGS, type LandingLocale } from '@/lib/booking-landing';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import YouTubeEmbed from '@/components/YouTubeEmbed';
import RichText from '@/components/RichText';

type Locale = 'es' | 'en' | 'fr' | 'it';

// Each artist has a dedicated "how to book" guide in the blog. Linking the artist
// page → its guide (and back) routes internal link equity between the two highest
// commercial-intent page types and rescues the guides from being near-orphans.
const ARTIST_TO_GUIDE_SLUG: Record<string, string> = {
  'manolin': 'como-contratar-manolin-medico-salsa-europa-2026',
  'el-micha': 'como-contratar-el-micha-europa-2026',
  'jacob-forever': 'como-contratar-jacob-forever-europa-2026',
  'charly-johayron': 'como-contratar-charly-johayron-europa-2026',
  'talent-fuego': 'como-contratar-talent-fuego-europa-2026',
  'ja-rulay': 'como-contratar-ja-rulay-europa-2026',
  'wildey': 'como-contratar-wildey-europa-2026',
};

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

  const notFoundTitles: Record<Locale, string> = {
    es: 'Artista no encontrado - Cubita Producciones',
    en: 'Artist not found - Cubita Producciones',
    fr: 'Artiste non trouvé - Cubita Producciones',
    it: 'Artista non trovato - Cubita Producciones',
  };

  let artist;
  try {
    artist = await getArtistBySlug(slug);
  } catch {
    return { title: notFoundTitles[locale] };
  }

  if (!artist) {
    return { title: notFoundTitles[locale] };
  }

  // Drop the quoted suffix from long stage names so the <title> stays near ~60 chars
  // (the full name still appears in the H1 and JSON-LD).
  const shortName = artist.name.split('"')[0].trim() || artist.name;

  const titleFallbacks: Record<Locale, string> = {
    es: `Booking ${shortName} | Festivales y Eventos en Europa`,
    en: `Book ${shortName} | Festivals & Events in Europe`,
    fr: `Booking ${shortName} | Festivals et Événements en Europe`,
    it: `Booking ${shortName} | Festival ed Eventi in Europa`,
  };

  const descriptionFallbacks: Record<Locale, string> = {
    es: `Booking de ${artist.name}, artista cubano de ${artist.genre}. Contratar para festivales, conciertos y eventos privados en Europa. Solicita presupuesto ahora.`,
    en: `Book ${artist.name}, Cuban ${artist.genre} artist. Available for festivals, concerts and private events in Europe. Request a quote now.`,
    fr: `Booking de ${artist.name}, artiste cubain de ${artist.genre}. Disponible pour festivals, concerts et événements privés en Europe. Demandez un devis.`,
    it: `Booking di ${artist.name}, artista cubano di ${artist.genre}. Disponibile per festival, concerti ed eventi privati in Europa. Richiedi un preventivo.`,
  };

  const keywordsFallbacks: Record<Locale, string> = {
    es: `booking ${artist.name}, contratar ${artist.name}, ${artist.name} ${artist.genre}, ${artist.name} Europa, ${artist.name} festivales, artista cubano booking`,
    en: `booking ${artist.name}, book ${artist.name}, hire ${artist.name}, ${artist.name} ${artist.genre}, ${artist.name} Europe, ${artist.name} festivals, Cuban artist booking`,
    fr: `booking ${artist.name}, réserver ${artist.name}, ${artist.name} ${artist.genre}, ${artist.name} Europe, ${artist.name} festivals, artiste cubain booking`,
    it: `booking ${artist.name}, prenotare ${artist.name}, ${artist.name} ${artist.genre}, ${artist.name} Europa, ${artist.name} festival, artista cubano booking`,
  };

  return generateMetadataFromSEO(artist.seo, locale, {
    title: titleFallbacks[locale],
    description: stripMarkdown(artist.bio[locale])?.slice(0, 160) || descriptionFallbacks[locale],
    keywords: keywordsFallbacks[locale],
    image: artist.image ? `https://cubitaproducciones.com${artist.image}` : undefined,
  }, `/artistas/${slug}`);
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
    video: string;
    watchVideo: string;
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
      video: 'Video Destacado',
      watchVideo: 'Ver video de',
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
      video: 'Featured Video',
      watchVideo: 'Watch video of',
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
      video: 'Video en Vedette',
      watchVideo: 'Voir la video de',
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
      video: 'Video in Evidenza',
      watchVideo: 'Guarda il video di',
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
  const baseUrl = 'https://cubitaproducciones.com';

  const bookingSubhead: Record<Locale, string> = {
    es: `Booking de ${artist.name} para festivales y eventos en Europa`,
    en: `Book ${artist.name} for festivals and events in Europe`,
    fr: `Booking de ${artist.name} pour festivals et événements en Europe`,
    it: `Booking di ${artist.name} per festival ed eventi in Europa`,
  };
  const guideLinkLabel: Record<Locale, string> = {
    es: `Cómo contratar a ${artist.name}`,
    en: `How to book ${artist.name}`,
    fr: `Comment réserver ${artist.name}`,
    it: `Come prenotare ${artist.name}`,
  };
  const bookingHubLabel: Record<Locale, string> = {
    es: 'Booking de artistas cubanos en Europa',
    en: 'Cuban artists booking in Europe',
    fr: 'Booking d\'artistes cubains en Europe',
    it: 'Booking di artisti cubani in Europa',
  };
  const guideSlug = ARTIST_TO_GUIDE_SLUG[artist.slug];
  const bookingHubSlug = BOOKING_LANDING_SLUGS[locale as LandingLocale] ?? BOOKING_LANDING_SLUGS.es;

  const breadcrumbItems = [
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: pageContent.title[locale], url: `${baseUrl}/${locale}/artistas` },
    { name: artist.name, url: `${baseUrl}/${locale}/artistas/${artist.slug}` },
  ];

  return (
    <>
      <ArtistJsonLd
        name={artist.name}
        description={stripMarkdown(artist.bio[locale])}
        image={artist.image}
        genre={genreLabel}
        instagram={artist.instagram}
        youtube={artist.youtube}
        url={`${baseUrl}/${locale}/artistas/${artist.slug}`}
      />
      <ArtistEventsJsonLd
        artistName={artist.name}
        artistUrl={`${baseUrl}/${locale}/artistas/${artist.slug}`}
        image={artist.image ? `${baseUrl}${artist.image}` : undefined}
        events={ARTIST_EVENTS[artist.slug] ?? []}
      />
      {artist.youtubeVideoId && (
        <VideoObjectJsonLd
          name={`${artist.name} - ${genreLabel} (Video)`}
          description={`Video oficial de ${artist.name}, artista cubano de ${genreLabel}. Disponible para booking en festivales y eventos en Europa con Cubita Producciones.`}
          thumbnailUrl={`https://i.ytimg.com/vi/${artist.youtubeVideoId}/maxresdefault.jpg`}
          embedUrl={`https://www.youtube.com/embed/${artist.youtubeVideoId}`}
          contentUrl={artist.youtube || `https://www.youtube.com/watch?v=${artist.youtubeVideoId}`}
        />
      )}
      <BreadcrumbJsonLd items={breadcrumbItems} />
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          {artist.image && (
            <Image
              src={artist.image}
              alt=""
              fill
              className="object-cover opacity-30"
              aria-hidden="true"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-gray-900/60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-4 md:py-8">
          {/* Breadcrumbs */}
          <FadeIn direction="down">
            <div className="mb-4 md:mb-8">
              <Breadcrumbs
                variant="dark"
                items={[
                  { label: 'Home', href: '/' },
                  { label: pageContent.title[locale], href: '/artistas' },
                  { label: artist.name },
                ]}
              />
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center py-4 md:py-8">
            {/* Artist Info */}
            <div>
              <FadeIn direction="left" delay={0.1}>
                <div className="inline-block bg-black px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-6">
                  {genreLabel}
                </div>
              </FadeIn>
              <FadeIn direction="left" eager>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-3 md:mb-4">{artist.name}</h1>
              </FadeIn>
              <FadeIn direction="left" delay={0.25}>
                <p className="text-base md:text-xl text-gray-300 mb-4 md:mb-6 max-w-xl">{bookingSubhead[locale]}</p>
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
            <FadeIn direction="right" eager>
              <div className="relative h-[280px] sm:h-[350px] md:h-[500px] rounded-xl md:rounded-2xl overflow-hidden shadow-2xl img-zoom">
                {artist.image ? (
                  <Image
                    src={artist.image}
                    alt={artistImageAlt(locale, artist.name, genreLabel)}
                    fill
                    className="object-cover"
                    priority
                    sizes="(min-width: 1024px) 50vw, (min-width: 640px) 90vw, 100vw"
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
          {/* Biography & Video */}
          <div className="lg:col-span-2 space-y-8 md:space-y-12">
            {/* Biography */}
            <FadeIn direction="up">
              <div>
                <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-6">{t.biography}</h2>
                <RichText content={artist.bio[locale] || ''} />
              </div>
            </FadeIn>

            {/* YouTube Video */}
            {artist.youtubeVideoId && (
              <FadeIn direction="up" delay={0.2}>
                <div>
                  <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-6 flex items-center gap-3">
                    <Play className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
                    {t.video}
                  </h2>
                  <YouTubeEmbed
                    videoId={artist.youtubeVideoId}
                    title={`${t.watchVideo} ${artist.name}`}
                  />
                </div>
              </FadeIn>
            )}
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

                {/* Contextual internal links: the artist's booking guide + the booking hub */}
                {guideSlug && (
                  <Link
                    href={`/blog/${guideSlug}`}
                    className="mt-3 block text-center text-sm font-semibold text-amber-700 hover:text-amber-600 underline"
                  >
                    {guideLinkLabel[locale]}
                  </Link>
                )}
                <a
                  href={`/${locale}/${bookingHubSlug}`}
                  className="mt-2 block text-center text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  {bookingHubLabel[locale]}
                </a>
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
    </>
  );
}
