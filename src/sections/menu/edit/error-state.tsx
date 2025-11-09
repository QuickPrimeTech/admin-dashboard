import { Button } from "@ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@ui/empty";
import { AlertCircleIcon, RefreshCw } from "lucide-react";

type EditErrorStateProps = {
  refetch: () => void;
};

export function EditErrorState({ refetch }: EditErrorStateProps) {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertCircleIcon />
        </EmptyMedia>
        <EmptyTitle>
          Oops! Something went wrong while getting your data
        </EmptyTitle>
        <EmptyDescription>
          This may occur when offline or due to a server issue.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm" onClick={refetch}>
          <RefreshCw />
          Retry
        </Button>
      </EmptyContent>
    </Empty>
  );
}
