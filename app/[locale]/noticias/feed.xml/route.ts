import { getNews } from '@/lib/content';
import { stripMarkdown } from '@/lib/utils';
import { routing } from '@/i18n/routing';

type Locale = 'es' | 'en' | 'fr' | 'it';

const BASE_URL = 'https://cubitaproducciones.com';

const CHANNEL: Record<Locale, { title: string; description: string }> = {
  es: { title: 'Noticias | Cubita Producciones', description: 'Últimas noticias y giras de artistas cubanos en Europa.' },
  en: { title: 'News | Cubita Producciones', description: 'Latest news and tours from Cuban artists in Europe.' },
  fr: { title: 'Actualités | Cubita Producciones', description: 'Dernières actualités et tournées des artistes cubains en Europe.' },
  it: { title: 'Notizie | Cubita Producciones', description: 'Ultime notizie e tour degli artisti cubani in Europa.' },
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
  const items = await getNews();
  const channel = CHANNEL[locale] ?? CHANNEL.es;
  const feedUrl = `${BASE_URL}/${locale}/noticias/feed.xml`;
  const siteUrl = `${BASE_URL}/${locale}/noticias`;
  // Items are sorted newest-first in lib/content/news.ts, so items[0] is the freshest.
  const lastBuild = items.length ? new Date(items[0].publishedAt).toUTCString() : new Date(0).toUTCString();

  const entries = items
    .map((item) => {
      const title = item.title[locale] || item.title.es;
      const description = stripMarkdown(item.excerpt[locale] || item.excerpt.es);
      const link = `${BASE_URL}/${locale}/noticias/${item.slug}`;
      const pubDate = new Date(item.publishedAt).toUTCString();
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
