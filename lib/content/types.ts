/**
 * Represents a media image (named StrapiImage for backwards-compatible imports)
 * @interface StrapiImage
 */
export interface StrapiImage {
  /** Full or relative URL to the image */
  url: string;
  /** Alt text for accessibility */
  alternativeText?: string;
  /** Image width in pixels */
  width?: number;
  /** Image height in pixels */
  height?: number;
}

/**
 * Represents a Cuban artist for booking
 * @interface Artist
 */
export interface Artist {
  id: string;
  name: string;
  slug: string;
  genre: 'salsa' | 'reggaeton';
  bio: {
    es: string;
    en: string;
    fr: string;
    it: string;
  };
  availability: string;
  image: string | null;
  instagram?: string;
  youtube?: string;
  youtubeVideoId?: string;
  travelParty: number;
  seo: SEO | null;
}

export interface HomePage {
  heroTitle: { es: string; en: string; fr: string; it: string };
  heroSubtitle: { es: string; en: string; fr: string; it: string };
  stats: {
    years: number;
    artists: number;
    festivals: number;
    countries: number;
  };
  aboutTitle: { es: string; en: string; fr: string; it: string };
  aboutText: { es: string; en: string; fr: string; it: string };
  ctaText: { es: string; en: string; fr: string; it: string };
  heroImages: StrapiImage[];
  aboutVideo: string | null;
  seo: SEO | null;
}

export interface AboutPage {
  title: { es: string; en: string; fr: string; it: string };
  subtitle: { es: string; en: string; fr: string; it: string };
  missionTitle: { es: string; en: string; fr: string; it: string };
  missionText: { es: string; en: string; fr: string; it: string };
  stats: {
    years: number;
    festivals: number;
    countries: number;
    artists: number;
  };
  services: Array<{
    title: { es: string; en: string; fr: string; it: string };
    text: { es: string; en: string; fr: string; it: string };
  }>;
  seo: SEO | null;
}

export interface ContactPage {
  title: { es: string; en: string; fr: string; it: string };
  subtitle: { es: string; en: string; fr: string; it: string };
  email: string;
  phone: string;
  location: string;
  responseTimeTitle: { es: string; en: string; fr: string; it: string };
  responseTimeText: { es: string; en: string; fr: string; it: string };
  formLabels: {
    name: { es: string; en: string; fr: string; it: string };
    email: { es: string; en: string; fr: string; it: string };
    country: { es: string; en: string; fr: string; it: string };
    date: { es: string; en: string; fr: string; it: string };
    artist: { es: string; en: string; fr: string; it: string };
    message: { es: string; en: string; fr: string; it: string };
    submit: { es: string; en: string; fr: string; it: string };
  };
  successMessage: { es: string; en: string; fr: string; it: string };
  errorMessage: { es: string; en: string; fr: string; it: string };
  seo: SEO | null;
}

export interface ArtistsPage {
  title: { es: string; en: string; fr: string; it: string };
  subtitle: { es: string; en: string; fr: string; it: string };
  viewDetailsButton: { es: string; en: string; fr: string; it: string };
  ctaTitle: { es: string; en: string; fr: string; it: string };
  ctaSubtitle: { es: string; en: string; fr: string; it: string };
  salsaLabel: { es: string; en: string; fr: string; it: string };
  reggaetonLabel: { es: string; en: string; fr: string; it: string };
  seo: SEO | null;
}

export interface SiteSettings {
  companyName: string;
  logo: string | null;
  email: string;
  phone: string;
  location: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  nav: {
    home: { es: string; en: string; fr: string; it: string };
    artists: { es: string; en: string; fr: string; it: string };
    about: { es: string; en: string; fr: string; it: string };
    contact: { es: string; en: string; fr: string; it: string };
  };
  footerDescription: { es: string; en: string; fr: string; it: string };
  footerCopyright: { es: string; en: string; fr: string; it: string };
}

export interface SEO {
  metaTitle: { es: string; en: string; fr: string; it: string };
  metaDescription: { es: string; en: string; fr: string; it: string };
  keywords: string | null;
  ogImage: string | null;
  canonicalUrl: string | null;
  noIndex: boolean;
}

export interface PageWithSEO {
  seo: SEO | null;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: { es: string; en: string; fr: string; it: string };
  excerpt: { es: string; en: string; fr: string; it: string };
  content: { es: string; en: string; fr: string; it: string };
  coverImage: string | null;
  publishedAt: string;
  updatedAt: string;
  author: string;
  readingTime: number;
  seo: SEO | null;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  eventName?: string;
  artistName?: string;
  featured: boolean;
}

export type SitemapData = {
  home: Date | null;
  artistsList: Date | null;
  contact: Date | null;
  about: Date | null;
  artists: Array<{ slug: string; updatedAt: Date }>;
};
