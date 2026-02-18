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
