import {useTranslations, useLocale} from 'next-intl';
import {artists} from '@/lib/data/artists';
import {notFound} from 'next/navigation';
import {Link} from '@/i18n/routing';
import {Music, Calendar, Users, Mail, Instagram, Youtube} from 'lucide-react';

export function generateStaticParams() {
  return artists.map((artist) => ({
    slug: artist.slug,
  }));
}

export default async function ArtistaPage({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;
  const t = useTranslations();
  const locale = useLocale() as 'es' | 'en' | 'fr';
  
  const artist = artists.find((a) => a.slug === slug);

  if (!artist) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                {artist.genre === 'salsa' ? t('artists.salsa') : t('artists.reggaeton')}
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                {artist.name}
              </h1>
              <p className="text-xl text-red-100 mb-8">
                {artist.bio[locale]}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  {t('artists.contact')}
                </Link>
                {artist.instagram && (
                  <a
                    href={artist.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
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
                    className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                  >
                    <Youtube className="w-5 h-5" />
                    YouTube
                  </a>
                )}
              </div>
            </div>

            <div className="relative h-96 bg-white/10 rounded-2xl backdrop-blur flex items-center justify-center">
              <Music className="w-48 h-48 text-white/30" />
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Detalles del Artista
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {t('artists.available')}
                </h3>
                <p className="text-gray-600">{artist.availability}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Equipo de Viaje
                </h3>
                <p className="text-gray-600">
                  {artist.travelParty} personas (artista + banda)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <Music className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {t('artists.genre')}
                </h3>
                <p className="text-gray-600">
                  {artist.genre === 'salsa' ? t('artists.salsa') : t('artists.reggaeton')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Quieres contratar a {artist.name}?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Contáctanos para recibir más información, EPK y presupuesto
          </p>
          <Link
            href="/contacto"
            className="inline-block bg-white text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-50 transition-colors"
          >
            Solicitar Información
          </Link>
        </div>
      </div>
    </div>
  );
}
