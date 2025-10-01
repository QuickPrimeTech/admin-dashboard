"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export function MenuFiltersSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search Skeleton */}
      <div className="relative flex-1">
        <Skeleton className="h-10 w-full rounded-md" />
        {/* Icon placeholder (Search icon) */}
        <Skeleton className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 rounded" />
      </div>

      {/* Categories Skeleton */}
      <ScrollArea className="w-full sm:w-auto">
        <div className="flex gap-2 w-max px-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-md" />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
