export function SkeletonCard({ lines = 3, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl shadow-soft border border-gray-50 p-6 animate-pulse ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-100 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-100 rounded w-3/4" />
          <div className="h-3 bg-gray-50 rounded w-1/2" />
        </div>
      </div>
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <div key={i} className="h-3 bg-gray-50 rounded mb-2" style={{ width: `${75 - i * 15}%` }} />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonText({ className = "" }) {
  return <div className={`h-4 bg-gray-100 rounded animate-pulse ${className}`} />;
}
