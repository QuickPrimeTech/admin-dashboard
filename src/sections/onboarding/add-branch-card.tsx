"use client";

import { Card, CardContent } from "@ui/card";
import { Plus } from "lucide-react";
import { BranchFormDialog } from "./branch-form-dialog";
import { useState } from "react";
import { Branch } from "@/types/onboarding";

export function AddBranchCard() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  return (
    <>
      <Card
        className="border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group py-0"
        onClick={() => {
          setEditingBranch(null);
          setIsAddDialogOpen(true);
        }}
      >
        <CardContent className="flex flex-col items-center justify-center h-full min-h-40 text-center p-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-3 transition-colors">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <p className="font-semibold text-foreground">Add Branch</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create a new location
          </p>
        </CardContent>
      </Card>
      <BranchFormDialog
        open={isAddDialogOpen}
        branchData={editingBranch}
        onOpenChange={setIsAddDialogOpen}
        mode={editingBranch ? "edit" : "create"}
      />
    </>
  );
}
