import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { getArtistBySlug, getAllArtistSlugs, getArtistsPage, generateMetadataFromSEO } from '@/lib/strapi';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { Music, Calendar, Users, Mail, Instagram, Youtube, ArrowLeft } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer';

type Locale = 'es' | 'en' | 'fr';

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

        <div className="relative max-w-7xl mx-auto px-4 py-8">
          {/* Back Link */}
          <FadeIn direction="down">
            <Link
              href="/artistas"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.backToArtists}
            </Link>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-8">
            {/* Artist Info */}
            <div>
              <FadeIn direction="left" delay={0.1}>
                <div className="inline-block bg-black px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  {genreLabel}
                </div>
              </FadeIn>
              <FadeIn direction="left" delay={0.2}>
                <h1 className="text-5xl md:text-7xl font-bold mb-6">{artist.name}</h1>
              </FadeIn>

              {/* Quick Stats */}
              <FadeIn direction="left" delay={0.3}>
                <div className="flex flex-wrap gap-6 mb-8 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-500" />
                    <span>{artist.availability}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-500" />
                    <span>{artist.travelParty} {t.travelTeamDesc}</span>
                  </div>
                </div>
              </FadeIn>

              {/* Action Buttons */}
              <FadeIn direction="left" delay={0.4}>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/contacto"
                    className="inline-flex items-center gap-2 bg-amber-500 text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-amber-400 transition-colors btn-hover"
                  >
                    <Mail className="w-5 h-5" />
                    {t.contact}
                  </Link>
                  {artist.instagram && (
                    <a
                      href={artist.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white px-6 py-4 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                      Instagram
                    </a>
                  )}
                  {artist.youtube && (
                    <a
                      href={artist.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white/10 backdrop-blur text-white px-6 py-4 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                    >
                      <Youtube className="w-5 h-5" />
                      YouTube
                    </a>
                  )}
                </div>
              </FadeIn>
            </div>

            {/* Artist Image */}
            <FadeIn direction="right" delay={0.3}>
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl img-zoom">
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
                    <Music className="w-32 h-32 text-white/30" />
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Biography */}
          <div className="lg:col-span-2">
            <FadeIn direction="up">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.biography}</h2>
              <div className="prose prose-lg max-w-none text-gray-600">
                {artist.bio[locale]?.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                )) || (
                  <p>{artist.bio[locale]}</p>
                )}
              </div>
            </FadeIn>
          </div>

          {/* Booking Info Sidebar */}
          <StaggerContainer className="space-y-6" staggerDelay={0.15}>
            <StaggerItem>
              <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{t.details}</h3>

                <div className="space-y-6">
                  {/* Availability */}
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-3 rounded-lg shrink-0">
                      <Calendar className="w-6 h-6 text-gray-800" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{t.availability}</h4>
                      <p className="text-gray-800 font-medium">{artist.availability}</p>
                      <p className="text-sm text-gray-500 mt-1">{t.availableFor}</p>
                    </div>
                  </div>

                  {/* Travel Party */}
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-3 rounded-lg shrink-0">
                      <Users className="w-6 h-6 text-gray-800" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{t.travelTeam}</h4>
                      <p className="text-gray-600">{artist.travelParty} {t.travelTeamDesc}</p>
                    </div>
                  </div>

                  {/* Genre */}
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-100 p-3 rounded-lg shrink-0">
                      <Music className="w-6 h-6 text-gray-800" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{t.genre}</h4>
                      <p className="text-gray-600">{genreLabel}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Button */}
                <Link
                  href="/contacto"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors btn-hover"
                >
                  <Mail className="w-5 h-5" />
                  {t.contact}
                </Link>
              </div>
            </StaggerItem>

            {/* Social Links Card */}
            {(artist.instagram || artist.youtube) && (
              <StaggerItem>
                <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Social Media</h3>
                  <div className="space-y-3">
                    {artist.instagram && (
                      <a
                        href={artist.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <Instagram className="w-5 h-5" />
                        <span>Instagram</span>
                      </a>
                    )}
                    {artist.youtube && (
                      <a
                        href={artist.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <Youtube className="w-5 h-5" />
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
      <div className="bg-gradient-to-r from-black to-gray-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn direction="up">
            <h2 className="text-4xl font-bold mb-4">
              {t.cta} {artist.name}?
            </h2>
          </FadeIn>
          <FadeIn direction="up" delay={0.15}>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">{t.ctaText}</p>
          </FadeIn>
          <FadeIn direction="up" delay={0.3}>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 bg-amber-500 text-black px-10 py-5 rounded-lg font-semibold text-lg hover:bg-amber-400 transition-colors shadow-lg btn-hover"
            >
              <Mail className="w-5 h-5" />
              {t.ctaButton}
            </Link>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
