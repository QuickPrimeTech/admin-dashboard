import { Button } from "@ui/button";
import { Edit } from "lucide-react";
import { BasicInfoSkeleton } from "./basic-info-skeleton";
import { AvailabilitySkeleton } from "./availability-skeleton";
import { ChoicesListSkeleton } from "./choice-list-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageSectionSkeleton } from "./image-section-skeleton";

export function LoadingPageSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <ImageSectionSkeleton />
      </div>
      <div className="lg:col-span-2 space-y-6">
        <BasicInfoSkeleton />
        <AvailabilitySkeleton />
        <ChoicesListSkeleton />
        <Skeleton className="w-full h-6" />
        <div className="flex justify-end">
          <Button type="submit">
            <Edit /> Update Menu Item
          </Button>
        </div>
      </div>
    </div>
  );
}
