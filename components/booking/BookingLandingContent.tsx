import { Link } from '@/i18n/routing';
import { ArrowRight, CheckCircle2, Globe, Music2, Calendar, Headphones, Award } from 'lucide-react';
import FadeIn from '@/components/ui/FadeIn';
import StaggerContainer, { StaggerItem } from '@/components/ui/StaggerContainer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

type Locale = 'es' | 'en' | 'fr' | 'it';

const COPY = {
  es: {
    breadcrumbHome: 'Home',
    breadcrumb: 'Booking de Artistas en Europa',
    h1: 'Booking de Artistas en Europa: Artistas Cubanos para Festivales y Eventos',
    subtitle: 'Booking de artistas en Europa con más de 30 años de experiencia. Agencia oficial que hace booking de artistas cubanos de salsa, reguetón y timba para festivales, conciertos, fiestas privadas y eventos corporativos en toda Europa.',
    ctaPrimary: 'Solicitar Booking',
    ctaSecondary: 'Ver Catálogo de Artistas',
    statsTitle: 'Booking artistas cubanos en cifras',
    stats: [
      { value: '30+', label: 'Años haciendo booking de artistas' },
      { value: '50+', label: 'Artistas cubanos en catálogo' },
      { value: '100+', label: 'Festivales y eventos al año' },
      { value: '15+', label: 'Países en Europa' },
    ],
    whyTitle: '¿Por qué hacer booking con Cubita Producciones?',
    whyIntro: 'Somos la agencia especializada en booking de artistas en Europa. Hacemos booking de artistas cubanos para festivales, conciertos y eventos en toda Europa. Nuestro servicio cubre todo el proceso: desde la consulta de disponibilidad hasta la producción del evento.',
    whyBullets: [
      { title: 'Booking directo con los artistas', text: 'Trabajamos como agencia oficial con relación directa con los artistas, sin intermediarios.' },
      { title: 'Respuesta en menos de 24 horas', text: 'Solicita disponibilidad y presupuesto para tu evento y recibirás respuesta en un día laborable.' },
      { title: 'Cobertura en toda Europa', text: 'Booking de artistas para festivales, conciertos, eventos corporativos y fiestas privadas en España, Italia, Francia, Alemania, Suiza y más.' },
      { title: 'Producción integral', text: 'Además del booking, gestionamos logística internacional, rider técnico, alojamiento y transporte de artistas.' },
      { title: 'Más de 30 años de experiencia', text: 'Tres décadas contratando artistas cubanos para los principales festivales y promotores europeos.' },
      { title: 'Atención multilingüe', text: 'Equipo que habla español, inglés, francés e italiano para gestionar tu booking en tu idioma.' },
    ],
    artistsTitle: 'Artistas disponibles para booking',
    artistsIntro: 'Algunos de los artistas cubanos que representamos para festivales y eventos en Europa:',
    artistsList: [{ name: 'Jacob Forever', slug: 'jacob-forever' }, { name: 'Manolín "El Médico de la Salsa"', slug: 'manolin' }, { name: 'El Micha', slug: 'el-micha' }, { name: 'Charly & Johayron', slug: 'charly-johayron' }, { name: 'Ja Rulay', slug: 'ja-rulay' }, { name: 'Y muchos más' }],
    artistsCta: 'Ver catálogo completo',
    howTitle: 'Cómo funciona el booking',
    howSteps: [
      { n: '1', title: 'Solicitud', text: 'Cuéntanos el tipo de evento, fecha, lugar y qué artista quieres contratar a través del formulario o por email.' },
      { n: '2', title: 'Confirmación', text: 'En menos de 24h recibirás confirmación de disponibilidad, presupuesto y condiciones del booking.' },
      { n: '3', title: 'Contrato', text: 'Firmamos contrato de booking con todas las garantías legales y técnicas.' },
      { n: '4', title: 'Producción', text: 'Coordinamos logística, viajes, rider técnico y alojamiento hasta el día del evento.' },
    ],
    coverageTitle: 'Booking de artistas en Europa: cobertura geográfica',
    coverageText: 'Hacemos booking de artistas en Europa para festivales, conciertos y eventos. Booking de artistas cubanos disponible en toda Europa. Países donde operamos habitualmente:',
    countries: ['España', 'Italia', 'Francia', 'Alemania', 'Suiza', 'Bélgica', 'Países Bajos', 'Austria', 'Portugal', 'Reino Unido', 'Grecia', 'Polonia'],
    eventsTitle: 'Tipos de eventos para los que ofrecemos booking',
    eventTypes: [
      'Festivales de música latina y salsa',
      'Conciertos en salas y teatros',
      'Eventos corporativos y galas',
      'Fiestas privadas y bodas',
      'Cruceros temáticos de salsa',
      'Congresos de baile y festivales de salsa',
    ],
    finalCtaTitle: '¿Quieres hacer booking de un artista cubano para tu evento?',
    finalCtaText: 'Solicita disponibilidad y presupuesto sin compromiso. Te respondemos en menos de 24 horas.',
    finalCtaButton: 'Contactar para Booking',
  },
  en: {
    breadcrumbHome: 'Home',
    breadcrumb: 'Booking Artists in Europe',
    h1: 'Booking Artists in Europe: Cuban Artists for Festivals and Events',
    subtitle: 'Booking artists in Europe with over 30 years of experience. Official booking agency booking Cuban salsa, reggaeton and timba artists for festivals, concerts, private parties and corporate events across Europe.',
    ctaPrimary: 'Request Booking',
    ctaSecondary: 'View Artist Roster',
    statsTitle: 'Booking Cuban artists by the numbers',
    stats: [
      { value: '30+', label: 'Years booking artists' },
      { value: '50+', label: 'Cuban artists in roster' },
      { value: '100+', label: 'Festivals and events per year' },
      { value: '15+', label: 'European countries' },
    ],
    whyTitle: 'Why book artists with Cubita Producciones?',
    whyIntro: 'We are the specialized agency for booking artists in Europe. We book Cuban artists for festivals, concerts and events across Europe. Our service covers the entire process: from availability inquiry to event production.',
    whyBullets: [
      { title: 'Direct booking with artists', text: 'We work as official agency with direct relationships with the artists, no middlemen.' },
      { title: 'Response within 24 hours', text: 'Request availability and pricing for your event and get a response within one business day.' },
      { title: 'Europe-wide coverage', text: 'Booking artists for festivals, concerts, corporate events and private parties in Spain, Italy, France, Germany, Switzerland and more.' },
      { title: 'Full event production', text: 'Beyond booking, we handle international logistics, technical rider, accommodation and artist transport.' },
      { title: 'Over 30 years experience', text: 'Three decades booking Cuban artists for major European festivals and promoters.' },
      { title: 'Multilingual support', text: 'Team that speaks Spanish, English, French and Italian to handle your booking in your language.' },
    ],
    artistsTitle: 'Artists available for booking',
    artistsIntro: 'Some of the Cuban artists we represent for festivals and events in Europe:',
    artistsList: [{ name: 'Jacob Forever', slug: 'jacob-forever' }, { name: 'Manolín "El Médico de la Salsa"', slug: 'manolin' }, { name: 'El Micha', slug: 'el-micha' }, { name: 'Charly & Johayron', slug: 'charly-johayron' }, { name: 'Ja Rulay', slug: 'ja-rulay' }, { name: 'And many more' }],
    artistsCta: 'View full roster',
    howTitle: 'How the booking works',
    howSteps: [
      { n: '1', title: 'Inquiry', text: 'Tell us about your event type, date, location and which artist you want to book via the form or email.' },
      { n: '2', title: 'Confirmation', text: 'Within 24h you receive availability confirmation, pricing and booking conditions.' },
      { n: '3', title: 'Contract', text: 'We sign the booking contract with full legal and technical guarantees.' },
      { n: '4', title: 'Production', text: 'We coordinate logistics, travel, technical rider and accommodation up to the event day.' },
    ],
    coverageTitle: 'Booking artists in Europe: coverage area',
    coverageText: 'We do booking of artists in Europe for festivals, concerts and events. Booking Cuban artists available all over Europe. Countries we regularly operate in:',
    countries: ['Spain', 'Italy', 'France', 'Germany', 'Switzerland', 'Belgium', 'Netherlands', 'Austria', 'Portugal', 'United Kingdom', 'Greece', 'Poland'],
    eventsTitle: 'Types of events we book artists for',
    eventTypes: [
      'Latin music and salsa festivals',
      'Concerts in venues and theatres',
      'Corporate events and galas',
      'Private parties and weddings',
      'Themed salsa cruises',
      'Dance congresses and salsa festivals',
    ],
    finalCtaTitle: 'Want to book a Cuban artist for your event?',
    finalCtaText: 'Request availability and a quote with no commitment. We reply within 24 hours.',
    finalCtaButton: 'Contact for Booking',
  },
  fr: {
    breadcrumbHome: 'Home',
    breadcrumb: 'Booking d\'Artistes en Europe',
    h1: 'Booking d\'Artistes en Europe : Artistes Cubains pour Festivals et Événements',
    subtitle: 'Booking d\'artistes en Europe avec plus de 30 ans d\'expérience. Agence officielle qui fait le booking d\'artistes cubains de salsa, reggaeton et timba pour festivals, concerts, soirées privées et événements corporatifs en Europe.',
    ctaPrimary: 'Demander un Booking',
    ctaSecondary: 'Voir le Catalogue d\'Artistes',
    statsTitle: 'Booking d\'artistes cubains en chiffres',
    stats: [
      { value: '30+', label: 'Années de booking d\'artistes' },
      { value: '50+', label: 'Artistes cubains au catalogue' },
      { value: '100+', label: 'Festivals et événements par an' },
      { value: '15+', label: 'Pays en Europe' },
    ],
    whyTitle: 'Pourquoi faire le booking avec Cubita Producciones ?',
    whyIntro: 'Nous sommes l\'agence spécialisée dans le booking d\'artistes en Europe. Nous faisons le booking d\'artistes cubains pour festivals, concerts et événements en Europe. Notre service couvre l\'ensemble du processus : de la demande de disponibilité à la production de l\'événement.',
    whyBullets: [
      { title: 'Booking direct avec les artistes', text: 'Nous travaillons comme agence officielle avec une relation directe avec les artistes, sans intermédiaires.' },
      { title: 'Réponse sous 24 heures', text: 'Demandez disponibilité et tarif pour votre événement et recevez une réponse sous un jour ouvré.' },
      { title: 'Couverture européenne', text: 'Booking d\'artistes pour festivals, concerts, événements corporatifs et soirées privées en Espagne, Italie, France, Allemagne, Suisse et plus.' },
      { title: 'Production complète', text: 'Au-delà du booking, nous gérons la logistique internationale, le rider technique, l\'hébergement et le transport des artistes.' },
      { title: 'Plus de 30 ans d\'expérience', text: 'Trois décennies à faire le booking d\'artistes cubains pour les principaux festivals et promoteurs européens.' },
      { title: 'Support multilingue', text: 'Équipe qui parle espagnol, anglais, français et italien pour gérer votre booking dans votre langue.' },
    ],
    artistsTitle: 'Artistes disponibles pour booking',
    artistsIntro: 'Quelques-uns des artistes cubains que nous représentons pour festivals et événements en Europe :',
    artistsList: [{ name: 'Jacob Forever', slug: 'jacob-forever' }, { name: 'Manolín "El Médico de la Salsa"', slug: 'manolin' }, { name: 'El Micha', slug: 'el-micha' }, { name: 'Charly & Johayron', slug: 'charly-johayron' }, { name: 'Ja Rulay', slug: 'ja-rulay' }, { name: 'Et bien plus' }],
    artistsCta: 'Voir le catalogue complet',
    howTitle: 'Comment fonctionne le booking',
    howSteps: [
      { n: '1', title: 'Demande', text: 'Indiquez-nous le type d\'événement, la date, le lieu et l\'artiste à réserver via le formulaire ou par email.' },
      { n: '2', title: 'Confirmation', text: 'Sous 24h vous recevez la confirmation de disponibilité, le tarif et les conditions du booking.' },
      { n: '3', title: 'Contrat', text: 'Nous signons le contrat de booking avec toutes les garanties légales et techniques.' },
      { n: '4', title: 'Production', text: 'Nous coordonnons logistique, voyages, rider technique et hébergement jusqu\'au jour de l\'événement.' },
    ],
    coverageTitle: 'Booking d\'artistes en Europe : couverture géographique',
    coverageText: 'Nous faisons le booking d\'artistes en Europe pour festivals, concerts et événements. Booking d\'artistes cubains disponible dans toute l\'Europe. Pays où nous opérons régulièrement :',
    countries: ['Espagne', 'Italie', 'France', 'Allemagne', 'Suisse', 'Belgique', 'Pays-Bas', 'Autriche', 'Portugal', 'Royaume-Uni', 'Grèce', 'Pologne'],
    eventsTitle: 'Types d\'événements pour lesquels nous offrons le booking',
    eventTypes: [
      'Festivals de musique latine et salsa',
      'Concerts en salles et théâtres',
      'Événements corporatifs et galas',
      'Soirées privées et mariages',
      'Croisières thématiques salsa',
      'Congrès de danse et festivals de salsa',
    ],
    finalCtaTitle: 'Vous voulez faire le booking d\'un artiste cubain pour votre événement ?',
    finalCtaText: 'Demandez disponibilité et devis sans engagement. Réponse sous 24 heures.',
    finalCtaButton: 'Contacter pour un Booking',
  },
  it: {
    breadcrumbHome: 'Home',
    breadcrumb: 'Booking di Artisti in Europa',
    h1: 'Booking di Artisti in Europa: Artisti Cubani per Festival ed Eventi',
    subtitle: 'Booking di artisti in Europa con oltre 30 anni di esperienza. Agenzia ufficiale che fa booking di artisti cubani di salsa, reggaeton e timba per festival, concerti, feste private ed eventi aziendali in tutta Europa.',
    ctaPrimary: 'Richiedi Booking',
    ctaSecondary: 'Vedi Catalogo Artisti',
    statsTitle: 'Booking artisti cubani in numeri',
    stats: [
      { value: '30+', label: 'Anni di booking artisti' },
      { value: '50+', label: 'Artisti cubani in catalogo' },
      { value: '100+', label: 'Festival ed eventi all\'anno' },
      { value: '15+', label: 'Paesi in Europa' },
    ],
    whyTitle: 'Perché fare il booking con Cubita Producciones?',
    whyIntro: 'Siamo l\'agenzia specializzata nel booking di artisti in Europa. Facciamo booking di artisti cubani per festival, concerti ed eventi in tutta Europa. Il nostro servizio copre l\'intero processo: dalla richiesta di disponibilità alla produzione dell\'evento.',
    whyBullets: [
      { title: 'Booking diretto con gli artisti', text: 'Lavoriamo come agenzia ufficiale con relazione diretta con gli artisti, senza intermediari.' },
      { title: 'Risposta entro 24 ore', text: 'Richiedi disponibilità e preventivo per il tuo evento e ricevi risposta entro un giorno lavorativo.' },
      { title: 'Copertura in tutta Europa', text: 'Booking artisti per festival, concerti, eventi aziendali e feste private in Spagna, Italia, Francia, Germania, Svizzera e altro.' },
      { title: 'Produzione integrale', text: 'Oltre al booking, gestiamo logistica internazionale, rider tecnico, alloggio e trasporto degli artisti.' },
      { title: 'Oltre 30 anni di esperienza', text: 'Tre decenni di booking di artisti cubani per i principali festival e promotori europei.' },
      { title: 'Assistenza multilingue', text: 'Team che parla spagnolo, inglese, francese e italiano per gestire il tuo booking nella tua lingua.' },
    ],
    artistsTitle: 'Artisti disponibili per booking',
    artistsIntro: 'Alcuni degli artisti cubani che rappresentiamo per festival ed eventi in Europa:',
    artistsList: [{ name: 'Jacob Forever', slug: 'jacob-forever' }, { name: 'Manolín "El Médico de la Salsa"', slug: 'manolin' }, { name: 'El Micha', slug: 'el-micha' }, { name: 'Charly & Johayron', slug: 'charly-johayron' }, { name: 'Ja Rulay', slug: 'ja-rulay' }, { name: 'E molti altri' }],
    artistsCta: 'Vedi catalogo completo',
    howTitle: 'Come funziona il booking',
    howSteps: [
      { n: '1', title: 'Richiesta', text: 'Indicaci tipo di evento, data, luogo e quale artista vuoi prenotare tramite il modulo o per email.' },
      { n: '2', title: 'Conferma', text: 'Entro 24h ricevi conferma di disponibilità, preventivo e condizioni del booking.' },
      { n: '3', title: 'Contratto', text: 'Firmiamo il contratto di booking con tutte le garanzie legali e tecniche.' },
      { n: '4', title: 'Produzione', text: 'Coordiniamo logistica, viaggi, rider tecnico e alloggio fino al giorno dell\'evento.' },
    ],
    coverageTitle: 'Booking di artisti in Europa: copertura geografica',
    coverageText: 'Facciamo booking di artisti in Europa per festival, concerti ed eventi. Booking di artisti cubani disponibile in tutta Europa. Paesi in cui operiamo regolarmente:',
    countries: ['Spagna', 'Italia', 'Francia', 'Germania', 'Svizzera', 'Belgio', 'Paesi Bassi', 'Austria', 'Portogallo', 'Regno Unito', 'Grecia', 'Polonia'],
    eventsTitle: 'Tipi di eventi per cui offriamo il booking',
    eventTypes: [
      'Festival di musica latina e salsa',
      'Concerti in sale e teatri',
      'Eventi aziendali e gala',
      'Feste private e matrimoni',
      'Crociere a tema salsa',
      'Congressi di ballo e festival di salsa',
    ],
    finalCtaTitle: 'Vuoi fare il booking di un artista cubano per il tuo evento?',
    finalCtaText: 'Richiedi disponibilità e preventivo senza impegno. Rispondiamo entro 24 ore.',
    finalCtaButton: 'Contatta per un Booking',
  },
} as const;

