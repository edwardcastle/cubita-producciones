import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import YouTubeEmbed from '@/components/YouTubeEmbed';

describe('YouTubeEmbed', () => {
  const defaultProps = {
    videoId: 'dQw4w9WgXcQ',
    title: 'Test Video',
  };

  describe('Initial State (Thumbnail)', () => {
    it('renders thumbnail image', () => {
      render(<YouTubeEmbed {...defaultProps} />);

      const thumbnail = screen.getByAltText('Test Video');
      expect(thumbnail).toBeInTheDocument();
      expect(thumbnail).toHaveAttribute(
        'src',
        expect.stringContaining('img.youtube.com')
      );
    });

    it('shows play button', () => {
      render(<YouTubeEmbed {...defaultProps} />);

      const playButton = screen.getByRole('button', { name: /play test video/i });
      expect(playButton).toBeInTheDocument();
    });

    it('shows YouTube branding', () => {
      render(<YouTubeEmbed {...defaultProps} />);

      expect(screen.getByText('YouTube')).toBeInTheDocument();
    });

    it('uses correct thumbnail URL', () => {
      render(<YouTubeEmbed {...defaultProps} />);

      const thumbnail = screen.getByAltText('Test Video');
      expect(thumbnail).toHaveAttribute(
        'src',
        expect.stringContaining('dQw4w9WgXcQ')
      );
    });

    it('applies custom className', () => {
      render(<YouTubeEmbed {...defaultProps} className="custom-class" />);

      const button = screen.getByRole('button');
      expect(button.className).toContain('custom-class');
    });

    it('uses default title when not provided', () => {
      render(<YouTubeEmbed videoId="dQw4w9WgXcQ" />);

      const thumbnail = screen.getByAltText('YouTube video');
      expect(thumbnail).toBeInTheDocument();
    });
  });

  describe('After Click (Iframe)', () => {
    it('loads iframe when clicked', async () => {
      const user = userEvent.setup();
      render(<YouTubeEmbed {...defaultProps} />);

      const playButton = screen.getByRole('button', { name: /play test video/i });
      await user.click(playButton);

      const iframe = screen.getByTitle('Test Video');
      expect(iframe).toBeInTheDocument();
      expect(iframe.tagName).toBe('IFRAME');
    });

    it('iframe has correct src', async () => {
      const user = userEvent.setup();
      render(<YouTubeEmbed {...defaultProps} />);

      const playButton = screen.getByRole('button');
      await user.click(playButton);

      const iframe = screen.getByTitle('Test Video');
      expect(iframe).toHaveAttribute('src', expect.stringContaining('youtube.com/embed/dQw4w9WgXcQ'));
      expect(iframe).toHaveAttribute('src', expect.stringContaining('autoplay=1'));
    });

    it('iframe has allowFullScreen', async () => {
      const user = userEvent.setup();
      render(<YouTubeEmbed {...defaultProps} />);

      const playButton = screen.getByRole('button');
      await user.click(playButton);

      const iframe = screen.getByTitle('Test Video');
      expect(iframe).toHaveAttribute('allowfullscreen');
    });

    it('hides thumbnail after click', async () => {
      const user = userEvent.setup();
      render(<YouTubeEmbed {...defaultProps} />);

      const playButton = screen.getByRole('button');
      await user.click(playButton);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('applies className to iframe container', async () => {
      const user = userEvent.setup();
      const { container } = render(<YouTubeEmbed {...defaultProps} className="custom-class" />);

      const playButton = screen.getByRole('button');
      await user.click(playButton);

      const iframeContainer = container.querySelector('.custom-class');
      expect(iframeContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('button has accessible label', () => {
      render(<YouTubeEmbed {...defaultProps} />);

      const button = screen.getByRole('button', { name: /play test video/i });
      expect(button).toBeInTheDocument();
    });

    it('thumbnail has alt text', () => {
      render(<YouTubeEmbed {...defaultProps} />);

      const img = screen.getByAltText('Test Video');
      expect(img).toBeInTheDocument();
    });

    it('iframe has title attribute', async () => {
      const user = userEvent.setup();
      render(<YouTubeEmbed {...defaultProps} />);

      await user.click(screen.getByRole('button'));

      const iframe = screen.getByTitle('Test Video');
      expect(iframe).toBeInTheDocument();
    });
  });

  describe('Different Video IDs', () => {
    it('handles different video IDs', () => {
      render(<YouTubeEmbed videoId="abc123xyz" title="Different Video" />);

      const thumbnail = screen.getByAltText('Different Video');
      expect(thumbnail).toHaveAttribute('src', expect.stringContaining('abc123xyz'));
    });
  });

  describe('Styling', () => {
    it('has aspect-video class for proper ratio', () => {
      render(<YouTubeEmbed {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button.className).toContain('aspect-video');
    });

    it('has rounded corners', () => {
      render(<YouTubeEmbed {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button.className).toContain('rounded-xl');
    });

    it('has shadow styling', () => {
      render(<YouTubeEmbed {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button.className).toContain('shadow-lg');
    });
  });
});
