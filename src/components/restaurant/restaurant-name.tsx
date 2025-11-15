"use client";

import { Skeleton } from "@ui/skeleton";
import { useRestaurantQuery } from "@/hooks/use-restaurant";

export function RestaurantName() {
  const { data, isLoading, isError } = useRestaurantQuery();

  if (isLoading) {
    return <Skeleton className="h-5 w-32 rounded" />;
  }

  if (isError || !data) {
    return <span className="text-muted-foreground italic">Unnamed Restaurant</span>;
  }

  return (
    <span className="truncate font-semibold">
      {data}
    </span>
  );
}