import { Card, CardContent } from "@ui/card";
import { Skeleton } from "@ui/skeleton";

export function ManageBranchSkeleton() {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3 w-full">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
