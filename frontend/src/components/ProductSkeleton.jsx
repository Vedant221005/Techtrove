export function ProductSkeleton() {
  return (
    <div className="rounded-xl border-2 border-transparent bg-white dark:bg-gray-900 shadow-lg animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-gray-200 dark:bg-gray-800" />
      
      {/* Content Skeleton */}
      <div className="p-5 md:p-6 space-y-3">
        {/* Category Skeleton */}
        <div className="w-20 h-6 bg-gray-200 dark:bg-gray-800 rounded-full" />
        
        {/* Title Skeleton */}
        <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-800 rounded" />
        
        {/* Description Skeleton */}
        <div className="space-y-2">
          <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="w-2/3 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
        
        {/* Rating Skeleton */}
        <div className="flex items-center gap-2">
          <div className="w-24 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
        
        {/* Price and Button Skeleton */}
        <div className="mt-5 flex items-end justify-between pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            <div className="w-12 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="w-20 h-6 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
          <div className="w-28 h-10 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
      </div>
    </div>
  );
}