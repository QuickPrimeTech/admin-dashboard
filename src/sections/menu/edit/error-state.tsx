import { Button } from "@ui/button";
import { RefreshCcw, AlertTriangle } from "lucide-react";
import Link from "next/link";

type EditErrorStateProps = {
  refetch: () => void;
};

export function EditErrorState({ refetch }: EditErrorStateProps) {
  return (
    <div className="lg:col-span-3 flex flex-col items-center justify-center py-12 px-6 text-center rounded-xl border border-destructive/20 bg-destructive/10">
      {/* Icon Badge */}
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-destructive/20 mb-4">
        <AlertTriangle className="h-6 w-6 text-destructive" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-destructive mb-2">
        Couldn&apos;t Load This Menu Item
      </h3>

      {/* Message */}
      <p className="text-sm text-muted-foreground max-w-xs mb-6">
        This menu item may not exist in the selected branch. Try again or switch
        branches to check if it&apos;s available.
      </p>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button onClick={refetch}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Retry
        </Button>

        <Button variant="outline" asChild>
          <Link href="/dashboard/menu">Back to Menu Page</Link>
        </Button>
      </div>
    </div>
  );
}
