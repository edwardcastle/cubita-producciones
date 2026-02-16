import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import type {Metadata} from 'next';
import {Poppins} from 'next/font/google';
import {getSiteSettings} from '@/lib/strapi';
import {OrganizationJsonLd, LocalBusinessJsonLd, WebsiteJsonLd} from '@/components/seo/JsonLd';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
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

  const baseUrl = 'https://cubitaproducciones.com';
  const locales = ['es', 'en', 'fr', 'it'];
  const title = titles[locale as keyof typeof titles] || titles.es;
  const description = descriptions[locale as keyof typeof descriptions] || descriptions.es;

  return {
    title,
    description,
    keywords: ['booking', 'artistas cubanos', 'Cuban artists', 'salsa', 'reguetón', 'reggaeton', 'Jacob Forever', 'Manolín', 'Charly & Johayron', 'festivales', 'Europa', 'conciertos', 'booking agency', 'music booking', 'live music'],
    authors: [{name: 'Cubita Producciones'}],
    creator: 'Cubita Producciones',
    publisher: 'Cubita Producciones',
    metadataBase: new URL(baseUrl),
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}`,
      type: 'website',
      locale: locale,
      siteName: 'Cubita Producciones',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Cubita Producciones - Cuban Artists Booking Agency',
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
      canonical: `${baseUrl}/${locale}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}/${l}`])
      ),
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
      </head>
      <body className={`${poppins.className} antialiased bg-white`}>
        <NextIntlClientProvider messages={messages}>
          <Navigation logo={siteSettings.logo} />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
