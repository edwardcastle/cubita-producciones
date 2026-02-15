import { getLocale } from 'next-intl/server';
import { Mail, Phone, MapPin } from 'lucide-react';
import { getContactPage, getArtists } from '@/lib/strapi';
import ContactForm from '@/components/ContactForm';

type Locale = 'es' | 'en' | 'fr';

export default async function ContactoPage() {
  const locale = (await getLocale()) as Locale;
  const [pageContent, artists] = await Promise.all([getContactPage(), getArtists()]);

  const sendingTexts: Record<Locale, string> = {
    es: 'Enviando...',
    en: 'Sending...',
    fr: 'Envoi en cours...',
  };

  const selectPlaceholders: Record<Locale, string> = {
    es: 'Seleccionar artista...',
    en: 'Select artist...',
    fr: 'Sélectionner un artiste...',
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

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-red-100 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">{pageContent.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="bg-red-100 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {locale === 'es' ? 'Teléfono' : locale === 'en' ? 'Phone' : 'Téléphone'}
                  </h3>
                  <p className="text-gray-600">{pageContent.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {locale === 'es' ? 'Ubicación' : locale === 'en' ? 'Location' : 'Emplacement'}
                  </h3>
                  <p className="text-gray-600">{pageContent.location}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-600 to-orange-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">
                {pageContent.responseTimeTitle[locale]}
              </h3>
              <p className="text-red-100">{pageContent.responseTimeText[locale]}</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <ContactForm
                artists={artists.map((a) => ({ id: a.id, name: a.name }))}
                labels={{
                  name: pageContent.formLabels.name[locale],
                  email: pageContent.formLabels.email[locale],
                  country: pageContent.formLabels.country[locale],
                  date: pageContent.formLabels.date[locale],
                  artist: pageContent.formLabels.artist[locale],
                  message: pageContent.formLabels.message[locale],
                  submit: pageContent.formLabels.submit[locale],
                }}
                successMessage={pageContent.successMessage[locale]}
                errorMessage={pageContent.errorMessage[locale]}
                sendingText={sendingTexts[locale]}
                selectArtistPlaceholder={selectPlaceholders[locale]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
