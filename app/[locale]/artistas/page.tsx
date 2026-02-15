import { getLocale } from 'next-intl/server';
import { getArtists, getArtistsPage, getSiteSettings } from '@/lib/strapi';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { Music, Calendar, Users } from 'lucide-react';

type Locale = 'es' | 'en' | 'fr';

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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {pageContent.title[locale]}
          </h1>
          <p className="text-xl text-red-100">{pageContent.subtitle[locale]}</p>
        </div>
      </div>

      {/* Artists Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Artist Image */}
              <div className="relative h-64 bg-gradient-to-br from-red-100 to-orange-100">
                {artist.image ? (
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Music className="w-24 h-24 text-red-300" />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-red-600">
                  {artist.genre === 'salsa'
                    ? pageContent.salsaLabel[locale]
                    : pageContent.reggaetonLabel[locale]}
                </div>
              </div>

              {/* Artist Info */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{artist.name}</h3>

                <p className="text-gray-600 mb-4 line-clamp-3">{artist.bio[locale]}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-red-600" />
                    <span>{artist.availability}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 text-red-600" />
                    <span>
                      {artist.travelParty} {personasText[locale]}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/artistas/${artist.slug}`}
                  className="block w-full text-center bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  {pageContent.viewDetailsButton[locale]}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{pageContent.ctaTitle[locale]}</h2>
          <p className="text-xl text-gray-300 mb-8">{pageContent.ctaSubtitle[locale]}</p>
          <Link
            href="/contacto"
            className="inline-block bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors"
          >
            {siteSettings.nav.contact[locale]}
          </Link>
        </div>
      </div>
    </div>
  );
}
