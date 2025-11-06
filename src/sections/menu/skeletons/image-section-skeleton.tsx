import { Skeleton } from "@ui/skeleton";
import { Card, CardHeader, CardContent } from "@ui/card";

export function ImageSectionSkeleton() {
  return (
    <Card className="sticky top-16 h-fit animate-pulse">
      <CardHeader>
        <Skeleton className="h-5 w-1/2 bg-muted rounded-md mb-2" />
        <Skeleton className="h-4 w-2/3 bg-muted rounded-md" />
      </CardHeader>
      <CardContent>
        <Skeleton className="relative aspect-square rounded-xl bg-muted" />
      </CardContent>
    </Card>
  );
}
