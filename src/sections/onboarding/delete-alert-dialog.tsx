import { ApiResponse } from "@/helpers/api-responses";
import { Branch } from "@/types/onboarding";
import { UseMutationResult } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui/alert-dialog";
import { Button } from "@ui/button";
import { AxiosError } from "axios";
import { Trash2 } from "lucide-react";

type DeleteAlertDialogProps = {
  branch: Branch;
  deleteMutation: UseMutationResult<
    ApiResponse<Branch>,
    AxiosError<ApiResponse<null>, any>,
    string,
    {
      previousBranches: Branch[] | undefined;
    }
  >;
};

export function DeleteAlertDialog({
  branch,
  deleteMutation,
}: DeleteAlertDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive flex-1"
        >
          <Trash2 className="mr-2" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <strong className="font-medium">{branch.name}</strong> from your
            restaurant branches and all of its related data.
            <br />
            <br />
            This will delete the following data:
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>All your menu items associated with this branch name</li>
              <li>All the gallery photos of this branch</li>
              <li>All your transaction history for this branch</li>
              <li>All the order history for this branch</li>
              <li>All the reservation history for this branch</li>
            </ul>
            <br />
            Please confirm this is what you absolutely want before proceeding.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => deleteMutation.mutate(branch.id)}
          >
            Yes, delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
