import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import {
  OrganizationJsonLd,
  LocalBusinessJsonLd,
  BreadcrumbJsonLd,
  ArtistJsonLd,
  WebsiteJsonLd,
} from '@/components/seo/JsonLd';

// Mock getSiteSettings
vi.mock('@/lib/strapi', () => ({
  getSiteSettings: vi.fn(() =>
    Promise.resolve({
      logo: 'https://example.com/logo.png',
      footerDescription: {
        es: 'Descripción en español',
        en: 'Description in English',
        fr: 'Description en français',
        it: 'Descrizione in italiano',
      },
      email: 'test@example.com',
      phone: '+39 123 456 789',
      location: 'Roma, Italia',
      instagram: 'https://instagram.com/test',
      facebook: 'https://facebook.com/test',
      youtube: 'https://youtube.com/test',
    })
  ),
}));

describe('JsonLd Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('BreadcrumbJsonLd', () => {
    it('renders JSON-LD script tag', () => {
      const items = [
        { name: 'Home', url: 'https://example.com' },
        { name: 'Artists', url: 'https://example.com/artists' },
      ];

      const { container } = render(<BreadcrumbJsonLd items={items} />);

      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script).toBeInTheDocument();
    });

    it('contains correct breadcrumb data', () => {
      const items = [
        { name: 'Home', url: 'https://example.com' },
        { name: 'Artists', url: 'https://example.com/artists' },
      ];

      const { container } = render(<BreadcrumbJsonLd items={items} />);

      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.innerHTML || '{}');

      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('BreadcrumbList');
      expect(jsonLd.itemListElement).toHaveLength(2);
      expect(jsonLd.itemListElement[0].position).toBe(1);
      expect(jsonLd.itemListElement[0].name).toBe('Home');
      expect(jsonLd.itemListElement[1].position).toBe(2);
      expect(jsonLd.itemListElement[1].name).toBe('Artists');
    });

    it('handles single breadcrumb item', () => {
      const items = [{ name: 'Home', url: 'https://example.com' }];

      const { container } = render(<BreadcrumbJsonLd items={items} />);

      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.innerHTML || '{}');

      expect(jsonLd.itemListElement).toHaveLength(1);
    });

    it('handles empty breadcrumb items', () => {
      const items: { name: string; url: string }[] = [];

      const { container } = render(<BreadcrumbJsonLd items={items} />);

      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.innerHTML || '{}');

      expect(jsonLd.itemListElement).toHaveLength(0);
    });
  });

  describe('ArtistJsonLd', () => {
    const defaultProps = {
      name: 'Test Artist',
      description: 'A great artist',
      image: 'https://example.com/artist.jpg',
      genre: 'Salsa',
      instagram: 'https://instagram.com/artist',
      youtube: 'https://youtube.com/artist',
      url: 'https://example.com/artists/test-artist',
    };

    it('renders JSON-LD script tag', () => {
      const { container } = render(<ArtistJsonLd {...defaultProps} />);

      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script).toBeInTheDocument();
    });

    it('contains correct artist data', () => {
      const { container } = render(<ArtistJsonLd {...defaultProps} />);

      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.innerHTML || '{}');

      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('MusicGroup');
      expect(jsonLd.name).toBe('Test Artist');
      expect(jsonLd.description).toBe('A great artist');
      expect(jsonLd.image).toBe('https://example.com/artist.jpg');
      expect(jsonLd.genre).toBe('Salsa');
      expect(jsonLd.url).toBe('https://example.com/artists/test-artist');
    });

    it('includes social links in sameAs', () => {
      const { container } = render(<ArtistJsonLd {...defaultProps} />);

      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.innerHTML || '{}');

      expect(jsonLd.sameAs).toContain('https://instagram.com/artist');
      expect(jsonLd.sameAs).toContain('https://youtube.com/artist');
    });

    it('handles missing image', () => {
      const props = { ...defaultProps, image: null };
      const { container } = render(<ArtistJsonLd {...props} />);

      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.innerHTML || '{}');

      expect(jsonLd.image).toBeUndefined();
    });

    it('handles missing social links', () => {
      const props = {
        name: 'Test Artist',
        description: 'A great artist',
        image: 'https://example.com/artist.jpg',
        genre: 'Salsa',
        url: 'https://example.com/artists/test-artist',
      };

      const { container } = render(<ArtistJsonLd {...props} />);

      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.innerHTML || '{}');

      // sameAs should be empty or filter out undefined
      expect(jsonLd.sameAs.filter(Boolean)).toHaveLength(0);
    });

    it('includes member information', () => {
      const { container } = render(<ArtistJsonLd {...defaultProps} />);

      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.innerHTML || '{}');

      expect(jsonLd.member).toBeDefined();
      expect(jsonLd.member['@type']).toBe('OrganizationRole');
      expect(jsonLd.member.member.name).toBe('Test Artist');
    });
  });

  describe('WebsiteJsonLd', () => {
    it('renders JSON-LD script tag', () => {
      const { container } = render(<WebsiteJsonLd locale="es" />);

      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script).toBeInTheDocument();
    });

    it('contains correct website data for Spanish', () => {
      const { container } = render(<WebsiteJsonLd locale="es" />);

      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.innerHTML || '{}');

      expect(jsonLd['@context']).toBe('https://schema.org');
      expect(jsonLd['@type']).toBe('WebSite');
      expect(jsonLd.url).toBe('https://cubitaproducciones.com');
      expect(jsonLd.name).toContain('Cubita Producciones');
    });

    it('contains correct website data for English', () => {
      const { container } = render(<WebsiteJsonLd locale="en" />);

      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.innerHTML || '{}');

      expect(jsonLd.name).toContain('Cuban Artists Booking');
    });

    it('contains correct website data for French', () => {
      const { container } = render(<WebsiteJsonLd locale="fr" />);

      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.innerHTML || '{}');

      expect(jsonLd.name).toContain('Artistes Cubains');
    });

    it('contains correct website data for Italian', () => {
      const { container } = render(<WebsiteJsonLd locale="it" />);

      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.innerHTML || '{}');

      expect(jsonLd.name).toContain('Artisti Cubani');
    });

    it('includes language information', () => {
      const { container } = render(<WebsiteJsonLd locale="es" />);

      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.innerHTML || '{}');

      expect(jsonLd.inLanguage).toBeDefined();
      expect(jsonLd.inLanguage).toHaveLength(4);
    });

    it('includes search action', () => {
      const { container } = render(<WebsiteJsonLd locale="es" />);

      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.innerHTML || '{}');

      expect(jsonLd.potentialAction).toBeDefined();
      expect(jsonLd.potentialAction['@type']).toBe('SearchAction');
    });

    it('references organization', () => {
      const { container } = render(<WebsiteJsonLd locale="es" />);

      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.innerHTML || '{}');

      expect(jsonLd.publisher).toBeDefined();
      expect(jsonLd.publisher['@id']).toContain('#organization');
    });

    it('falls back to Spanish for unknown locale', () => {
      const { container } = render(<WebsiteJsonLd locale="de" />);

      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.innerHTML || '{}');

      expect(jsonLd.name).toContain('Cubita Producciones');
    });
  });

  describe('OrganizationJsonLd', () => {
    it('renders JSON-LD script tag', async () => {
      const { container } = render(await OrganizationJsonLd({ locale: 'es' }));

      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script).toBeInTheDocument();
    });

    it('contains correct organization type', async () => {
      const { container } = render(await OrganizationJsonLd({ locale: 'es' }));

      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.innerHTML || '{}');

      expect(jsonLd['@type']).toBe('Organization');
      expect(jsonLd.name).toBe('Cubita Producciones');
    });
  });

  describe('LocalBusinessJsonLd', () => {
    it('renders JSON-LD script tag', async () => {
      const { container } = render(await LocalBusinessJsonLd({ locale: 'es' }));

      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script).toBeInTheDocument();
    });

    it('contains correct business type', async () => {
      const { container } = render(await LocalBusinessJsonLd({ locale: 'es' }));

      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.innerHTML || '{}');

      expect(jsonLd['@type']).toBe('EntertainmentBusiness');
      expect(jsonLd.name).toBe('Cubita Producciones');
    });

    it('contains localized description', async () => {
      const { container } = render(await LocalBusinessJsonLd({ locale: 'en' }));

      const script = container.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.innerHTML || '{}');

      expect(jsonLd.description).toContain('Booking agency');
    });
  });
});
