import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GripVertical } from "lucide-react";

export function FaqCardSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between">
          <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-move" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20 rounded-md" />{" "}
            {/* Published/Draft button */}
            <Skeleton className="h-8 w-8 rounded-md" /> {/* Edit button */}
            <Skeleton className="h-8 w-8 rounded-md" /> {/* Delete button */}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" /> {/* FAQ question title */}
            <Skeleton className="h-4 w-full" /> {/* Line 1 of answer */}
            <Skeleton className="h-4 w-5/6" /> {/* Line 2 of answer */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
