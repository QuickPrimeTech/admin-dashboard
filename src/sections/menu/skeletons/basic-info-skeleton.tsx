// @/sections/menu/skeletons/basic-info-skeleton.tsx
import { Skeleton } from "@ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@ui/card";

const SkeletonField = ({
  label,
  height = 40,
}: {
  label?: string;
  height?: number;
}) => (
  <div className="space-y-2">
    {label && <div className="h-4 w-24 bg-muted rounded" />}{" "}
    {/* label placeholder */}
    <Skeleton className="rounded-md w-full" style={{ height }} />
  </div>
);

export function BasicInfoSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Basic Information</CardTitle>
        <CardDescription>
          Enter the essential details about your menu item
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Item Name */}
        <SkeletonField label="Item Name" />

        {/* Price + Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonField label="Price" />
          <SkeletonField label="Category" />
        </div>

        {/* Description */}
        <SkeletonField label="Description" height={100} />

        {/* Save button */}
        <div className="flex justify-end pt-4 border-t border-border">
          <Skeleton className="h-9 w-36 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
