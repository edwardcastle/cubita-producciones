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
  };
  availability: string;
  image: string | null;
  instagram?: string;
  youtube?: string;
  travelParty: number;
  seo: SEO | null;
}

export interface HomePage {
  heroTitle: { es: string; en: string; fr: string };
  heroSubtitle: { es: string; en: string; fr: string };
  stats: {
    years: number;
    artists: number;
    festivals: number;
    countries: number;
  };
  aboutTitle: { es: string; en: string; fr: string };
  aboutText: { es: string; en: string; fr: string };
  ctaText: { es: string; en: string; fr: string };
  seo: SEO | null;
}

export interface AboutPage {
  title: { es: string; en: string; fr: string };
  subtitle: { es: string; en: string; fr: string };
  missionTitle: { es: string; en: string; fr: string };
  missionText: { es: string; en: string; fr: string };
  stats: {
    years: number;
    festivals: number;
    countries: number;
    artists: number;
  };
  services: Array<{
    title: { es: string; en: string; fr: string };
    text: { es: string; en: string; fr: string };
  }>;
  seo: SEO | null;
}

export interface ContactPage {
  title: { es: string; en: string; fr: string };
  subtitle: { es: string; en: string; fr: string };
  email: string;
  phone: string;
  location: string;
  responseTimeTitle: { es: string; en: string; fr: string };
  responseTimeText: { es: string; en: string; fr: string };
  formLabels: {
    name: { es: string; en: string; fr: string };
    email: { es: string; en: string; fr: string };
    country: { es: string; en: string; fr: string };
    date: { es: string; en: string; fr: string };
    artist: { es: string; en: string; fr: string };
    message: { es: string; en: string; fr: string };
    submit: { es: string; en: string; fr: string };
  };
  successMessage: { es: string; en: string; fr: string };
  errorMessage: { es: string; en: string; fr: string };
  seo: SEO | null;
}

export interface ArtistsPage {
  title: { es: string; en: string; fr: string };
  subtitle: { es: string; en: string; fr: string };
  viewDetailsButton: { es: string; en: string; fr: string };
  ctaTitle: { es: string; en: string; fr: string };
  ctaSubtitle: { es: string; en: string; fr: string };
  salsaLabel: { es: string; en: string; fr: string };
  reggaetonLabel: { es: string; en: string; fr: string };
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
    home: { es: string; en: string; fr: string };
    artists: { es: string; en: string; fr: string };
    about: { es: string; en: string; fr: string };
    contact: { es: string; en: string; fr: string };
  };
  footerDescription: { es: string; en: string; fr: string };
  footerCopyright: { es: string; en: string; fr: string };
}

export interface SEO {
  metaTitle: { es: string; en: string; fr: string };
  metaDescription: { es: string; en: string; fr: string };
  keywords: string | null;
  ogImage: string | null;
  canonicalUrl: string | null;
  noIndex: boolean;
}

export interface PageWithSEO {
  seo: SEO | null;
}

