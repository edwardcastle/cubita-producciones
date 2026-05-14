import { getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import BookingLandingContent from '@/components/booking/BookingLandingContent';
import { BreadcrumbJsonLd, BookingServiceJsonLd } from '@/components/seo/JsonLd';
import { buildBookingLandingMetadata, buildBookingLandingUrl } from '@/lib/booking-landing';

const PAGE_LOCALE = 'it' as const;

export const metadata = buildBookingLandingMetadata(PAGE_LOCALE);

export default async function Page() {
  const locale = await getLocale();
  if (locale !== PAGE_LOCALE) notFound();

  const url = buildBookingLandingUrl(PAGE_LOCALE);
  const breadcrumbItems = [
    { name: 'Home', url: `https://cubitaproducciones.com/${PAGE_LOCALE}` },
    { name: 'Booking Artisti Cubani', url },
  ];

  return (
    <>
      <BookingServiceJsonLd locale={PAGE_LOCALE} url={url} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <BookingLandingContent locale={PAGE_LOCALE} />
    </>
  );
}
