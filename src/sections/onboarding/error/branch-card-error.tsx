import { Branch } from "@/types/onboarding";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { Button } from "@ui/button";
import { RefreshCcw } from "lucide-react";

type BranchCardErrorProps = {
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult<Branch[] | null, Error>>;
};

export function BranchCardError({ refetch }: BranchCardErrorProps) {
  return (
    <div className="lg:col-span-3 flex flex-col items-center justify-center py-10 text-center border border-destructive/30 rounded-lg bg-destructive/5">
      <p className="text-destructive font-medium mb-2">
        Failed to load branches.
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        Please check your connection or try again.
      </p>
      <Button onClick={() => refetch()} variant="outline" size="sm">
        <RefreshCcw className="mr-2" />
        Retry
      </Button>
    </div>
  );
}
