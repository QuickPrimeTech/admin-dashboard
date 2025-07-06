"use client";

import { Card, CardContent } from "@/components/ui/card";

export function GallerySkeletonGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <div className="aspect-square bg-muted rounded-t-lg"></div>
          <CardContent className="p-4">
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-3 bg-muted rounded"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
