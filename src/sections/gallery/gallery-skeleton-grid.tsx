import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function GallerySkeletonGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card className="py-0 pb-3 overflow-hidden" key={i}>
          {/* Image Skeleton */}
          <div className="relative aspect-square overflow-hidden">
            <Skeleton className="absolute inset-0 w-full h-full" />
            <div className="absolute top-2 right-2">
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>

          {/* Title & Description Skeleton */}
          <CardContent>
            <Skeleton className="h-4 w-3/4 mt-3 mb-2 rounded" />
            <Skeleton className="h-3 w-full rounded mb-1" />
            <Skeleton className="h-3 w-5/6 rounded" />
          </CardContent>

          {/* Buttons Skeleton */}
          <CardFooter className="flex gap-1">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