// Helper to generate metadata from SEO data
export function generateMetadataFromSEO(
  seo: SEO | null,
  locale: 'es' | 'en' | 'fr',
  fallback: { title: string; description: string }
): {
  title: string;
  description: string;
  keywords?: string;
  openGraph?: {
    title: string;
    description: string;
    images?: string[];
  };
  robots?: { index: boolean; follow: boolean };
  alternates?: { canonical?: string };
} {
  const title = seo?.metaTitle[locale] || fallback.title;
  const description = seo?.metaDescription[locale] || fallback.description;

  const metadata: ReturnType<typeof generateMetadataFromSEO> = {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(seo?.ogImage && { images: [seo.ogImage] }),
    },
  };

  if (seo?.keywords) {
    metadata.keywords = seo.keywords;
  }

  if (seo?.noIndex) {
    metadata.robots = { index: false, follow: false };
  }

  if (seo?.canonicalUrl) {
    metadata.alternates = { canonical: seo.canonicalUrl };
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

  console.log('Fetching Strapi:', url);

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
    console.log('Strapi response:', JSON.stringify(json, null, 2));
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
    },
    metaDescription: {
      es: seoData.metaDescriptionEs || '',
      en: seoData.metaDescriptionEn || '',
      fr: seoData.metaDescriptionFr || '',
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
    heroTitle: { es: 'Booking de Artistas Cubanos', en: 'Cuban Artists Booking', fr: 'Réservation d\'Artistes Cubains' },
    heroSubtitle: { es: 'Conectamos el talento cubano con el mundo', en: 'Connecting Cuban talent with the world', fr: 'Connecter le talent cubain avec le monde' },
    stats: { years: 30, artists: 50, festivals: 100, countries: 15 },
    aboutTitle: { es: 'Sobre Nosotros', en: 'About Us', fr: 'À Propos' },
    aboutText: { es: 'Somos una agencia de booking especializada en artistas cubanos.', en: 'We are a booking agency specialized in Cuban artists.', fr: 'Nous sommes une agence de booking spécialisée dans les artistes cubains.' },
    ctaText: { es: 'Ver Artistas', en: 'View Artists', fr: 'Voir les Artistes' },
    seo: null,
  };

  if (!data) return defaults;

  return {
    heroTitle: {
      es: data.heroTitleEs || defaults.heroTitle.es,
      en: data.heroTitleEn || defaults.heroTitle.en,
      fr: data.heroTitleFr || defaults.heroTitle.fr,
    },
    heroSubtitle: {
      es: data.heroSubtitleEs || defaults.heroSubtitle.es,
      en: data.heroSubtitleEn || defaults.heroSubtitle.en,
      fr: data.heroSubtitleFr || defaults.heroSubtitle.fr,
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
    },
    aboutText: {
      es: data.aboutTextEs || defaults.aboutText.es,
      en: data.aboutTextEn || defaults.aboutText.en,
      fr: data.aboutTextFr || defaults.aboutText.fr,
    },
    ctaText: {
      es: data.ctaTextEs || defaults.ctaText.es,
      en: data.ctaTextEn || defaults.ctaText.en,
      fr: data.ctaTextFr || defaults.ctaText.fr,
    },
    seo: parseSEO(data.seo),
  };
});

