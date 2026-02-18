'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import Image from 'next/image';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  className?: string;
}

export default function YouTubeEmbed({ videoId, title = 'YouTube video', className = '' }: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  if (isLoaded) {
    return (
      <div className={`relative aspect-video rounded-xl overflow-hidden shadow-lg ${className}`}>
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsLoaded(true)}
      className={`relative aspect-video rounded-xl overflow-hidden shadow-lg group cursor-pointer w-full ${className}`}
      aria-label={`Play ${title}`}
    >
      {/* Thumbnail */}
      <Image
        src={thumbnailUrl}
        alt={title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />

      {/* Play Button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-red-600 rounded-full p-4 md:p-6 shadow-lg transform transition-transform duration-300 group-hover:scale-110">
          <Play className="w-8 h-8 md:w-12 md:h-12 text-white fill-white" />
        </div>
      </div>

      {/* YouTube Branding */}
      <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-black/70 px-2 py-1 rounded text-white text-xs md:text-sm font-medium">
        YouTube
      </div>
    </button>
  );
}
