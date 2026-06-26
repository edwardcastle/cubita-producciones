import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import LazyChat from '@/components/LazyChat';
import type {Metadata} from 'next';
import {Poppins} from 'next/font/google';
import Script from 'next/script';
import {getSiteSettings, buildLocalizedUrl} from '@/lib/content';
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
    es: 'Cubita Producciones | Booking de Artistas Cubanos para Eventos en Europa',
    en: 'Cubita Producciones | Booking Cuban Artists for Events in Europe',
    fr: 'Cubita Producciones | Booking d\'Artistes Cubains pour Événements en Europe',
    it: 'Cubita Producciones | Booking Artisti Cubani per Eventi in Europa'
  };

  const descriptions = {
    es: 'Agencia de booking de artistas cubanos de salsa y reguetón en Europa. Más de 30 años contratando artistas para festivales, conciertos y eventos. Jacob Forever, Manolín, Charly & Johayron y más.',
    en: 'Cuban artist booking agency for salsa and reggaeton in Europe. Over 30 years booking artists for festivals, concerts and events. Jacob Forever, Manolín, Charly & Johayron and more.',
    fr: 'Agence de booking d\'artistes cubains de salsa et reggaeton en Europe. Plus de 30 ans de réservation d\'artistes pour festivals, concerts et événements. Jacob Forever, Manolín, Charly & Johayron et plus.',
    it: 'Agenzia di booking di artisti cubani di salsa e reggaeton in Europa. Oltre 30 anni di prenotazione artisti per festival, concerti ed eventi. Jacob Forever, Manolín, Charly & Johayron e altri.'
  };

  const baseUrl = 'https://cubitaproducciones.com';
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
    es: ['booking artistas en Europa', 'booking de artistas en Europa', 'booking artistas en europa', 'booking de artistas cubanos en Europa', 'booking artistas cubanos en Europa', 'booking artistas para eventos en Europa', 'booking artistas para festivales en Europa', 'agencia de booking en Europa', 'contratar artistas en Europa', 'contratar artistas cubanos en Europa', 'booking artistas', 'booking artistas cubanos', 'contratar artistas cubanos', 'booking artistas para eventos', 'booking artistas para fiestas', 'booking Jacob Forever', 'booking Manolín', 'booking El Micha', 'booking Charly & Johayron', 'salsa', 'reguetón', 'reggaeton', 'contratar artistas para festivales', 'artistas cubanos Europa', 'agencia de booking artistas', 'conciertos salsa Europa', 'eventos música cubana', 'booking artistas salsa', 'booking artistas reggaeton'],
    en: ['booking artists in Europe', 'book artists in Europe', 'booking Cuban artists in Europe', 'book Cuban artists in Europe', 'booking artists for events in Europe', 'booking artists for festivals in Europe', 'artist booking agency in Europe', 'European artist booking agency', 'hire artists in Europe', 'hire Cuban artists in Europe', 'booking artists', 'book Cuban artists', 'artist booking agency', 'booking artists for events', 'booking artists for festivals', 'booking Jacob Forever', 'booking Manolín', 'booking El Micha', 'booking Charly & Johayron', 'Cuban artists Europe', 'salsa', 'reggaeton', 'hire Cuban artists', 'Cuban booking agency', 'salsa concerts Europe', 'Cuban music events', 'Latin artists booking'],
    fr: ['booking artistes en Europe', 'booking d\'artistes en Europe', 'booking artistes cubains en Europe', 'booking d\'artistes cubains en Europe', 'booking artistes pour événements en Europe', 'booking artistes pour festivals en Europe', 'agence de booking en Europe', 'réserver artistes en Europe', 'réserver artistes cubains en Europe', 'booking artistes', 'booking artistes cubains', 'réserver artistes pour événements', 'agence booking artistes', 'réserver Jacob Forever', 'booking Manolín', 'booking El Micha', 'booking Charly & Johayron', 'artistes cubains Europe', 'salsa', 'reggaeton', 'agence booking cubaine', 'concerts salsa Europe', 'événements musique cubaine'],
    it: ['booking artisti in Europa', 'booking di artisti in Europa', 'booking artisti cubani in Europa', 'booking di artisti cubani in Europa', 'booking artisti per eventi in Europa', 'booking artisti per festival in Europa', 'agenzia di booking in Europa', 'prenotare artisti in Europa', 'prenotare artisti cubani in Europa', 'booking artisti', 'booking artisti cubani', 'prenotare artisti per eventi', 'agenzia booking artisti', 'prenotare Jacob Forever', 'booking Manolín', 'booking El Micha', 'booking Charly & Johayron', 'artisti cubani Europa', 'salsa', 'reggaeton', 'agenzia booking cubana', 'concerti salsa Europa', 'eventi musica cubana'],
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

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  // Enable static rendering for this locale (next-intl v4).
  // Without this, getLocale()/useLocale() reads request-time headers and
  // forces dynamic rendering with Cache-Control: no-store on every response,
  // which hurts crawl speed and SEO.
  setRequestLocale(locale);

  const [messages, siteSettings] = await Promise.all([
    getMessages(),
    getSiteSettings(),
  ]);

  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <html lang={locale} className={poppins.variable}>
      <body className={`${poppins.className} antialiased bg-white`}>
        {/* JSON-LD structured data — Google reads these from anywhere in the document */}
        <OrganizationJsonLd locale={locale} />
        <LocalBusinessJsonLd locale={locale} />
        <WebsiteJsonLd locale={locale} />

        {/* Meta Pixel */}
        {pixelId && (
          <>
            {/* Warm up the pixel origin's DNS/TLS before fbevents.js loads (React hoists these to <head>). */}
            <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
            <link rel="dns-prefetch" href="https://connect.facebook.net" />
            <Script id="meta-pixel" strategy="afterInteractive">
              {`!function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${pixelId}');
              fbq('track', 'PageView');`}
            </Script>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}

        <NextIntlClientProvider messages={messages}>
          <header>
            <Navigation logo={siteSettings.logo} />
          </header>
          <main className="min-h-screen">
            {children}
          </main>
          <Footer
            email={siteSettings.email}
            phone={siteSettings.phone}
            instagram={siteSettings.instagram}
          />
          <LazyChat />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
