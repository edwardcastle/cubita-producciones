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
  es: 'Booking de Artistas en Europa | Artistas Cubanos para Festivales y Eventos | Cubita Producciones',
  en: 'Booking Artists in Europe | Cuban Artists for Festivals and Events | Cubita Producciones',
  fr: 'Booking d\'Artistes en Europe | Artistes Cubains pour Festivals et Événements | Cubita Producciones',
  it: 'Booking di Artisti in Europa | Artisti Cubani per Festival ed Eventi | Cubita Producciones',
};

const DESCRIPTIONS: Record<LandingLocale, string> = {
  es: 'Booking de artistas en Europa: agencia oficial de booking de artistas cubanos de salsa, reguetón y timba para festivales, conciertos y eventos en toda Europa. Más de 30 años haciendo booking de artistas en Europa. Solicita disponibilidad y presupuesto en menos de 24h.',
  en: 'Booking artists in Europe: official booking agency for Cuban salsa, reggaeton and timba artists for festivals, concerts and events across Europe. Over 30 years booking artists in Europe. Request availability and pricing within 24 hours.',
  fr: 'Booking d\'artistes en Europe : agence officielle de booking d\'artistes cubains de salsa, reggaeton et timba pour festivals, concerts et événements en Europe. Plus de 30 ans de booking d\'artistes en Europe. Demandez disponibilité et tarif sous 24h.',
  it: 'Booking di artisti in Europa: agenzia ufficiale di booking di artisti cubani di salsa, reggaeton e timba per festival, concerti ed eventi in tutta Europa. Oltre 30 anni di booking di artisti in Europa. Richiedi disponibilità e preventivo entro 24h.',
};

const KEYWORDS: Record<LandingLocale, string[]> = {
  es: [
    'booking artistas en Europa',
    'booking de artistas en Europa',
    'booking artistas en europa',
    'booking de artistas cubanos en Europa',
    'booking artistas cubanos en Europa',
    'booking artistas para eventos en Europa',
    'booking artistas para festivales en Europa',
    'agencia de booking en Europa',
    'agencia booking artistas Europa',
    'contratar artistas cubanos en Europa',
    'contratar artistas en Europa',
    'booking artistas cubanos',
    'booking artistas',
    'booking artistas Europa',
    'booking salsa Europa',
    'booking reguetón Europa',
    'booking artistas festivales',
    'booking Jacob Forever',
    'booking Manolín',
    'booking El Micha',
    'booking Charly & Johayron',
  ],
  en: [
    'booking artists in Europe',
    'book artists in Europe',
    'booking Cuban artists in Europe',
    'book Cuban artists in Europe',
    'booking artists for events in Europe',
    'booking artists for festivals in Europe',
    'artist booking agency in Europe',
    'European artist booking agency',
    'hire artists in Europe',
    'hire Cuban artists in Europe',
    'booking Cuban artists',
    'book Cuban artists',
    'booking artists Europe',
    'booking salsa artists Europe',
    'booking reggaeton artists Europe',
    'Cuban music booking Europe',
    'book Jacob Forever',
    'book Manolín',
    'book El Micha',
  ],
  fr: [
    'booking artistes en Europe',
    'booking d\'artistes en Europe',
    'booking artistes cubains en Europe',
    'booking d\'artistes cubains en Europe',
    'booking artistes pour événements en Europe',
    'booking artistes pour festivals en Europe',
    'agence de booking en Europe',
    'agence booking artistes Europe',
    'réserver artistes en Europe',
    'réserver artistes cubains en Europe',
    'booking artistes cubains',
    'booking artistes',
    'agence booking artistes',
    'artistes cubains Europe',
    'booking salsa Europe',
    'booking reggaeton Europe',
    'booking festival artistes cubains',
  ],
  it: [
    'booking artisti in Europa',
    'booking di artisti in Europa',
    'booking artisti cubani in Europa',
    'booking di artisti cubani in Europa',
    'booking artisti per eventi in Europa',
    'booking artisti per festival in Europa',
    'agenzia di booking in Europa',
    'agenzia booking artisti Europa',
    'prenotare artisti in Europa',
    'prenotare artisti cubani in Europa',
    'booking artisti cubani',
    'booking artisti',
    'agenzia booking artisti',
    'artisti cubani Europa',
    'booking salsa Europa',
    'booking reggaeton Europa',
    'booking festival artisti cubani',
  ],
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
