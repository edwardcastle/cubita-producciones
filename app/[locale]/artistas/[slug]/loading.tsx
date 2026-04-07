export default function ArtistLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero skeleton */}
      <div className="relative bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
          <div className="h-4 bg-white/10 rounded w-32 mb-4 md:mb-8 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center py-4 md:py-8">
            <div>
              <div className="h-6 bg-white/10 rounded-full w-24 mb-3 md:mb-6 animate-pulse" />
              <div className="h-10 md:h-16 bg-white/10 rounded-lg w-3/4 mb-3 md:mb-6 animate-pulse" />
              <div className="flex gap-3 md:gap-6 mb-4 md:mb-8">
                <div className="h-5 bg-white/10 rounded w-28 animate-pulse" />
                <div className="h-5 bg-white/10 rounded w-28 animate-pulse" />
              </div>
              <div className="flex gap-2 md:gap-4">
                <div className="h-10 md:h-14 bg-amber-500/20 rounded-lg w-40 animate-pulse" />
                <div className="h-10 md:h-14 bg-white/10 rounded-lg w-32 animate-pulse" />
              </div>
            </div>
            <div className="h-[280px] sm:h-[350px] md:h-[500px] bg-white/10 rounded-xl md:rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-40 mb-4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
          </div>
          <div className="bg-white rounded-lg md:rounded-xl shadow-lg p-4 md:p-6 h-72 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
