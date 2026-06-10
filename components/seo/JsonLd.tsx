import { getSiteSettings } from '@/lib/content';

interface OrganizationJsonLdProps {
  locale: string;
}

export async function OrganizationJsonLd({ locale }: OrganizationJsonLdProps) {
  const settings = await getSiteSettings();

  const slogans: Record<string, string> = {
    es: 'Booking de Artistas Cubanos para Eventos en Europa',
    en: 'Booking Cuban Artists for Events in Europe',
    fr: 'Booking d\'Artistes Cubains pour Événements en Europe',
    it: 'Booking di Artisti Cubani per Eventi in Europa',
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://cubitaproducciones.com/#organization',
    name: 'Cubita Producciones',
    alternateName: ['Cubita', 'Cubita Booking', 'Cubita Producciones Booking'],
    legalName: 'Cubita Producciones',
    url: 'https://cubitaproducciones.com',
    logo: {
      '@type': 'ImageObject',
      url: settings.logo || 'https://cubitaproducciones.com/logo.jpeg',
      width: 512,
      height: 512,
    },
    image: settings.logo || 'https://cubitaproducciones.com/logo.jpeg',
    slogan: slogans[locale] || slogans.es,
    description: settings.footerDescription[locale as keyof typeof settings.footerDescription] || settings.footerDescription.es,
    foundingDate: '1994',
    knowsAbout: [
      'Booking de Artistas Cubanos',
      'Cuban Artist Booking',
      'Salsa',
      'Reggaeton',
      'Reguetón',
      'Timba',
      'Música Cubana',
      'Cuban Music',
      'Event Production',
      'Producción de Eventos',
      'International Tours',
      'Festival Booking',
    ],
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
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export const HOME_FAQS: Record<string, Array<{ question: string; answer: string }>> = {
  es: [
    { question: '¿Qué es Cubita Producciones?', answer: 'Cubita Producciones es una agencia de booking de artistas cubanos con más de 30 años representando talento internacional de salsa y reguetón en el mercado europeo. Trabajamos con artistas como Jacob Forever, Manolín, El Micha y Charly & Johayron.' },
    { question: '¿Cómo funciona el booking de artistas cubanos con Cubita Producciones?', answer: 'Nuestro servicio de booking de artistas cubre disponibilidad, contratación, logística internacional y producción del evento. Contáctanos por el formulario o email y te responderemos en menos de 24 horas con disponibilidad y presupuesto.' },
    { question: '¿En qué países de Europa están disponibles los artistas?', answer: 'Nuestros artistas están disponibles para eventos en toda Europa, incluyendo España, Italia, Francia, Alemania, Suiza, Bélgica, Países Bajos y más.' },
    { question: '¿Qué géneros musicales ofrecen los artistas?', answer: 'Representamos artistas de salsa, reggaetón, timba y otros géneros de música cubana y latina.' },
  ],
  en: [
    { question: 'What is Cubita Producciones?', answer: 'Cubita Producciones is a Cuban artist booking agency with over 30 years representing international salsa and reggaeton talent in the European market. We work with artists like Jacob Forever, Manolín, El Micha and Charly & Johayron.' },
    { question: 'How does booking Cuban artists with Cubita Producciones work?', answer: 'Our artist booking service covers availability, contracting, international logistics and event production. Contact us via the form or email and we will respond within 24 hours with availability and pricing.' },
    { question: 'In which European countries are the artists available?', answer: 'Our artists are available for events across Europe, including Spain, Italy, France, Germany, Switzerland, Belgium, Netherlands and more.' },
    { question: 'What music genres do the artists perform?', answer: 'We represent artists performing salsa, reggaeton, timba and other Cuban and Latin music genres.' },
  ],
  fr: [
    { question: 'Qu\'est-ce que Cubita Producciones ?', answer: 'Cubita Producciones est une agence de booking d\'artistes cubains avec plus de 30 ans de représentation de talents internationaux de salsa et reggaeton sur le marché européen. Nous travaillons avec des artistes comme Jacob Forever, Manolín, El Micha et Charly & Johayron.' },
    { question: 'Comment fonctionne le booking d\'artistes cubains avec Cubita Producciones ?', answer: 'Notre service de booking d\'artistes couvre la disponibilité, la contractualisation, la logistique internationale et la production de l\'événement. Contactez-nous via le formulaire ou par email et nous vous répondrons sous 24 heures avec disponibilité et tarifs.' },
    { question: 'Dans quels pays européens les artistes sont-ils disponibles ?', answer: 'Nos artistes sont disponibles pour des événements dans toute l\'Europe, y compris l\'Espagne, l\'Italie, la France, l\'Allemagne, la Suisse, la Belgique, les Pays-Bas et plus.' },
    { question: 'Quels genres musicaux proposent les artistes ?', answer: 'Nous représentons des artistes de salsa, reggaeton, timba et d\'autres genres de musique cubaine et latine.' },
  ],
  it: [
    { question: 'Cos\'è Cubita Producciones?', answer: 'Cubita Producciones è un\'agenzia di booking di artisti cubani con oltre 30 anni di rappresentanza di talenti internazionali di salsa e reggaeton nel mercato europeo. Lavoriamo con artisti come Jacob Forever, Manolín, El Micha e Charly & Johayron.' },
    { question: 'Come funziona il booking di artisti cubani con Cubita Producciones?', answer: 'Il nostro servizio di booking artisti copre disponibilità, contrattualizzazione, logistica internazionale e produzione dell\'evento. Contattaci tramite il modulo o email e ti risponderemo entro 24 ore con disponibilità e preventivo.' },
    { question: 'In quali paesi europei sono disponibili gli artisti?', answer: 'I nostri artisti sono disponibili per eventi in tutta Europa, inclusi Spagna, Italia, Francia, Germania, Svizzera, Belgio, Paesi Bassi e altro.' },
    { question: 'Quali generi musicali offrono gli artisti?', answer: 'Rappresentiamo artisti di salsa, reggaeton, timba e altri generi di musica cubana e latina.' },
  ],
};

interface BookingServiceJsonLdProps {
  locale: string;
  url: string;
}

export async function BookingServiceJsonLd({ locale, url }: BookingServiceJsonLdProps) {
  const settings = await getSiteSettings();

  const names: Record<string, string> = {
    es: 'Booking de Artistas Cubanos para Festivales y Eventos en Europa',
    en: 'Booking Cuban Artists for Festivals and Events in Europe',
    fr: 'Booking d\'Artistes Cubains pour Festivals et Événements en Europe',
    it: 'Booking di Artisti Cubani per Festival ed Eventi in Europa',
  };

  const descriptions: Record<string, string> = {
    es: 'Servicio profesional de booking de artistas cubanos de salsa, reguetón y timba para festivales, conciertos, eventos corporativos y privados en toda Europa. Más de 30 años contratando talento cubano internacional.',
    en: 'Professional booking service for Cuban salsa, reggaeton and timba artists for festivals, concerts, corporate and private events across Europe. Over 30 years booking international Cuban talent.',
    fr: 'Service professionnel de booking d\'artistes cubains de salsa, reggaeton et timba pour festivals, concerts, événements corporatifs et privés en Europe. Plus de 30 ans de réservation de talents cubains internationaux.',
    it: 'Servizio professionale di booking di artisti cubani di salsa, reggaeton e timba per festival, concerti, eventi aziendali e privati in tutta Europa. Oltre 30 anni di prenotazione di talenti cubani internazionali.',
  };

  const serviceTypes: Record<string, string> = {
    es: 'Booking de Artistas',
    en: 'Artist Booking Service',
    fr: 'Service de Booking d\'Artistes',
    it: 'Servizio di Booking Artisti',
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: names[locale] || names.es,
    description: descriptions[locale] || descriptions.es,
    serviceType: serviceTypes[locale] || serviceTypes.es,
    category: 'Artist Booking Agency',
    provider: {
      '@id': 'https://cubitaproducciones.com/#organization',
    },
    areaServed: [
      { '@type': 'Country', name: 'Spain' },
      { '@type': 'Country', name: 'Italy' },
      { '@type': 'Country', name: 'France' },
      { '@type': 'Country', name: 'Germany' },
      { '@type': 'Country', name: 'Switzerland' },
      { '@type': 'Country', name: 'Belgium' },
      { '@type': 'Country', name: 'Netherlands' },
      { '@type': 'Country', name: 'Portugal' },
      { '@type': 'Country', name: 'Austria' },
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Continent', name: 'Europe' },
    ],
    audience: {
      '@type': 'BusinessAudience',
      audienceType: 'Festival organizers, event promoters, venue managers, corporate event planners',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      priceRange: '$$$',
      availability: 'https://schema.org/InStock',
      seller: {
        '@id': 'https://cubitaproducciones.com/#organization',
      },
    },
    url,
    image: settings.logo || 'https://cubitaproducciones.com/og-image.jpg',
    termsOfService: `${url}#how-it-works`,
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: url,
      availableLanguage: ['Spanish', 'English', 'French', 'Italian'],
      processingTime: 'PT24H',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface HowToBookingJsonLdProps {
  locale: string;
  url: string;
}

const HOW_TO_STEPS: Record<string, { name: string; description: string; steps: Array<{ name: string; text: string }> }> = {
  es: {
    name: 'Cómo hacer booking de un artista cubano con Cubita Producciones',
    description: 'Proceso paso a paso para hacer booking de artistas cubanos para tu festival, concierto o evento en Europa.',
    steps: [
      { name: 'Solicitud', text: 'Cuéntanos el tipo de evento, fecha, lugar y qué artista quieres contratar a través del formulario o por email.' },
      { name: 'Confirmación', text: 'En menos de 24h recibirás confirmación de disponibilidad, presupuesto y condiciones del booking.' },
      { name: 'Contrato', text: 'Firmamos contrato de booking con todas las garantías legales y técnicas.' },
      { name: 'Producción', text: 'Coordinamos logística, viajes, rider técnico y alojamiento hasta el día del evento.' },
    ],
  },
  en: {
    name: 'How to book a Cuban artist with Cubita Producciones',
    description: 'Step-by-step process to book Cuban artists for your festival, concert or event in Europe.',
    steps: [
      { name: 'Inquiry', text: 'Tell us about your event type, date, location and which artist you want to book via the form or email.' },
      { name: 'Confirmation', text: 'Within 24h you receive availability confirmation, pricing and booking conditions.' },
      { name: 'Contract', text: 'We sign the booking contract with full legal and technical guarantees.' },
      { name: 'Production', text: 'We coordinate logistics, travel, technical rider and accommodation up to the event day.' },
    ],
  },
  fr: {
    name: 'Comment réserver un artiste cubain avec Cubita Producciones',
    description: 'Processus étape par étape pour faire le booking d\'artistes cubains pour votre festival, concert ou événement en Europe.',
    steps: [
      { name: 'Demande', text: 'Indiquez-nous le type d\'événement, la date, le lieu et l\'artiste à réserver via le formulaire ou par email.' },
      { name: 'Confirmation', text: 'Sous 24h vous recevez la confirmation de disponibilité, le tarif et les conditions du booking.' },
      { name: 'Contrat', text: 'Nous signons le contrat de booking avec toutes les garanties légales et techniques.' },
      { name: 'Production', text: 'Nous coordonnons logistique, voyages, rider technique et hébergement jusqu\'au jour de l\'événement.' },
    ],
  },
  it: {
    name: 'Come prenotare un artista cubano con Cubita Producciones',
    description: 'Processo passo dopo passo per fare booking di artisti cubani per il tuo festival, concerto o evento in Europa.',
    steps: [
      { name: 'Richiesta', text: 'Indicaci tipo di evento, data, luogo e quale artista vuoi prenotare tramite il modulo o per email.' },
      { name: 'Conferma', text: 'Entro 24h ricevi conferma di disponibilità, preventivo e condizioni del booking.' },
      { name: 'Contratto', text: 'Firmiamo il contratto di booking con tutte le garanzie legali e tecniche.' },
      { name: 'Produzione', text: 'Coordiniamo logistica, viaggi, rider tecnico e alloggio fino al giorno dell\'evento.' },
    ],
  },
};

export function HowToBookingJsonLd({ locale, url }: HowToBookingJsonLdProps) {
  const content = HOW_TO_STEPS[locale] || HOW_TO_STEPS.es;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    '@id': `${url}#howto`,
    name: content.name,
    description: content.description,
    inLanguage: locale,
    totalTime: 'PT24H',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'EUR',
      value: '0',
    },
    step: content.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      url: `${url}#how-it-works`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface VideoObjectJsonLdProps {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate?: string;
  embedUrl: string;
  contentUrl?: string;
}

export function VideoObjectJsonLd({ name, description, thumbnailUrl, uploadDate, embedUrl, contentUrl }: VideoObjectJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl,
    uploadDate: uploadDate || '2024-01-01',
    embedUrl,
    contentUrl: contentUrl || embedUrl,
    publisher: {
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

interface ArtistEventsJsonLdProps {
  artistName: string;
  artistUrl: string;
  events: Array<{
    name: string;
    startDate: string;
    endDate: string;
    locationName: string;
    locationRegion: string;
    description: string;
  }>;
}

export function ArtistEventsJsonLd({ artistName, artistUrl, events }: ArtistEventsJsonLdProps) {
  if (!events.length) return null;

  const jsonLds = events.map((event, i) => ({
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    '@id': `${artistUrl}#event-${i + 1}`,
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.locationName,
      address: {
        '@type': 'PostalAddress',
        addressRegion: event.locationRegion,
        addressCountry: 'EU',
      },
    },
    performer: {
      '@type': 'MusicGroup',
      name: artistName,
      url: artistUrl,
    },
    organizer: {
      '@id': 'https://cubitaproducciones.com/#organization',
    },
    offers: {
      '@type': 'Offer',
      url: 'https://cubitaproducciones.com/contacto',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'EUR',
      validFrom: new Date().toISOString().split('T')[0],
    },
  }));

  return (
    <>
      {jsonLds.map((jsonLd, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ))}
    </>
  );
}

interface AggregateRatingJsonLdProps {
  reviews: Array<{
    author: string;
    rating: number;
    text: string;
    date: string;
    eventName?: string;
  }>;
  itemReviewedName: string;
  itemReviewedUrl: string;
}

export function AggregateRatingJsonLd({ reviews, itemReviewedName, itemReviewedUrl }: AggregateRatingJsonLdProps) {
  if (!reviews.length) return null;

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://cubitaproducciones.com/#organization',
    name: itemReviewedName,
    url: itemReviewedUrl,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avg.toFixed(1),
      reviewCount: reviews.length,
      bestRating: '5',
      worstRating: '1',
    },
    review: reviews.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      datePublished: r.date,
      reviewBody: r.text,
      name: r.eventName || `Review by ${r.author}`,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: String(r.rating),
        bestRating: '5',
        worstRating: '1',
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

interface BlogPostJsonLdProps {
  title: string;
  description: string;
  image: string | null;
  publishedAt: string;
  updatedAt: string;
  author: string;
  url: string;
  locale: string;
}

export function BlogPostJsonLd({ title, description, image, publishedAt, updatedAt, author, url, locale }: BlogPostJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#post`,
    headline: title,
    description,
    image: image || 'https://cubitaproducciones.com/og-image.jpg',
    datePublished: publishedAt,
    dateModified: updatedAt,
    inLanguage: locale,
    author: {
      '@type': 'Organization',
      name: author,
      '@id': 'https://cubitaproducciones.com/#organization',
    },
    publisher: {
      '@id': 'https://cubitaproducciones.com/#organization',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
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
  const localeFaqs = HOME_FAQS[locale] || HOME_FAQS.es;

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
