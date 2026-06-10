import 'server-only';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { BlogPost } from './types';

const DRAFTS_DIR = join(process.cwd(), 'docs', 'blog-drafts');

type Locale = 'es' | 'en' | 'fr' | 'it';
const FIELD_SUFFIX: Record<Locale, string> = { es: 'Es', en: 'En', fr: 'Fr', it: 'It' };

/**
 * Extract the text under `### <label> (<base><Suffix>)` up to the next `### ` or `---` or EOF.
 *
 * CONSTRAINT: draft body content must use `##` headings only.
 * Do NOT use `###` headings or `---` horizontal rules inside any field's content —
 * the regex terminates field capture at the next `\n### ` or `\n---`.
 */
function extractField(text: string, base: string, suffix: string): string {
  const re = new RegExp(`###[^\\n]*\\(${base}${suffix}\\)\\s*\\n([\\s\\S]*?)(?=\\n###\\s|\\n---|$)`);
  const m = text.match(re);
  return m ? m[1].trim() : '';
}

function readLocale(text: string, base: string): Record<Locale, string> {
  return {
    es: extractField(text, base, FIELD_SUFFIX.es),
    en: extractField(text, base, FIELD_SUFFIX.en),
    fr: extractField(text, base, FIELD_SUFFIX.fr),
    it: extractField(text, base, FIELD_SUFFIX.it),
  };
}

function parseDraft(filename: string): BlogPost {
  const text = readFileSync(join(DRAFTS_DIR, filename), 'utf8');

  const slug = text.match(/\*\*Slug:\*\*\s*`([^`]+)`/)?.[1]?.trim() ?? '';
  const author = text.match(/\*\*Author:\*\*\s*(.+)/)?.[1]?.trim() ?? 'Cubita Producciones';
  const readingTime = Number(text.match(/\*\*Reading Time:\*\*\s*(\d+)/)?.[1] ?? 5);

  return {
    id: slug,
    slug,
    title: readLocale(text, 'title'),
    excerpt: readLocale(text, 'excerpt'),
    content: readLocale(text, 'content'),
    coverImage: null, // original Strapi media is gone; owner can add a local path later
    publishedAt: '2026-01-01T00:00:00.000Z', // TODO: drafts have no date field; add one to the draft format when the blog goes live
    updatedAt: '2026-01-01T00:00:00.000Z',   // TODO: drafts have no date field; add one to the draft format when the blog goes live
    author,
    readingTime,
    seo: null,
  };
}

export const BLOG_POSTS: BlogPost[] = readdirSync(DRAFTS_DIR)
  .filter((f) => f.endsWith('.md'))
  .sort()
  .map(parseDraft)
  .filter((p) => p.slug);
