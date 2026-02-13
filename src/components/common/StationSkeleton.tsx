type Props = {
  items?: number;
}

export function StationSkeleton({ items = 1 }: Props) {
  return (
    <>
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
      {/* Header: CreId + Nombre | Precio */}
      <div className="flex justify-between items-start mb-3">
        <div className="space-y-2">
          {/* CreId */}
          <div className="h-3 w-28 rounded animate-shimmer"></div>
          {/* Nombre */}
          <div className="h-5 w-44 rounded animate-shimmer"></div>
        </div>
        {/* Precio + Label */}
        <div className="text-right space-y-1">
          <div className="h-8 w-20 rounded animate-shimmer"></div>
          <div className="h-3 w-12 rounded animate-shimmer ml-auto"></div>
        </div>
      </div>

      {/* Otros precios */}
      <div className="flex gap-4 p-2 rounded-lg bg-gray-50 mb-4">
        <div className="h-4 w-24 rounded animate-shimmer"></div>
        <div className="h-4 w-24 rounded animate-shimmer"></div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-2">
        <div className="h-4 w-16 rounded animate-shimmer"></div>
        <div className="h-8 w-24 rounded-full animate-shimmer"></div>
      </div>
    </div>
    ))}
    </>
  );
}