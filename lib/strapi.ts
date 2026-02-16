import { cache } from 'react';

const STRAPI_URL = process.env.STRAPI_URL || 'https://natural-dinosaurs-5b6cbd810f.strapiapp.com';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// ============ TYPES ============

export interface StrapiImage {
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
}

export interface Artist {
  id: string;
  name: string;
  slug: string;
  genre: 'salsa' | 'reggaeton';
  bio: {
    es: string;
    en: string;
    fr: string;
    it: string;
  };
  availability: string;
  image: string | null;
  instagram?: string;
  youtube?: string;
  travelParty: number;
  seo: SEO | null;
}

export interface HomePage {
  heroTitle: { es: string; en: string; fr: string; it: string };
  heroSubtitle: { es: string; en: string; fr: string; it: string };
  stats: {
    years: number;
    artists: number;
    festivals: number;
    countries: number;
  };
  aboutTitle: { es: string; en: string; fr: string; it: string };
  aboutText: { es: string; en: string; fr: string; it: string };
  ctaText: { es: string; en: string; fr: string; it: string };
  seo: SEO | null;
}

export interface AboutPage {
  title: { es: string; en: string; fr: string; it: string };
  subtitle: { es: string; en: string; fr: string; it: string };
  missionTitle: { es: string; en: string; fr: string; it: string };
  missionText: { es: string; en: string; fr: string; it: string };
  stats: {
    years: number;
    festivals: number;
    countries: number;
    artists: number;
  };
  services: Array<{
    title: { es: string; en: string; fr: string; it: string };
    text: { es: string; en: string; fr: string; it: string };
  }>;
  seo: SEO | null;
}

export interface ContactPage {
  title: { es: string; en: string; fr: string; it: string };
  subtitle: { es: string; en: string; fr: string; it: string };
  email: string;
  phone: string;
  location: string;
  responseTimeTitle: { es: string; en: string; fr: string; it: string };
  responseTimeText: { es: string; en: string; fr: string; it: string };
  formLabels: {
    name: { es: string; en: string; fr: string; it: string };
    email: { es: string; en: string; fr: string; it: string };
    country: { es: string; en: string; fr: string; it: string };
    date: { es: string; en: string; fr: string; it: string };
    artist: { es: string; en: string; fr: string; it: string };
    message: { es: string; en: string; fr: string; it: string };
    submit: { es: string; en: string; fr: string; it: string };
  };
  successMessage: { es: string; en: string; fr: string; it: string };
  errorMessage: { es: string; en: string; fr: string; it: string };
  seo: SEO | null;
}

export interface ArtistsPage {
  title: { es: string; en: string; fr: string; it: string };
  subtitle: { es: string; en: string; fr: string; it: string };
  viewDetailsButton: { es: string; en: string; fr: string; it: string };
  ctaTitle: { es: string; en: string; fr: string; it: string };
  ctaSubtitle: { es: string; en: string; fr: string; it: string };
  salsaLabel: { es: string; en: string; fr: string; it: string };
  reggaetonLabel: { es: string; en: string; fr: string; it: string };
  seo: SEO | null;
}

export interface SiteSettings {
  companyName: string;
  logo: string | null;
  email: string;
  phone: string;
  location: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  nav: {
    home: { es: string; en: string; fr: string; it: string };
    artists: { es: string; en: string; fr: string; it: string };
    about: { es: string; en: string; fr: string; it: string };
    contact: { es: string; en: string; fr: string; it: string };
  };
  footerDescription: { es: string; en: string; fr: string; it: string };
  footerCopyright: { es: string; en: string; fr: string; it: string };
}

export interface SEO {
  metaTitle: { es: string; en: string; fr: string; it: string };
  metaDescription: { es: string; en: string; fr: string; it: string };
  keywords: string | null;
  ogImage: string | null;
  canonicalUrl: string | null;
  noIndex: boolean;
}

export interface PageWithSEO {
  seo: SEO | null;
}

const BASE_URL = 'https://cubitaproducciones.com';
const LOCALES = ['es', 'en', 'fr', 'it'] as const;

