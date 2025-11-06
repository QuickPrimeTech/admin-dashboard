import { MenuFiltersSkeleton } from "@/components/skeletons/menu-filter-skeleton";
import { MenuItemSkeleton } from "@/components/skeletons/menu-item-skeleton";

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 items-start lg:flex-row justify-between lg:items-center">
        <div className="space-y-2 w-full max-w-sm">
          <div className="h-8 w-48 bg-muted rounded-md" />
          <div className="h-4 w-64 bg-muted rounded-md" />
        </div>
        <div className="flex gap-2 w-full lg:w-auto">
          <div className="h-10 w-32 bg-muted rounded-md" />
          <div className="h-10 w-32 bg-muted rounded-md" />
        </div>
      </div>

      {/* Filters Skeleton */}
      <MenuFiltersSkeleton />

      {/* Menu Items Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <MenuItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
