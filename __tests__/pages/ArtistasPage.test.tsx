import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock the data fetchers
vi.mock('@/lib/strapi', () => ({
  getArtists: vi.fn(() =>
    Promise.resolve([
      {
        id: '1',
        name: 'Artist One',
        slug: 'artist-one',
        genre: 'salsa',
        bio: {
          es: 'Bio en español',
          en: 'Bio in English',
          fr: 'Bio en français',
          it: 'Bio in italiano',
        },
        availability: 'Enero - Marzo 2025',
        image: 'https://example.com/artist1.jpg',
        travelParty: 5,
      },
      {
        id: '2',
        name: 'Artist Two',
        slug: 'artist-two',
        genre: 'reggaeton',
        bio: {
          es: 'Otra bio',
          en: 'Another bio',
          fr: 'Une autre bio',
          it: 'Un\'altra bio',
        },
        availability: 'Todo el año',
        image: null,
        travelParty: 3,
      },
    ])
  ),
  getArtistsPage: vi.fn(() =>
    Promise.resolve({
      title: {
        es: 'Nuestros Artistas',
        en: 'Our Artists',
        fr: 'Nos Artistes',
        it: 'I Nostri Artisti',
      },
      subtitle: {
        es: 'Descubre el talento cubano',
        en: 'Discover Cuban talent',
        fr: 'Découvrez le talent cubain',
        it: 'Scopri il talento cubano',
      },
      viewDetailsButton: {
        es: 'Ver Detalles',
        en: 'View Details',
        fr: 'Voir Détails',
        it: 'Vedi Dettagli',
      },
      ctaTitle: {
        es: '¿Interesado en booking?',
        en: 'Interested in booking?',
        fr: 'Intéressé par une réservation?',
        it: 'Interessato a prenotare?',
      },
      ctaSubtitle: {
        es: 'Contacta con nosotros',
        en: 'Contact us',
        fr: 'Contactez-nous',
        it: 'Contattaci',
      },
      salsaLabel: {
        es: 'Salsa',
        en: 'Salsa',
        fr: 'Salsa',
        it: 'Salsa',
      },
      reggaetonLabel: {
        es: 'Reguetón',
        en: 'Reggaeton',
        fr: 'Reggaeton',
        it: 'Reggaeton',
      },
      seo: null,
    })
  ),
  getSiteSettings: vi.fn(() =>
    Promise.resolve({
      nav: {
        contact: {
          es: 'Contacto',
          en: 'Contact',
          fr: 'Contact',
          it: 'Contatto',
        },
      },
    })
  ),
  generateMetadataFromSEO: vi.fn(() => ({
    title: 'Artistas - Cubita Producciones',
    description: 'Test Description',
  })),
}));

// Mock next-intl/server
vi.mock('next-intl/server', () => ({
  getLocale: vi.fn(() => Promise.resolve('es')),
}));

describe('ArtistasPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders page title', async () => {
      const ArtistasPage = (await import('@/app/[locale]/artistas/page')).default;

      render(await ArtistasPage());

      expect(screen.getByText('Nuestros Artistas')).toBeInTheDocument();
    });

    it('renders page subtitle', async () => {
      const ArtistasPage = (await import('@/app/[locale]/artistas/page')).default;

      render(await ArtistasPage());

      expect(screen.getByText('Descubre el talento cubano')).toBeInTheDocument();
    });

    it('renders all artists', async () => {
      const ArtistasPage = (await import('@/app/[locale]/artistas/page')).default;

      render(await ArtistasPage());

      expect(screen.getByText('Artist One')).toBeInTheDocument();
      expect(screen.getByText('Artist Two')).toBeInTheDocument();
    });

    it('renders artist bios', async () => {
      const ArtistasPage = (await import('@/app/[locale]/artistas/page')).default;

      render(await ArtistasPage());

      expect(screen.getByText('Bio en español')).toBeInTheDocument();
      expect(screen.getByText('Otra bio')).toBeInTheDocument();
    });

    it('renders genre badges', async () => {
      const ArtistasPage = (await import('@/app/[locale]/artistas/page')).default;

      render(await ArtistasPage());

      expect(screen.getByText('Salsa')).toBeInTheDocument();
      expect(screen.getByText('Reguetón')).toBeInTheDocument();
    });

    it('renders view details buttons', async () => {
      const ArtistasPage = (await import('@/app/[locale]/artistas/page')).default;

      render(await ArtistasPage());

      const buttons = screen.getAllByText('Ver Detalles');
      expect(buttons).toHaveLength(2);
    });

    it('renders CTA section', async () => {
      const ArtistasPage = (await import('@/app/[locale]/artistas/page')).default;

      render(await ArtistasPage());

      expect(screen.getByText('¿Interesado en booking?')).toBeInTheDocument();
      expect(screen.getByText('Contacta con nosotros')).toBeInTheDocument();
    });

    it('renders contact button in CTA', async () => {
      const ArtistasPage = (await import('@/app/[locale]/artistas/page')).default;

      render(await ArtistasPage());

      expect(screen.getByText('Contacto')).toBeInTheDocument();
    });
  });

  describe('Artist Cards', () => {
    it('renders artist images when available', async () => {
      const ArtistasPage = (await import('@/app/[locale]/artistas/page')).default;

      render(await ArtistasPage());

      const artistImage = screen.getByAltText('Artist One');
      expect(artistImage).toBeInTheDocument();
    });

    it('renders placeholder when image is not available', async () => {
      const ArtistasPage = (await import('@/app/[locale]/artistas/page')).default;

      render(await ArtistasPage());

      // Artist Two has no image, should show placeholder icon
      // The Music icon from lucide is rendered
      const artistTwoCard = screen.getByText('Artist Two').closest('a');
      expect(artistTwoCard).toBeInTheDocument();
    });
  });

  describe('Links', () => {
    it('artist cards link to detail pages', async () => {
      const ArtistasPage = (await import('@/app/[locale]/artistas/page')).default;

      render(await ArtistasPage());

      const artistOneLink = screen.getByText('Artist One').closest('a');
      expect(artistOneLink).toHaveAttribute('href', '/artistas/artist-one');

      const artistTwoLink = screen.getByText('Artist Two').closest('a');
      expect(artistTwoLink).toHaveAttribute('href', '/artistas/artist-two');
    });

    it('CTA links to contact page', async () => {
      const ArtistasPage = (await import('@/app/[locale]/artistas/page')).default;

      render(await ArtistasPage());

      const contactLink = screen.getByText('Contacto').closest('a');
      expect(contactLink).toHaveAttribute('href', '/contacto');
    });
  });

  describe('Structure', () => {
    it('has header section', async () => {
      const ArtistasPage = (await import('@/app/[locale]/artistas/page')).default;

      render(await ArtistasPage());

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Nuestros Artistas');
    });

    it('has artists grid', async () => {
      const ArtistasPage = (await import('@/app/[locale]/artistas/page')).default;

      const { container } = render(await ArtistasPage());

      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('Metadata', () => {
    it('generates correct metadata', async () => {
      const { generateMetadata } = await import('@/app/[locale]/artistas/page');

      const metadata = await generateMetadata();

      expect(metadata).toBeDefined();
      expect(metadata.title).toContain('Artistas');
    });
  });
});
