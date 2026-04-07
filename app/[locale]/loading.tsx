export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="bg-gradient-to-br from-black via-gray-900 to-gray-800 py-12 md:py-24 px-4">
        <div className="max-w-7xl mx-auto max-w-3xl">
          <div className="h-10 md:h-14 bg-white/10 rounded-lg w-3/4 mb-4 md:mb-6 animate-pulse" />
          <div className="h-6 md:h-8 bg-white/10 rounded-lg w-2/3 mb-6 md:mb-8 animate-pulse" />
          <div className="h-12 md:h-14 bg-amber-500/20 rounded-lg w-48 animate-pulse" />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="py-8 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-3 md:p-6 text-center">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-gray-200 rounded-full mx-auto mb-2 md:mb-4 animate-pulse" />
              <div className="h-8 md:h-10 bg-gray-200 rounded w-16 mx-auto mb-1 md:mb-2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-20 mx-auto animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
