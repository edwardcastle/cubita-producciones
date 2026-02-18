import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock the data fetchers
vi.mock('@/lib/strapi', () => ({
  getAboutPage: vi.fn(() =>
    Promise.resolve({
      title: {
        es: 'Sobre Nosotros',
        en: 'About Us',
        fr: 'À Propos',
        it: 'Chi Siamo',
      },
      subtitle: {
        es: 'Más de 30 años de experiencia',
        en: 'Over 30 years of experience',
        fr: 'Plus de 30 ans d\'expérience',
        it: 'Oltre 30 anni di esperienza',
      },
      missionTitle: {
        es: 'Nuestra Misión',
        en: 'Our Mission',
        fr: 'Notre Mission',
        it: 'La Nostra Missione',
      },
      missionText: {
        es: 'Conectar el talento cubano con el mundo.',
        en: 'Connecting Cuban talent with the world.',
        fr: 'Connecter le talent cubain avec le monde.',
        it: 'Collegare il talento cubano con il mondo.',
      },
      stats: {
        years: 30,
        festivals: 100,
        countries: 15,
        artists: 50,
      },
      services: [
        {
          title: { es: 'Booking', en: 'Booking', fr: 'Réservation', it: 'Prenotazione' },
          text: { es: 'Gestión completa', en: 'Complete management', fr: 'Gestion complète', it: 'Gestione completa' },
        },
        {
          title: { es: 'Producción', en: 'Production', fr: 'Production', it: 'Produzione' },
          text: { es: 'Eventos y conciertos', en: 'Events and concerts', fr: 'Événements et concerts', it: 'Eventi e concerti' },
        },
        {
          title: { es: 'Tours', en: 'Tours', fr: 'Tournées', it: 'Tour' },
          text: { es: 'Giras internacionales', en: 'International tours', fr: 'Tournées internationales', it: 'Tour internazionali' },
        },
      ],
      seo: null,
    })
  ),
  generateMetadataFromSEO: vi.fn(() => ({
    title: 'Sobre Nosotros - Cubita Producciones',
    description: 'Test Description',
  })),
}));

// Mock next-intl/server
vi.mock('next-intl/server', () => ({
  getLocale: vi.fn(() => Promise.resolve('es')),
  getTranslations: vi.fn(() =>
    Promise.resolve((key: string) => {
      const translations: Record<string, string> = {
        'about.experience': 'años de experiencia',
        'home.stats.festivals': 'Festivales',
        'home.stats.countries': 'Países',
        'artists.title': 'Artistas',
        'about.professionalism': 'Profesionalismo',
        'about.response': 'Respuesta',
        'about.years': 'Años',
        'about.services': 'Nuestros Servicios',
        'about.ctaTitle': 'Trabaja con nosotros',
        'about.ctaSubtitle': 'Estamos aquí para ayudarte',
        'nav.contact': 'Contacto',
      };
      return translations[key] || key;
    })
  ),
}));

