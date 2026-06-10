import type { Artist, BlogPost, Review } from './types';
import { ARTISTS } from './artists';
import { REVIEWS } from './reviews';
import { BLOG_POSTS } from './blog';
import { HOME_PAGE, ABOUT_PAGE, CONTACT_PAGE, ARTISTS_PAGE, SITE_SETTINGS } from './pages';

// Re-export types and SEO helpers — `@/lib/content` is the drop-in replacement for the former `@/lib/strapi`.
export type {
  StrapiImage, Artist, HomePage, AboutPage, ContactPage, ArtistsPage,
  SiteSettings, SEO, PageWithSEO, BlogPost, Review, SitemapData,
} from './types';
export {
  generateMetadataFromSEO, buildAlternates, buildLocalizedUrl, parseHeroImages,
} from './seo';
export { getSitemapData } from './sitemap';

export async function getArtists(): Promise<Artist[]> {
  return [...ARTISTS].sort((a, b) => a.name.localeCompare(b.name, 'es'));
}
export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  return ARTISTS.find((a) => a.slug === slug) ?? null;
}
export async function getAllArtistSlugs(): Promise<string[]> {
  return ARTISTS.map((a) => a.slug);
}

export async function getHomePage() { return HOME_PAGE; }
export async function getAboutPage() { return ABOUT_PAGE; }
export async function getContactPage() { return CONTACT_PAGE; }
export async function getArtistsPage() { return ARTISTS_PAGE; }
export async function getSiteSettings() { return SITE_SETTINGS; }

export async function getReviews(): Promise<Review[]> { return REVIEWS; }

export async function getBlogPosts(): Promise<BlogPost[]> { return BLOG_POSTS; }
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return BLOG_POSTS.find((p) => p.slug === slug) ?? null;
}
export async function getAllBlogPostSlugs(): Promise<Array<{ slug: string; updatedAt: string }>> {
  return BLOG_POSTS.map((p) => ({ slug: p.slug, updatedAt: p.updatedAt }));
}
