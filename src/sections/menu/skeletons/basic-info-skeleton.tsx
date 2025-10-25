//@/sections/menu/skeletons/basic-info-skeleton.tsx

import { Skeleton } from "@ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@ui/card";
import { FormLabel } from "@ui/form";

const SkeletonField = ({ height = 40 }: { height?: number }) => (
  <Skeleton className="rounded-md" style={{ height }} />
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
        <div>
          <FormLabel>Item Name</FormLabel>
          <SkeletonField />
        </div>

        {/* Price + Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FormLabel>Price</FormLabel>
            <SkeletonField />
          </div>
          <div>
            <FormLabel>Category</FormLabel>
            <SkeletonField />
          </div>
        </div>

        {/* Description */}
        <div>
          <FormLabel>Description</FormLabel>
          <SkeletonField height={100} />
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <SkeletonField height={36} />
        </div>
      </CardContent>
    </Card>
  );
}