describe('SobreNosotrosPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders page title', async () => {
      const SobreNosotrosPage = (await import('@/app/[locale]/sobre-nosotros/page')).default;

      render(await SobreNosotrosPage());

      expect(screen.getByText('Sobre Nosotros')).toBeInTheDocument();
    });

    it('renders page subtitle', async () => {
      const SobreNosotrosPage = (await import('@/app/[locale]/sobre-nosotros/page')).default;

      render(await SobreNosotrosPage());

      expect(screen.getByText('Más de 30 años de experiencia')).toBeInTheDocument();
    });

    it('renders stats section', async () => {
      const SobreNosotrosPage = (await import('@/app/[locale]/sobre-nosotros/page')).default;

      render(await SobreNosotrosPage());

      expect(screen.getAllByText('30+').length).toBeGreaterThan(0);
      expect(screen.getByText('100+')).toBeInTheDocument();
      expect(screen.getByText('15+')).toBeInTheDocument();
      expect(screen.getByText('50+')).toBeInTheDocument();
    });

    it('renders mission section', async () => {
      const SobreNosotrosPage = (await import('@/app/[locale]/sobre-nosotros/page')).default;

      render(await SobreNosotrosPage());

      expect(screen.getByText('Nuestra Misión')).toBeInTheDocument();
      expect(screen.getByText('Conectar el talento cubano con el mundo.')).toBeInTheDocument();
    });

    it('renders services section', async () => {
      const SobreNosotrosPage = (await import('@/app/[locale]/sobre-nosotros/page')).default;

      render(await SobreNosotrosPage());

      expect(screen.getByText('Nuestros Servicios')).toBeInTheDocument();
    });

    it('renders all services', async () => {
      const SobreNosotrosPage = (await import('@/app/[locale]/sobre-nosotros/page')).default;

      render(await SobreNosotrosPage());

      expect(screen.getByText('Booking')).toBeInTheDocument();
      expect(screen.getByText('Producción')).toBeInTheDocument();
      expect(screen.getByText('Tours')).toBeInTheDocument();
    });

    it('renders service descriptions', async () => {
      const SobreNosotrosPage = (await import('@/app/[locale]/sobre-nosotros/page')).default;

      render(await SobreNosotrosPage());

      expect(screen.getByText('Gestión completa')).toBeInTheDocument();
      expect(screen.getByText('Eventos y conciertos')).toBeInTheDocument();
      expect(screen.getByText('Giras internacionales')).toBeInTheDocument();
    });

    it('renders CTA section', async () => {
      const SobreNosotrosPage = (await import('@/app/[locale]/sobre-nosotros/page')).default;

      render(await SobreNosotrosPage());

      expect(screen.getByText('Trabaja con nosotros')).toBeInTheDocument();
      expect(screen.getByText('Estamos aquí para ayudarte')).toBeInTheDocument();
    });
  });

  describe('Stats Details', () => {
    it('renders stat labels', async () => {
      const SobreNosotrosPage = (await import('@/app/[locale]/sobre-nosotros/page')).default;

      render(await SobreNosotrosPage());

      expect(screen.getAllByText('años de experiencia').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Festivales').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Países').length).toBeGreaterThan(0);
    });

    it('renders mission grid stats', async () => {
      const SobreNosotrosPage = (await import('@/app/[locale]/sobre-nosotros/page')).default;

      render(await SobreNosotrosPage());

      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.getByText('24h')).toBeInTheDocument();
      expect(screen.getByText('Top')).toBeInTheDocument();
    });
  });

  describe('Links', () => {
    it('CTA links to contact page', async () => {
      const SobreNosotrosPage = (await import('@/app/[locale]/sobre-nosotros/page')).default;

      render(await SobreNosotrosPage());

      const contactLink = screen.getByText('Contacto').closest('a');
      expect(contactLink).toHaveAttribute('href', '/contacto');
    });
  });

  describe('Structure', () => {
    it('has hero section', async () => {
      const SobreNosotrosPage = (await import('@/app/[locale]/sobre-nosotros/page')).default;

      render(await SobreNosotrosPage());

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Sobre Nosotros');
    });

    it('has services grid with 3 services', async () => {
      const SobreNosotrosPage = (await import('@/app/[locale]/sobre-nosotros/page')).default;

      const { container } = render(await SobreNosotrosPage());

      // Check for service grid
      const serviceSection = container.querySelector('.md\\:grid-cols-3');
      expect(serviceSection).toBeInTheDocument();
    });
  });

  describe('Metadata', () => {
    it('generates correct metadata', async () => {
      const { generateMetadata } = await import('@/app/[locale]/sobre-nosotros/page');

      const metadata = await generateMetadata();

      expect(metadata).toBeDefined();
      expect(metadata.title).toContain('Sobre Nosotros');
    });
  });
});
