import { Button } from "@ui/button";
import { Edit } from "lucide-react";
import { BasicInfoSkeleton } from "./basic-info-skeleton";
import { AvailabilitySkeleton } from "./availability-skeleton";
import { ChoicesListSkeleton } from "./choice-list-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageSectionSkeleton } from "./image-section-skeleton";

export function LoadingPageSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between mb-8 space-y-4">
          <div>
            <Skeleton className="h-12 max-w-sm" />
            <Skeleton className="h-10 max-w-md" />
          </div>
        </div>
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
      </div>
    </div>
  );
}