export const getAboutPage = cache(async (): Promise<AboutPage> => {
  const data = await fetchStrapi<any>('/about-page?populate=*');

  const defaults: AboutPage = {
    title: { es: 'Sobre Nosotros', en: 'About Us', fr: 'À Propos' },
    subtitle: { es: 'Más de 30 años de experiencia', en: 'Over 30 years of experience', fr: 'Plus de 30 ans d\'expérience' },
    missionTitle: { es: 'Nuestra Misión', en: 'Our Mission', fr: 'Notre Mission' },
    missionText: { es: 'Conectar el talento cubano con escenarios de todo el mundo.', en: 'Connecting Cuban talent with stages around the world.', fr: 'Connecter le talent cubain avec les scènes du monde entier.' },
    stats: { years: 30, festivals: 100, countries: 15, artists: 50 },
    services: [
      { title: { es: 'Booking', en: 'Booking', fr: 'Réservation' }, text: { es: 'Gestión completa de contrataciones', en: 'Complete booking management', fr: 'Gestion complète des réservations' } },
      { title: { es: 'Producción', en: 'Production', fr: 'Production' }, text: { es: 'Producción de eventos y conciertos', en: 'Event and concert production', fr: 'Production d\'événements et concerts' } },
      { title: { es: 'Tours', en: 'Tours', fr: 'Tournées' }, text: { es: 'Organización de giras internacionales', en: 'International tour organization', fr: 'Organisation de tournées internationales' } },
    ],
    seo: null,
  };

  if (!data) return defaults;

  return {
    title: {
      es: data.titleEs || defaults.title.es,
      en: data.titleEn || defaults.title.en,
      fr: data.titleFr || defaults.title.fr,
    },
    subtitle: {
      es: data.subtitleEs || defaults.subtitle.es,
      en: data.subtitleEn || defaults.subtitle.en,
      fr: data.subtitleFr || defaults.subtitle.fr,
    },
    missionTitle: {
      es: data.missionTitleEs || defaults.missionTitle.es,
      en: data.missionTitleEn || defaults.missionTitle.en,
      fr: data.missionTitleFr || defaults.missionTitle.fr,
    },
    missionText: {
      es: data.missionTextEs || defaults.missionText.es,
      en: data.missionTextEn || defaults.missionText.en,
      fr: data.missionTextFr || defaults.missionText.fr,
    },
    stats: {
      years: data.statsYears || defaults.stats.years,
      festivals: data.statsFestivals || defaults.stats.festivals,
      countries: data.statsCountries || defaults.stats.countries,
      artists: data.statsArtists || defaults.stats.artists,
    },
    services: [
      {
        title: { es: data.service1TitleEs || defaults.services[0].title.es, en: data.service1TitleEn || defaults.services[0].title.en, fr: data.service1TitleFr || defaults.services[0].title.fr },
        text: { es: data.service1TextEs || defaults.services[0].text.es, en: data.service1TextEn || defaults.services[0].text.en, fr: data.service1TextFr || defaults.services[0].text.fr },
      },
      {
        title: { es: data.service2TitleEs || defaults.services[1].title.es, en: data.service2TitleEn || defaults.services[1].title.en, fr: data.service2TitleFr || defaults.services[1].title.fr },
        text: { es: data.service2TextEs || defaults.services[1].text.es, en: data.service2TextEn || defaults.services[1].text.en, fr: data.service2TextFr || defaults.services[1].text.fr },
      },
      {
        title: { es: data.service3TitleEs || defaults.services[2].title.es, en: data.service3TitleEn || defaults.services[2].title.en, fr: data.service3TitleFr || defaults.services[2].title.fr },
        text: { es: data.service3TextEs || defaults.services[2].text.es, en: data.service3TextEn || defaults.services[2].text.en, fr: data.service3TextFr || defaults.services[2].text.fr },
      },
    ],
    seo: parseSEO(data.seo),
  };
});

