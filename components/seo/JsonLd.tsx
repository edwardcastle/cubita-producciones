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
      name: 'Booking de Artistas Cubanos / Cuban Artist Booking Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Booking de Artistas para Festivales y Eventos', description: 'Servicio de booking de artistas cubanos de salsa y reggaeton para festivales, conciertos y eventos privados en Europa' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Producción de Eventos y Conciertos', description: 'Producción integral de eventos y conciertos con artistas cubanos' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Giras Internacionales de Artistas', description: 'Organización de giras y tours internacionales para artistas cubanos en Europa' } },
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
    es: 'Agencia de booking de artistas cubanos de salsa y reggaeton. Más de 30 años contratando artistas para festivales, conciertos y eventos privados en toda Europa.',
    en: 'Cuban artist booking agency for salsa and reggaeton. Over 30 years booking artists for festivals, concerts and private events across Europe.',
    fr: 'Agence de booking d\'artistes cubains de salsa et reggaeton. Plus de 30 ans de réservation d\'artistes pour festivals, concerts et événements privés en Europe.',
    it: 'Agenzia di booking di artisti cubani di salsa e reggaeton. Oltre 30 anni di prenotazione artisti per festival, concerti ed eventi privati in Europa.',
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
    serviceType: ['Booking de Artistas', 'Artist Booking', 'Booking Artistas para Eventos', 'Event Production', 'International Tours'],
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

  const names: Record<string, string> = {
    es: 'Booking Artistas Cubanos - Catálogo de Artistas',
    en: 'Cuban Artists Booking - Artist Catalog',
    fr: 'Booking Artistes Cubains - Catalogue d\'Artistes',
    it: 'Booking Artisti Cubani - Catalogo Artisti',
  };

  const pageDescriptions: Record<string, string> = {
    es: 'Catálogo de artistas cubanos de salsa y reggaeton disponibles para booking en festivales, conciertos y eventos en Europa.',
    en: 'Catalog of Cuban salsa and reggaeton artists available for booking at festivals, concerts and events in Europe.',
    fr: 'Catalogue d\'artistes cubains de salsa et reggaeton disponibles pour booking lors de festivals, concerts et événements en Europe.',
    it: 'Catalogo di artisti cubani di salsa e reggaeton disponibili per booking a festival, concerti ed eventi in Europa.',
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: names[locale] || names.es,
    url: `https://cubitaproducciones.com${prefix}/artistas`,
    description: pageDescriptions[locale] || pageDescriptions.es,
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
  const siteNames: Record<string, string> = {
    es: 'Cubita Producciones - Booking de Artistas Cubanos para Eventos en Europa',
    en: 'Cubita Producciones - Booking Cuban Artists for Events in Europe',
    fr: 'Cubita Producciones - Booking d\'Artistes Cubains pour Événements en Europe',
    it: 'Cubita Producciones - Booking Artisti Cubani per Eventi in Europa',
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://cubitaproducciones.com/#website',
    url: 'https://cubitaproducciones.com',
    name: siteNames[locale] || siteNames.es,
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
