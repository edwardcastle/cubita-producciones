'use client';

import { useRouter } from 'next/navigation';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4">500</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Something went wrong. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
