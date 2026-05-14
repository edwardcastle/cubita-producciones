import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import HeroCarousel from '@/components/home/HeroCarousel';
import type { StrapiImage } from '@/lib/strapi';

const images: StrapiImage[] = [
  { url: 'https://cdn.example.com/1.jpg', alternativeText: 'Slide one' },
  { url: 'https://cdn.example.com/2.jpg', alternativeText: 'Slide two' },
  { url: 'https://cdn.example.com/3.jpg', alternativeText: 'Slide three' },
];

const labels = { prev: 'Anterior', next: 'Siguiente', slide: 'Ir a la diapositiva' };

describe('HeroCarousel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the hero content passed as children', () => {
    render(
      <HeroCarousel images={images} labels={labels}>
        <h1>Hero heading</h1>
      </HeroCarousel>
    );

    expect(screen.getByRole('heading', { name: 'Hero heading' })).toBeInTheDocument();
  });

  it('shows the first image initially', () => {
    render(
      <HeroCarousel images={images} labels={labels}>
        <span>content</span>
      </HeroCarousel>
    );

    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://cdn.example.com/1.jpg');
  });

  it('advances to the next image when the next button is clicked', () => {
    render(
      <HeroCarousel images={images} labels={labels}>
        <span>content</span>
      </HeroCarousel>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));

    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://cdn.example.com/2.jpg');
  });

  it('wraps to the last image when clicking previous from the first', () => {
    render(
      <HeroCarousel images={images} labels={labels}>
        <span>content</span>
      </HeroCarousel>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Anterior' }));

    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://cdn.example.com/3.jpg');
  });

  it('jumps to a slide when its dot indicator is clicked', () => {
    render(
      <HeroCarousel images={images} labels={labels}>
        <span>content</span>
      </HeroCarousel>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Ir a la diapositiva 3' }));

    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://cdn.example.com/3.jpg');
  });

  it('renders children without carousel UI when there are no images', () => {
    render(
      <HeroCarousel images={[]} labels={labels}>
        <h1>Fallback heading</h1>
      </HeroCarousel>
    );

    expect(screen.getByRole('heading', { name: 'Fallback heading' })).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Siguiente' })).not.toBeInTheDocument();
  });

  it('does not render navigation controls for a single image', () => {
    render(
      <HeroCarousel images={[images[0]]} labels={labels}>
        <span>content</span>
      </HeroCarousel>
    );

    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Siguiente' })).not.toBeInTheDocument();
  });

  describe('autoplay', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('advances to the next image after the interval elapses', () => {
      render(
        <HeroCarousel images={images} labels={labels} interval={5000}>
          <span>content</span>
        </HeroCarousel>
      );

      expect(screen.getByRole('img')).toHaveAttribute('src', 'https://cdn.example.com/1.jpg');

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(screen.getByRole('img')).toHaveAttribute('src', 'https://cdn.example.com/2.jpg');
    });
  });
});
