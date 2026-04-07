import { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { Mail, Phone, MapPin } from 'lucide-react';
import { getContactPage, getArtists, generateMetadataFromSEO } from '@/lib/strapi';
import ContactForm from '@/components/ContactForm';
import FadeIn from '@/components/ui/FadeIn';
import { FAQJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

type Locale = 'es' | 'en' | 'fr' | 'it';

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  const pageContent = await getContactPage();

  const fallbacks: Record<Locale, { title: string; description: string }> = {
    es: { title: 'Contacto - Cubita Producciones', description: 'Contacta con Cubita Producciones para booking de artistas cubanos de salsa y reguetón en Europa.' },
    en: { title: 'Contact - Cubita Producciones', description: 'Contact Cubita Producciones for booking Cuban salsa and reggaeton artists in Europe.' },
    fr: { title: 'Contact - Cubita Producciones', description: 'Contactez Cubita Producciones pour réserver des artistes cubains de salsa et reggaeton en Europe.' },
    it: { title: 'Contatti - Cubita Producciones', description: 'Contatta Cubita Producciones per prenotare artisti cubani di salsa e reggaeton in Europa.' },
  };

  return generateMetadataFromSEO(pageContent.seo, locale, fallbacks[locale], '/contacto');
}

export default async function ContactoPage() {
  const locale = (await getLocale()) as Locale;
  const [pageContent, artists] = await Promise.all([getContactPage(), getArtists()]);

  const sendingTexts: Record<Locale, string> = {
    es: 'Enviando...',
    en: 'Sending...',
    fr: 'Envoi en cours...',
    it: 'Invio in corso...',
  };

  const selectPlaceholders: Record<Locale, string> = {
    es: 'Seleccionar artista...',
    en: 'Select artist...',
    fr: 'Selectionner un artiste...',
    it: 'Seleziona artista...',
  };

  const baseUrl = 'https://cubitaproducciones.com';
  const breadcrumbItems = [
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: pageContent.title[locale], url: `${baseUrl}/${locale}/contacto` },
  ];

  return (
    <>
    <FAQJsonLd locale={locale} />
    <BreadcrumbJsonLd items={breadcrumbItems} />
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white py-6 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-3">
            <Breadcrumbs variant="dark" items={[
              { label: 'Home', href: '/' },
              { label: pageContent.title[locale] },
            ]} />
          </div>
          <FadeIn direction="down">
            <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-4">
              {pageContent.title[locale]}
            </h1>
          </FadeIn>
          <FadeIn direction="down" delay={0.15}>
            <p className="text-sm md:text-xl text-gray-300">{pageContent.subtitle[locale]}</p>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-12">
          {/* Contact Info */}
          <div className="space-y-3 md:space-y-6">
            <FadeIn direction="left">
              <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 card-hover">
                <h2 className="sr-only">
                  {locale === 'es' ? 'Información de contacto' : locale === 'en' ? 'Contact information' : locale === 'fr' ? 'Coordonnées' : 'Informazioni di contatto'}
                </h2>
                <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="bg-gray-100 p-2 md:p-3 rounded-lg">
                    <Mail className="w-4 h-4 md:w-6 md:h-6 text-gray-800" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm md:text-base mb-0.5 md:mb-1">Email</p>
                    <p className="text-gray-600 text-xs md:text-base truncate">{pageContent.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="bg-gray-100 p-2 md:p-3 rounded-lg">
                    <Phone className="w-4 h-4 md:w-6 md:h-6 text-gray-800" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm md:text-base mb-0.5 md:mb-1">
                      {locale === 'es' ? 'Telefono' : locale === 'en' ? 'Phone' : locale === 'it' ? 'Telefono' : 'Telephone'}
                    </p>
                    <p className="text-gray-600 text-xs md:text-base">{pageContent.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:gap-4">
                  <div className="bg-gray-100 p-2 md:p-3 rounded-lg">
                    <MapPin className="w-4 h-4 md:w-6 md:h-6 text-gray-800" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm md:text-base mb-0.5 md:mb-1">
                      {locale === 'es' ? 'Ubicacion' : locale === 'en' ? 'Location' : locale === 'it' ? 'Posizione' : 'Emplacement'}
                    </p>
                    <p className="text-gray-600 text-xs md:text-base">{pageContent.location}</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.15}>
              <div className="bg-gradient-to-br from-black to-gray-800 rounded-lg md:rounded-xl p-4 md:p-6 text-white card-hover">
                <p className="text-base md:text-xl font-bold mb-1 md:mb-2">
                  {pageContent.responseTimeTitle[locale]}
                </p>
                <p className="text-gray-300 text-xs md:text-base">{pageContent.responseTimeText[locale]}</p>
              </div>
            </FadeIn>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <FadeIn direction="right">
              <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-8 card-hover">
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
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
