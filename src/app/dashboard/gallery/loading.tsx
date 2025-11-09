import { GallerySkeletonGrid } from "@/sections/gallery/gallery-skeleton-grid";
import { Skeleton } from "@ui/skeleton";
import { Search } from "lucide-react";

export default function Loading() {
  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header skeleton */}
      <div className="flex flex-col gap-4 items-start lg:flex-row justify-between lg:items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" /> {/* Title */}
          <Skeleton className="h-4 w-72" /> {/* Subtitle */}
        </div>
        <Skeleton className="h-10 w-[120px] rounded-md" /> {/* Add button */}
      </div>

      {/* Filter/search skeleton */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Search className="h-4 w-4 opacity-40" />
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton className="h-10 w-[100px] rounded-md" key={index} />
          ))}
        </div>
      </div>

      {/* Gallery grid skeleton */}
      <GallerySkeletonGrid />
    </div>
  );
}
