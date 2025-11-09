"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@ui/card";
import { Skeleton } from "@ui/skeleton";

export function BranchCardSkeleton() {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Skeleton className="size-5" />
          <Skeleton className="h-6 flex-1" />
        </CardTitle>
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent className="flex gap-2">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 flex-1" />
      </CardContent>
    </Card>
  );
}
