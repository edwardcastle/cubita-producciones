import Image from 'next/image';
import { ReactNode } from 'react';

interface Hero3DFallbackProps {
  fallbackImage: string;
  altText: string;
  children: ReactNode;
}

/**
 * Server-rendered static hero used when the WebGL scene can't or shouldn't render:
 *  - During SSR / before the dynamic import finishes
 *  - On mobile (no heavy 3D for phones)
 *  - When prefers-reduced-motion is on
 *
 * Same structural shape as Hero3D so layout doesn't shift on hydration.
 */
export default function Hero3DFallback({ fallbackImage, altText, children }: Hero3DFallbackProps) {
  return (
    <section className="relative flex flex-col overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white md:min-h-screen">
      <div className="absolute inset-0 w-full">
        <Image
          src={fallbackImage}
          alt={altText}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/20" aria-hidden="true" />
      </div>
      <div className="relative z-10 w-full flex-1 flex items-center py-10 px-4 sm:px-6 lg:px-8 md:py-16">
        {children}
      </div>
    </section>
  );
}
