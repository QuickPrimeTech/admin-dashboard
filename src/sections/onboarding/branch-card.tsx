"use client";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogFooter,
} from "@ui/alert-dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@ui/card";
import { Button } from "@ui/button";
import { Edit2, MapPin } from "lucide-react";
import { Branch } from "@/types/onboarding";
import { Trash2 } from "lucide-react";
import { useDeleteBranchMutation } from "@/hooks/use-branches";

type BranchCardProps = {
  branch: Branch;
  setEditingBranch: (branch: Branch) => void;
  setIsAddDialogOpen: (open: boolean) => void;
};

export function BranchCard({
  branch,
  setEditingBranch,
  setIsAddDialogOpen,
}: BranchCardProps) {
  const deleteMutation = useDeleteBranchMutation();

  return (
    <>
      <Card key={branch.id} className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-primary" />
            {branch.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {branch.location}
          </p>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              setIsAddDialogOpen(true);
              setEditingBranch(branch);
            }}
          >
            <Edit2 />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-destructive hover:text-destructive"
              >
                <Trash2 />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete <strong>{branch.name}</strong>{" "}
                  and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteMutation.mutate(branch.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </>
  );
}
