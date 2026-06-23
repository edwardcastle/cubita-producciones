import type { HomePage, AboutPage, ContactPage, ArtistsPage, SiteSettings } from './types';

export const HOME_PAGE: HomePage = {
  heroTitle: { es: 'Booking de Artistas Cubanos para Eventos y Festivales', en: 'Booking Cuban Artists for Events & Festivals', fr: 'Booking d\'Artistes Cubains pour Événements et Festivals', it: 'Booking Artisti Cubani per Eventi e Festival' },
  heroSubtitle: { es: 'Agencia de booking de artistas de salsa y reguetón en Europa', en: 'Salsa and reggaeton artist booking agency in Europe', fr: 'Agence de booking d\'artistes salsa et reggaeton en Europe', it: 'Agenzia di booking di artisti salsa e reggaeton in Europa' },
  stats: { years: 30, artists: 50, festivals: 100, countries: 15 },
  aboutTitle: { es: 'Sobre Nosotros', en: 'About Us', fr: 'À Propos', it: 'Chi Siamo' },
  aboutText: { es: 'Somos una agencia de booking de artistas cubanos con más de 30 años de experiencia contratando artistas para festivales y eventos en Europa.', en: 'We are a Cuban artist booking agency with over 30 years of experience booking artists for festivals and events in Europe.', fr: 'Nous sommes une agence de booking d\'artistes cubains avec plus de 30 ans d\'expérience dans la réservation d\'artistes pour festivals et événements en Europe.', it: 'Siamo un\'agenzia di booking di artisti cubani con oltre 30 anni di esperienza nella prenotazione di artisti per festival ed eventi in Europa.' },
  ctaText: { es: 'Ver Artistas', en: 'View Artists', fr: 'Voir les Artistes', it: 'Vedi Artisti' },
  heroImages: [],
  aboutVideo: null,
  seo: null,
};

export const ABOUT_PAGE: AboutPage = {
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

export const CONTACT_PAGE: ContactPage = {
  title: { es: 'Contacto', en: 'Contact', fr: 'Contact', it: 'Contatto' },
  subtitle: { es: 'Estamos aquí para ayudarte', en: 'We are here to help you', fr: 'Nous sommes là pour vous aider', it: 'Siamo qui per aiutarti' },
  email: 'info@cubitaproducciones.com',
  phone: '+39 327 607 8955',
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

export const ARTISTS_PAGE: ArtistsPage = {
  title: { es: 'Nuestros Artistas', en: 'Our Artists', fr: 'Nos Artistes', it: 'I Nostri Artisti' },
  subtitle: { es: 'Descubre el talento cubano', en: 'Discover Cuban talent', fr: 'Découvrez le talent cubain', it: 'Scopri il talento cubano' },
  viewDetailsButton: { es: 'Ver Detalles', en: 'View Details', fr: 'Voir Détails', it: 'Vedi Dettagli' },
  ctaTitle: { es: '¿Interesado en booking?', en: 'Interested in booking?', fr: 'Intéressé par une réservation?', it: 'Interessato a prenotare?' },
  ctaSubtitle: { es: 'Contacta con nosotros para más información', en: 'Contact us for more information', fr: 'Contactez-nous pour plus d\'informations', it: 'Contattaci per maggiori informazioni' },
  salsaLabel: { es: 'Salsa', en: 'Salsa', fr: 'Salsa', it: 'Salsa' },
  reggaetonLabel: { es: 'Reguetón', en: 'Reggaeton', fr: 'Reggaeton', it: 'Reggaeton' },
  seo: null,
};

export const SITE_SETTINGS: SiteSettings = {
  companyName: 'Cubita Producciones',
  logo: '/logo.jpeg',
  email: 'info@cubitaproducciones.com',
  phone: '+39 327 607 8955',
  location: 'Roma, Italia',
  instagram: undefined,
  facebook: undefined,
  youtube: undefined,
  nav: {
    home: { es: 'Inicio', en: 'Home', fr: 'Accueil', it: 'Home' },
    artists: { es: 'Artistas', en: 'Artists', fr: 'Artistes', it: 'Artisti' },
    about: { es: 'Sobre Nosotros', en: 'About Us', fr: 'À Propos', it: 'Chi Siamo' },
    contact: { es: 'Contacto', en: 'Contact', fr: 'Contact', it: 'Contatto' },
  },
  footerDescription: {
    es: 'Agencia de booking de artistas cubanos para eventos y festivales en Europa',
    en: 'Cuban artist booking agency for events and festivals in Europe',
    fr: 'Agence de booking d\'artistes cubains pour événements et festivals en Europe',
    it: 'Agenzia di booking di artisti cubani per eventi e festival in Europa',
  },
  footerCopyright: {
    es: 'Todos los derechos reservados',
    en: 'All rights reserved',
    fr: 'Tous droits réservés',
    it: 'Tutti i diritti riservati',
  },
};
