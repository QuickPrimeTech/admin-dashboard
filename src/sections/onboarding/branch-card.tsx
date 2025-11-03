"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@ui/card";
import { Button } from "@ui/button";
import { MapPin, ExternalLink, Edit, Trash2 } from "lucide-react";
import { Branch } from "@/types/onboarding";
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
import { deleteBranchMutation } from "@/hooks/use-branches";

type BranchCardProps = {
  branch: Branch;
};

export function BranchCard({ branch }: BranchCardProps) {
  const mutate = deleteBranchMutation();

  return (
    <Card
      key={branch.id}
      className="border-border shadow-md hover:shadow-lg transition-shadow"
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          {branch.name}
        </CardTitle>
        <CardDescription>{branch.location}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full" size="sm">
          <ExternalLink className="mr-2" />
          Visit Dashboard
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Edit className="mr-2" />
            Edit
          </Button>
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
                  <span className="font-medium">{branch.name}</span> from your
                  restaurant branches and all of its related data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => mutate.mutate(branch.id)}
                >
                  Yes, delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
