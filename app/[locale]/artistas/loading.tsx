export default function ArtistasLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header skeleton */}
      <div className="bg-gradient-to-r from-black to-gray-800 py-10 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 md:h-12 bg-white/10 rounded-lg w-64 mb-2 md:mb-4 animate-pulse" />
          <div className="h-5 md:h-6 bg-white/10 rounded-lg w-96 animate-pulse" />
        </div>
      </div>

      {/* Artists grid skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg md:rounded-xl shadow-lg overflow-hidden">
              <div className="aspect-[4/5] md:aspect-[3/4] bg-gray-200 animate-pulse" />
              <div className="p-2 md:p-4">
                <div className="h-4 md:h-6 bg-gray-200 rounded w-3/4 mb-1 md:mb-2 animate-pulse" />
                <div className="h-3 md:h-4 bg-gray-200 rounded w-full mb-2 md:mb-3 animate-pulse" />
                <div className="h-8 md:h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
