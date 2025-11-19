import { Card, CardContent, CardFooter, CardHeader } from "@ui/card";
import { Skeleton } from "@ui/skeleton";

export function OfferCardSkeleton() {
  return (
    <Card className="relative py-0 gap-0 group overflow-hidden">
      {/* HEADER TEXT OVER IMAGE */}
      <CardHeader className="px-0 mb-0">
        <Skeleton className="relative aspect-3/2 overflow-hidden" />
        <div className="px-4 py-4 space-y-2">
          <Skeleton className="h-4 max-w-3/4" />
          <Skeleton className="h-3.5" />
          <Skeleton className="h-3.5" />
        </div>
      </CardHeader>

      <Skeleton className="absolute top-3 right-3 w-22 h-5" />

      {/* CONTENT SECTION */}
      <CardContent className="p-5">
        <div className="space-y-3">
          <div className="flex gap-2 items-center text-sm">
            <Skeleton className="size-5 rounded-full" />
            <Skeleton className="text-muted-foreground font-medium h-5 flex-1" />
          </div>

          <div className="flex gap-2 items-start text-sm">
            <Skeleton className="size-5" />
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: 3 }, (_, idx) => (
                <Skeleton key={idx} className="h-4.5 w-9 rounded-full" />
              ))}
            </div>
          </div>
        </div>
        {/* <Separator className="mt-4" /> */}
        {/* ACTION BUTTONS */}
        <CardFooter className="flex justify-end bg-muted gap-2 items-center mt-2 p-2 rounded-sm">
          <Skeleton className="h-8 w-18" />
          <Skeleton className="h-8 w-18" />
        </CardFooter>
      </CardContent>
    </Card>
  );
}
