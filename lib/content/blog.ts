import 'server-only';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { BlogPost } from './types';
import { readLocale, parseMeta } from './draft-parser';
import { articleCoverImage } from './artists';

const DRAFTS_DIR = join(process.cwd(), 'docs', 'blog-drafts');

function parseDraft(filename: string): BlogPost {
  const text = readFileSync(join(DRAFTS_DIR, filename), 'utf8');
  const meta = parseMeta(text);

  return {
    id: meta.slug,
    slug: meta.slug,
    title: readLocale(text, 'title'),
    excerpt: readLocale(text, 'excerpt'),
    content: readLocale(text, 'content'),
    // Derive a per-post image from the artist the post is about (null → generic).
    coverImage: articleCoverImage(meta.slug),
    publishedAt: meta.publishedAt,
    updatedAt: meta.updatedAt,
    author: meta.author,
    readingTime: meta.readingTime,
    seo: null,
  };
}

export const BLOG_POSTS: BlogPost[] = readdirSync(DRAFTS_DIR)
  .filter((f) => f.endsWith('.md'))
  .sort()
  .map(parseDraft)
  .filter((p) => p.slug);
