import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import type {Metadata} from 'next';
import {Poppins} from 'next/font/google';
import {getSiteSettings} from '@/lib/strapi';
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
    fr: 'Cubita Producciones | Booking d\'Artistes Cubains en Europe'
  };

  const descriptions = {
    es: 'Agencia de booking con más de 30 años representando artistas cubanos de salsa y reguetón en Europa. Jacob Forever, Manolín, Charly & Johayron y más.',
    en: 'Booking agency with over 30 years representing Cuban salsa and reggaeton artists in Europe. Jacob Forever, Manolín, Charly & Johayron and more.',
    fr: 'Agence de booking avec plus de 30 ans représentant des artistes cubains de salsa et reggaeton en Europe. Jacob Forever, Manolín, Charly & Johayron et plus.'
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.es,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.es,
    keywords: ['booking', 'artistas cubanos', 'salsa', 'reguetón', 'reggaeton', 'Jacob Forever', 'Manolín', 'festivales', 'Europa', 'conciertos'],
    authors: [{name: 'Cubita Producciones'}],
    icons: {
      icon: '/logo.jpeg',
      apple: '/logo.jpeg',
    },
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.es,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.es,
      type: 'website',
      locale: locale,
      siteName: 'Cubita Producciones',
    },
    robots: {
      index: true,
      follow: true,
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
