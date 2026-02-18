import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RichText from '@/components/RichText';

describe('RichText', () => {
  describe('Basic Rendering', () => {
    it('renders plain text content', () => {
      render(<RichText content="Hello world" />);
      expect(screen.getByText('Hello world')).toBeInTheDocument();
    });

    it('returns null for empty content', () => {
      const { container } = render(<RichText content="" />);
      expect(container.firstChild).toBeNull();
    });

    it('applies custom className', () => {
      const { container } = render(<RichText content="Test" className="custom-class" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('custom-class');
    });

    it('has prose classes by default', () => {
      const { container } = render(<RichText content="Test" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.className).toContain('prose');
    });
  });

  describe('Markdown Rendering', () => {
    it('renders bold text', () => {
      render(<RichText content="This is **bold** text" />);
      const strong = screen.getByText('bold');
      expect(strong.tagName).toBe('STRONG');
    });

    it('renders italic text', () => {
      render(<RichText content="This is *italic* text" />);
      const em = screen.getByText('italic');
      expect(em.tagName).toBe('EM');
    });

    it('renders headings', () => {
      const content = `# Heading 1

## Heading 2

### Heading 3`;
      render(<RichText content={content} />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Heading 1');
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Heading 2');
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Heading 3');
    });

    it('renders unordered lists', () => {
      const content = `- Item 1
- Item 2
- Item 3`;
      render(<RichText content={content} />);
      const list = screen.getByRole('list');
      expect(list.tagName).toBe('UL');
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });

    it('renders ordered lists', () => {
      const content = `1. First
2. Second
3. Third`;
      render(<RichText content={content} />);
      const list = screen.getByRole('list');
      expect(list.tagName).toBe('OL');
      expect(screen.getAllByRole('listitem')).toHaveLength(3);
    });

    it('renders links with correct attributes', () => {
      render(<RichText content="Visit [Google](https://google.com)" />);
      const link = screen.getByRole('link', { name: 'Google' });
      expect(link).toHaveAttribute('href', 'https://google.com');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders blockquotes', () => {
      render(<RichText content="> This is a quote" />);
      const blockquote = screen.getByText('This is a quote');
      expect(blockquote.closest('blockquote')).toBeInTheDocument();
    });

    it('renders paragraphs', () => {
      const content = `First paragraph

Second paragraph`;
      render(<RichText content={content} />);
      const paragraphs = screen.getAllByText(/paragraph/);
      expect(paragraphs).toHaveLength(2);
    });
  });

  describe('Styling', () => {
    it('applies amber color to links', () => {
      render(<RichText content="[Link](https://example.com)" />);
      const link = screen.getByRole('link');
      expect(link.className).toContain('text-amber-600');
    });

    it('applies border styling to blockquotes', () => {
      render(<RichText content="> Quote" />);
      const blockquote = screen.getByText('Quote').closest('blockquote');
      expect(blockquote?.className).toContain('border-l-4');
      expect(blockquote?.className).toContain('border-amber-500');
    });

    it('applies font-semibold to strong text', () => {
      render(<RichText content="**bold**" />);
      const strong = screen.getByText('bold');
      expect(strong.className).toContain('font-semibold');
    });
  });

  describe('Complex Content', () => {
    it('renders mixed content correctly', () => {
      const content = `
# Title

This is a **bold** paragraph with *italic* text.

- List item 1
- List item 2

> A blockquote

[A link](https://example.com)
      `.trim();

      render(<RichText content={content} />);

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText('bold')).toBeInTheDocument();
      expect(screen.getByText('italic')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(2);
      expect(screen.getByText('A blockquote')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'A link' })).toBeInTheDocument();
    });
  });
});
