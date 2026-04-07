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
    logo: {
      '@type': 'ImageObject',
      url: settings.logo || 'https://cubitaproducciones.com/logo.jpeg',
      width: 512,
      height: 512,
    },
    description: settings.footerDescription[locale as keyof typeof settings.footerDescription] || settings.footerDescription.es,
    foundingDate: '1994',
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
      areaServed: 'Europe',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Artist Booking Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Artist Booking' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Event Production' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'International Tours' } },
      ],
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

interface ArtistsListJsonLdProps {
  artists: Array<{ name: string; slug: string; image: string | null; genre: string }>;
  locale: string;
}

export function ArtistsListJsonLd({ artists, locale }: ArtistsListJsonLdProps) {
  const prefix = locale === 'es' ? '' : `/${locale}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Cuban Artists for Booking',
    url: `https://cubitaproducciones.com${prefix}/artistas`,
    description: 'Browse our collection of Cuban salsa and reggaeton artists available for booking in Europe.',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: artists.length,
      itemListElement: artists.map((artist, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: artist.name,
        url: `https://cubitaproducciones.com${prefix}/artistas/${artist.slug}`,
        image: artist.image || undefined,
      })),
    },
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
    '@id': `${url}#artist`,
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
    managedBy: {
      '@id': 'https://cubitaproducciones.com/#organization',
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

interface FAQJsonLdProps {
  locale: string;
}

export function FAQJsonLd({ locale }: FAQJsonLdProps) {
  const faqs: Record<string, Array<{ question: string; answer: string }>> = {
    es: [
      { question: '¿Cómo puedo reservar un artista cubano para mi evento?', answer: 'Contacta con nosotros a través del formulario de contacto o por email. Te responderemos en menos de 24 horas con toda la información sobre disponibilidad y presupuesto.' },
      { question: '¿En qué países de Europa están disponibles los artistas?', answer: 'Nuestros artistas están disponibles para eventos en toda Europa, incluyendo España, Italia, Francia, Alemania, Suiza, Bélgica, Países Bajos y más.' },
      { question: '¿Qué géneros musicales ofrecen los artistas?', answer: 'Representamos artistas de salsa, reggaetón, timba y otros géneros de música cubana y latina.' },
    ],
    en: [
      { question: 'How can I book a Cuban artist for my event?', answer: 'Contact us through the contact form or by email. We will respond within 24 hours with all information about availability and pricing.' },
      { question: 'In which European countries are the artists available?', answer: 'Our artists are available for events across Europe, including Spain, Italy, France, Germany, Switzerland, Belgium, Netherlands and more.' },
      { question: 'What music genres do the artists perform?', answer: 'We represent artists performing salsa, reggaeton, timba and other Cuban and Latin music genres.' },
    ],
    fr: [
      { question: 'Comment puis-je réserver un artiste cubain pour mon événement ?', answer: 'Contactez-nous via le formulaire de contact ou par email. Nous vous répondrons dans les 24 heures avec toutes les informations sur la disponibilité et les tarifs.' },
      { question: 'Dans quels pays européens les artistes sont-ils disponibles ?', answer: 'Nos artistes sont disponibles pour des événements dans toute l\'Europe, y compris l\'Espagne, l\'Italie, la France, l\'Allemagne, la Suisse, la Belgique, les Pays-Bas et plus.' },
      { question: 'Quels genres musicaux proposent les artistes ?', answer: 'Nous représentons des artistes de salsa, reggaeton, timba et d\'autres genres de musique cubaine et latine.' },
    ],
    it: [
      { question: 'Come posso prenotare un artista cubano per il mio evento?', answer: 'Contattaci tramite il modulo di contatto o via email. Ti risponderemo entro 24 ore con tutte le informazioni su disponibilità e preventivo.' },
      { question: 'In quali paesi europei sono disponibili gli artisti?', answer: 'I nostri artisti sono disponibili per eventi in tutta Europa, inclusi Spagna, Italia, Francia, Germania, Svizzera, Belgio, Paesi Bassi e altro.' },
      { question: 'Quali generi musicali offrono gli artisti?', answer: 'Rappresentiamo artisti di salsa, reggaeton, timba e altri generi di musica cubana e latina.' },
    ],
  };

  const localeFaqs = faqs[locale] || faqs.es;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: localeFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