export const getContactPage = cache(async (): Promise<ContactPage> => {
  const data = await fetchStrapi<any>('/contact-page?populate=*');

  const defaults: ContactPage = {
    title: { es: 'Contacto', en: 'Contact', fr: 'Contact' },
    subtitle: { es: 'Estamos aquí para ayudarte', en: 'We are here to help you', fr: 'Nous sommes là pour vous aider' },
    email: 'info@cubitaproducciones.com',
    phone: '+39 XXX XXX XXXX',
    location: 'Roma, Italia',
    responseTimeTitle: { es: 'Respuesta Rápida', en: 'Quick Response', fr: 'Réponse Rapide' },
    responseTimeText: { es: 'Respondemos en menos de 24 horas', en: 'We respond within 24 hours', fr: 'Nous répondons sous 24 heures' },
    formLabels: {
      name: { es: 'Nombre', en: 'Name', fr: 'Nom' },
      email: { es: 'Email', en: 'Email', fr: 'Email' },
      country: { es: 'País', en: 'Country', fr: 'Pays' },
      date: { es: 'Fecha del evento', en: 'Event date', fr: 'Date de l\'événement' },
      artist: { es: 'Artista de interés', en: 'Artist of interest', fr: 'Artiste d\'intérêt' },
      message: { es: 'Mensaje', en: 'Message', fr: 'Message' },
      submit: { es: 'Enviar mensaje', en: 'Send message', fr: 'Envoyer le message' },
    },
    successMessage: { es: 'Mensaje enviado correctamente', en: 'Message sent successfully', fr: 'Message envoyé avec succès' },
    errorMessage: { es: 'Error al enviar el mensaje', en: 'Error sending message', fr: 'Erreur lors de l\'envoi du message' },
    seo: null,
  };

  if (!data) return defaults;

  return {
    title: {
      es: data.titleEs || defaults.title.es,
      en: data.titleEn || defaults.title.en,
      fr: data.titleFr || defaults.title.fr,
    },
    subtitle: {
      es: data.subtitleEs || defaults.subtitle.es,
      en: data.subtitleEn || defaults.subtitle.en,
      fr: data.subtitleFr || defaults.subtitle.fr,
    },
    email: data.email || defaults.email,
    phone: data.phone || defaults.phone,
    location: data.location || defaults.location,
    responseTimeTitle: {
      es: data.responseTimeTitleEs || defaults.responseTimeTitle.es,
      en: data.responseTimeTitleEn || defaults.responseTimeTitle.en,
      fr: data.responseTimeTitleFr || defaults.responseTimeTitle.fr,
    },
    responseTimeText: {
      es: data.responseTimeTextEs || defaults.responseTimeText.es,
      en: data.responseTimeTextEn || defaults.responseTimeText.en,
      fr: data.responseTimeTextFr || defaults.responseTimeText.fr,
    },
    formLabels: {
      name: { es: data.formNameLabelEs || defaults.formLabels.name.es, en: data.formNameLabelEn || defaults.formLabels.name.en, fr: data.formNameLabelFr || defaults.formLabels.name.fr },
      email: { es: data.formEmailLabelEs || defaults.formLabels.email.es, en: data.formEmailLabelEn || defaults.formLabels.email.en, fr: data.formEmailLabelFr || defaults.formLabels.email.fr },
      country: { es: data.formCountryLabelEs || defaults.formLabels.country.es, en: data.formCountryLabelEn || defaults.formLabels.country.en, fr: data.formCountryLabelFr || defaults.formLabels.country.fr },
      date: { es: data.formDateLabelEs || defaults.formLabels.date.es, en: data.formDateLabelEn || defaults.formLabels.date.en, fr: data.formDateLabelFr || defaults.formLabels.date.fr },
      artist: { es: data.formArtistLabelEs || defaults.formLabels.artist.es, en: data.formArtistLabelEn || defaults.formLabels.artist.en, fr: data.formArtistLabelFr || defaults.formLabels.artist.fr },
      message: { es: data.formMessageLabelEs || defaults.formLabels.message.es, en: data.formMessageLabelEn || defaults.formLabels.message.en, fr: data.formMessageLabelFr || defaults.formLabels.message.fr },
      submit: { es: data.formSubmitButtonEs || defaults.formLabels.submit.es, en: data.formSubmitButtonEn || defaults.formLabels.submit.en, fr: data.formSubmitButtonFr || defaults.formLabels.submit.fr },
    },
    successMessage: {
      es: data.formSuccessMessageEs || defaults.successMessage.es,
      en: data.formSuccessMessageEn || defaults.successMessage.en,
      fr: data.formSuccessMessageFr || defaults.successMessage.fr,
    },
    errorMessage: {
      es: data.formErrorMessageEs || defaults.errorMessage.es,
      en: data.formErrorMessageEn || defaults.errorMessage.en,
      fr: data.formErrorMessageFr || defaults.errorMessage.fr,
    },
    seo: parseSEO(data.seo),
  };
});

