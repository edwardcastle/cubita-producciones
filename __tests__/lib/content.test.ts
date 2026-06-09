import { describe, it, expect } from 'vitest';
import { BLOG_POSTS } from '@/lib/content/blog';

describe('blog parser', () => {
  it('parses all 11 drafts with 4-language fields', () => {
    expect(BLOG_POSTS.length).toBe(11);
    for (const p of BLOG_POSTS) {
      expect(p.slug).toBeTruthy();
      expect(p.title.es).toBeTruthy();
      expect(p.title.en).toBeTruthy();
      expect(p.title.fr).toBeTruthy();
      expect(p.title.it).toBeTruthy();
      expect(p.content.es.length).toBeGreaterThan(100);
      expect(p.readingTime).toBeGreaterThan(0);
    }
  });
  it('parses Manolín slug from file content, not filename', () => {
    const m = BLOG_POSTS.find((p) => p.slug === 'como-contratar-manolin-medico-salsa-europa-2026');
    expect(m).toBeTruthy();
    expect(m!.title.en).toContain('Manolín');
  });
});
