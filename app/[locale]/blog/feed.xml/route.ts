import { getBlogPosts } from '@/lib/content';
import { stripMarkdown } from '@/lib/utils';
import { routing } from '@/i18n/routing';

type Locale = 'es' | 'en' | 'fr' | 'it';

const BASE_URL = 'https://cubitaproducciones.com';

const CHANNEL: Record<Locale, { title: string; description: string }> = {
  es: { title: 'Blog | Cubita Producciones', description: 'Guías de booking y música cubana para promotores y organizadores de eventos en Europa.' },
  en: { title: 'Blog | Cubita Producciones', description: 'Booking guides and Cuban music for promoters and event organizers in Europe.' },
  fr: { title: 'Blog | Cubita Producciones', description: 'Guides de booking et musique cubaine pour promoteurs et organisateurs en Europe.' },
  it: { title: 'Blog | Cubita Producciones', description: 'Guide al booking e musica cubana per promoter e organizzatori in Europa.' },
};

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = (await params) as { locale: Locale };
  const posts = [...(await getBlogPosts())].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const channel = CHANNEL[locale] ?? CHANNEL.es;
  const feedUrl = `${BASE_URL}/${locale}/blog/feed.xml`;
  const siteUrl = `${BASE_URL}/${locale}/blog`;
  const lastBuild = posts.length ? new Date(posts[0].publishedAt).toUTCString() : new Date(0).toUTCString();

  const entries = posts
    .map((post) => {
      const title = post.title[locale] || post.title.es;
      const description = stripMarkdown(post.excerpt[locale] || post.excerpt.es);
      const link = `${BASE_URL}/${locale}/blog/${post.slug}`;
      const pubDate = new Date(post.publishedAt).toUTCString();
      return `    <item>
      <title>${escapeXml(title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(description)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channel.title)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(channel.description)}</description>
    <language>${locale}</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${entries}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
