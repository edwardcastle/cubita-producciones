import { describe, it, expect } from 'vitest';
import { stripMarkdown, truncateText } from '@/lib/utils';

describe('stripMarkdown', () => {
  it('returns empty string for empty input', () => {
    expect(stripMarkdown('')).toBe('');
  });

  it('returns empty string for null/undefined', () => {
    expect(stripMarkdown(null as unknown as string)).toBe('');
    expect(stripMarkdown(undefined as unknown as string)).toBe('');
  });

  it('removes bold formatting with asterisks', () => {
    expect(stripMarkdown('This is **bold** text')).toBe('This is bold text');
  });

  it('removes bold formatting with underscores', () => {
    expect(stripMarkdown('This is __bold__ text')).toBe('This is bold text');
  });

  it('removes italic formatting with asterisks', () => {
    expect(stripMarkdown('This is *italic* text')).toBe('This is italic text');
  });

  it('removes italic formatting with underscores', () => {
    expect(stripMarkdown('This is _italic_ text')).toBe('This is italic text');
  });

  it('removes bold and italic combined', () => {
    expect(stripMarkdown('This is ***bold italic*** text')).toBe('This is bold italic text');
  });

  it('removes headers', () => {
    expect(stripMarkdown('# Header 1')).toBe('Header 1');
    expect(stripMarkdown('## Header 2')).toBe('Header 2');
    expect(stripMarkdown('### Header 3')).toBe('Header 3');
  });

  it('removes links but keeps text', () => {
    expect(stripMarkdown('Visit [Google](https://google.com)')).toBe('Visit Google');
  });

  it('removes images', () => {
    expect(stripMarkdown('![Alt text](image.jpg)')).toBe('Alt text');
  });

  it('removes inline code', () => {
    expect(stripMarkdown('Use `code` here')).toBe('Use code here');
  });

  it('removes blockquotes', () => {
    expect(stripMarkdown('> This is a quote')).toBe('This is a quote');
  });

  it('removes unordered list markers', () => {
    expect(stripMarkdown('- Item 1\n- Item 2')).toBe('Item 1\nItem 2');
    expect(stripMarkdown('* Item 1\n* Item 2')).toBe('Item 1\nItem 2');
  });

  it('removes ordered list markers', () => {
    expect(stripMarkdown('1. First\n2. Second')).toBe('First\nSecond');
  });

  it('removes strikethrough', () => {
    expect(stripMarkdown('This is ~~deleted~~ text')).toBe('This is deleted text');
  });

  it('handles complex markdown', () => {
    const markdown = '**Charly & Johayron** est un duo cubain de musique urbaine composé de **Carlos de Jesús**';
    const expected = 'Charly & Johayron est un duo cubain de musique urbaine composé de Carlos de Jesús';
    expect(stripMarkdown(markdown)).toBe(expected);
  });
});

describe('truncateText', () => {
  it('returns original text if shorter than maxLength', () => {
    expect(truncateText('Hello', 10)).toBe('Hello');
  });

  it('returns empty string for empty input', () => {
    expect(truncateText('', 10)).toBe('');
  });

  it('truncates text and adds ellipsis', () => {
    expect(truncateText('Hello World', 8)).toBe('Hello...');
  });

  it('handles exact length', () => {
    expect(truncateText('Hello', 5)).toBe('Hello');
  });

  it('handles null/undefined', () => {
    expect(truncateText(null as unknown as string, 10)).toBeFalsy();
    expect(truncateText(undefined as unknown as string, 10)).toBeFalsy();
  });
});