// Helper to generate metadata from SEO data
export function generateMetadataFromSEO(
  seo: SEO | null,
  locale: 'es' | 'en' | 'fr' | 'it',
  fallback: { title: string; description: string },
  path: string = ''
): {
  title: string;
  description: string;
  keywords?: string;
  openGraph?: {
    title: string;
    description: string;
    url: string;
    type: string;
    siteName: string;
    locale: string;
    images?: Array<{ url: string; width: number; height: number; alt: string }>;
  };
  twitter?: {
    card: string;
    title: string;
    description: string;
    images?: string[];
  };
  robots?: { index: boolean; follow: boolean; googleBot?: { index: boolean; follow: boolean; 'max-image-preview': 'none' | 'standard' | 'large'; 'max-snippet': number } };
  alternates?: { canonical: string; languages: Record<string, string> };
} {
  const title = seo?.metaTitle[locale] || fallback.title;
  const description = seo?.metaDescription[locale] || fallback.description;
  const pageUrl = `${BASE_URL}/${locale}${path}`;
  const ogImage = seo?.ogImage || `${BASE_URL}/og-image.jpg`;

  const metadata: ReturnType<typeof generateMetadataFromSEO> = {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: 'website',
      siteName: 'Cubita Producciones',
      locale,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: seo?.canonicalUrl || pageUrl,
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `${BASE_URL}/${l}${path}`])
      ),
    },
  };

  if (seo?.keywords) {
    metadata.keywords = seo.keywords;
  }

  if (seo?.noIndex) {
    metadata.robots = {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
        'max-image-preview': 'none' as const,
        'max-snippet': 0,
      },
    };
  } else {
    metadata.robots = {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large' as const,
        'max-snippet': -1,
      },
    };
  }

  return metadata;
}

// ============ FETCH HELPER ============

