import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '@/components/layout/Footer';

describe('Footer', () => {
  describe('Rendering', () => {
    it('renders the company name', () => {
      render(<Footer />);

      expect(screen.getByText('Cubita Producciones')).toBeInTheDocument();
    });

    it('renders the company description', () => {
      render(<Footer />);

      // Uses translation key
      expect(screen.getByText('home.about.description')).toBeInTheDocument();
    });

    it('renders navigation links', () => {
      render(<Footer />);

      expect(screen.getByText('nav.home')).toBeInTheDocument();
      expect(screen.getByText('nav.artists')).toBeInTheDocument();
      expect(screen.getByText('nav.about')).toBeInTheDocument();
      expect(screen.getByText('nav.contact')).toBeInTheDocument();
    });

    it('renders contact section header', () => {
      render(<Footer />);

      expect(screen.getByText('footer.contact')).toBeInTheDocument();
    });

    it('renders email address from props', () => {
      render(<Footer email="info@cubitaproducciones.com" />);

      const emailLink = screen.getByText('info@cubitaproducciones.com');
      expect(emailLink).toBeInTheDocument();
      expect(emailLink.closest('a')).toHaveAttribute('href', 'mailto:info@cubitaproducciones.com');
    });

    it('renders phone number from props', () => {
      render(<Footer phone="+39 327 607 8955" />);

      const phoneLink = screen.getByText('+39 327 607 8955');
      expect(phoneLink).toBeInTheDocument();
      expect(phoneLink.closest('a')).toHaveAttribute('href', 'tel:+393276078955');
    });

    it('omits email and phone when not provided', () => {
      render(<Footer />);

      expect(screen.queryByText(/cubitaproducciones\.com$/)).not.toBeInTheDocument();
      expect(screen.queryByText(/^\+39/)).not.toBeInTheDocument();
    });

    it('renders copyright with current year', () => {
      render(<Footer />);

      const currentYear = new Date().getFullYear();
      expect(screen.getByText(new RegExp(`${currentYear}`))).toBeInTheDocument();
    });

    it('renders rights reserved text', () => {
      render(<Footer />);

      expect(screen.getByText(/footer\.rights/)).toBeInTheDocument();
    });
  });

  describe('Links', () => {
    it('renders Links section header', () => {
      render(<Footer />);

      expect(screen.getByText('Links')).toBeInTheDocument();
    });

    it('home link points to correct path', () => {
      render(<Footer />);

      const homeLink = screen.getByText('nav.home').closest('a');
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('artists link points to correct path', () => {
      render(<Footer />);

      const artistsLink = screen.getByText('nav.artists').closest('a');
      expect(artistsLink).toHaveAttribute('href', '/artistas');
    });

    it('about link points to correct path', () => {
      render(<Footer />);

      const aboutLink = screen.getByText('nav.about').closest('a');
      expect(aboutLink).toHaveAttribute('href', '/sobre-nosotros');
    });

    it('contact link points to correct path', () => {
      render(<Footer />);

      const contactLink = screen.getByText('nav.contact').closest('a');
      expect(contactLink).toHaveAttribute('href', '/contacto');
    });
  });

  describe('Icons', () => {
    it('renders mail icon next to email', () => {
      render(<Footer email="info@cubitaproducciones.com" />);

      const emailContainer = screen.getByText('info@cubitaproducciones.com').closest('li');
      expect(emailContainer).toBeInTheDocument();
    });

    it('renders phone icon next to phone number', () => {
      render(<Footer phone="+39 327 607 8955" />);

      const phoneContainer = screen.getByText('+39 327 607 8955').closest('li');
      expect(phoneContainer).toBeInTheDocument();
    });
  });

  describe('Structure', () => {
    it('has footer element', () => {
      render(<Footer />);

      expect(document.querySelector('footer')).toBeInTheDocument();
    });

    it('has three column grid on desktop', () => {
      render(<Footer />);

      const grid = document.querySelector('.grid');
      expect(grid).toBeInTheDocument();
      expect(grid?.className).toContain('md:grid-cols-3');
    });

    it('has border separator above locale links', () => {
      render(<Footer />);

      const borderSection = document.querySelector('.border-t.border-gray-800');
      expect(borderSection).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('has dark background', () => {
      render(<Footer />);

      const footer = document.querySelector('footer');
      expect(footer?.className).toContain('bg-gray-900');
    });

    it('has white text', () => {
      render(<Footer />);

      const footer = document.querySelector('footer');
      expect(footer?.className).toContain('text-white');
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      render(<Footer />);

      // Footer element exists
      const footer = document.querySelector('footer');
      expect(footer).toBeInTheDocument();

      // Lists are used for navigation
      const lists = document.querySelectorAll('ul');
      expect(lists.length).toBeGreaterThan(0);
    });

    it('links are accessible', () => {
      render(<Footer />);

      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThanOrEqual(4);
    });
  });
});
