import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Skeleton } from "@ui/skeleton";
import { ChefHat } from "lucide-react";

export function InviteSignupSkeleton() {
  return (
    <div className="flex-1 flex items-center justify-center p-6 md:p-12 min-h-screen lg:min-h-0">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-3 mb-4 lg:hidden">
            <div className="bg-card-foreground/10 rounded-lg p-2">
              <ChefHat className="h-6 w-6 text-card-foreground" />
            </div>
            <div>
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>

          <CardTitle className="text-2xl md:text-3xl font-bold text-Foreground mb-2">
            <Skeleton className="h-6 w-40 mx-auto" />
          </CardTitle>
          <Skeleton className="h-4 w-48 mx-auto" />
        </CardHeader>

        <CardContent className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}

          <Skeleton className="h-10 w-full rounded-md" />

          <div className="mt-8 text-center">
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
