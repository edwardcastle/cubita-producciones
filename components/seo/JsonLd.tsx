import { getSiteSettings } from '@/lib/strapi';

interface OrganizationJsonLdProps {
  locale: string;
}

export async function OrganizationJsonLd({ locale }: OrganizationJsonLdProps) {
  const settings = await getSiteSettings();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://cubitaproducciones.com/#organization',
    name: 'Cubita Producciones',
    url: 'https://cubitaproducciones.com',
    logo: settings.logo || 'https://cubitaproducciones.com/logo.jpeg',
    description: settings.footerDescription[locale as keyof typeof settings.footerDescription] || settings.footerDescription.es,
    email: settings.email,
    telephone: settings.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: settings.location,
      addressCountry: 'IT',
    },
    sameAs: [
      settings.instagram,
      settings.facebook,
      settings.youtube,
    ].filter(Boolean),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: settings.phone,
      email: settings.email,
      contactType: 'booking inquiries',
      availableLanguage: ['Spanish', 'English', 'French', 'Italian'],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface LocalBusinessJsonLdProps {
  locale: string;
}

export async function LocalBusinessJsonLd({ locale }: LocalBusinessJsonLdProps) {
  const settings = await getSiteSettings();

  const descriptions: Record<string, string> = {
    es: 'Agencia de booking especializada en artistas cubanos de salsa y reggaeton para festivales y eventos en Europa.',
    en: 'Booking agency specializing in Cuban salsa and reggaeton artists for festivals and events in Europe.',
    fr: 'Agence de booking specialisee dans les artistes cubains de salsa et reggaeton pour festivals et evenements en Europe.',
    it: 'Agenzia di booking specializzata in artisti cubani di salsa e reggaeton per festival ed eventi in Europa.',
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EntertainmentBusiness',
    '@id': 'https://cubitaproducciones.com/#business',
    name: 'Cubita Producciones',
    url: 'https://cubitaproducciones.com',
    logo: settings.logo || 'https://cubitaproducciones.com/logo.jpeg',
    image: settings.logo || 'https://cubitaproducciones.com/logo.jpeg',
    description: descriptions[locale] || descriptions.es,
    email: settings.email,
    telephone: settings.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: settings.location,
      addressCountry: 'IT',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 41.9028,
      longitude: 12.4964,
    },
    priceRange: '$$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    sameAs: [
      settings.instagram,
      settings.facebook,
      settings.youtube,
    ].filter(Boolean),
    areaServed: {
      '@type': 'Continent',
      name: 'Europe',
    },
    serviceType: ['Artist Booking', 'Event Production', 'International Tours'],
    knowsLanguage: ['Spanish', 'English', 'French', 'Italian'],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: Array<{ name: string; url: string }>;
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface ArtistJsonLdProps {
  name: string;
  description: string;
  image: string | null;
  genre: string;
  instagram?: string;
  youtube?: string;
  url: string;
}

export function ArtistJsonLd({ name, description, image, genre, instagram, youtube, url }: ArtistJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name,
    description,
    image: image || undefined,
    genre,
    url,
    sameAs: [instagram, youtube].filter(Boolean),
    member: {
      '@type': 'OrganizationRole',
      member: {
        '@type': 'Person',
        name,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface WebsiteJsonLdProps {
  locale: string;
}

export function WebsiteJsonLd({ locale }: WebsiteJsonLdProps) {
  const names: Record<string, string> = {
    es: 'Cubita Producciones - Booking de Artistas Cubanos',
    en: 'Cubita Producciones - Cuban Artists Booking',
    fr: 'Cubita Producciones - Booking d\'Artistes Cubains',
    it: 'Cubita Producciones - Prenotazione Artisti Cubani',
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://cubitaproducciones.com/#website',
    url: 'https://cubitaproducciones.com',
    name: names[locale] || names.es,
    publisher: {
      '@id': 'https://cubitaproducciones.com/#organization',
    },
    inLanguage: [
      { '@type': 'Language', name: 'Spanish', alternateName: 'es' },
      { '@type': 'Language', name: 'English', alternateName: 'en' },
      { '@type': 'Language', name: 'French', alternateName: 'fr' },
      { '@type': 'Language', name: 'Italian', alternateName: 'it' },
    ],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://cubitaproducciones.com/${locale}/artistas?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
