import { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: '404 - Cubita Producciones',
  description: 'Page not found',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}