export default function BookingLandingContent({ locale }: { locale: Locale }) {
  const c = COPY[locale];

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white py-12 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4">
            <Breadcrumbs
              variant="dark"
              items={[
                { label: c.breadcrumbHome, href: '/' },
                { label: c.breadcrumb },
              ]}
            />
          </div>
          <div className="max-w-4xl">
            <p className="text-amber-500 text-sm md:text-base font-semibold tracking-widest uppercase mb-3 md:mb-4">
              Cubita Producciones
            </p>
            <FadeIn direction="down">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
                {c.h1}
              </h1>
            </FadeIn>
            <FadeIn direction="down" delay={0.15}>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 text-gray-300">
                {c.subtitle}
              </p>
            </FadeIn>
            <FadeIn direction="up" delay={0.3}>
              <div className="flex flex-wrap gap-3 md:gap-4">
                <Link
                  href="/contacto"
                  className="inline-flex items-center gap-2 bg-amber-500 text-black px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-amber-400 transition-colors"
                >
                  {c.ctaPrimary}
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </Link>
                <Link
                  href="/artistas"
                  className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-white/10 transition-colors"
                >
                  {c.ctaSecondary}
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <FadeIn direction="up">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-10 text-center">
              {c.statsTitle}
            </h2>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center" staggerDelay={0.1}>
            {c.stats.map((s) => (
              <StaggerItem key={s.label}>
                <div className="p-3 md:p-6">
                  <div className="text-3xl md:text-5xl font-bold text-amber-600 mb-1 md:mb-2">{s.value}</div>
                  <div className="text-xs md:text-base text-gray-600">{s.label}</div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <FadeIn direction="up">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6 text-center">
              {c.whyTitle}
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-8 md:mb-12 text-center max-w-3xl mx-auto">
              {c.whyIntro}
            </p>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" staggerDelay={0.08}>
            {c.whyBullets.map((b) => (
              <StaggerItem key={b.title}>
                <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-amber-600 shrink-0 mt-0.5" />
                    <h3 className="text-base md:text-lg font-bold text-gray-900">{b.title}</h3>
                  </div>
                  <p className="text-sm md:text-base text-gray-600">{b.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="py-12 md:py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <FadeIn direction="up">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6 text-center">
              {c.artistsTitle}
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-10 text-center">
              {c.artistsIntro}
            </p>
          </FadeIn>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10">
            {c.artistsList.map((a) => {
              const href = 'slug' in a ? `/artistas/${a.slug}` : '/artistas';
              return (
                <li key={a.name}>
                  <Link
                    href={href}
                    className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 hover:shadow-md hover:border-amber-300 transition-all"
                  >
                    <Music2 className="w-4 h-4 md:w-5 md:h-5 text-amber-600 shrink-0" />
                    <span className="text-sm md:text-base font-semibold text-gray-900">{a.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="text-center">
            <Link
              href="/artistas"
              className="inline-flex items-center gap-2 text-amber-700 font-semibold hover:text-amber-900"
            >
              {c.artistsCta}
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeIn direction="up">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-12 text-center">
              {c.howTitle}
            </h2>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" staggerDelay={0.1}>
            {c.howSteps.map((s) => (
              <StaggerItem key={s.n}>
                <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-xl p-5 md:p-6 h-full">
                  <div className="text-4xl md:text-5xl font-bold text-amber-500 mb-3">{s.n}</div>
                  <h3 className="text-base md:text-lg font-bold mb-2">{s.title}</h3>
                  <p className="text-sm md:text-base text-gray-300">{s.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="py-12 md:py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          <FadeIn direction="left">
            <div>
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <Globe className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{c.coverageTitle}</h2>
              </div>
              <p className="text-base md:text-lg text-gray-600 mb-4 md:mb-6">{c.coverageText}</p>
              <ul className="flex flex-wrap gap-2">
                {c.countries.map((country) => (
                  <li
                    key={country}
                    className="bg-white border border-gray-200 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium text-gray-800"
                  >
                    {country}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
          <FadeIn direction="right" delay={0.15}>
            <div>
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <Calendar className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{c.eventsTitle}</h2>
              </div>
              <ul className="space-y-2 md:space-y-3">
                {c.eventTypes.map((e) => (
                  <li key={e} className="flex items-start gap-2 text-sm md:text-base text-gray-700">
                    <Headphones className="w-4 h-4 md:w-5 md:h-5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-gray-900 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn direction="up">
            <Award className="w-10 h-10 md:w-14 md:h-14 text-amber-500 mx-auto mb-4 md:mb-6" />
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">{c.finalCtaTitle}</h2>
            <p className="text-base md:text-xl text-gray-300 mb-6 md:mb-8">{c.finalCtaText}</p>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 bg-amber-500 text-black px-6 py-3 md:px-8 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-amber-400 transition-colors"
            >
              {c.finalCtaButton}
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
