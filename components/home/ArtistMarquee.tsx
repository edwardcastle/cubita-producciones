// components/home/ArtistMarquee.tsx
import { getArtists } from '@/lib/strapi';
import Marquee from '@/components/ui/Marquee';

/**
 * Server component that fetches the artist roster from Strapi and renders
 * a slow horizontal marquee of their names. Decorative — aria-hidden.
 * Hidden below the md breakpoint.
 */
export default async function ArtistMarquee() {
  const artists = await getArtists();
  if (!artists.length) return null;

  const names = artists.map((a) => a.name).join(' · ');

  return (
    <div
      aria-hidden="true"
      role="presentation"
      className="hidden md:flex md:items-center absolute inset-0 -z-10 pointer-events-none opacity-[0.06]"
    >
      <Marquee durationSec={80}>
        <span className="text-8xl font-bold tracking-tight text-gray-900 whitespace-nowrap px-8">
          {names}
        </span>
      </Marquee>
    </div>
  );
}
