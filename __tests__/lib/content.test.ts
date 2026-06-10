import { describe, it, expect } from 'vitest';
import { BLOG_POSTS } from '@/lib/content/blog';
import { getArtists, getArtistBySlug, getAllArtistSlugs, getReviews, getAllBlogPostSlugs } from '@/lib/content';

describe('blog parser', () => {
  it('parses all 11 drafts with 4-language fields', () => {
    expect(BLOG_POSTS.length).toBeGreaterThanOrEqual(11);
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

describe('artist content', () => {
  it('has unique, non-empty slugs', async () => {
    const slugs = await getAllArtistSlugs();
    expect(slugs.length).toBe(7);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(slugs.every(Boolean)).toBe(true);
  });
  it('round-trips every slug via getArtistBySlug', async () => {
    for (const slug of await getAllArtistSlugs()) {
      const a = await getArtistBySlug(slug);
      expect(a?.slug).toBe(slug);
      expect(a?.bio.es).toBeTruthy();
    }
  });
  it('returns null for unknown slug', async () => {
    expect(await getArtistBySlug('nope')).toBeNull();
  });
  it('sorts artists by name', async () => {
    const names = (await getArtists()).map((a) => a.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });
});

describe('reviews content', () => {
  it('is empty for now', async () => {
    expect(await getReviews()).toEqual([]);
  });
});

describe('blog content integrity', () => {
  it('has unique slugs', async () => {
    const slugs = (await getAllBlogPostSlugs()).map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
