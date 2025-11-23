import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@ui/card";
import { Skeleton } from "@ui/skeleton";

export function MenuItemSkeleton() {
  return (
    <Card className="py-0 pb-5 overflow-hidden">
      {/* Image Skeleton */}
      <div className="relative h-48 w-full">
        <Skeleton className="absolute inset-0 w-full h-full" />
      </div>

      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">
              <Skeleton className="h-5 w-32 rounded" />
            </CardTitle>
            <CardDescription className="mt-1 space-y-1">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
            </CardDescription>
          </div>
          <div className="ml-2">
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex justify-between items-center mb-3">
          <Skeleton className="h-5 w-20 rounded" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-14 rounded-full" />
          ))}
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-9 w-full rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
