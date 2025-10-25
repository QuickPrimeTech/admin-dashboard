// @/sections/menu/skeletons/availability-skeleton.tsx
import { Skeleton } from "@ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@ui/card";

const SkeletonField = ({
  label,
  height = 40,
}: {
  label?: string;
  height?: number;
}) => (
  <div className="space-y-2">
    {label && <div className="h-4 w-24 bg-muted rounded" />}
    <Skeleton className="rounded-md w-full" style={{ height }} />
  </div>
);

export function AvailabilitySkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Availability</CardTitle>
        <CardDescription>
          Set when this item is available for ordering
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Availability Switch */}
        <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-card">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-3 w-64 bg-muted/60 rounded" />
          </div>
          <Skeleton className="h-6 w-10 rounded-full" />
        </div>

        {/* Popular Switch */}
        <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-card">
          <div className="space-y-2">
            <div className="h-4 w-20 bg-muted rounded" />
            <div className="h-3 w-64 bg-muted/60 rounded" />
          </div>
          <Skeleton className="h-6 w-10 rounded-full" />
        </div>

        {/* Time Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonField label="Available From" />
          <SkeletonField label="Available Until" />
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-border">
          <Skeleton className="h-9 w-36 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
