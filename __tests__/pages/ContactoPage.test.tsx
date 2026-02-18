import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock the data fetchers
vi.mock('@/lib/strapi', () => ({
  getContactPage: vi.fn(() =>
    Promise.resolve({
      title: {
        es: 'Contacto',
        en: 'Contact',
        fr: 'Contact',
        it: 'Contatto',
      },
      subtitle: {
        es: 'Estamos aquí para ayudarte',
        en: 'We are here to help you',
        fr: 'Nous sommes là pour vous aider',
        it: 'Siamo qui per aiutarti',
      },
      email: 'booking@cubitaproducciones.com',
      phone: '+39 320 936 5048',
      location: 'Roma, Italia',
      responseTimeTitle: {
        es: 'Respuesta Rápida',
        en: 'Quick Response',
        fr: 'Réponse Rapide',
        it: 'Risposta Rapida',
      },
      responseTimeText: {
        es: 'Respondemos en menos de 24 horas',
        en: 'We respond within 24 hours',
        fr: 'Nous répondons sous 24 heures',
        it: 'Rispondiamo entro 24 ore',
      },
      formLabels: {
        name: { es: 'Nombre', en: 'Name', fr: 'Nom', it: 'Nome' },
        email: { es: 'Email', en: 'Email', fr: 'Email', it: 'Email' },
        country: { es: 'País', en: 'Country', fr: 'Pays', it: 'Paese' },
        date: { es: 'Fecha del evento', en: 'Event date', fr: 'Date de l\'événement', it: 'Data evento' },
        artist: { es: 'Artista de interés', en: 'Artist of interest', fr: 'Artiste d\'intérêt', it: 'Artista di interesse' },
        message: { es: 'Mensaje', en: 'Message', fr: 'Message', it: 'Messaggio' },
        submit: { es: 'Enviar mensaje', en: 'Send message', fr: 'Envoyer le message', it: 'Invia messaggio' },
      },
      successMessage: {
        es: 'Mensaje enviado correctamente',
        en: 'Message sent successfully',
        fr: 'Message envoyé avec succès',
        it: 'Messaggio inviato con successo',
      },
      errorMessage: {
        es: 'Error al enviar el mensaje',
        en: 'Error sending message',
        fr: 'Erreur lors de l\'envoi du message',
        it: 'Errore nell\'invio del messaggio',
      },
      seo: null,
    })
  ),
  getArtists: vi.fn(() =>
    Promise.resolve([
      { id: '1', name: 'Artist One' },
      { id: '2', name: 'Artist Two' },
    ])
  ),
  generateMetadataFromSEO: vi.fn(() => ({
    title: 'Contacto - Cubita Producciones',
    description: 'Test Description',
  })),
}));

// Mock next-intl/server
vi.mock('next-intl/server', () => ({
  getLocale: vi.fn(() => Promise.resolve('es')),
}));

describe('ContactoPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders page title', async () => {
      const ContactoPage = (await import('@/app/[locale]/contacto/page')).default;

      render(await ContactoPage());

      expect(screen.getByText('Contacto')).toBeInTheDocument();
    });

    it('renders page subtitle', async () => {
      const ContactoPage = (await import('@/app/[locale]/contacto/page')).default;

      render(await ContactoPage());

      expect(screen.getByText('Estamos aquí para ayudarte')).toBeInTheDocument();
    });

    it('renders email address', async () => {
      const ContactoPage = (await import('@/app/[locale]/contacto/page')).default;

      render(await ContactoPage());

      expect(screen.getByText('booking@cubitaproducciones.com')).toBeInTheDocument();
    });

    it('renders phone number', async () => {
      const ContactoPage = (await import('@/app/[locale]/contacto/page')).default;

      render(await ContactoPage());

      expect(screen.getByText('+39 320 936 5048')).toBeInTheDocument();
    });

    it('renders location', async () => {
      const ContactoPage = (await import('@/app/[locale]/contacto/page')).default;

      render(await ContactoPage());

      expect(screen.getByText('Roma, Italia')).toBeInTheDocument();
    });

    it('renders response time card', async () => {
      const ContactoPage = (await import('@/app/[locale]/contacto/page')).default;

      render(await ContactoPage());

      expect(screen.getByText('Respuesta Rápida')).toBeInTheDocument();
      expect(screen.getByText('Respondemos en menos de 24 horas')).toBeInTheDocument();
    });
  });

  describe('Contact Form', () => {
    it('renders contact form', async () => {
      const ContactoPage = (await import('@/app/[locale]/contacto/page')).default;

      render(await ContactoPage());

      expect(document.querySelector('form')).toBeInTheDocument();
    });

    it('renders form with correct labels', async () => {
      const ContactoPage = (await import('@/app/[locale]/contacto/page')).default;

      render(await ContactoPage());

      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/país/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mensaje/i)).toBeInTheDocument();
    });

    it('renders artist select with artists', async () => {
      const ContactoPage = (await import('@/app/[locale]/contacto/page')).default;

      render(await ContactoPage());

      expect(screen.getByText('Artist One')).toBeInTheDocument();
      expect(screen.getByText('Artist Two')).toBeInTheDocument();
    });

    it('renders submit button', async () => {
      const ContactoPage = (await import('@/app/[locale]/contacto/page')).default;

      render(await ContactoPage());

      expect(screen.getByRole('button', { name: /enviar mensaje/i })).toBeInTheDocument();
    });
  });

  describe('Contact Info Section', () => {
    it('renders Email label', async () => {
      const ContactoPage = (await import('@/app/[locale]/contacto/page')).default;

      render(await ContactoPage());

      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('renders Telefono label for Spanish', async () => {
      const ContactoPage = (await import('@/app/[locale]/contacto/page')).default;

      render(await ContactoPage());

      expect(screen.getByText('Telefono')).toBeInTheDocument();
    });

    it('renders Ubicacion label for Spanish', async () => {
      const ContactoPage = (await import('@/app/[locale]/contacto/page')).default;

      render(await ContactoPage());

      expect(screen.getByText('Ubicacion')).toBeInTheDocument();
    });
  });

  describe('Structure', () => {
    it('has header section', async () => {
      const ContactoPage = (await import('@/app/[locale]/contacto/page')).default;

      render(await ContactoPage());

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Contacto');
    });

    it('has two column layout on desktop', async () => {
      const ContactoPage = (await import('@/app/[locale]/contacto/page')).default;

      const { container } = render(await ContactoPage());

      const grid = container.querySelector('.lg\\:grid-cols-3');
      expect(grid).toBeInTheDocument();
    });

    it('form takes 2 columns on desktop', async () => {
      const ContactoPage = (await import('@/app/[locale]/contacto/page')).default;

      const { container } = render(await ContactoPage());

      const formColumn = container.querySelector('.lg\\:col-span-2');
      expect(formColumn).toBeInTheDocument();
    });
  });

  describe('Metadata', () => {
    it('generates correct metadata', async () => {
      const { generateMetadata } = await import('@/app/[locale]/contacto/page');

      const metadata = await generateMetadata();

      expect(metadata).toBeDefined();
      expect(metadata.title).toContain('Contacto');
    });
  });
});
