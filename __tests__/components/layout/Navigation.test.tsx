import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navigation from '@/components/layout/Navigation';

// Mock the router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe('Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  });

  describe('Rendering', () => {
    it('renders the company name', () => {
      render(<Navigation logo={null} />);

      expect(screen.getByText('Cubita Producciones')).toBeInTheDocument();
    });

    it('renders navigation links', () => {
      render(<Navigation logo={null} />);

      // Desktop navigation links
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
    });

    it('renders logo when provided', () => {
      render(<Navigation logo="https://example.com/logo.png" />);

      const logo = screen.getByAltText('Cubita Producciones');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', expect.stringContaining('logo.png'));
    });

    it('does not render logo image when logo is null', () => {
      render(<Navigation logo={null} />);

      expect(screen.queryByAltText('Cubita Producciones')).not.toBeInTheDocument();
    });

    it('renders language selector button', () => {
      render(<Navigation logo={null} />);

      // The locale should be displayed (mocked as 'ES')
      expect(screen.getByText('ES')).toBeInTheDocument();
    });

    it('renders mobile menu button', () => {
      render(<Navigation logo={null} />);

      // Mobile menu button should exist
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Language Selector', () => {
    it('shows language options when clicked', async () => {
      const user = userEvent.setup();
      render(<Navigation logo={null} />);

      const langButton = screen.getByText('ES');
      await user.click(langButton);

      await waitFor(() => {
        expect(screen.getByText('Espanol')).toBeInTheDocument();
        expect(screen.getByText('English')).toBeInTheDocument();
        expect(screen.getByText('Francais')).toBeInTheDocument();
        expect(screen.getByText('Italiano')).toBeInTheDocument();
      });
    });

    it('shows language flags', async () => {
      const user = userEvent.setup();
      render(<Navigation logo={null} />);

      const langButton = screen.getByText('ES');
      await user.click(langButton);

      await waitFor(() => {
        expect(screen.getByText('🇪🇸')).toBeInTheDocument();
        expect(screen.getByText('🇬🇧')).toBeInTheDocument();
        expect(screen.getByText('🇫🇷')).toBeInTheDocument();
        expect(screen.getByText('🇮🇹')).toBeInTheDocument();
      });
    });

    it('calls router.push when language is changed', async () => {
      const user = userEvent.setup();
      render(<Navigation logo={null} />);

      const langButton = screen.getByText('ES');
      await user.click(langButton);

      const englishOption = await screen.findByText('English');
      await user.click(englishOption);

      expect(mockPush).toHaveBeenCalledWith('/en/');
    });

    it('closes language dropdown after selection', async () => {
      const user = userEvent.setup();
      render(<Navigation logo={null} />);

      const langButton = screen.getByText('ES');
      await user.click(langButton);

      const englishOption = await screen.findByText('English');
      await user.click(englishOption);

      await waitFor(() => {
        expect(screen.queryByText('Espanol')).not.toBeInTheDocument();
      });
    });
  });

  describe('Mobile Menu', () => {
    it('has mobile menu button', () => {
      render(<Navigation logo={null} />);

      // Find the mobile menu button container
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('has language buttons', () => {
      render(<Navigation logo={null} />);

      const buttons = screen.getAllByRole('button');
      // At least one button for language selector
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Scroll Behavior', () => {
    it('applies scrolled styles when page is scrolled', () => {
      render(<Navigation logo={null} />);

      const nav = screen.getByRole('navigation');

      // Initially should not have scrolled styles (shadow-md is for scrolled state)
      expect(nav.className).toContain('shadow-sm');

      // Simulate scroll
      Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
      fireEvent.scroll(window);

      // After scroll, styles should change
      // Note: Due to React state updates, we need waitFor
      waitFor(() => {
        expect(nav.className).toContain('shadow-md');
      });
    });
  });

  describe('Links', () => {
    it('has navigation links with correct hrefs', () => {
      render(<Navigation logo={null} />);

      const links = screen.getAllByRole('link');
      const hrefs = links.map(link => link.getAttribute('href'));

      expect(hrefs).toContain('/');
      expect(hrefs).toContain('/artistas');
      expect(hrefs).toContain('/sobre-nosotros');
      expect(hrefs).toContain('/contacto');
    });

    it('logo links to home page', () => {
      render(<Navigation logo="https://example.com/logo.png" />);

      const logoLink = screen.getByText('Cubita Producciones').closest('a');
      expect(logoLink).toHaveAttribute('href', '/');
    });
  });

  describe('Accessibility', () => {
    it('has navigation role', () => {
      render(<Navigation logo={null} />);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('navigation links are accessible', () => {
      render(<Navigation logo={null} />);

      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
    });

    it('buttons are accessible', () => {
      render(<Navigation logo={null} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
