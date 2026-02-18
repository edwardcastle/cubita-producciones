import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock the data fetchers
vi.mock('@/lib/strapi', () => ({
  getHomePage: vi.fn(() =>
    Promise.resolve({
      heroTitle: {
        es: 'Título Hero ES',
        en: 'Hero Title EN',
        fr: 'Titre Hero FR',
        it: 'Titolo Hero IT',
      },
      heroSubtitle: {
        es: 'Subtítulo ES',
        en: 'Subtitle EN',
        fr: 'Sous-titre FR',
        it: 'Sottotitolo IT',
      },
      stats: {
        years: 30,
        artists: 50,
        festivals: 100,
        countries: 15,
      },
      aboutTitle: {
        es: 'Sobre Nosotros ES',
        en: 'About Us EN',
        fr: 'À Propos FR',
        it: 'Chi Siamo IT',
      },
      aboutText: {
        es: 'Texto sobre nosotros ES',
        en: 'About text EN',
        fr: 'Texte à propos FR',
        it: 'Testo chi siamo IT',
      },
      ctaText: {
        es: 'Ver Artistas',
        en: 'View Artists',
        fr: 'Voir Artistes',
        it: 'Vedi Artisti',
      },
      seo: null,
    })
  ),
  generateMetadataFromSEO: vi.fn(() => ({
    title: 'Test Title',
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
        'artists.title': 'Artistas',
        'home.stats.festivals': 'Festivales',
        'home.stats.countries': 'Países',
        'home.about.learnMore': 'Saber más',
        'home.cta.title': 'Listo para reservar?',
        'home.cta.subtitle': 'Contacta con nosotros',
        'nav.contact': 'Contacto',
      };
      return translations[key] || key;
    })
  ),
}));

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders hero section with title', async () => {
      // Import the page component
      const HomePage = (await import('@/app/[locale]/page')).default;

      render(await HomePage());

      expect(screen.getByText('Título Hero ES')).toBeInTheDocument();
    });

    it('renders hero subtitle', async () => {
      const HomePage = (await import('@/app/[locale]/page')).default;

      render(await HomePage());

      expect(screen.getByText('Subtítulo ES')).toBeInTheDocument();
    });

    it('renders CTA button in hero', async () => {
      const HomePage = (await import('@/app/[locale]/page')).default;

      render(await HomePage());

      expect(screen.getByText('Ver Artistas')).toBeInTheDocument();
    });

    it('renders stats section', async () => {
      const HomePage = (await import('@/app/[locale]/page')).default;

      render(await HomePage());

      expect(screen.getByText('30+')).toBeInTheDocument();
      expect(screen.getByText('50+')).toBeInTheDocument();
      expect(screen.getByText('100+')).toBeInTheDocument();
      expect(screen.getByText('15+')).toBeInTheDocument();
    });

    it('renders about section', async () => {
      const HomePage = (await import('@/app/[locale]/page')).default;

      render(await HomePage());

      expect(screen.getByText('Sobre Nosotros ES')).toBeInTheDocument();
      expect(screen.getByText('Texto sobre nosotros ES')).toBeInTheDocument();
    });

    it('renders CTA section', async () => {
      const HomePage = (await import('@/app/[locale]/page')).default;

      render(await HomePage());

      expect(screen.getByText('Listo para reservar?')).toBeInTheDocument();
      expect(screen.getByText('Contacta con nosotros')).toBeInTheDocument();
    });
  });

  describe('Links', () => {
    it('has link to artists page', async () => {
      const HomePage = (await import('@/app/[locale]/page')).default;

      render(await HomePage());

      const artistsLink = screen.getByText('Ver Artistas').closest('a');
      expect(artistsLink).toHaveAttribute('href', '/artistas');
    });

    it('has link to about page', async () => {
      const HomePage = (await import('@/app/[locale]/page')).default;

      render(await HomePage());

      const aboutLink = screen.getByText('Saber más').closest('a');
      expect(aboutLink).toHaveAttribute('href', '/sobre-nosotros');
    });

    it('has link to contact page', async () => {
      const HomePage = (await import('@/app/[locale]/page')).default;

      render(await HomePage());

      const contactLink = screen.getByText('Contacto').closest('a');
      expect(contactLink).toHaveAttribute('href', '/contacto');
    });
  });

  describe('Structure', () => {
    it('has hero section', async () => {
      const HomePage = (await import('@/app/[locale]/page')).default;

      render(await HomePage());

      // Hero section contains the main title
      const heroTitle = screen.getByRole('heading', { level: 1 });
      expect(heroTitle).toHaveTextContent('Título Hero ES');
    });

    it('has stats section with 4 stat items', async () => {
      const HomePage = (await import('@/app/[locale]/page')).default;

      render(await HomePage());

      // Check for stat labels (translations)
      expect(screen.getByText('años de experiencia')).toBeInTheDocument();
      expect(screen.getByText('Artistas')).toBeInTheDocument();
      expect(screen.getByText('Festivales')).toBeInTheDocument();
      expect(screen.getByText('Países')).toBeInTheDocument();
    });
  });

  describe('Metadata', () => {
    it('generates correct metadata', async () => {
      const { generateMetadata } = await import('@/app/[locale]/page');

      const metadata = await generateMetadata();

      expect(metadata).toBeDefined();
      expect(metadata.title).toBeDefined();
      expect(metadata.description).toBeDefined();
    });
  });
});
