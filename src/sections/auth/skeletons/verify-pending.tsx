import { Card, CardContent, CardHeader } from "@ui/card";
import { Skeleton } from "@ui/skeleton";

export function VerifyPendingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl p-2">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <Skeleton className="h-6 w-40 mx-auto" />
          <Skeleton className="h-4 w-60 mx-auto" />
        </CardHeader>

        <CardContent className="space-y-4 mt-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
