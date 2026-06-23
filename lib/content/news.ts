import 'server-only';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { BlogPost } from './types';
import { readLocale, parseMeta } from './draft-parser';

/**
 * News / announcements stream. Same markdown-draft format as the blog
 * (see ./draft-parser), but a separate source dir and URL namespace (`/noticias`).
 * News items are short, dated announcements (tours, festival confirmations,
 * signings); the blog holds long-form evergreen guides. Items are NewsArticle-typed
 * for schema.org and surfaced newest-first.
 */

const NEWS_DIR = join(process.cwd(), 'docs', 'news-drafts');

function parseDraft(filename: string): BlogPost {
  const text = readFileSync(join(NEWS_DIR, filename), 'utf8');
  const meta = parseMeta(text);

  return {
    id: meta.slug,
    slug: meta.slug,
    title: readLocale(text, 'title'),
    excerpt: readLocale(text, 'excerpt'),
    content: readLocale(text, 'content'),
    coverImage: null,
    publishedAt: meta.publishedAt,
    updatedAt: meta.updatedAt,
    author: meta.author,
    readingTime: meta.readingTime,
    seo: null,
  };
}

export const NEWS_ITEMS: BlogPost[] = (existsSync(NEWS_DIR) ? readdirSync(NEWS_DIR) : [])
  .filter((f) => f.endsWith('.md'))
  .map(parseDraft)
  .filter((p) => p.slug)
  // newest first — freshest announcement at the top of the feed
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
