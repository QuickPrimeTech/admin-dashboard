import { Skeleton } from "@ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";

export function AddBranchCardSkeleton() {
  return (
    <Card className="border-border shadow-md hover:cursor-pointer">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="size-5 text-primary" />
          <Skeleton className="h-5 w-1/2" />
        </CardTitle>
        <Skeleton className="h-4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-9" />
      </CardContent>
    </Card>
  );
}