async function fetchStrapi<T>(endpoint: string): Promise<T | null> {
  const url = `${STRAPI_URL}/api${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (STRAPI_API_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
  }

  try {
    const response = await fetch(url, {
      headers,
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error(`Strapi fetch error: ${response.status} ${response.statusText}`);
      return null;
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error('Strapi fetch error:', error);
    return null;
  }
}

function getImageUrl(image: StrapiImage | null): string | null {
  if (!image?.url) return null;
  return image.url.startsWith('http') ? image.url : `${STRAPI_URL}${image.url}`;
}

function formatAvailability(start: string | null, end: string | null): string {
  if (!start || !end) return 'Por confirmar / TBC / À confirmer';

  const startDate = new Date(start);
  const endDate = new Date(end);

  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
  const startEs = startDate.toLocaleDateString('es-ES', options);
  const endEs = endDate.toLocaleDateString('es-ES', options);
  const year = endDate.getFullYear();

  return `${startEs} - ${endEs} ${year}`;
}

function parseSEO(seoData: any): SEO | null {
  if (!seoData) return null;

  return {
    metaTitle: {
      es: seoData.metaTitleEs || '',
      en: seoData.metaTitleEn || '',
      fr: seoData.metaTitleFr || '',
      it: seoData.metaTitleIt || '',
    },
    metaDescription: {
      es: seoData.metaDescriptionEs || '',
      en: seoData.metaDescriptionEn || '',
      fr: seoData.metaDescriptionFr || '',
      it: seoData.metaDescriptionIt || '',
    },
    keywords: seoData.keywords || null,
    ogImage: getImageUrl(seoData.ogImage),
    canonicalUrl: seoData.canonicalUrl || null,
    noIndex: seoData.noIndex || false,
  };
}

// ============ DATA FETCHERS ============

export const getArtists = cache(async (): Promise<Artist[]> => {
  const data = await fetchStrapi<any[]>('/artists?populate=*&sort=name:asc');

  if (!data) return [];

  return data.map((item) => ({
    id: item.documentId || String(item.id),
    name: item.name || '',
    slug: item.slug || '',
    genre: item.genre || 'salsa',
    bio: {
      es: item.bioEs || '',
      en: item.bioEn || '',
      fr: item.bioFr || '',
      it: item.bioIt || '',
    },
    availability: formatAvailability(item.availabilityStart, item.availabilityEnd),
    image: getImageUrl(item.image),
    instagram: item.instagram || undefined,
    youtube: item.youtube || undefined,
    travelParty: item.travelParty || 0,
    seo: parseSEO(item.seo),
  }));
});

export const getArtistBySlug = cache(async (slug: string): Promise<Artist | null> => {
  const data = await fetchStrapi<any[]>(`/artists?filters[slug][$eq]=${slug}&populate=*`);

  if (!data || data.length === 0) return null;

  const item = data[0];
  return {
    id: item.documentId || String(item.id),
    name: item.name || '',
    slug: item.slug || '',
    genre: item.genre || 'salsa',
    bio: {
      es: item.bioEs || '',
      en: item.bioEn || '',
      fr: item.bioFr || '',
      it: item.bioIt || '',
    },
    availability: formatAvailability(item.availabilityStart, item.availabilityEnd),
    image: getImageUrl(item.image),
    instagram: item.instagram || undefined,
    youtube: item.youtube || undefined,
    travelParty: item.travelParty || 0,
    seo: parseSEO(item.seo),
  };
});

export const getAllArtistSlugs = cache(async (): Promise<string[]> => {
  const data = await fetchStrapi<any[]>('/artists?fields[0]=slug');
  if (!data) return [];
  return data.map((item) => item.slug).filter(Boolean);
});

export const getHomePage = cache(async (): Promise<HomePage> => {
  const data = await fetchStrapi<any>('/home-page?populate=*');

  const defaults: HomePage = {
    heroTitle: { es: 'Booking de Artistas Cubanos', en: 'Cuban Artists Booking', fr: 'Réservation d\'Artistes Cubains', it: 'Prenotazione Artisti Cubani' },
    heroSubtitle: { es: 'Conectamos el talento cubano con el mundo', en: 'Connecting Cuban talent with the world', fr: 'Connecter le talent cubain avec le monde', it: 'Colleghiamo il talento cubano con il mondo' },
    stats: { years: 30, artists: 50, festivals: 100, countries: 15 },
    aboutTitle: { es: 'Sobre Nosotros', en: 'About Us', fr: 'À Propos', it: 'Chi Siamo' },
    aboutText: { es: 'Somos una agencia de booking especializada en artistas cubanos.', en: 'We are a booking agency specialized in Cuban artists.', fr: 'Nous sommes une agence de booking spécialisée dans les artistes cubains.', it: 'Siamo un\'agenzia di booking specializzata in artisti cubani.' },
    ctaText: { es: 'Ver Artistas', en: 'View Artists', fr: 'Voir les Artistes', it: 'Vedi Artisti' },
    seo: null,
  };

  if (!data) return defaults;

  return {
    heroTitle: {
      es: data.heroTitleEs || defaults.heroTitle.es,
      en: data.heroTitleEn || defaults.heroTitle.en,
      fr: data.heroTitleFr || defaults.heroTitle.fr,
      it: data.heroTitleIt || defaults.heroTitle.it,
    },
    heroSubtitle: {
      es: data.heroSubtitleEs || defaults.heroSubtitle.es,
      en: data.heroSubtitleEn || defaults.heroSubtitle.en,
      fr: data.heroSubtitleFr || defaults.heroSubtitle.fr,
      it: data.heroSubtitleIt || defaults.heroSubtitle.it,
    },
    stats: {
      years: data.statsYears || defaults.stats.years,
      artists: data.statsArtists || defaults.stats.artists,
      festivals: data.statsFestivals || defaults.stats.festivals,
      countries: data.statsCountries || defaults.stats.countries,
    },
    aboutTitle: {
      es: data.aboutTitleEs || defaults.aboutTitle.es,
      en: data.aboutTitleEn || defaults.aboutTitle.en,
      fr: data.aboutTitleFr || defaults.aboutTitle.fr,
      it: data.aboutTitleIt || defaults.aboutTitle.it,
    },
    aboutText: {
      es: data.aboutTextEs || defaults.aboutText.es,
      en: data.aboutTextEn || defaults.aboutText.en,
      fr: data.aboutTextFr || defaults.aboutText.fr,
      it: data.aboutTextIt || defaults.aboutText.it,
    },
    ctaText: {
      es: data.ctaTextEs || defaults.ctaText.es,
      en: data.ctaTextEn || defaults.ctaText.en,
      fr: data.ctaTextFr || defaults.ctaText.fr,
      it: data.ctaTextIt || defaults.ctaText.it,
    },
    seo: parseSEO(data.seo),
  };
});

export const getAboutPage = cache(async (): Promise<AboutPage> => {
  const data = await fetchStrapi<any>('/about-page?populate=*');

  const defaults: AboutPage = {
    title: { es: 'Sobre Nosotros', en: 'About Us', fr: 'À Propos', it: 'Chi Siamo' },
    subtitle: { es: 'Más de 30 años de experiencia', en: 'Over 30 years of experience', fr: 'Plus de 30 ans d\'expérience', it: 'Oltre 30 anni di esperienza' },
    missionTitle: { es: 'Nuestra Misión', en: 'Our Mission', fr: 'Notre Mission', it: 'La Nostra Missione' },
    missionText: { es: 'Conectar el talento cubano con escenarios de todo el mundo.', en: 'Connecting Cuban talent with stages around the world.', fr: 'Connecter le talent cubain avec les scènes du monde entier.', it: 'Collegare il talento cubano con i palcoscenici di tutto il mondo.' },
    stats: { years: 30, festivals: 100, countries: 15, artists: 50 },
    services: [
      { title: { es: 'Booking', en: 'Booking', fr: 'Réservation', it: 'Prenotazione' }, text: { es: 'Gestión completa de contrataciones', en: 'Complete booking management', fr: 'Gestion complète des réservations', it: 'Gestione completa delle prenotazioni' } },
      { title: { es: 'Producción', en: 'Production', fr: 'Production', it: 'Produzione' }, text: { es: 'Producción de eventos y conciertos', en: 'Event and concert production', fr: 'Production d\'événements et concerts', it: 'Produzione di eventi e concerti' } },
      { title: { es: 'Tours', en: 'Tours', fr: 'Tournées', it: 'Tour' }, text: { es: 'Organización de giras internacionales', en: 'International tour organization', fr: 'Organisation de tournées internationales', it: 'Organizzazione di tour internazionali' } },
    ],
    seo: null,
  };

  if (!data) return defaults;

  return {
    title: {
      es: data.titleEs || defaults.title.es,
      en: data.titleEn || defaults.title.en,
      fr: data.titleFr || defaults.title.fr,
      it: data.titleIt || defaults.title.it,
    },
    subtitle: {
      es: data.subtitleEs || defaults.subtitle.es,
      en: data.subtitleEn || defaults.subtitle.en,
      fr: data.subtitleFr || defaults.subtitle.fr,
      it: data.subtitleIt || defaults.subtitle.it,
    },
    missionTitle: {
      es: data.missionTitleEs || defaults.missionTitle.es,
      en: data.missionTitleEn || defaults.missionTitle.en,
      fr: data.missionTitleFr || defaults.missionTitle.fr,
      it: data.missionTitleIt || defaults.missionTitle.it,
    },
    missionText: {
      es: data.missionTextEs || defaults.missionText.es,
      en: data.missionTextEn || defaults.missionText.en,
      fr: data.missionTextFr || defaults.missionText.fr,
      it: data.missionTextIt || defaults.missionText.it,
    },
    stats: {
      years: data.statsYears || defaults.stats.years,
      festivals: data.statsFestivals || defaults.stats.festivals,
      countries: data.statsCountries || defaults.stats.countries,
      artists: data.statsArtists || defaults.stats.artists,
    },
    services: [
      {
        title: { es: data.service1TitleEs || defaults.services[0].title.es, en: data.service1TitleEn || defaults.services[0].title.en, fr: data.service1TitleFr || defaults.services[0].title.fr, it: data.service1TitleIt || defaults.services[0].title.it },
        text: { es: data.service1TextEs || defaults.services[0].text.es, en: data.service1TextEn || defaults.services[0].text.en, fr: data.service1TextFr || defaults.services[0].text.fr, it: data.service1TextIt || defaults.services[0].text.it },
      },
      {
        title: { es: data.service2TitleEs || defaults.services[1].title.es, en: data.service2TitleEn || defaults.services[1].title.en, fr: data.service2TitleFr || defaults.services[1].title.fr, it: data.service2TitleIt || defaults.services[1].title.it },
        text: { es: data.service2TextEs || defaults.services[1].text.es, en: data.service2TextEn || defaults.services[1].text.en, fr: data.service2TextFr || defaults.services[1].text.fr, it: data.service2TextIt || defaults.services[1].text.it },
      },
      {
        title: { es: data.service3TitleEs || defaults.services[2].title.es, en: data.service3TitleEn || defaults.services[2].title.en, fr: data.service3TitleFr || defaults.services[2].title.fr, it: data.service3TitleIt || defaults.services[2].title.it },
        text: { es: data.service3TextEs || defaults.services[2].text.es, en: data.service3TextEn || defaults.services[2].text.en, fr: data.service3TextFr || defaults.services[2].text.fr, it: data.service3TextIt || defaults.services[2].text.it },
      },
    ],
    seo: parseSEO(data.seo),
  };
});

export const getContactPage = cache(async (): Promise<ContactPage> => {
  const data = await fetchStrapi<any>('/contact-page?populate=*');

  const defaults: ContactPage = {
    title: { es: 'Contacto', en: 'Contact', fr: 'Contact', it: 'Contatto' },
    subtitle: { es: 'Estamos aquí para ayudarte', en: 'We are here to help you', fr: 'Nous sommes là pour vous aider', it: 'Siamo qui per aiutarti' },
    email: 'info@cubitaproducciones.com',
    phone: '+39 XXX XXX XXXX',
    location: 'Roma, Italia',
    responseTimeTitle: { es: 'Respuesta Rápida', en: 'Quick Response', fr: 'Réponse Rapide', it: 'Risposta Rapida' },
    responseTimeText: { es: 'Respondemos en menos de 24 horas', en: 'We respond within 24 hours', fr: 'Nous répondons sous 24 heures', it: 'Rispondiamo entro 24 ore' },
    formLabels: {
      name: { es: 'Nombre', en: 'Name', fr: 'Nom', it: 'Nome' },
      email: { es: 'Email', en: 'Email', fr: 'Email', it: 'Email' },
      country: { es: 'País', en: 'Country', fr: 'Pays', it: 'Paese' },
      date: { es: 'Fecha del evento', en: 'Event date', fr: 'Date de l\'événement', it: 'Data evento' },
      artist: { es: 'Artista de interés', en: 'Artist of interest', fr: 'Artiste d\'intérêt', it: 'Artista di interesse' },
      message: { es: 'Mensaje', en: 'Message', fr: 'Message', it: 'Messaggio' },
      submit: { es: 'Enviar mensaje', en: 'Send message', fr: 'Envoyer le message', it: 'Invia messaggio' },
    },
    successMessage: { es: 'Mensaje enviado correctamente', en: 'Message sent successfully', fr: 'Message envoyé avec succès', it: 'Messaggio inviato con successo' },
    errorMessage: { es: 'Error al enviar el mensaje', en: 'Error sending message', fr: 'Erreur lors de l\'envoi du message', it: 'Errore nell\'invio del messaggio' },
    seo: null,
  };

  if (!data) return defaults;

  return {
    title: {
      es: data.titleEs || defaults.title.es,
      en: data.titleEn || defaults.title.en,
      fr: data.titleFr || defaults.title.fr,
      it: data.titleIt || defaults.title.it,
    },
    subtitle: {
      es: data.subtitleEs || defaults.subtitle.es,
      en: data.subtitleEn || defaults.subtitle.en,
      fr: data.subtitleFr || defaults.subtitle.fr,
      it: data.subtitleIt || defaults.subtitle.it,
    },
    email: data.email || defaults.email,
    phone: data.phone || defaults.phone,
    location: data.location || defaults.location,
    responseTimeTitle: {
      es: data.responseTimeTitleEs || defaults.responseTimeTitle.es,
      en: data.responseTimeTitleEn || defaults.responseTimeTitle.en,
      fr: data.responseTimeTitleFr || defaults.responseTimeTitle.fr,
      it: data.responseTimeTitleIt || defaults.responseTimeTitle.it,
    },
    responseTimeText: {
      es: data.responseTimeTextEs || defaults.responseTimeText.es,
      en: data.responseTimeTextEn || defaults.responseTimeText.en,
      fr: data.responseTimeTextFr || defaults.responseTimeText.fr,
      it: data.responseTimeTextIt || defaults.responseTimeText.it,
    },
    formLabels: {
      name: { es: data.formNameLabelEs || defaults.formLabels.name.es, en: data.formNameLabelEn || defaults.formLabels.name.en, fr: data.formNameLabelFr || defaults.formLabels.name.fr, it: data.formNameLabelIt || defaults.formLabels.name.it },
      email: { es: data.formEmailLabelEs || defaults.formLabels.email.es, en: data.formEmailLabelEn || defaults.formLabels.email.en, fr: data.formEmailLabelFr || defaults.formLabels.email.fr, it: data.formEmailLabelIt || defaults.formLabels.email.it },
      country: { es: data.formCountryLabelEs || defaults.formLabels.country.es, en: data.formCountryLabelEn || defaults.formLabels.country.en, fr: data.formCountryLabelFr || defaults.formLabels.country.fr, it: data.formCountryLabelIt || defaults.formLabels.country.it },
      date: { es: data.formDateLabelEs || defaults.formLabels.date.es, en: data.formDateLabelEn || defaults.formLabels.date.en, fr: data.formDateLabelFr || defaults.formLabels.date.fr, it: data.formDateLabelIt || defaults.formLabels.date.it },
      artist: { es: data.formArtistLabelEs || defaults.formLabels.artist.es, en: data.formArtistLabelEn || defaults.formLabels.artist.en, fr: data.formArtistLabelFr || defaults.formLabels.artist.fr, it: data.formArtistLabelIt || defaults.formLabels.artist.it },
      message: { es: data.formMessageLabelEs || defaults.formLabels.message.es, en: data.formMessageLabelEn || defaults.formLabels.message.en, fr: data.formMessageLabelFr || defaults.formLabels.message.fr, it: data.formMessageLabelIt || defaults.formLabels.message.it },
      submit: { es: data.formSubmitButtonEs || defaults.formLabels.submit.es, en: data.formSubmitButtonEn || defaults.formLabels.submit.en, fr: data.formSubmitButtonFr || defaults.formLabels.submit.fr, it: data.formSubmitButtonIt || defaults.formLabels.submit.it },
    },
    successMessage: {
      es: data.formSuccessMessageEs || defaults.successMessage.es,
      en: data.formSuccessMessageEn || defaults.successMessage.en,
      fr: data.formSuccessMessageFr || defaults.successMessage.fr,
      it: data.formSuccessMessageIt || defaults.successMessage.it,
    },
    errorMessage: {
      es: data.formErrorMessageEs || defaults.errorMessage.es,
      en: data.formErrorMessageEn || defaults.errorMessage.en,
      fr: data.formErrorMessageFr || defaults.errorMessage.fr,
      it: data.formErrorMessageIt || defaults.errorMessage.it,
    },
    seo: parseSEO(data.seo),
  };
});

export const getArtistsPage = cache(async (): Promise<ArtistsPage> => {
  const data = await fetchStrapi<any>('/artists-page?populate=*');

  const defaults: ArtistsPage = {
    title: { es: 'Nuestros Artistas', en: 'Our Artists', fr: 'Nos Artistes', it: 'I Nostri Artisti' },
    subtitle: { es: 'Descubre el talento cubano', en: 'Discover Cuban talent', fr: 'Découvrez le talent cubain', it: 'Scopri il talento cubano' },
    viewDetailsButton: { es: 'Ver Detalles', en: 'View Details', fr: 'Voir Détails', it: 'Vedi Dettagli' },
    ctaTitle: { es: '¿Interesado en booking?', en: 'Interested in booking?', fr: 'Intéressé par une réservation?', it: 'Interessato a prenotare?' },
    ctaSubtitle: { es: 'Contacta con nosotros para más información', en: 'Contact us for more information', fr: 'Contactez-nous pour plus d\'informations', it: 'Contattaci per maggiori informazioni' },
    salsaLabel: { es: 'Salsa', en: 'Salsa', fr: 'Salsa', it: 'Salsa' },
    reggaetonLabel: { es: 'Reguetón', en: 'Reggaeton', fr: 'Reggaeton', it: 'Reggaeton' },
    seo: null,
  };

  if (!data) return defaults;

  return {
    title: {
      es: data.titleEs || defaults.title.es,
      en: data.titleEn || defaults.title.en,
      fr: data.titleFr || defaults.title.fr,
      it: data.titleIt || defaults.title.it,
    },
    subtitle: {
      es: data.subtitleEs || defaults.subtitle.es,
      en: data.subtitleEn || defaults.subtitle.en,
      fr: data.subtitleFr || defaults.subtitle.fr,
      it: data.subtitleIt || defaults.subtitle.it,
    },
    viewDetailsButton: {
      es: data.viewDetailsButtonEs || defaults.viewDetailsButton.es,
      en: data.viewDetailsButtonEn || defaults.viewDetailsButton.en,
      fr: data.viewDetailsButtonFr || defaults.viewDetailsButton.fr,
      it: data.viewDetailsButtonIt || defaults.viewDetailsButton.it,
    },
    ctaTitle: {
      es: data.ctaTitleEs || defaults.ctaTitle.es,
      en: data.ctaTitleEn || defaults.ctaTitle.en,
      fr: data.ctaTitleFr || defaults.ctaTitle.fr,
      it: data.ctaTitleIt || defaults.ctaTitle.it,
    },
    ctaSubtitle: {
      es: data.ctaSubtitleEs || defaults.ctaSubtitle.es,
      en: data.ctaSubtitleEn || defaults.ctaSubtitle.en,
      fr: data.ctaSubtitleFr || defaults.ctaSubtitle.fr,
      it: data.ctaSubtitleIt || defaults.ctaSubtitle.it,
    },
    salsaLabel: {
      es: data.salsaLabelEs || defaults.salsaLabel.es,
      en: data.salsaLabelEn || defaults.salsaLabel.en,
      fr: data.salsaLabelFr || defaults.salsaLabel.fr,
      it: data.salsaLabelIt || defaults.salsaLabel.it,
    },
    reggaetonLabel: {
      es: data.reggaetonLabelEs || defaults.reggaetonLabel.es,
      en: data.reggaetonLabelEn || defaults.reggaetonLabel.en,
      fr: data.reggaetonLabelFr || defaults.reggaetonLabel.fr,
      it: data.reggaetonLabelIt || defaults.reggaetonLabel.it,
    },
    seo: parseSEO(data.seo),
  };
});

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const data = await fetchStrapi<any>('/site-setting?populate=logo');

  const defaults: SiteSettings = {
    companyName: 'Cubita Producciones',
    logo: null,
    email: 'info@cubitaproducciones.com',
    phone: '+39 XXX XXX XXXX',
    location: 'Roma, Italia',
    nav: {
      home: { es: 'Inicio', en: 'Home', fr: 'Accueil', it: 'Home' },
      artists: { es: 'Artistas', en: 'Artists', fr: 'Artistes', it: 'Artisti' },
      about: { es: 'Sobre Nosotros', en: 'About Us', fr: 'À Propos', it: 'Chi Siamo' },
      contact: { es: 'Contacto', en: 'Contact', fr: 'Contact', it: 'Contatto' },
    },
    footerDescription: {
      es: 'Agencia de booking de artistas cubanos',
      en: 'Cuban artists booking agency',
      fr: 'Agence de réservation d\'artistes cubains',
      it: 'Agenzia di booking di artisti cubani',
    },
    footerCopyright: {
      es: 'Todos los derechos reservados',
      en: 'All rights reserved',
      fr: 'Tous droits réservés',
      it: 'Tutti i diritti riservati',
    },
  };

  if (!data) return defaults;

  return {
    companyName: data.companyName || defaults.companyName,
    logo: getImageUrl(data.logo),
    email: data.email || defaults.email,
    phone: data.phone || defaults.phone,
    location: data.location || defaults.location,
    instagram: data.instagram || undefined,
    facebook: data.facebook || undefined,
    youtube: data.youtube || undefined,
    nav: {
      home: { es: data.navHomeEs || defaults.nav.home.es, en: data.navHomeEn || defaults.nav.home.en, fr: data.navHomeFr || defaults.nav.home.fr, it: data.navHomeIt || defaults.nav.home.it },
      artists: { es: data.navArtistsEs || defaults.nav.artists.es, en: data.navArtistsEn || defaults.nav.artists.en, fr: data.navArtistsFr || defaults.nav.artists.fr, it: data.navArtistsIt || defaults.nav.artists.it },
      about: { es: data.navAboutEs || defaults.nav.about.es, en: data.navAboutEn || defaults.nav.about.en, fr: data.navAboutFr || defaults.nav.about.fr, it: data.navAboutIt || defaults.nav.about.it },
      contact: { es: data.navContactEs || defaults.nav.contact.es, en: data.navContactEn || defaults.nav.contact.en, fr: data.navContactFr || defaults.nav.contact.fr, it: data.navContactIt || defaults.nav.contact.it },
    },
    footerDescription: {
      es: data.footerDescriptionEs || defaults.footerDescription.es,
      en: data.footerDescriptionEn || defaults.footerDescription.en,
      fr: data.footerDescriptionFr || defaults.footerDescription.fr,
      it: data.footerDescriptionIt || defaults.footerDescription.it,
    },
    footerCopyright: {
      es: data.footerCopyrightEs || defaults.footerCopyright.es,
      en: data.footerCopyrightEn || defaults.footerCopyright.en,
      fr: data.footerCopyrightFr || defaults.footerCopyright.fr,
      it: data.footerCopyrightIt || defaults.footerCopyright.it,
    },
  };
});
