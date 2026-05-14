import type { Metadata } from 'next';

export type LandingLocale = 'es' | 'en' | 'fr' | 'it';

export const BOOKING_LANDING_SLUGS: Record<LandingLocale, string> = {
  es: 'booking-artistas-cubanos',
  en: 'booking-cuban-artists',
  fr: 'booking-artistes-cubains',
  it: 'booking-artisti-cubani',
};

const BASE_URL = 'https://cubitaproducciones.com';

const OG_LOCALES: Record<LandingLocale, string> = {
  es: 'es_ES',
  en: 'en_US',
  fr: 'fr_FR',
  it: 'it_IT',
};

const TITLES: Record<LandingLocale, string> = {
  es: 'Booking de Artistas Cubanos para Festivales y Eventos en Europa | Cubita Producciones',
  en: 'Booking Cuban Artists for Festivals and Events in Europe | Cubita Producciones',
  fr: 'Booking d\'Artistes Cubains pour Festivals et Événements en Europe | Cubita Producciones',
  it: 'Booking di Artisti Cubani per Festival ed Eventi in Europa | Cubita Producciones',
};

const DESCRIPTIONS: Record<LandingLocale, string> = {
  es: 'Agencia oficial de booking de artistas cubanos de salsa, reguetón y timba para festivales, conciertos y eventos en toda Europa. Más de 30 años de experiencia. Solicita disponibilidad y presupuesto en menos de 24h.',
  en: 'Official booking agency for Cuban salsa, reggaeton and timba artists for festivals, concerts and events across Europe. Over 30 years of experience. Request availability and pricing within 24 hours.',
  fr: 'Agence officielle de booking d\'artistes cubains de salsa, reggaeton et timba pour festivals, concerts et événements en Europe. Plus de 30 ans d\'expérience. Demandez disponibilité et tarif sous 24h.',
  it: 'Agenzia ufficiale di booking di artisti cubani di salsa, reggaeton e timba per festival, concerti ed eventi in tutta Europa. Oltre 30 anni di esperienza. Richiedi disponibilità e preventivo entro 24h.',
};

const KEYWORDS: Record<LandingLocale, string[]> = {
  es: ['booking artistas cubanos', 'booking artistas', 'contratar artistas cubanos', 'booking salsa', 'booking reguetón', 'agencia booking artistas', 'booking artistas festivales', 'booking artistas Europa', 'booking Jacob Forever', 'booking Manolín', 'booking El Micha'],
  en: ['booking Cuban artists', 'book Cuban artists', 'booking artists Europe', 'Cuban artist booking agency', 'booking salsa artists', 'booking reggaeton artists', 'hire Cuban artists', 'Cuban music booking', 'book Jacob Forever', 'book Manolín'],
  fr: ['booking artistes cubains', 'booking artistes', 'réserver artistes cubains', 'agence booking artistes', 'booking salsa', 'booking reggaeton', 'artistes cubains Europe', 'booking festival artistes cubains'],
  it: ['booking artisti cubani', 'booking artisti', 'prenotare artisti cubani', 'agenzia booking artisti', 'booking salsa', 'booking reggaeton', 'artisti cubani Europa', 'booking festival artisti cubani'],
};

export function buildBookingLandingUrl(locale: LandingLocale): string {
  return `${BASE_URL}/${locale}/${BOOKING_LANDING_SLUGS[locale]}`;
}

export function buildBookingLandingMetadata(locale: LandingLocale): Metadata {
  const url = buildBookingLandingUrl(locale);
  const title = TITLES[locale];
  const description = DESCRIPTIONS[locale];

  const languages = Object.fromEntries(
    (Object.keys(BOOKING_LANDING_SLUGS) as LandingLocale[]).map((l) => [
      l,
      buildBookingLandingUrl(l),
    ])
  );

  return {
    title,
    description,
    keywords: KEYWORDS[locale],
    alternates: {
      canonical: url,
      languages: {
        ...languages,
        'x-default': buildBookingLandingUrl('es'),
      },
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'Cubita Producciones',
      locale: OG_LOCALES[locale],
      alternateLocale: (Object.keys(OG_LOCALES) as LandingLocale[])
        .filter((l) => l !== locale)
        .map((l) => OG_LOCALES[l]),
      images: [
        {
          url: `${BASE_URL}/og-image.jpg`,
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
      images: [`${BASE_URL}/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}
