"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@ui/card";
import { Button } from "@ui/button";
import { MapPin, ExternalLink, Edit } from "lucide-react";
import { Branch } from "@/types/onboarding";
import {
  deleteBranchMutation,
  updateBranchMutation,
} from "@/hooks/use-branches";
import { useState } from "react";
import { EditBranchDialog } from "./edit-branch-dialog";
import { DeleteAlertDialog } from "./delete-alert-dialog";

type BranchCardProps = {
  branch: Branch;
};

export function BranchCard({ branch }: BranchCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const deleteMutation = deleteBranchMutation();
  const editMutation = updateBranchMutation();

  const handleEdit = async (data: { name: string }) => {
    const newData = { ...branch, ...data };
    try {
      setIsDialogOpen(false);
      await editMutation.mutateAsync(newData);
    } catch {
      setIsDialogOpen(true);
    }
  };
  return (
    <>
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
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setIsDialogOpen(() => true)}
            >
              <Edit className="mr-2" />
              Edit
            </Button>
            <DeleteAlertDialog
              branch={branch}
              deleteMutation={deleteMutation}
            />
          </div>
        </CardContent>
      </Card>
      <EditBranchDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        branch={branch}
        onEdit={handleEdit}
      />
    </>
  );
}
