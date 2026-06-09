import type { SitemapData } from './types';
import { ARTISTS } from './artists';

const STAMP = new Date('2026-01-01T00:00:00.000Z');

export async function getSitemapData(): Promise<SitemapData> {
  return {
    home: STAMP,
    about: STAMP,
    contact: STAMP,
    artistsList: STAMP,
    artists: ARTISTS.map((a) => ({ slug: a.slug, updatedAt: STAMP })),
  };
}
