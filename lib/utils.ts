/**
 * @fileoverview Utility functions for Cubita Producciones
 * @module lib/utils
 */

/**
 * Strips markdown formatting from text for plain text display
 * Removes bold, italic, links, headers, lists, etc.
 * @param text - Markdown formatted text
 * @returns Plain text without markdown formatting
 * @example
 * stripMarkdown('**bold** and *italic*') // Returns: 'bold and italic'
 */
export function stripMarkdown(text: string): string {
  if (!text) return '';

  return text
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic (***text***, **text**, *text*, ___text___, __text__, _text_)
    .replace(/(\*\*\*|___)(.*?)\1/g, '$2')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove strikethrough
    .replace(/~~(.*?)~~/g, '$1')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove images ![alt](url) - must come before links
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // Remove links but keep text [text](url)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // Remove unordered list markers
    .replace(/^[\s]*[-*+]\s+/gm, '')
    // Remove ordered list markers
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Collapse multiple newlines
    .replace(/\n{3,}/g, '\n\n')
    // Trim whitespace
    .trim();
}

type AltLocale = 'es' | 'en' | 'fr' | 'it';

/**
 * Builds localized, keyword-rich alt text for an artist photo.
 * The wrapper sentence is translated per locale (the name + already-localized
 * genre word are passed in) so image alt matches the page language for
 * accessibility and image search, instead of being hardcoded in one language.
 * @param locale - Page locale
 * @param name - Artist name (kept verbatim)
 * @param genre - Already-localized genre word (e.g. "salsa" / "reggaeton")
 * @returns Localized alt string
 */
export function artistImageAlt(locale: AltLocale, name: string, genre: string): string {
  const builders: Record<AltLocale, (n: string, g: string) => string> = {
    es: (n, g) => `Booking ${n} — artista cubano de ${g} disponible para eventos en Europa`,
    en: (n, g) => `Booking ${n} — Cuban ${g} artist available for events in Europe`,
    fr: (n, g) => `Booking ${n} — artiste cubain de ${g} disponible pour événements en Europe`,
    it: (n, g) => `Booking ${n} — artista cubano di ${g} disponibile per eventi in Europa`,
  };
  return (builders[locale] || builders.es)(name, genre);
}

/**
 * Truncates text to a maximum length, adding ellipsis if needed
 * @param text - Text to truncate
 * @param maxLength - Maximum length of output string
 * @returns Truncated text with ellipsis if needed
 * @example
 * truncateText('Hello World', 8) // Returns: 'Hello...'
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3).trim() + '...';
}
