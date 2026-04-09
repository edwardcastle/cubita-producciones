import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import LazyChat from '@/components/LazyChat';
import type {Metadata} from 'next';
import {Poppins} from 'next/font/google';
import {getSiteSettings, buildLocalizedUrl} from '@/lib/strapi';
import {OrganizationJsonLd, LocalBusinessJsonLd, WebsiteJsonLd} from '@/components/seo/JsonLd';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;

  const titles = {
    es: 'Cubita Producciones | Booking de Artistas Cubanos en Europa',
    en: 'Cubita Producciones | Cuban Artists Booking in Europe',
    fr: 'Cubita Producciones | Booking d\'Artistes Cubains en Europe',
    it: 'Cubita Producciones | Prenotazione Artisti Cubani in Europa'
  };

  const descriptions = {
    es: 'Agencia de booking con más de 30 años representando artistas cubanos de salsa y reguetón en Europa. Jacob Forever, Manolín, Charly & Johayron y más.',
    en: 'Booking agency with over 30 years representing Cuban salsa and reggaeton artists in Europe. Jacob Forever, Manolín, Charly & Johayron and more.',
    fr: 'Agence de booking avec plus de 30 ans représentant des artistes cubains de salsa et reggaeton en Europe. Jacob Forever, Manolín, Charly & Johayron et plus.',
    it: 'Agenzia di booking con oltre 30 anni di rappresentanza di artisti cubani di salsa e reggaeton in Europa. Jacob Forever, Manolín, Charly & Johayron e altri.'
  };

  const baseUrl = 'https://www.cubitaproducciones.com';
  const locales = ['es', 'en', 'fr', 'it'];
  const title = titles[locale as keyof typeof titles] || titles.es;
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.es;

  const ogLocales: Record<string, string> = {
    es: 'es_ES',
    en: 'en_US',
    fr: 'fr_FR',
    it: 'it_IT',
  };

  const localeKeywords: Record<string, string[]> = {
    es: ['booking artistas cubanos', 'contratar artistas cubanos', 'booking Jacob Forever', 'booking Manolín', 'booking El Micha', 'booking Charly & Johayron', 'salsa', 'reguetón', 'reggaeton', 'contratar para festivales', 'artistas cubanos Europa', 'agencia de booking cubana', 'conciertos salsa Europa', 'eventos música cubana'],
    en: ['book Cuban artists', 'booking Jacob Forever', 'booking Manolín', 'booking El Micha', 'booking Charly & Johayron', 'Cuban artists Europe', 'salsa', 'reggaeton', 'hire Cuban artists', 'Cuban booking agency', 'salsa concerts Europe', 'Cuban music events', 'Latin artists booking'],
    fr: ['booking artistes cubains', 'réserver Jacob Forever', 'booking Manolín', 'booking El Micha', 'booking Charly & Johayron', 'artistes cubains Europe', 'salsa', 'reggaeton', 'agence booking cubaine', 'concerts salsa Europe', 'événements musique cubaine'],
    it: ['booking artisti cubani', 'prenotare Jacob Forever', 'booking Manolín', 'booking El Micha', 'booking Charly & Johayron', 'artisti cubani Europa', 'salsa', 'reggaeton', 'agenzia booking cubana', 'concerti salsa Europa', 'eventi musica cubana'],
  };

  return {
    title,
    description,
    keywords: localeKeywords[locale] || localeKeywords.es,
    authors: [{name: 'Cubita Producciones'}],
    creator: 'Cubita Producciones',
    publisher: 'Cubita Producciones',
    category: 'entertainment',
    metadataBase: new URL(baseUrl),
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      other: [
        { rel: 'android-chrome', url: '/android-chrome-192x192.png', sizes: '192x192' },
        { rel: 'android-chrome', url: '/android-chrome-512x512.png', sizes: '512x512' },
      ],
    },
    manifest: '/site.webmanifest',
    openGraph: {
      title,
      description,
      url: buildLocalizedUrl(locale),
      type: 'website',
      locale: ogLocales[locale] || 'es_ES',
      alternateLocale: locales.filter(l => l !== locale).map(l => ogLocales[l]),
      siteName: 'Cubita Producciones',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.jpg'],
      creator: '@cubitaproducciones',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: buildLocalizedUrl(locale),
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [l, buildLocalizedUrl(l)])
        ),
        'x-default': buildLocalizedUrl('es'),
      },
    },
    verification: {
      // Add your verification codes here when you have them
      // google: 'your-google-verification-code',
      // yandex: 'your-yandex-verification-code',
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const [messages, siteSettings] = await Promise.all([
    getMessages(),
    getSiteSettings(),
  ]);

  return (
    <html lang={locale} className={poppins.variable}>
      <head>
        <OrganizationJsonLd locale={locale} />
        <LocalBusinessJsonLd locale={locale} />
        <WebsiteJsonLd locale={locale} />
        {/* Meta Pixel */}
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <>
            <script
              async
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
                  fbq('track', 'PageView');
                `,
              }}
            />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
      </head>
      <body className={`${poppins.className} antialiased bg-white`}>
        <NextIntlClientProvider messages={messages}>
          <header>
            <Navigation logo={siteSettings.logo} />
          </header>
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <LazyChat />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