export const getArtistsPage = cache(async (): Promise<ArtistsPage> => {
  const data = await fetchStrapi<any>('/artists-page?populate=*');

  const defaults: ArtistsPage = {
    title: { es: 'Nuestros Artistas', en: 'Our Artists', fr: 'Nos Artistes' },
    subtitle: { es: 'Descubre el talento cubano', en: 'Discover Cuban talent', fr: 'Découvrez le talent cubain' },
    viewDetailsButton: { es: 'Ver Detalles', en: 'View Details', fr: 'Voir Détails' },
    ctaTitle: { es: '¿Interesado en booking?', en: 'Interested in booking?', fr: 'Intéressé par une réservation?' },
    ctaSubtitle: { es: 'Contacta con nosotros para más información', en: 'Contact us for more information', fr: 'Contactez-nous pour plus d\'informations' },
    salsaLabel: { es: 'Salsa', en: 'Salsa', fr: 'Salsa' },
    reggaetonLabel: { es: 'Reguetón', en: 'Reggaeton', fr: 'Reggaeton' },
    seo: null,
  };

  if (!data) return defaults;

  return {
    title: {
      es: data.titleEs || defaults.title.es,
      en: data.titleEn || defaults.title.en,
      fr: data.titleFr || defaults.title.fr,
    },
    subtitle: {
      es: data.subtitleEs || defaults.subtitle.es,
      en: data.subtitleEn || defaults.subtitle.en,
      fr: data.subtitleFr || defaults.subtitle.fr,
    },
    viewDetailsButton: {
      es: data.viewDetailsButtonEs || defaults.viewDetailsButton.es,
      en: data.viewDetailsButtonEn || defaults.viewDetailsButton.en,
      fr: data.viewDetailsButtonFr || defaults.viewDetailsButton.fr,
    },
    ctaTitle: {
      es: data.ctaTitleEs || defaults.ctaTitle.es,
      en: data.ctaTitleEn || defaults.ctaTitle.en,
      fr: data.ctaTitleFr || defaults.ctaTitle.fr,
    },
    ctaSubtitle: {
      es: data.ctaSubtitleEs || defaults.ctaSubtitle.es,
      en: data.ctaSubtitleEn || defaults.ctaSubtitle.en,
      fr: data.ctaSubtitleFr || defaults.ctaSubtitle.fr,
    },
    salsaLabel: {
      es: data.salsaLabelEs || defaults.salsaLabel.es,
      en: data.salsaLabelEn || defaults.salsaLabel.en,
      fr: data.salsaLabelFr || defaults.salsaLabel.fr,
    },
    reggaetonLabel: {
      es: data.reggaetonLabelEs || defaults.reggaetonLabel.es,
      en: data.reggaetonLabelEn || defaults.reggaetonLabel.en,
      fr: data.reggaetonLabelFr || defaults.reggaetonLabel.fr,
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
      home: { es: 'Inicio', en: 'Home', fr: 'Accueil' },
      artists: { es: 'Artistas', en: 'Artists', fr: 'Artistes' },
      about: { es: 'Sobre Nosotros', en: 'About Us', fr: 'À Propos' },
      contact: { es: 'Contacto', en: 'Contact', fr: 'Contact' },
    },
    footerDescription: {
      es: 'Agencia de booking de artistas cubanos',
      en: 'Cuban artists booking agency',
      fr: 'Agence de réservation d\'artistes cubains',
    },
    footerCopyright: {
      es: 'Todos los derechos reservados',
      en: 'All rights reserved',
      fr: 'Tous droits réservés',
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
      home: { es: data.navHomeEs || defaults.nav.home.es, en: data.navHomeEn || defaults.nav.home.en, fr: data.navHomeFr || defaults.nav.home.fr },
      artists: { es: data.navArtistsEs || defaults.nav.artists.es, en: data.navArtistsEn || defaults.nav.artists.en, fr: data.navArtistsFr || defaults.nav.artists.fr },
      about: { es: data.navAboutEs || defaults.nav.about.es, en: data.navAboutEn || defaults.nav.about.en, fr: data.navAboutFr || defaults.nav.about.fr },
      contact: { es: data.navContactEs || defaults.nav.contact.es, en: data.navContactEn || defaults.nav.contact.en, fr: data.navContactFr || defaults.nav.contact.fr },
    },
    footerDescription: {
      es: data.footerDescriptionEs || defaults.footerDescription.es,
      en: data.footerDescriptionEn || defaults.footerDescription.en,
      fr: data.footerDescriptionFr || defaults.footerDescription.fr,
    },
    footerCopyright: {
      es: data.footerCopyrightEs || defaults.footerCopyright.es,
      en: data.footerCopyrightEn || defaults.footerCopyright.en,
      fr: data.footerCopyrightFr || defaults.footerCopyright.fr,
    },
  };
});
