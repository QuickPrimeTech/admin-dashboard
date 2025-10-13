"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function OrdersLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* TABS */}

      {/* TABLE */}
      <Card>
        <CardContent className="p-0 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 p-4 border-b bg-muted/40">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
          </div>

          {/* Table Rows */}
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-6 gap-4 p-4 border-b last:border-none"
            >
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="h-4 w-12 rounded" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-4">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
        <Skeleton className="h-4 w-36 rounded-md" />
      </div>
    </div>
  );
}
