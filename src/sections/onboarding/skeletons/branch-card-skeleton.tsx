import { Card, CardHeader, CardTitle, CardContent } from "@ui/card";
import { ExternalLink, Edit, Trash2 } from "lucide-react";
import { Button } from "@ui/button";
import { Skeleton } from "@ui/skeleton";

export function BranchCardSkeleton() {
  return (
    <Card className="border-border shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="size-5 rounded-full" />
          <Skeleton className="h-4 w-1/2" />
        </CardTitle>
        <Skeleton className="h-3" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-9" />
        <div className="flex gap-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
      </CardContent>
    </Card>
  );
}
